import { defaultSetting } from '@/settings'

if (defaultSetting.useMock) {
  // 加载modules下的所有mock文件
  const files = require.context('./modules', false, /\.js$/)
  files.keys().forEach(key => {
    files(key)
  })
}
