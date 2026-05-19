output "backend_public_ip" {
  description = "Public IP address of the Jobify backend EC2 instance"
  value       = aws_instance.jobify_backend.public_ip
}

output "backend_public_dns" {
  description = "Public DNS of the backend EC2 instance"
  value       = aws_instance.jobify_backend.public_dns
}

output "backend_api_url" {
  description = "Backend API base URL"
  value       = "http://${aws_instance.jobify_backend.public_ip}:5000"
}



output "jwt_secret_arn" {
  description = "ARN of the JWT secret in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.jobify_jwt.arn
  sensitive   = true
}
