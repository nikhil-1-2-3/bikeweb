# Internal Cluster Communication SG (Applies to all nodes)
resource "aws_security_group" "cluster_sg" {
  name        = "${var.cluster_name}-cluster-sg"
  description = "Allows full internal communication between all cluster nodes"
  vpc_id      = aws_vpc.k8s_vpc.id

  # Allow all internal traffic between nodes sharing this SG
  ingress {
    description = "Full internal node-to-node communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.cluster_name}-cluster-sg"
  }
}

# Control Plane Master Security Group
resource "aws_security_group" "master_sg" {
  name        = "${var.cluster_name}-master-sg"
  description = "Security group for Kubernetes Control Plane (Master)"
  vpc_id      = aws_vpc.k8s_vpc.id

  # SSH
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Kubernetes API Server
  ingress {
    description = "Kubernetes API server"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.cluster_name}-master-sg"
  }
}

# Worker Node Security Group
resource "aws_security_group" "worker_sg" {
  name        = "${var.cluster_name}-worker-sg"
  description = "Security group for Kubernetes Worker Nodes"
  vpc_id      = aws_vpc.k8s_vpc.id

  # SSH
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP for Ingress
  ingress {
    description = "HTTP Ingress"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS for Ingress
  ingress {
    description = "HTTPS Ingress"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # NodePort Range
  ingress {
    description = "Kubernetes NodePort range"
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.cluster_name}-worker-sg"
  }
}
