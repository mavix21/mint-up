module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['universe/native'],
  overrides: [
    {
      files: ['*.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['packages/backend/convex/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['*/_generated/server'],
                importNames: ['mutation', 'internalMutation'],
                message: 'Use functions.ts for mutations to ensure triggers run',
              },
            ],
          },
        ],
      },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react-hooks/rules-of-hooks': 'warn',
  },
  settings: {
    'import/ignore': ['react-native'],
    react: {
      version: 'detect',
    },
  },
};
