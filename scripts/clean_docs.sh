#!/bin/bash
echo "🧽 تنظيف ملفات Markdown..."
find ./docs -type f -name "*.md" -exec sed -i 's/[ \t]*$//' {} \;
find ./docs -type f -name "*.md" -exec sed -i '/^$/N;/^\n$/D' {} \;
echo "✅ تم تنظيف الوثائق بنجاح."
