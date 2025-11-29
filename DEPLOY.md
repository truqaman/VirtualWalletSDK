# VaultX - Google Cloud Run Deployment Guide

This guide explains how to deploy VaultX to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account** - Sign up at [Google Cloud Console](https://console.cloud.google.com)
2. **gcloud CLI** - Install from [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
3. **Docker** - Install from [Docker](https://docs.docker.com/install/)
4. **Authenticate with GCP**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

## Environment Variables Required

Before deploying, ensure you have these secrets configured in your Cloud Run service:

```
ALCHEMY_API_KEY=ovF7P49HQUPcSHcMQjg9-
DUNE_API_KEY=your_dune_api_key
DUNE_CLI_API_KEY=sim_InmhMna5dwtaGqJyM5FVXVFSQaqU3LfU
DUNE_SIM_API_KEY=sim_ENa3Ba3ZTFAuA9LWa0jtmJhd8fMgDaJY
SESSION_SECRET=your_random_session_secret
DATABASE_URL=your_production_database_url
```

## Step 1: Build Docker Image

### Option A: Local Build and Push

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id
export IMAGE_NAME=vaultx
export REGION=us-central1

# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:latest .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest
```

### Option B: Cloud Build (Recommended)

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME:latest
```

## Step 2: Deploy to Cloud Run

```bash
gcloud run deploy vaultx \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --set-env-vars ALCHEMY_API_KEY=$ALCHEMY_API_KEY,DUNE_API_KEY=$DUNE_API_KEY,DUNE_CLI_API_KEY=$DUNE_CLI_API_KEY,DUNE_SIM_API_KEY=$DUNE_SIM_API_KEY,SESSION_SECRET=$SESSION_SECRET,DATABASE_URL=$DATABASE_URL \
  --allow-unauthenticated
```

Or use secrets for sensitive values (recommended for production):

```bash
# Create secrets in Secret Manager
gcloud secrets create ALCHEMY_API_KEY --replication-policy="automatic"
echo -n "$ALCHEMY_API_KEY" | gcloud secrets versions add ALCHEMY_API_KEY --data-file=-

gcloud secrets create DATABASE_URL --replication-policy="automatic"
echo -n "$DATABASE_URL" | gcloud secrets versions add DATABASE_URL --data-file=-

# Deploy with secret references
gcloud run deploy vaultx \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --set-env-vars ALCHEMY_API_KEY=@ALCHEMY_API_KEY,DATABASE_URL=@DATABASE_URL \
  --set-cloudsql-instances=$CLOUD_SQL_INSTANCE \
  --allow-unauthenticated
```

## Step 3: Configure Custom Domain (Optional)

```bash
gcloud run services update-traffic vaultx --to-revisions LATEST=100 --region $REGION

# Map custom domain
gcloud beta run domain-mappings create --service=vaultx --domain=yourdomain.com --region=$REGION
```

## Step 4: View Deployment Status

```bash
# Get service URL
gcloud run services describe vaultx --region $REGION --format='value(status.url)'

# View logs
gcloud run services logs read vaultx --region $REGION --limit 50

# Monitor performance
gcloud monitoring dashboards create --config-from-file=monitoring-config.yaml
```

## Troubleshooting

### Build Failures
```bash
# View build logs
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')

# Check image size (must be < 2GB)
docker images gcr.io/$PROJECT_ID/$IMAGE_NAME
```

### Runtime Errors
```bash
# Stream live logs
gcloud run services logs read vaultx --region $REGION --follow

# SSH into running container (if needed)
gcloud compute instances list
gcloud compute ssh INSTANCE_NAME
```

### Cold Start Issues
Increase memory allocation:
```bash
gcloud run services update vaultx \
  --memory 1Gi \
  --region $REGION
```

## Production Best Practices

1. **Use Cloud SQL** for PostgreSQL instead of connecting to external databases
2. **Enable VPC Connector** for secure database access
3. **Set up Cloud Armor** for DDoS protection
4. **Enable Binary Authorization** for image verification
5. **Configure Cloud CDN** for static assets
6. **Set up Cloud Monitoring** and alerts
7. **Use Cloud Trace** for performance analysis
8. **Enable Cloud Audit Logs** for security
9. **Configure load balancer** with custom domain and SSL

## Deployment Script (Quick)

Save as `deploy.sh`:

```bash
#!/bin/bash
set -e

PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
IMAGE_NAME="vaultx"

echo "🚀 Deploying VaultX to Google Cloud Run..."
echo "Project: $PROJECT_ID | Region: $REGION"

# Build and push
echo "📦 Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:latest .
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest

# Deploy
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy vaultx \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --allow-unauthenticated

# Get URL
SERVICE_URL=$(gcloud run services describe vaultx --region $REGION --format='value(status.url)')
echo "✅ Deployment successful!"
echo "Service URL: $SERVICE_URL"
```

Run with:
```bash
chmod +x deploy.sh
./deploy.sh your-project-id us-central1
```

## Rollback

```bash
# List previous revisions
gcloud run revisions list --service=vaultx --region $REGION

# Route traffic back to previous revision
gcloud run services update-traffic vaultx \
  --to-revisions REVISION_ID=100 \
  --region $REGION
```

## Cost Optimization

- **Concurrency**: Set to 80 (default) to handle requests efficiently
- **Min instances**: 0 (cold starts but saves cost)
- **Memory**: Start with 512Mi, increase if needed
- **CPU**: 1 CPU is sufficient for most workloads

## Next Steps

1. Test the deployed application: `curl $SERVICE_URL/api/wallet`
2. Set up monitoring and alerts in Cloud Console
3. Configure custom domain with DNS records
4. Set up CI/CD pipeline with Cloud Build
5. Enable backup and disaster recovery

For more information, see [Cloud Run Documentation](https://cloud.google.com/run/docs)
