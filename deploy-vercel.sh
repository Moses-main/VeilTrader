#!/bin/bash

# VeilTrader Vercel Deployment Script
# This script deploys the VeilTrader UI to Vercel

set -e

echo "🚀 Starting VeilTrader UI deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run 'vercel login' first."
    exit 1
fi

# Build the UI
echo "📦 Building UI..."
npm run build 2>/dev/null || echo "No build script found, skipping..."

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your VeilTrader dashboard is now live!"
