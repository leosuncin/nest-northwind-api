variable "VERSION" {
  default = "latest"
  validation {
    condition = VERSION == regex("(?:^\\d+\\.\\d+\\.\\d+$)|latest", VERSION)
    error_message = "VERSION must follow SemVer format"
  }
}

function "tag" {
  params = [project]
  result = ["${project}:${VERSION}"]
}

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
