module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'react',
    'react-native'
  ],
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true,
      'modules': true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base',
    'plugin:react-native/all'
  ],
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.android.js', '.ios.js']
      }
    }
  },
  rules: {
    'import/no-unresolved': [2, { ignore: ['\.png$'] }],
    'arrow-body-style': 'warn',
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'react-native/no-color-literals': 'off',
    'max-len': ["error", { "code": 160 }],
    'eqeqeq': 'off',
    'react/no-deprecated': 'off',
    'react-native/no-inline-styles': 'off',
    'object-curly-newline': 'off',
    'react/no-string-refs': 'off',
    'prefer-destructuring': 'off',
  },
  env: {
    'jest': true,
  },
  globals: {
    'navigator': true,
    'fetch': true,
    'FormData': true,
    'Headers': true,
    'isNaN': true,
    'window': true,
    '__DEV__': true
  },
};
