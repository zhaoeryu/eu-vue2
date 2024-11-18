export const defaultTheme = {
  // 布局: column vertical
  layout: 'column',
  // [vertical]是否只保持一个子菜单的展开
  uniqueOpened: true,
  // 是否使用标签页
  showTabsBar: true,
  // 是否固定标签页
  fixedTabsBar: true,
  // 皮肤 light,dark,syncOS
  darkMode: 'syncOS',
  // 是否使用进度条
  showProgressBar: true,
  // 是否使用快捷菜单
  useUsualMenu: false,
  // 是否开启水印
  enabledWatermark: true
}

export const defaultSetting = {
  // 网站名称
  title: 'EuBackend',
  // 网站版本
  version: '0.0.1',
  // 是否使用Mock数据
  useMock: true,
  // 页面底部的copyright
  copyright: function () {
    const date = new Date()
    const year = date.getFullYear()
    return `Copyright © 2023-${year} Eu. All Rights Reserved.`
  }(),
  // 路由缓存的最大数量
  keepAliveMaxNum: 5,
  // 请求根地址
  BASE_API: process.env.VUE_APP_BASE_API,
  // 默认的记住我的时长（单位：天）
  rememberMeDefaultDays: 180,
  // 匿名访问白名单
  anonymousAccessWhiteList: ['/login', '/404', '/401', '/demo'],

  // 系统帮助文档地址
  systemHelpDocUrl: 'https://zhaoeryu.github.io',
  // github源码地址
  githubUrl: 'https://github.com/zhaoeryu',
  // gitee源码地址
  giteeUrl: 'https://gitee.com/zhaoeryu',
  // 默认语言
  locale: 'zh_CN',
}
