#!/bin/bash

# VaultX Google Cloud Run Deployment Script
# Usage: ./deploy.sh [project-id] [region]

set -e

# Configuration
PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
IMAGE_NAME="vaultx"
SERVICE_NAME="vaultx"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 VaultX Google Cloud Run Deployment${NC}"
echo -e "${YELLOW}Project: $PROJECT_ID | Region: $REGION${NC}"
echo "=================================================="

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Install from: https://docs.docker.com/install/"
    exit 1
fi

# Set project
echo -e "${YELLOW}Setting GCP project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}Enabling required Google Cloud APIs...${NC}"
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com

# Build Docker image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:latest .

# Push to Google Container Registry
echo -e "${YELLOW}📤 Pushing image to Google Container Registry...${NC}"
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest

# Deploy to Cloud Run
echo -e "${YELLOW}🌐 Deploying to Google Cloud Run...${NC}"

gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --max-instances 100 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production"

# Get service URL
echo -e "${YELLOW}Retrieving service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')

echo "=================================================="
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}Service URL: $SERVICE_URL${NC}"
echo "=================================================="

# Test the deployment
echo -e "${YELLOW}Testing deployment...${NC}"
if curl -s "$SERVICE_URL/api/wallet" > /dev/null; then
    echo -e "${GREEN}✅ API is responding correctly${NC}"
else
    echo -e "${YELLOW}⚠️  API test failed. Check logs with:${NC}"
    echo "gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50"
fi

# Display next steps
echo ""
echo -e "${GREEN}📋 Next Steps:${NC}"
echo "1. View logs: gcloud run services logs read $SERVICE_NAME --region $REGION"
echo "2. Set environment variables: gcloud run services update $SERVICE_NAME --set-env-vars KEY=VALUE"
echo "3. Configure custom domain: gcloud beta run domain-mappings create --service=$SERVICE_NAME --domain=yourdomain.com"
echo "4. Scale service: gcloud run services update $SERVICE_NAME --max-instances 200"
echo ""
echo -e "${YELLOW}Remember to set these environment variables:${NC}"
echo "  ALCHEMY_API_KEY"
echo "  DUNE_API_KEY"
echo "  DUNE_CLI_API_KEY"
echo "  DUNE_SIM_API_KEY"
echo "  SESSION_SECRET"
echo "  DATABASE_URL"
echo ""
echo "Run: gcloud run services update $SERVICE_NAME --set-env-vars <KEY>=<VALUE>"
