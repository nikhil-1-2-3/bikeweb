# Query the official latest Ubuntu 24.04 Noble AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# SSH Key Pair for EC2 login
resource "aws_key_pair" "k8s_key" {
  key_name   = "${var.cluster_name}-key"
  public_key = file(pathexpand(var.public_key_path))

  tags = {
    Name = "${var.cluster_name}-key"
  }
}

# ── Control Plane (Master Node) ──────────────────────────────────────────────
resource "aws_instance" "master" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.master_instance_type
  subnet_id            = aws_subnet.public_subnet[0].id
  key_name             = aws_key_pair.k8s_key.key_name
  iam_instance_profile = aws_iam_instance_profile.k8s_node_profile.name

  vpc_security_group_ids = [
    aws_security_group.cluster_sg.id,
    aws_security_group.master_sg.id
  ]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = file("${path.module}/scripts/install_k8s.sh")

  tags = {
    Name                                        = "${var.cluster_name}-master"
    Role                                        = "control-plane"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# ── Worker Nodes ─────────────────────────────────────────────────────────────
resource "aws_instance" "workers" {
  count                = var.worker_count
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.worker_instance_type
  subnet_id            = aws_subnet.public_subnet[count.index % 2].id
  key_name             = aws_key_pair.k8s_key.key_name
  iam_instance_profile = aws_iam_instance_profile.k8s_node_profile.name

  vpc_security_group_ids = [
    aws_security_group.cluster_sg.id,
    aws_security_group.worker_sg.id
  ]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = file("${path.module}/scripts/install_k8s.sh")

  tags = {
    Name                                        = "${var.cluster_name}-worker-${count.index + 1}"
    Role                                        = "worker"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}
