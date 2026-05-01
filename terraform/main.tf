terraform {
  required_version = ">= 1.5.0"
}

output "environment" {
  value = "local-minikube"
}

output "deployment_target" {
  value = "kubernetes"
}