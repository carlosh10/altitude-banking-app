#!/bin/bash

echo "🚀 Altitude Banking App - Files to Copy to Replit"
echo "================================================="
echo ""

echo "📁 ROOT FILES (copy these to Replit root):"
echo "├── .replit"
echo "├── replit.nix" 
echo "├── package.json"
echo "├── App.tsx"
echo "├── babel.config.js"
echo "├── metro.config.js"
echo "├── tsconfig.json"
echo "├── app.json"
echo "├── server.js"
echo "├── REPLIT_SETUP.md"
echo "└── README.md"
echo ""

echo "📁 SOURCE CODE (recreate this folder structure):"
find src -type f -name "*.ts" -o -name "*.tsx" | sort | sed 's/^/├── /'
echo ""

echo "🎯 TOTAL FILES TO COPY:"
echo "Root files: $(ls -1 *.* .replit replit.nix 2>/dev/null | wc -l | xargs)"
echo "Source files: $(find src -type f | wc -l | xargs)"
echo ""

echo "✅ Next steps:"
echo "1. Create new Replit (Node.js template)"
echo "2. Copy all files above to Replit"  
echo "3. Run: npm install"
echo "4. Run: npm start"
echo "5. Open your banking app! 🏦"