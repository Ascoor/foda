// eslint.config.ts (أو eslint.config.mjs)
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import"; // لدعم قواعد الاستيراد

export default tseslint.config(
  // 0) تجاهل مجلدات البناء
  { ignores: ["dist", "node_modules"] },

  // 1) قواعد TypeScript + Type-Checked
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked, // يفعّل type-aware rules
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        // يقرأ tsconfig ويستخدم Project Service (بديل لـ project)
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // React Fast Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // TypeScript
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",

      // Imports (اختياري مفيد)
      "import/first": "warn",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "warn",
    },
    settings: {
      // مهم: يخلّي ESLint يفهم aliases من tsconfig.json
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
        },
      },
    },
  },

  // 2) ملفات JS/JSX (لو عندك)
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/first": "warn",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
        },
      },
    },
  }
);
