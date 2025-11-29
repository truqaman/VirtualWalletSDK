# Design Guidelines: Blockchain Virtual Wallet Application

## Design Approach

**Selected Approach:** Hybrid Design System with Crypto Wallet References

Drawing inspiration from established crypto wallet interfaces (MetaMask, Rainbow, Coinbase Wallet) combined with Material Design principles for data-rich applications. This approach prioritizes:
- Clear information hierarchy for balances and transactions
- Trust-building through clean, professional aesthetics
- Efficient task completion for transfers and conversions
- Data density without overwhelming the user

**Key Design Principles:**
1. **Clarity First:** Financial data must be immediately scannable
2. **Trust Through Simplicity:** Clean, uncluttered interface builds confidence
3. **Action-Oriented:** Transaction flows should be obvious and frictionless
4. **Status Visibility:** Real-time feedback for all blockchain operations

## Typography

**Font Family:**
- Primary: Inter (via Google Fonts CDN) - excellent for data-heavy UIs
- Monospace: JetBrains Mono - for addresses, hashes, and numerical values

**Hierarchy:**
- Page Titles: text-2xl md:text-3xl, font-semibold
- Section Headers: text-lg md:text-xl, font-semibold
- Card Titles: text-base, font-medium
- Body Text: text-sm md:text-base, font-normal
- Data Labels: text-xs, font-medium, uppercase tracking-wide
- Numerical Values: text-lg md:text-2xl, font-mono, font-semibold
- Wallet Addresses/Hashes: text-xs md:text-sm, font-mono
- Transaction Status: text-xs, font-medium, uppercase

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Card margins: space-y-4
- Button padding: px-6 py-2 or px-8 py-3
- Container max-width: max-w-7xl

**Grid Structure:**
- Dashboard: 2-column layout on desktop (sidebar + main content)
- Wallet Cards: 2-3 column grid for token balances
- Transaction History: Single column list with full-width cards
- Transfer Forms: Single column, max-w-md centered

## Component Library

### Navigation
- **Sidebar Navigation** (Desktop): Fixed left sidebar, w-64, containing wallet overview, navigation links, and connect wallet button
- **Mobile Header:** Sticky top bar with hamburger menu, wallet connection status
- **Navigation Items:** Icon + label, hover states with subtle background

### Dashboard Components
- **Wallet Overview Card:** Displays total portfolio value, virtualETH balance, virtualUSDC balance with large numerical displays and percentage changes
- **Balance Cards:** Grid of token balance cards, each showing token icon, symbol, amount (large), USD value (smaller), and quick action buttons
- **Quick Actions Bar:** Horizontal button group for Send, Receive, Convert, positioned prominently below wallet overview

### Transaction Components
- **Transaction History List:** Full-width cards showing: transaction type icon, amount, token, timestamp, status badge, destination address (truncated), with expand for details
- **Transaction Details Modal:** Overlay showing complete transaction data including hash, gas fees, confirmations, block number
- **Transfer Form:** Multi-step form with token selection, amount input with max button, recipient address input, gas fee preview, slippage settings, confirmation step
- **Status Indicators:** Pending (animated), Success (checkmark), Failed (error icon) with appropriate visual feedback

### Data Display
- **Balance Display:** Large numerical value with token symbol, USD equivalent below in muted text
- **Address Display:** Truncated format (0x1234...5678) with copy button, full address on hover/click
- **Gas Fee Indicator:** Current gas price with visual gauge (low/medium/high)
- **Slippage Protection:** Percentage display with adjustable slider

### Forms & Inputs
- **Amount Input:** Large numerical input with token selector dropdown, "Max" button, USD equivalent display below
- **Address Input:** Full-width with paste button, ENS name resolution display
- **Token Selector:** Dropdown with token icons, balances, and search functionality
- **Confirmation Button:** Full-width, prominent CTA with loading states

### Overlays & Modals
- **Connect Wallet Modal:** Centered modal with wallet provider options (Alchemy, MetaMask, WalletConnect)
- **Transaction Confirmation:** Modal showing all transaction details before submission, with clear warning for irreversible actions
- **Success/Error Notifications:** Toast notifications, top-right corner, auto-dismiss

### Visual Elements
- **Token Icons:** Circular badges, 24px-32px, for ETH and USDC
- **Status Badges:** Rounded pills with icon + text for transaction states
- **Dividers:** Subtle horizontal rules between transaction list items
- **Loading States:** Skeleton screens for data loading, spinner for button actions
- **Empty States:** Centered illustrations with helpful messaging when no transactions exist

## Images

**No Hero Image Required** - This is a dashboard application focused on functionality.

**Required Icons:**
- Use Heroicons via CDN for all interface icons (arrows, copy, check, warning, menu, etc.)
- Token icons: Use placeholder circular divs with gradient backgrounds or load from cryptocurrency icon libraries

**Illustrations (Optional):**
- Empty state illustration for transaction history when no transactions exist
- Success confirmation illustrations for completed transfers

## Animations

**Minimal & Purposeful:**
- Pending transaction pulse animation (subtle)
- Modal fade-in/slide-up (200ms)
- Button loading spinner
- Number counter animation for balance updates (optional)
- No scroll animations or decorative effects