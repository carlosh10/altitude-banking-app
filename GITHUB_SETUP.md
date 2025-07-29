# 📚 GitHub Setup Guide for Altitude Banking App

This guide will walk you through pushing your Altitude Banking app to GitHub and then importing it to Replit.

## 🚀 Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)
1. **Go to [GitHub.com](https://github.com)**
2. **Click the "+" button** (top right) → "New repository"
3. **Repository details**:
   - Repository name: `altitude-banking-app`
   - Description: `B2B Cross-border Banking App with Multisig Support`
   - Visibility: `Public` (so Replit can import it)
   - ✅ Add a README file: **UNCHECK** (we have our own)
   - ✅ Add .gitignore: **UNCHECK** (we have our own)
   - ✅ Choose a license: **UNCHECK** (optional)
4. **Click "Create repository"**

### Option B: Via GitHub CLI (Alternative)
```bash
gh repo create altitude-banking-app --public --description "B2B Cross-border Banking App with Multisig Support"
```

## 📤 Step 2: Push Code to GitHub

### In your project directory, run these commands:

```bash
# Add all files to git
git add .

# Create your first commit
git commit -m "🏦 Initial commit: Complete Altitude Banking App

✨ Features:
- 🔐 Authentication with mock login
- 📊 Dashboard with USD/BRL balances
- 💸 Cross-border payments with exchange rates
- ✅ Multi-signature approval workflow
- 🔄 Asset trading and swaps
- 💰 USDC stablecoin integration
- 🛡️ TypeScript throughout
- 📱 Professional banking UI

🚀 Ready for deployment on Replit
🔗 Inspired by Altitude (squads.xyz/altitude)"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/altitude-banking-app.git

# Push to GitHub
git push -u origin main
```

**⚠️ Important**: Replace `YOUR_USERNAME` with your actual GitHub username!

## 🔧 Step 3: Update README Links

After creating the repository, update these placeholders in your README.md:

```markdown
# In README.md, replace:
[![Deploy to Replit](https://replit.com/badge/github/USERNAME/altitude-banking-app)](https://replit.com/new/github/USERNAME/altitude-banking-app)

# With your actual username:
[![Deploy to Replit](https://replit.com/badge/github/yourusername/altitude-banking-app)](https://replit.com/new/github/yourusername/altitude-banking-app)
```

Then commit the changes:
```bash
git add README.md
git commit -m "📝 Update README with correct GitHub username"
git push
```

## 🌐 Step 4: Import to Replit

### Method 1: Direct Import (Easiest)
1. **Go to [Replit.com](https://replit.com)**
2. **Click "Create Repl"**
3. **Select "Import from GitHub"**
4. **Paste your repository URL**: `https://github.com/YOUR_USERNAME/altitude-banking-app`
5. **Click "Import from GitHub"**
6. **Wait for import to complete**

### Method 2: One-Click Deploy (If README badge works)
1. **Go to your GitHub repository**
2. **Click the "Deploy to Replit" badge** in the README
3. **This will automatically import to Replit**

### Method 3: Manual Clone in Replit
1. **Create blank Node.js Repl**
2. **In Replit shell, run**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/altitude-banking-app.git .
   ```

## 🏃‍♂️ Step 5: Run in Replit

Once imported to Replit:

```bash
# Install dependencies
npm install

# Start the banking app
npm start
```

**Expected result**: Your banking app should open in Replit's web view! 🎉

## ✅ Verification Checklist

### ✅ GitHub Repository:
- [ ] Repository created successfully
- [ ] All source code visible on GitHub
- [ ] README displays properly with badges
- [ ] .gitignore working (no node_modules in repo)
- [ ] Repository is public (for Replit import)

### ✅ Replit Import:
- [ ] Repository imports without errors
- [ ] `npm install` runs successfully
- [ ] `npm start` launches the app
- [ ] Banking app loads in web view
- [ ] All 4 tabs work (Dashboard, Payments, Approvals, Trade)

## 🐛 Troubleshooting

### Common Issues:

**1. Git Push Fails (Authentication)**
```bash
# If you get authentication errors, use GitHub CLI or personal access token
gh auth login
# OR set up SSH keys in GitHub settings
```

**2. Replit Import Fails**
```bash
# Make sure repository is public
# Try importing with .git suffix: 
# https://github.com/YOUR_USERNAME/altitude-banking-app.git
```

**3. Dependencies Don't Install**
```bash
# In Replit shell:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**4. App Won't Start**
```bash
# Try different start commands:
npm run dev
# OR
npm run demo  # Fallback demo server
```

## 🎯 Success Indicators

You'll know everything worked when:
- ✅ **GitHub**: Repository shows all your banking app files
- ✅ **Replit**: App imports and installs dependencies
- ✅ **Running**: Banking app loads with login screen
- ✅ **Navigation**: All tabs work smoothly
- ✅ **Features**: Mock banking data displays properly

## 🔄 Making Updates

To update your app later:

```bash
# Make changes to your code
git add .
git commit -m "📝 Your update description"
git push

# In Replit, pull the changes:
git pull origin main
npm install  # If you added new dependencies
npm start
```

## 🌟 Optional Enhancements

### Add GitHub Actions (CI/CD)
Create `.github/workflows/ci.yml` for automated testing:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run typecheck
      - run: npm run lint
```

### Add Repository Topics
On GitHub, add these topics to your repository:
- `react-native`
- `expo`
- `typescript`
- `banking`
- `fintech`
- `cross-border`
- `multisig`
- `solana`
- `usdc`

---

## 🎉 You're Done!

Your Altitude Banking app is now:
- ✅ **Version controlled** on GitHub
- ✅ **Deployable** to Replit with one click
- ✅ **Shareable** with others
- ✅ **Ready for production** development

**🏦 Your B2B banking app is now live and accessible! 🚀**