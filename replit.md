# VaultX - Virtual Wallet Application

## Overview

VaultX is a production-ready blockchain virtual wallet DApp on OP Mainnet that enables users to manage virtual token balances (USDQ, USDC, WETH, OP) and transfer them to external wallets. The application integrates with smart contract 0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D using Alchemy's Modular Account SDK. Users can connect their wallet via Alchemy Signer, MetaMask, or other EVM wallets. Built with a modern full-stack architecture, it combines a React-based frontend with an Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing

**UI Component System**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by crypto wallet interfaces (MetaMask, Rainbow, Coinbase Wallet)
- Custom color scheme with HSL-based theming supporting light and dark modes
- Typography uses Inter for general UI and JetBrains Mono for monospaced content (addresses, hashes, numerical values)

**State Management**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form handling
- Context API for theme management and wallet connection state
- BrowserProvider from ethers v6 for blockchain interactions

**Key Design Decisions**
- Component-based architecture with separation between UI primitives and business logic components
- Virtual wallet balances maintained separately from actual blockchain balances
- Real-time transaction status tracking with pending, confirmed, and failed states
- Wallet-first authentication: users must connect their wallet to access the dashboard
- Signup page guards unauthenticated users; connects to Alchemy, MetaMask, or other EVM providers
- Persistent wallet connection stored in localStorage

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API endpoints
- HTTP server created with Node's native `http` module
- JSON-based request/response handling with raw body verification support

**API Structure**
- RESTful endpoints for wallet operations:
  - `GET /api/wallet` - Retrieve wallet overview with token balances
  - `GET /api/transactions` - Fetch transaction history
  - `POST /api/transfer` - Submit token transfer requests
  - `POST /api/convert` - Convert between ETH and USDC
  - `POST /api/withdraw` - Withdraw virtual tokens to external addresses
  - `GET /api/gas-estimate` - Get current gas fee estimates

**Storage Layer**
- In-memory storage implementation (`MemStorage`) for development
- Abstracted storage interface (`IStorage`) allowing easy database integration
- Pre-initialized demo wallet with sample data for testing

**Key Design Decisions**
- Separation of storage logic through interface abstraction enables switching between in-memory and persistent storage
- Transaction status tracking allows for simulating blockchain confirmation delays
- Default wallet address used for single-user demonstration mode

### Data Model

**Core Entities**
- **Users**: Authentication and user management (prepared for multi-user support)
- **Virtual Wallets**: User wallet instances with virtual ETH and USDC balances
- **Transactions**: Complete transaction history with type, status, amounts, and blockchain references
- **Token Balances**: Real-time balance information with USD valuations and 24-hour change tracking

**Database Schema** (Drizzle ORM with PostgreSQL)
- `users` table: id, username, password
- `virtual_wallets` table: id, address, ownerAddress, virtualEthBalance, virtualUsdcBalance, createdAt
- `transactions` table: id, walletId, type, tokenSymbol, amount, toAddress, fromAddress, txHash, status, gasFee, createdAt

**Validation**
- Zod schemas for runtime type validation
- Drizzle-Zod integration for automatic schema generation from database models
- Form validation using @hookform/resolvers with Zod

### External Dependencies

**Database**
- PostgreSQL as the primary database (configured via Drizzle)
- Neon Database serverless driver (@neondatabase/serverless) for database connectivity
- Drizzle ORM for type-safe database queries and migrations
- Connection string managed via `DATABASE_URL` environment variable

**Blockchain Integration**
- Smart contract 0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D on OP Mainnet for wallet interaction
- Alchemy Modular Account SDK (@alchemy/aa-core, @alchemy/aa-ethers) for account abstraction
- ethers v6 (BrowserProvider) for blockchain RPC calls
- Multi-network support: OP Mainnet (primary), Base Mainnet, Polygon Mainnet
- Multi-token support with contract addresses configured per network:
  - USDQ (6 decimals): OP 0x4b2842f382bfc19f409b1874c0480db3b36199b3, Base 0xbaf56ca7996e8398300d47f055f363882126f369
  - YLP (18 decimals): Base, Polygon, OP
  - YL$ (18 decimals): Polygon, OP
  - USDC, WETH, OP: Standard addresses per network
- External wallet address validation using Ethereum address format (0x + 40 hex characters)
- Gas fee estimation system for transaction cost calculations
- Transaction hash tracking for blockchain confirmation

**Third-Party Services**
- Alchemy API (ovF7P49HQUPcSHcMQjg9-) for blockchain node RPC and modular account SDK
- Dune Analytics API for sim.dune.com integration
  - SIM API: sim_ENa3Ba3ZTFAuA9LWa0jtmJhd8fMgDaJY
  - CLI API: sim_InmhMna5dwtaGqJyM5FVXVFSQaqU3LfU
  - IDX APP: sim_lwDjXWDdW9d4FLxz9N1fqvOW0ay2FBk1
- Price feed APIs for real-time token conversion rates
- Gas estimation services for accurate transaction fee calculations

**Development Tools**
- Replit-specific plugins for development environment integration
- Vite plugins for runtime error overlay and development banner
- ESBuild for production server bundling

**Session Management**
- Express-session with connect-pg-simple for PostgreSQL-backed sessions
- Session storage ready for multi-user authentication flows

**Key Integration Patterns**
- Environment-based configuration for database connections and API keys (ALCHEMY_API_KEY, DUNE_* keys)
- Separation of concerns between virtual balances (app-managed) and actual blockchain state
- Mock data initialization for development and testing without blockchain dependency
- Wallet context provider for centralized wallet state management
- BrowserProvider connection abstraction for blockchain RPC calls
- Signup page provides wallet connection UI before dashboard access

## Recent Updates (Latest Session)

### Changes Made
1. **Network Migration**: Changed from Ethereum Mainnet to OP Mainnet
2. **Token System**: Expanded from 2 tokens (ETH/USDC) to multi-token support:
   - Primary: USDQ (6 decimals) on OP Mainnet (demo: 15,000 balance)
   - Supporting: USDC, WETH, OP with OP Mainnet focus
   - Future support: YLP, YL$ on Base/Polygon
3. **Wallet Connection**: Implemented Alchemy wallet integration
   - Created WalletProvider context (client/src/contexts/wallet-context.tsx)
   - Installed packages: ethers v6, @alchemy/aa-core, @alchemy/aa-ethers
   - Created signup page with wallet connection UI
   - Updated routing: unauthenticated users redirected to signup
   - Persistent wallet state in localStorage
4. **API Credentials**: Added Alchemy and Dune API keys to project secrets
5. **Smart Contract**: Configured for 0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D on OP Mainnet
6. **GitHub Actions CI/CD**: Created professional deployment workflows
   - `docker-image.yml` - Builds Docker image, pushes to GCR, scans for vulnerabilities
   - Triggers on push to main/develop branches
   - Smart tagging strategy: `latest`, `production`, `develop` tags
   - Trivy vulnerability scanning integrated
   - Multi-stage Docker build with layer caching
   - Pull request builds (no push)

### Pages
- `/` - Dashboard (requires wallet connection)
- `/send` - Send tokens
- `/transactions` - Transaction history
- `/settings` - Wallet preferences
- `/signup` - Wallet connection page (default for unauthenticated users)

### GitHub Actions Workflows
- **docker-image.yml**: Builds and pushes Docker images to GCR with vulnerability scanning
- Repository: https://github.com/truqaman/VirtualWalletSDK
- Actions tab: https://github.com/truqaman/VirtualWalletSDK/actions