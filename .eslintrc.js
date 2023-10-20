module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    // vue组件名称必须多个单词
    'vue/multi-word-component-names': 'off',
    // 必须缩进2个空格
    'indent': ['error', 2, {
      'SwitchCase': 1
    }],
    // html标签开合缩进必须相同
    'vue/html-indent': ['error', 2, {
      'alignAttributesVertically': false
    }],
    // valid-jsdoc: JSDoc注释格式
    'valid-jsdoc': ['error', {
      // 强制使用 @returns
      'requireReturn': false,
      // 强制使用 @returns 的返回值类型 {void}
      'requireReturnType': false,
      // 强制使用 @param 的参数类型 {string}
      'requireParamType': true,
      // 强制使用 @param 的参数描述
      'requireParamDescription': true,
      // 强制使用 @returns 的返回值描述
      'requireReturnDescription': false
    }],
    // 强制代码中不能存在 TODO, FIXME 注释
    'no-warning-comments': ['warn', {
      'terms': ['TODO', 'FIXME']
    }],
    // 强制行注释的位置
    'line-comment-position': ['error', {
      'position': 'above'
    }],
    // 元素标签闭合
    // 'vue/html-self-closing': ['error', {
    //   'html': {
    //     'void': 'never',
    //     'normal': 'always',
    //     'component': 'always'
    //   },
    //   'svg': 'always',
    //   'math': 'always'
    // }],
    // 强制使用单引号
    'quotes': ['error', 'single'],
    // 强制,后面加一个空格,前面不加空格
    'comma-spacing': ['error', {
      'before': false,
      'after': true
    }],
    // 强制,不能单独放在一行
    'comma-style': ['error', 'last'],
    // 强制css属性冒号后面必须加空格
    //  if while function 后面的{必须与if在同一行，java风格
    'brace-style': ['error', '1tbs', {
      'allowSingleLine': true
    }],
    // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
    'computed-property-spacing': ['error', 'never'],
    //  if else while for do后面的代码块是否需要{ }包围
    'curly': ['error', 'all'],
  }
}
