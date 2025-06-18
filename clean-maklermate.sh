#!/bin/bash

echo "🧹 Starte Projektbereinigung für MaklerMate..."

# Seiten, die behalten werden sollen
keep_pages=("Home.jsx" "ExposeTool.jsx")

# Komponenten, die behalten werden sollen
keep_components=("CRMForm.jsx" "CRMExportBox.jsx" "ExposeForm.jsx" "GPTOutputBox.jsx" "Navbar.jsx")

# Styles, die behalten werden sollen
keep_styles=("ExposeTool.css" "Navbar.css")

# 🔄 Pages bereinigen
cd src/pages 2>/dev/null || exit
for file in *.jsx; do
  if [[ ! " ${keep_pages[@]} " =~ $file ]]; then
    echo "🗑️  Entferne pages/$file"
    rm "$file"
  fi
done
cd ../..

# 🔄 Components bereinigen
cd src/components 2>/dev/null || exit
for file in *.jsx; do
  if [[ ! " ${keep_components[@]} " =~ $file ]]; then
    echo "🗑️  Entferne components/$file"
    rm "$file"
  fi
done
cd ../..

# 🔄 Styles bereinigen
cd src/styles 2>/dev/null || exit
for file in *.css; do
  if [[ ! " ${keep_styles[@]} " =~ $file ]]; then
    echo "🗑️  Entferne styles/$file"
    rm "$file"
  fi
done
cd ../..

echo "✅ Bereinigung abgeschlossen!"

