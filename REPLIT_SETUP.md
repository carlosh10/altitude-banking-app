# 🚀 Altitude Banking App - Replit Migration Guide

This guide will help you migrate and run the Altitude B2B Banking app on Replit.

## 📋 Quick Setup Steps

### 1. Create New Replit Project
1. Go to [Replit.com](https://replit.com)
2. Click "Create Repl"
3. Choose "Import from GitHub" OR "Blank Repl" with Node.js template
4. Name it: `altitude-banking-app`

### 2. Upload Project Files
Copy all these files from your local project to Replit:

**📁 Essential Files:**
```
├── .replit                    # Replit configuration
├── replit.nix                # Nix dependencies
├── package.json              # Dependencies & scripts
├── App.tsx                   # Main app component
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler config
├── tsconfig.json             # TypeScript config
├── app.json                  # Expo configuration
├── server.js                 # Demo server (backup)
└── src/                      # All source code
    ├── components/           # UI components
    ├── navigation/           # Navigation setup
    ├── screens/              # App screens
    ├── services/             # Business logic
    ├── types/                # TypeScript types
    └── utils/                # Utility functions
```

### 3. Install Dependencies
In Replit shell, run:
```bash
npm install
```

### 4. Start the App
Choose one of these methods:

**Method A: Full Expo Web App (Recommended)**
```bash
npm start
```
This will start the complete React Native web app on port 3000.

**Method B: Demo Server (Fallback)**
```bash
npm run demo
```
This runs the demo server if Expo has issues.

## 🎯 Expected Results

### ✅ If Successful:
- App opens in Replit's web view
- You'll see the login screen
- Navigation works between tabs:
  - 🏠 Dashboard
  - 💸 Payments  
  - ✅ Approvals
  - 🔄 Trade

### 🔧 If Issues Occur:
1. **Dependencies fail**: Run `npm install --legacy-peer-deps`
2. **Port issues**: Change port in package.json from 3000 to 8080
3. **Expo fails**: Use demo server with `npm run demo`

## 🏦 App Features to Test

### 🔐 Login Screen
- Enter any email/password (mock authentication)
- Should redirect to dashboard

### 📊 Dashboard  
- View USD/BRL account balances
- See yield performance charts
- Check recent transactions

### 💸 Payments
- Create BRL/USD transfers
- View real-time exchange rates
- Test confirmation flow

### ✅ Approvals
- View pending transactions
- Test approve/reject actions
- See multi-signature progress

### 🔄 Trade
- Test currency swaps
- Get live quotes
- Execute trades

## 🛠 Replit-Specific Optimizations

### Environment Variables
Set these in Replit Secrets (if needed):
- `NODE_ENV=development`
- `EXPO_WEB_PORT=3000`

### File Structure
Replit works best with:
- All dependencies in package.json
- Relative imports (not @ aliases)
- Web-compatible code

### Performance Tips
- Use web view for testing
- Enable always-on for persistent development
- Use Replit database for data persistence (future enhancement)

## 🔄 Troubleshooting

### Common Issues:

**1. Module Resolution Errors**
```bash
# Fix: Use relative imports
import { Component } from '../../../components/Component'
```

**2. Port Already in Use**
```bash
# Fix: Kill existing processes
killall node
npm start
```

**3. TypeScript Errors**
```bash
# Fix: Skip lib check
npm run typecheck
```

**4. Expo Metro Issues**
```bash
# Fix: Clear cache and restart
rm -rf node_modules
npm install
npm start
```

## 📱 Mobile Testing

While in Replit:
1. **Web Version**: Opens automatically in Replit
2. **Mobile Simulation**: Use browser dev tools (F12) → Device toolbar
3. **Real Device**: Share the Replit URL and open on phone

## 🚀 Going Production

For production deployment:
1. **Export Web Build**: `npm run build`
2. **Deploy to Vercel/Netlify**: Use the exported files
3. **Mobile Apps**: Use `expo build` for app stores
4. **Real APIs**: Replace mock services with actual banking APIs

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Login screen loads without errors
- ✅ Tab navigation works smoothly  
- ✅ All 4 screens (Dashboard, Payments, Approvals, Trade) render
- ✅ Mock data displays correctly
- ✅ UI is responsive and professional-looking

## 📞 Support

If you encounter issues:
1. Check the Replit console for errors
2. Verify all files uploaded correctly
3. Ensure dependencies installed successfully
4. Try the demo server as fallback

**🏦 Your B2B cross-border banking app is ready for Replit! 🚀**