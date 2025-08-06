#!/bin/bash

echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo "🗑️ Cleaning node_modules (optional)..."
# Uncomment the next line if you want to clean node_modules too
# rm -rf node_modules && npm install

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 You can now run 'npm run dev' to start development server" 