# Frontend Structure and i18n

## Adding Translations
1. All UI strings live in `src/i18n/en.json` and `src/i18n/ar.json`.
2. Use the same key in both files. Example:
   ```json
   // src/i18n/en.json
   {
     "example.hello": "Hello"
   }
   // src/i18n/ar.json
   {
     "example.hello": "مرحبا"
   }
   ```
3. Inside components use the `useLanguage` hook and call `t('example.hello')`.
4. New keys appear immediately when the user switches language.

## Creating a Module
1. Create a folder inside `src/modules/` with the module name.
2. Add three files: `List.tsx`, `Form.tsx`, `Details.tsx`.
3. Each file exports a React component. Example skeleton:
   ```tsx
   import React from 'react';
   import { useLanguage } from '@/contexts/LanguageContext';

   const MyModuleList: React.FC = () => {
     const { t } = useLanguage();
     return <div>{t('nav.mymodule')}</div>;
   };

   export default MyModuleList;
   ```
4. Register routes for the new module in `src/App.tsx` and add navigation entry in `src/components/sidebar/sidebarConfig.ts`.
5. Add any required translation keys to both `en.json` and `ar.json`.

This structure keeps modules isolated and makes it easy to scale the application while maintaining full Arabic/English support.
