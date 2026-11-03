variable "aws_region" {
  description = "AWS region for the Kubernetes cluster"
  type        = string
  default     = "ap-south-1"
}

variable "cluster_name" {
  description = "Name tag prefix for the Kubernetes cluster"
  type        = string
  default     = "motorhouse-k8s"
}

variable "master_instance_type" {
  description = "EC2 instance type for the Control Plane (master) node"
  type        = string
  default     = "t3.medium"
}

variable "worker_instance_type" {
  description = "EC2 instance type for the Worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "worker_count" {
  description = "Number of worker nodes to create"
  type        = number
  default     = 2
}

variable "public_key_path" {
  description = "Path to the SSH public key for EC2 instance access"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

variable "vpc_cidr" {
  description = "CIDR block for the cluster VPC"
  type        = string
  default     = "10.0.0.0/16"
}
