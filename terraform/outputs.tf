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

output "frontend_s3_bucket" {
  description = "S3 bucket name for the frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_s3_website_url" {
  description = "S3 static website URL (HTTP)"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain (HTTPS)"
  value       = "https://${aws_cloudfront_distribution.frontend_cdn.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation)"
  value       = aws_cloudfront_distribution.frontend_cdn.id
}

output "jwt_secret_arn" {
  description = "ARN of the JWT secret in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.jobify_jwt.arn
  sensitive   = true
}
