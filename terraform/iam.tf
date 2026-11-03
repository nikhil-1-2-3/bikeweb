# IAM Role for Kubernetes EC2 Nodes (allows EBS CSI Driver volume management)
resource "aws_iam_role" "k8s_node_role" {
  name = "${var.cluster_name}-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.cluster_name}-node-role"
  }
}

# Attach AWS EBS CSI Driver Policy
resource "aws_iam_role_policy_attachment" "ebs_csi_policy" {
  role       = aws_iam_role.k8s_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

# Attach CloudWatch & SSM Core policies for optional remote management
resource "aws_iam_role_policy_attachment" "ssm_policy" {
  role       = aws_iam_role.k8s_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance profile to attach to EC2 instances
resource "aws_iam_instance_profile" "k8s_node_profile" {
  name = "${var.cluster_name}-instance-profile"
  role = aws_iam_role.k8s_node_role.name
}

