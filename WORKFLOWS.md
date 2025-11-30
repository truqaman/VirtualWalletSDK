# GitHub Actions Workflows for VaultX

Professional CI/CD automation for building, testing, and deploying VaultX to Google Cloud Run.

## Workflows Overview

### 1. CI - Build and Test
**File:** `.github/workflows/ci.yml`
- Runs on push to main/develop and pull requests
- Builds frontend with Vite
- Runs TypeScript type checking
- Audits dependencies for vulnerabilities
- Tests Docker image build

### 2. Deploy to Google Cloud Run
**File:** `.github/workflows/deploy.yml`
- Triggers on push to main branch
- Builds Docker image
- Pushes to Google Container Registry
- Deploys to Cloud Run with 512Mi memory
- Runs health checks

### 3. Code Quality
**File:** `.github/workflows/code-quality.yml`
- Runs on push and PRs
- Format checking
- TypeScript type validation
- Dependency vulnerability scanning

## Setup Instructions

### 1. GitHub Secrets
Add to Settings → Secrets and variables → Actions:
```
GCP_PROJECT_ID = your-project-id
WIF_PROVIDER = (from GCP setup)
WIF_SERVICE_ACCOUNT = (from GCP setup)
ALCHEMY_API_KEY = ovF7P49HQUPcSHcMQjg9-
DUNE_API_KEY = your_key
DUNE_CLI_API_KEY = your_key
DUNE_SIM_API_KEY = your_key
SESSION_SECRET = random_secure_string
DATABASE_URL = postgres://...
```

### 2. Enable GitHub Actions
Settings → Actions → General → Allow all actions

### 3. View Workflow Runs
https://github.com/truqaman/vaultx/actions

## Deployment

Push to main to trigger automatic deployment:
```bash
git push origin main
```

Or manually trigger in Actions tab: "Deploy to Google Cloud Run" → "Run workflow"

## Documentation
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Google Cloud Auth](https://github.com/google-github-actions/auth)
