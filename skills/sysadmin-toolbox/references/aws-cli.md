# AWS CLI One-Liners

## EC2 Operations

```bash
# List running instances with key details
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,PublicIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table

# Find instances by tag
aws ec2 describe-instances --filters "Name=tag:Environment,Values=production" --query 'Reservations[*].Instances[*].InstanceId' --output text

# Start/stop/reboot instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
aws ec2 reboot-instances --instance-ids i-1234567890abcdef0

# Get instance metadata (from inside instance)
curl -s http://169.254.169.254/latest/meta-data/instance-id
curl -s http://169.254.169.254/latest/meta-data/public-ipv4

# List security groups with open ports
aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupId,GroupName,IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]].FromPort]' --output table
```

## S3 Operations

```bash
# List buckets with size
aws s3 ls
aws s3api list-buckets --query 'Buckets[*].[Name,CreationDate]' --output table

# Get bucket size
aws s3 ls s3://bucket-name --recursive --human-readable --summarize

# Find large files (>100MB)
aws s3 ls s3://bucket-name --recursive | awk '$3 > 104857600 {print $0}'

# Sync with delete (dangerous)
aws s3 sync local/ s3://bucket-name/ --delete

# Enable versioning
aws s3api put-bucket-versioning --bucket bucket-name --versioning-configuration Status=Enabled

# Find public buckets
aws s3api get-bucket-acl --bucket bucket-name | grep -i "AllUsers\|AuthenticatedUsers"
```

## CloudWatch & Monitoring

```bash
# Get CPU utilization
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=i-1234567890abcdef0 --statistics Average --start-time 2026-01-27T00:00:00Z --end-time 2026-01-28T00:00:00Z --period 3600

# List CloudWatch alarms in alarm state
aws cloudwatch describe-alarms --state-value ALARM --query 'MetricAlarms[*].[AlarmName,StateValue,MetricName]' --output table

# Get recent CloudWatch logs
groups=$(aws logs describe-log-groups --query 'logGroups[*].logGroupName' --output text)
for group in $groups; do aws logs tail "$group" --since 1h; done

# Estimated charges
aws cloudwatch get-metric-statistics --namespace AWS/Billing --metric-name EstimatedCharges --statistics Maximum --start-time $(date -u -d '1 day ago' +%Y-%m-%d) --end-time $(date -u +%Y-%m-%d) --period 86400
```

## IAM & Security

```bash
# List users with console access
aws iam list-users --query 'Users[*].[UserName,PasswordLastUsed]' --output table

# Find unused access keys (90+ days)
aws iam list-access-keys --query 'AccessKeyMetadata[?Status==`Active`].[UserName,AccessKeyId,CreateDate]' --output table

# Check MFA status
aws iam get-credential-report --query 'Content' --output text | base64 -d | cut -d, -f1,4,8

# List roles with trust relationships
aws iam list-roles --query 'Roles[*].[RoleName,AssumeRolePolicyDocument.Statement[0].Principal]' --output table

# Find inline policies
aws iam list-users --query 'Users[*].UserName' --output text | xargs -I {} aws iam list-user-policies --user-name {} --query '[UserName,PolicyNames]' --output text 2>/dev/null
```

## RDS & Databases

```bash
# List RDS instances
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceClass,Engine,DBInstanceStatus]' --output table

# Check RDS storage
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,AllocatedStorage,MaxAllocatedStorage]' --output table

# List pending maintenance
aws rds describe-pending-maintenance-actions --query 'PendingMaintenanceActions[*].[ResourceIdentifier,PendingMaintenanceActionDetails[0].Action,PendingMaintenanceActionDetails[0].CurrentApplyDate]' --output table

# Get read replica lag
aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name ReplicaLag --dimensions Name=DBInstanceIdentifier,Value=replica-name --statistics Average --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 300
```

## Cost & Billing

```bash
# Current month costs by service
aws ce get-cost-and-usage --time-period Start=$(date -d "$(date +%Y-%m-01)" +%Y-%m-%d),End=$(date +%Y-%m-%d) --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE --query 'ResultsByTime[0].Groups[*].[Keys[0],Metrics.BlendedCost.Amount]' --output table

# Find unallocated resources (no tags)
aws ec2 describe-instances --filters "Name=tag-key,Values=!*" --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,LaunchTime]' --output table

# Get savings from Reserved Instances
aws ce get-reservation-utilization --time-period Start=$(date -d '30 days ago' +%Y-%m-%d),End=$(date +%Y-%m-%d) --query 'UtilizationsByTime[*].Utilization.Savings' --output text
```