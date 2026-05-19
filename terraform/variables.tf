variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "app_name" {
  description = "Application name prefix for all resources"
  type        = string
  default     = "jobify"
}

variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "ec2_instance_type" {
  description = "EC2 instance type for the backend server"
  type        = string
  default     = "m7i.large"
}

variable "ami_id" {
  description = "AMI ID — Ubuntu 22.04 LTS in ap-south-1"
  type        = string
  default     = "ami-0a936bb624678fd88"
}

variable "key_pair_name" {
  description = "Name of the EC2 key pair for SSH access"
  type        = string
  default     = "my-key"
}

variable "jwt_secret" {
  description = "JWT signing secret — stored in AWS Secrets Manager"
  type        = string
  sensitive   = true
  default     = "jobify_jwt_super_secret_2026_change_in_prod"
}

variable "mongo_uri" {
  description = "MongoDB connection URI for the backend"
  type        = string
  sensitive   = true
  default     = "mongodb://localhost:27017/jobify"
}
