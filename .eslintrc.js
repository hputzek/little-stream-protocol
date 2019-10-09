module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": "2018"
  },
  extends: ["plugin:prettier/recommended"],


  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    "no-console": "off",
    "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }],
    "prettier/prettier": [
      "error", {
      "semi": false,
      "singleQuote": true
      }
    ]
  }
}
