target "docker-metadata-action" {
  tags = ["latest"]
  args = {}
}

variable "BASE_TAG" {
  default = "nest-northwind"
}

target "api" {
  inherits = ["docker-metadata-action"]
  args = {
    "PORT" = 3000
  }
  tags = [
    for tag in target.docker-metadata-action.tags: "${BASE_TAG}-api:${tag}"
  ]
}

target "migrations" {
  inherits = ["docker-metadata-action"]
  target = "migrations"
  tags = [
    for tag in target.docker-metadata-action.tags: "${BASE_TAG}-migrations:${tag}"
  ]
}

group "default" {
  targets = ["api", "migrations"]
}
