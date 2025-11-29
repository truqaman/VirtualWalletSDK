# VaultX - Blockchain Virtual Wallet DApp

A production-ready blockchain virtual wallet DApp on OP Mainnet that enables users to manage virtual token balances and transfer them to external wallets. Built with modern web technologies and Alchemy's Modular Account SDK for seamless wallet integration.

## ✨ Features

- **🔐 Wallet Connection** - Connect via MetaMask, WalletConnect, Coinbase Wallet, or Alchemy Signer
- **💰 Multi-Token Support** - Manage USDQ, USDC, WETH, OP tokens across OP Mainnet, Base, and Polygon
- **🔄 Token Transfers** - Send tokens to external wallet addresses with real-time tracking
- **📊 Transaction History** - View complete transaction history with status tracking
- **💸 Gas Estimation** - Real-time gas fee calculation for transactions
- **🌓 Dark/Light Mode** - Theme support with persistent user preference
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🚀 Production Ready** - Deployed on Google Cloud Run with auto-scaling

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Wouter** - Lightweight routing
- **shadcn/ui** - Component library
- **Tailwind CSS** - Utility-first styling
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form management with validation
- **Zod** - Runtime type validation
- **ethers v6** - Blockchain interactions
- **Alchemy SDK** - Account abstraction

### Backend
- **Express.js** - REST API framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Production database
- **Neon Database** - Serverless PostgreSQL driver

### DevOps
- **Docker** - Container orchestration
- **Google Cloud Run** - Serverless deployment
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/truqaman/vaultx.git
cd vaultx
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
cp .env.example .env

# Add your API keys
ALCHEMY_API_KEY=your_alchemy_api_key
DUNE_API_KEY=your_dune_api_key
DUNE_CLI_API_KEY=your_dune_cli_api_key
DUNE_SIM_API_KEY=your_dune_sim_api_key
SESSION_SECRET=your_session_secret
DATABASE_URL=your_database_url
```

4. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📖 Usage

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" on the signup page
   - Select your preferred wallet provider
   - Approve the connection request

2. **View Dashboard**
   - See your token balances and total portfolio value
   - View recent transactions
   - Check 24-hour token price changes

3. **Send Tokens**
   - Go to "/send" page
   - Select token and amount
   - Enter recipient address
   - Review gas fees and confirm transaction

4. **View Transactions**
   - Go to "/transactions" page
   - See complete transaction history
   - Track transaction status (pending, confirmed, failed)

5. **Settings**
   - Manage wallet preferences
   - Disconnect wallet
   - Customize app settings

### For Developers

**Available Scripts:**

```bash
# Development server
npm run dev

# Build frontend
npm run build

# Build for production
npm run build

# Type checking
npm run typecheck

# Format code
npm run format

# Lint code
npm run lint
```

## 🔧 Configuration

### Supported Networks

- **OP Mainnet** (Primary) - Chain ID: 10
- **Base Mainnet** - Chain ID: 8453
- **Polygon Mainnet** - Chain ID: 137

### Token Contracts

**OP Mainnet:**
- USDQ: `0x4b2842f382bfc19f409b1874c0480db3b36199b3`
- YLP: `0x25789bbc835a77bc4afa862f638f09b8b8fae201`
- YL$: `0xc618101ad5f3a5d924219f225148f8ac1ad74dba`

**Base Mainnet:**
- USDQ: `0xbaf56ca7996e8398300d47f055f363882126f369`

**Smart Contract:**
- Address: `0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D`
- Network: OP Mainnet

## 🚀 Deployment

### Deploy to Google Cloud Run

1. **Prerequisites**
   - Google Cloud Account
   - gcloud CLI installed
   - Docker installed

2. **Quick Deploy**
```bash
chmod +x deploy.sh
./deploy.sh your-project-id us-central1
```

3. **Manual Deploy**
```bash
# Set variables
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1

