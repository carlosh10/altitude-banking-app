module.exports = {
  extends: ['expo'],
  plugins: ['react', 'react-native'],
  rules: {
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off',
  },
  env: {
    'react-native/react-native': true,
  },
};