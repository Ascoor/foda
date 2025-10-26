#!/bin/bash
echo "🔧 تهيئة بيئة التطوير..."
cp .env.example .env 2>/dev/null || echo "⚠️ ملف .env.example غير موجود"
echo "✅ بيئة التطوير جاهزة."
