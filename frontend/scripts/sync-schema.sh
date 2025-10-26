#!/bin/bash
echo "🔄 Synchronizing Frontend Schema with Laravel Backend..."
npm run generate:types
npm run lint
npm run build
echo "✅ Frontend schema synchronization complete."
