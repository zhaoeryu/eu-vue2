<template>
  <header id="eu-layout__navbar">
    <div class="left-side" @click="toHomePage">
      <img :src="require('@/assets/logo.png')" style="height: 30px;margin-right: 16px;">
      <span style="font-size: 24px;">{{ defaultSetting.title }}</span>
    </div>
    <ul class="right-side">
      <li v-if="defaultSetting.systemHelpDocUrl" class="eu-phone__hide" @click="toNewPage(defaultSetting.systemHelpDocUrl)">
        <svg-icon icon-class="help" />
      </li>
      <li v-if="defaultSetting.githubUrl" class="eu-phone__hide" @click="toNewPage(defaultSetting.githubUrl)">
        <svg-icon icon-class="github" />
      </li>
      <li v-if="defaultSetting.giteeUrl" class="eu-phone__hide" @click="toNewPage(defaultSetting.giteeUrl)">
        <svg-icon icon-class="gitee" />
      </li>
      <li class="eu-phone__hide" @click="onRefresh">
        <i class="el-icon-refresh"></i>
      </li>
      <li class="eu-phone__hide">
        <i v-if="darkMode === 'dark'" @click="changeDarkMode('light')" class="el-icon-moon"></i>
        <i v-else @click="changeDarkMode('dark')" class="el-icon-sunny"></i>
      </li>
      <li @click="$emit('themeconfig')">
        <svg-icon icon-class="theme" />
      </li>
      <li>
        <message>
          <template #reference="{ messageCount }">
            <el-badge :value="messageCount" :max="99" :hidden="messageCount === 0">
              <svg-icon icon-class="tongzhi" />
            </el-badge>
          </template>
        </message>
      </li>
      <li v-if="defaultSetting.enableI18n">
        <el-dropdown @command="onLocaleChange">
          <div>
            <svg-icon icon-class="language" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="option in langOptions"
                :key="option.value"
                :command="option.value"
              >{{ option.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li class="eu-phone__hide" @click="onScreenfull">
        <svg-icon :icon-class="isFullscreen ? 'fullscreen-exit':'fullscreen'" />
      </li>
      <li>
        <sidebar-header />
      </li>
    </ul>
  </header>
</template>

<script>
import Message from '@/components/Message/index.vue'
import screenfull from 'screenfull'
import SidebarHeader from '@/layout/components/SidebarHeader/index.vue'
import { mapGetters } from 'vuex'
import { LOCALE_OPTIONS } from '@/locale'
import { STORAGE_KEY_LOCALE } from '@/utils/constants'

export default {
  name: 'HeaderNavBar',
  components: { SidebarHeader, Message },
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme'
    }),
    darkMode() {
      return this.theme.darkMode
    },
    langOptions() {
      return LOCALE_OPTIONS
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    changeDarkMode(mode) {
      this.$store.dispatch('settings/saveTheme', Object.assign({}, this.theme, {
        darkMode: mode
      }))
    },
    onScreenfull() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: '暂不不支持全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    },
    onRefresh() {
      location.reload()
    },
    toHomePage() {
      location.href = '/'
    },
    toNewPage(url) {
      window.open(url)
    },
    onLocaleChange(locale) {
      this.$i18n.locale = locale
      localStorage.setItem(STORAGE_KEY_LOCALE, locale)
      location.reload()
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/styles/screen.scss";
#eu-layout__navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--layout-header-nav-height);
  background: var(--theme-nav-first-bg);
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
  padding: 0 16px;
  z-index: 200;
  color: var(--theme-nav-first-color);
  .left-side {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
  }
  .right-side {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 16px;
    li {
      cursor: pointer;
      & + li {
        margin-left: 30px;
      }
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}

@media (max-width: $screen-md) {
  .eu-phone__hide {
    display: none;
  }
}

::v-deep {
  .el-dropdown {
    color: inherit;
  }
}
</style>
