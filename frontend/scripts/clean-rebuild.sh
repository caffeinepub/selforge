#!/bin/bash
# Clean rebuild script for frontend
# This script removes all build artifacts and reinstalls dependencies for a fresh build

set -e

echo "🧹 Starting clean rebuild process..."

# Navigate to frontend directory
cd "$(dirname "$0")/.."

# Remove build artifacts
echo "📦 Removing build artifacts..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .vite/

# Remove node_modules for complete clean
echo "🗑️  Removing node_modules..."
rm -rf node_modules/

# Remove lock file to ensure fresh dependency resolution
echo "🔓 Removing lock file..."
rm -f pnpm-lock.yaml

# Reinstall dependencies
echo "📥 Installing dependencies..."
pnpm install

# Run TypeScript check
echo "🔍 Running TypeScript check..."
pnpm typescript-check

# Build the project
echo "🏗️  Building project..."
pnpm build:skip-bindings

echo "✅ Clean rebuild complete!"
echo ""
echo "Next steps:"
echo "1. Test the build locally: pnpm start"
echo "2. Deploy to production"
