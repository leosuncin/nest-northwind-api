variable "VERSION" {
  default = "latest"
  validation {
    condition = VERSION == regex("(?:^\\d+\\.\\d+\\.\\d+$)|latest", VERSION)
    error_message = "VERSION must follow SemVer format"
  }
}

variable "COMMIT_SHA" {
  validation {
    condition = COMMIT_SHA != ""
    error_message = "COMMIT_SHA should not be empty"
  }
}

function "tag" {
  params = ["project"]
  result = ["${project}:${VERSION}", "${project}:${COMMIT_SHA}"]
}

function "label" {
  params = ["title"]
  result = {
    "org.opencontainers.image.title" = "${title}"
    "org.opencontainers.image.source" = "https://github.com/leosuncin/nest-northwind-api"
    "org.opencontainers.image.version" = "${VERSION}"
    "org.opencontainers.image.revision" = "${COMMIT_SHA}"
    "org.opencontainers.image.licenses" = "AGPL-3.0-only"
  }
}

target "api" {
  context = "."
  args = {
    "PORT" = 3000
  }
  labels = label("Nest.js Northwind API")
  tags = tag("api")
}

target "migrations" {
  context = "."
  target = "migrations"
  labels = labels("TypeORM Northwind migrations")
  tags = tag("migrations")
}

group "default" {
  targets = ["api", "migrations"]
}
