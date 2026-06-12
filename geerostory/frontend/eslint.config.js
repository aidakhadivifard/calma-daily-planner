import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Loading-on-mount and prop/dependency-sync effects are intentional here
      // (auth bootstrap, data fetching, audio src changes, form resets).
      'react-hooks/set-state-in-effect': 'off',
      // Context modules intentionally co-export their `useX` hook with the provider.
      'react-refresh/only-export-components': 'off',
    },
  },
])
