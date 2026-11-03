output "master_public_ip" {
  description = "Public IP of the Kubernetes Master node"
  value       = aws_instance.master.public_ip
}

output "master_private_ip" {
  description = "Private IP of the Kubernetes Master node"
  value       = aws_instance.master.private_ip
}

output "workers_public_ips" {
  description = "Public IPs of the Kubernetes Worker nodes"
  value       = aws_instance.workers[*].public_ip
}

output "workers_private_ips" {
  description = "Private IPs of the Kubernetes Worker nodes"
  value       = aws_instance.workers[*].private_ip
}

output "ssh_master_command" {
  description = "Command to SSH into the Master node"
  value       = "ssh ubuntu@${aws_instance.master.public_ip}"
}

output "next_step_master_init" {
  description = "Command to run inside the Master node to initialize the cluster"
  value       = "sudo kubeadm init --apiserver-advertise-address=${aws_instance.master.private_ip} --pod-network-cidr=10.244.0.0/16"
}
