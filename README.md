# 🏦 Altitude Banking App

[![Deploy to Replit](https://replit.com/badge/github/carlosh10/altitude-banking-app)](https://replit.com/new/github/carlosh10/altitude-banking-app)

A complete React Native Expo B2B cross-border banking application inspired by Altitude (squads.xyz/altitude). This app enables secure multi-signature banking operations between USD (USDC) and BRL currencies.

![Banking App Preview](https://img.shields.io/badge/Platform-React%20Native-blue) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue) ![Expo](https://img.shields.io/badge/Framework-Expo-black)

## 🚀 Quick Start

### Option 1: Deploy to Replit (Recommended)
1. **Fork this repository** on GitHub
2. **Import to Replit**: Go to [Replit](https://replit.com) → "Create Repl" → "Import from GitHub"
3. **Paste your GitHub repository URL**
4. **Run the app**:
   ```bash
   npm install
   npm start
   ```

### Option 2: Local Development
```bash
git clone https://github.com/carlosh10/altitude-banking-app.git
cd altitude-banking-app
npm install
npm start
```

## 🎯 Demo Credentials
- **Email**: Any email address
- **Password**: Any password
- The app uses mock authentication for demonstration

## ✨ Features

### 🏦 Core Banking Functions
- 📊 **Dashboard**: USD/BRL balances, yields, account overview
- 💸 **Payments**: Cross-border BRL/USD transfers with real-time exchange rates  
- ✅ **Approvals**: Multi-user approval queue for transaction authorization
- 🔄 **Trade**: Asset swaps between USD (USDC), BRL, and other currencies

### 🔐 Security & Compliance
- 🔒 Multi-signature wallet integration (Squads Protocol)
- 🛡️ TypeScript for type safety
- 🔑 Secure authentication and session management
- 📈 Real-time exchange rate integration

### 💱 Cross-Border Features
- 💰 USD handled as USDC stablecoin on Solana
- 🌎 Real-time BRL/USD exchange rates
- 🚀 Cross-border payment processing
- 📊 Yield-generating accounts

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native + Expo |
| **Language** | TypeScript |
| **Navigation** | React Navigation (Tabs) |
| **Blockchain** | Solana + Squads SDK |
| **State** | React Hooks |
| **Storage** | AsyncStorage |
| **Charts** | react-native-chart-kit |

## 📱 App Screens

### 🔐 Authentication
- **Login Screen**: Secure authentication with session management

### 📊 Dashboard  
- Account balances (USD/BRL)
- Yield performance charts
- Recent transaction history
- Account overview cards

### 💸 Payments
- BRL/USD transfer interface
- Real-time exchange rates
- Recipient validation
- Transaction confirmation

### ✅ Approvals
- Multi-signature approval queue
- Transaction progress tracking (e.g., 2/3 approvals)
- Approve/Reject functionality
- Audit trail and comments

### 🔄 Trade
- Currency swap interface
- Live exchange quotes
- Slippage protection
- Trade execution

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # AccountCard, TransactionList
│   └── charts/         # YieldChart
├── navigation/         # Tab navigation setup
├── screens/           # Main app screens
│   ├── Auth/          # Login
│   ├── Dashboard/     # Account overview
│   ├── Payments/      # Transfer money
│   ├── Approvals/     # Transaction approvals
│   └── Trade/         # Currency swaps
├── services/          # Business logic & APIs
│   ├── authService.ts
│   ├── accountService.ts
│   ├── paymentsService.ts
│   ├── approvalsService.ts
│   ├── tradeService.ts
│   └── squadsService.ts
├── types/             # TypeScript definitions
└── utils/             # USDC/USD utilities
```

## ⚙️ Configuration

### Environment Variables
```bash
NODE_ENV=development
EXPO_WEB_PORT=3000
```

### Squads Protocol (Mock)
The app includes mock Squads Protocol integration for:
- Multisig wallet creation
- Transaction proposals
- Approval workflows
- Threshold-based execution

## 🚀 Deployment Options

### Replit (Web)
- Import from GitHub
- Automatic dependency installation
- Instant web deployment

### Mobile Apps
```bash
npm run build        # Web build
expo build:ios       # iOS build  
expo build:android   # Android build
```

## 🧪 Testing Features

### Mock Data Available:
- ✅ User accounts with USD/BRL balances
- ✅ Transaction history
- ✅ Pending approvals workflow
- ✅ Exchange rates and trading
- ✅ Yield performance data

### Test Scenarios:
1. **Login** → Use any credentials
2. **View Balances** → Check USD/BRL accounts
3. **Send Payment** → Create transfer with exchange rates
4. **Approve Transaction** → Test multisig workflow
5. **Trade Assets** → Swap between currencies

## 🔒 Security Features

- **Multi-signature** approval workflows
- **Transaction** approval thresholds
- **Secure** authentication flow
- **Audit** logging and trails
- **Real-time** fraud detection (mock)

## 🌟 Production Readiness

To make this production-ready:
1. **Replace mock services** with real banking APIs
2. **Implement KYC/AML** compliance
3. **Add real Squads Protocol** integration  
4. **Set up monitoring** and logging
5. **Configure production** environment variables

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/carlosh10/altitude-banking-app/issues)
- 📧 **Email**: Open an issue for support
- 📖 **Documentation**: Check the code comments and README

---

**🏦 A complete B2B cross-border banking solution with multisig support! 🚀**

> **Note**: This is a demonstration app with mock data. For production use, integrate with real banking APIs and ensure regulatory compliance.