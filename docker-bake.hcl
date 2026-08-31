target "docker-metadata-action" {}

target "api" {
  inherits = ["docker-metadata-action"]
  context = "."
  args = {
    "PORT" = 3000
  }
}

target "migrations" {
  inherits = ["docker-metadata-action"]
  context = "."
  target = "migrations"
}

group "default" {
  targets = ["api", "migrations"]
}
