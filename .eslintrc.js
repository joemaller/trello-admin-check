// // https://eslint.org/docs/user-guide/configuring

// module.exports = {
//   root: true,
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
//   env: {
//     browser: true,
//   },
//   extends: [
//     // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
//     // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
//     'plugin:vue/essential',
//     // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//     'eslint:recommended'
//   ],
//   // required to lint *.vue files
//   // add your custom rules here
//   rules: {
//     // allow async-await
//     'generator-star-spacing': 'off',
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
//   }
// }

module.exports = {
  root: true,

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:vue/essential"],
  parserOptions: {
    sourceType: "module",
    parser: "babel-eslint"
  },
  plugins: ["vue"],
  rules: {
    "linebreak-style": ["error", "unix"],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-param-reassign": "error",
    "space-before-function-paren": "off",
    "vars-on-top": "off"
  }
};