# Build and push Docker image
docker build -t gcr.io/$PROJECT_ID/vaultx:latest .
docker push gcr.io/$PROJECT_ID/vaultx:latest

# Deploy to Cloud Run
gcloud run deploy vaultx \
  --image gcr.io/$PROJECT_ID/vaultx:latest \
  --platform managed \
  --region $REGION \
  --memory 512Mi \
  --allow-unauthenticated
```

4. **Set Environment Variables**
```bash
gcloud run services update vaultx \
  --set-env-vars "ALCHEMY_API_KEY=your_key,DATABASE_URL=your_db" \
  --region $REGION
```

For detailed deployment instructions, see [DEPLOY.md](./DEPLOY.md)

## 📁 Project Structure

```
vaultx/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Route pages
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (wallet, theme)
│   │   ├── lib/              # Utilities and hooks
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
├── server/                   # Express backend
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Data storage interface
│   ├── index.ts              # Server entry point
│   └── vite.ts               # Vite dev server config
├── shared/                   # Shared types and schemas
│   └── schema.ts             # Zod schemas and types
├── Dockerfile                # Container configuration
├── docker-compose.yml        # Local development environment
├── deploy.sh                 # Cloud Run deployment script
├── DEPLOY.md                 # Deployment documentation
└── package.json              # Dependencies and scripts
```

## 🔐 Security

- ✅ Environment variables stored securely
- ✅ No sensitive data exposed in frontend
- ✅ HTTPS enforced in production
- ✅ Non-root user in Docker container
- ✅ Health checks configured
- ✅ SQL injection prevention with ORM
- ✅ XSS protection with React
- ✅ CSRF tokens in forms

## 📊 API Endpoints

### Wallet
- `GET /api/wallet` - Get wallet overview with token balances

### Transactions
- `GET /api/transactions` - Fetch transaction history
- `POST /api/transfer` - Submit token transfer
- `POST /api/convert` - Convert between tokens
- `POST /api/withdraw` - Withdraw tokens to external address

### Utilities
- `GET /api/gas-estimate` - Get current gas fee estimates

## 🐛 Troubleshooting

### Wallet Connection Issues
- Ensure you have a Web3 wallet installed (MetaMask, etc.)
- Check that you're connected to OP Mainnet
- Try clearing browser cache and refreshing

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
npm run build
```

### API Connection Issues
- Verify `ALCHEMY_API_KEY` is set correctly
- Check that backend server is running
- View server logs: `npm run dev`

## 📝 Environment Variables

```bash
# Required for production
ALCHEMY_API_KEY=                # Alchemy API key for blockchain RPC
DUNE_API_KEY=                   # Dune Analytics API key
DUNE_CLI_API_KEY=               # Dune CLI API key
DUNE_SIM_API_KEY=               # Dune SIM API key
SESSION_SECRET=                 # Secret for session encryption
DATABASE_URL=                   # PostgreSQL connection string (optional)

# Optional
NODE_ENV=development            # Environment (development/production)
VITE_API_URL=http://localhost:5000  # API URL (frontend)
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Make your changes
4. Test your changes in the browser
5. Commit and push
6. Create a PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Live App**: [VaultX on Cloud Run](https://vaultx-[project-id].a.run.app)
- **GitHub**: [github.com/truqaman/vaultx](https://github.com/truqaman/vaultx)
- **Alchemy SDK**: [docs.alchemy.com](https://docs.alchemy.com)
- **Smart Contract**: `0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D` on OP Mainnet

## 🙏 Acknowledgments

- Built with [Alchemy Modular Account SDK](https://www.alchemy.com/account-abstraction)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Blockchain interactions via [ethers.js](https://docs.ethers.org)
- Hosted on [Google Cloud Run](https://cloud.google.com/run)

## 📧 Support

For questions or issues, please:
1. Check existing issues on GitHub
2. Open a new issue with detailed description
3. Contact the development team

---

**Made with ❤️ for the Ethereum community**
