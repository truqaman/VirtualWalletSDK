# VaultX - Virtual Wallet Application

## Overview

VaultX is a blockchain-based virtual wallet application that enables users to manage virtual ETH and USDC balances. The application provides functionality for transferring tokens to external wallets, converting between ETH and USDC, and tracking transaction history in real-time. Built with a modern full-stack architecture, it combines a React-based frontend with an Express backend and PostgreSQL database for persistent storage.

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
- Context API for theme management

**Key Design Decisions**
- Component-based architecture with separation between UI primitives and business logic components
- Virtual wallet balances maintained separately from actual blockchain balances
- Real-time transaction status tracking with pending, confirmed, and failed states

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

**Blockchain Integration** (Prepared)
- Smart contract ABI present in attached_assets for wallet interaction
- External wallet address validation using Ethereum address format (0x + 40 hex characters)
- Gas fee estimation system for transaction cost calculations
- Transaction hash tracking for blockchain confirmation

**Third-Party Services** (Future Integration Points)
- Alchemy or similar blockchain node provider for actual blockchain interactions
- Price feed APIs for real-time ETH/USDC conversion rates
- Gas estimation services for accurate transaction fee calculations

**Development Tools**
- Replit-specific plugins for development environment integration
- Vite plugins for runtime error overlay and development banner
- ESBuild for production server bundling

**Session Management**
- Express-session with connect-pg-simple for PostgreSQL-backed sessions
- Session storage ready for multi-user authentication flows

**Key Integration Patterns**
- Environment-based configuration for database connections
- Separation of concerns between virtual balances (app-managed) and actual blockchain state
- Mock data initialization for development and testing without blockchain dependency