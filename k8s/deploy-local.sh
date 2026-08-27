#!/usr/bin/env bash
set -euo pipefail

# Script para desplegar la Northwind API en Kubernetes local (pruebas).
# Uso:
#   ./deploy-local.sh            # construye imágenes y despliega todo
#   ./deploy-local.sh --no-build # reutiliza imágenes ya construidas
#   ./deploy-local.sh --delete   # elimina todos los recursos k8s

K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/k8s" && pwd)"
NO_BUILD=false
DELETE=false
NAMESPACE="${NAMESPACE:-default}"
TIMEOUT_BASE=300

for arg in "$@"; do
  case "$arg" in
    --no-build) NO_BUILD=true ;;
    --delete) DELETE=true ;;
    *) echo "Argumento desconocido: $arg" >&2; exit 1 ;;
  esac
done

command -v kubectl >/dev/null 2>&1 || {
  echo "ERROR: kubectl no está instalado." >&2
  exit 1
}

context="$(kubectl config current-context 2>/dev/null || echo 'unknown')"
echo "→ Contexto de Kubernetes: $context (namespace: $NAMESPACE)"

kubectl get namespace "$NAMESPACE" >/dev/null 2>&1 || {
  echo "→ Creando namespace '$NAMESPACE'"
  kubectl create namespace "$NAMESPACE"
}

# Indica si la imagen debe construirse directamente con Docker (no un clúster
# con registro propio, p.ej. kind/minikube).
docker_local=false
case "$context" in
  docker-desktop|docker-*) docker_local=true ;;
esac

if [ "$DELETE" = true ]; then
  echo "→ Eliminando recursos..."
  kubectl -n "$NAMESPACE" delete \
    --ignore-not-found \
    -f "$K8S_DIR/migrations-job.yaml" \
    -f "$K8S_DIR/server-deployment.yaml" \
    -f "$K8S_DIR/server-service.yaml" \
    -f "$K8S_DIR/sql-server-deployment.yaml" \
    -f "$K8S_DIR/sql-server-service.yaml" \
    -f "$K8S_DIR/sql-server-data-persistentvolumeclaim.yaml" \
    -f "$K8S_DIR/data-source-configmap.yaml" \
    -f "$K8S_DIR/database-secret.yaml"
  echo "→ Recursos eliminados."
  exit 0
fi

if [ "$NO_BUILD" = false ]; then
  command -v docker >/dev/null 2>&1 || {
    echo "ERROR: docker no está instalado (o usa --no-build)." >&2
    exit 1
  }
  echo "→ Construyendo imágenes..."
  docker build -t server:local .
  docker build --target migrations -t migrations:local .
else
  echo "→ Omitiendo build (--no-build)..."
fi

# Para clústeres con registro propio (kind/minikube), es necesario cargar las
# imágenes dentro del clúster para poder usar imagePullPolicy: Never.
if [ "$docker_local" = false ] && [ "$NO_BUILD" = false ]; then
  case "$context" in
    kind-*)
      echo "→ Cargando imágenes en kind..."
      kind load docker-image server:local migrations:local ;;
    minikube)
      echo "→ Cargando imágenes en minikube..."
      minikube image load server:local
      minikube image load migrations:local ;;
    *)
      echo "→ Aviso: contexto '$context' no reconocido para cargar imágenes." >&2
      echo "  Asegúrate de que las imágenes 'server:local' y 'migrations:local' estén disponibles." >&2
      ;;
  esac
fi

echo "→ Aplicando manifiestos (en orden)..."
kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/sql-server-data-persistentvolumeclaim.yaml"
kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/database-secret.yaml"
kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/data-source-configmap.yaml"
kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/sql-server-service.yaml"
kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/sql-server-deployment.yaml"

echo "→ Esperando a que SQL Server esté listo..."
kubectl -n "$NAMESPACE" rollout status deployment/sql-server --timeout="${TIMEOUT_BASE}s"

kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/migrations-job.yaml"
echo "→ Esperando a que las migraciones terminen..."
kubectl -n "$NAMESPACE" wait --for=condition=complete job/migrations --timeout="${TIMEOUT_BASE}s"

kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/server-deployment.yaml"
kubectl -n "$NAMESPACE" apply -f "$K8S_DIR/server-service.yaml"
echo "→ Esperando a que la API esté lista..."
kubectl -n "$NAMESPACE" rollout status deployment/server --timeout="${TIMEOUT_BASE}s"

echo ""
echo "✔ Despliegue completado en el namespace '$NAMESPACE'."
echo ""
echo "Para acceder a la API (port-forward):"
echo "  kubectl -n $NAMESPACE port-forward service/server 3000:3000"
echo ""
echo "Para ver el estado:"
echo "  kubectl -n $NAMESPACE get pods"
echo "  kubectl -n $NAMESPACE get jobs"
