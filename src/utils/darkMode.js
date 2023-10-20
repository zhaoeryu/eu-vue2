/**
 * 适配深色模式
 * @param {String} theme 主题 light | dark | syncOS
 */
export function darkMode(theme = 'syncOS') {
  if (theme === 'light') {
    handleDarkMode(false);
    return
  }
  if (theme === 'dark') {
    handleDarkMode(true);
    return
  }
  const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  // 判断是否匹配深色模式
  if (darkMode && darkMode.matches) {
    handleDarkMode(true);
  } else {
    handleDarkMode(false);
  }
  // 监听主题切换事件
  darkMode && darkMode.addEventListener('change', e => {
    handleDarkMode(e.matches);
  });
}

function handleDarkMode(isDark = false) {
  if (isDark) {
    document.body.setAttribute('eu-theme', 'dark');
  } else {
    document.body.removeAttribute('eu-theme');
  }
}
