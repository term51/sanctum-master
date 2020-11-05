module.exports = {
   root: true,
   env: {
      node: true
   },
   'extends': [
      'plugin:vue/essential',
      'eslint:recommended'
   ],
   rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'no-unreachable': 'off',
      'no-empty': 'off'
   },
   parserOptions: {
      parser: 'babel-eslint'
   }
}
