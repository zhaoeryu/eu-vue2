<template>
  <el-drawer
    :title="$t('layout.ThemeConfig.title')"
    :visible.sync="innerShow"
    size="300px"
    direction="rtl"
    append-to-body
    @close="$emit('update:show', false)"
  >
    <div style="display: flex;flex-direction: column;height: 100%;overflow: hidden;">
      <div style="flex: 1;overflow-y: auto;">
        <el-form ref="form" :model="form" label-position="left">
          <el-form-item :label="$t('layout.ThemeConfig.form.layout')" class="eu-form-item__layout">
            <el-radio-group v-model="form.layout">
              <el-radio-button label="column">
                <el-tooltip :content="$t('layout.ThemeConfig.form.layout.column')" placement="top">
                  <svg-icon icon-class="layout-column" />
                </el-tooltip>
              </el-radio-button>
              <el-radio-button label="vertical">
                <el-tooltip :content="$t('layout.ThemeConfig.form.layout.vertical')" placement="top">
                  <svg-icon icon-class="layout-vertical" />
                </el-tooltip>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.layout === 'vertical'">
            <el-form-item :label="$t('layout.ThemeConfig.form.layout.uniqueOpened')">
              <el-switch v-model="form.uniqueOpened" />
            </el-form-item>
            <el-divider />
          </template>
          <!--          <el-form-item label="头部">-->
          <!--            <el-switch v-model="form.showHeader" />-->
          <!--          </el-form-item>-->
          <el-form-item :label="$t('layout.ThemeConfig.form.showTabsBar')">
            <el-switch v-model="form.showTabsBar" />
          </el-form-item>
          <!--          <el-form-item label="固定头部">-->
          <!--            <el-switch v-model="form.fixedHeader" />-->
          <!--          </el-form-item>-->
          <el-form-item :label="$t('layout.ThemeConfig.form.fixedTabsBar')">
            <el-switch v-model="form.fixedTabsBar" />
          </el-form-item>
          <el-form-item :label="$t('layout.ThemeConfig.form.showProgressBar')">
            <el-switch v-model="form.showProgressBar" />
          </el-form-item>
          <el-form-item :label="$t('layout.ThemeConfig.form.useUsualMenu')">
            <el-switch v-model="form.useUsualMenu" />
          </el-form-item>
          <el-form-item :label="$t('layout.ThemeConfig.form.enabledWatermark')">
            <el-switch v-model="form.enabledWatermark" />
          </el-form-item>
          <el-form-item :label="$t('layout.ThemeConfig.form.darkMode')">
            <el-radio-group v-model="form.darkMode">
              <el-radio-button label="light">
                <template #default>
                  <i class="el-icon-sunny" style="font-weight: bold;font-size: 18px;height: 18px;"></i>
                </template>
              </el-radio-button>
              <el-radio-button label="dark">
                <template #default>
                  <i class="el-icon-moon" style="font-weight: bold;font-size: 18px;height: 18px;"></i>
                </template>
              </el-radio-button>
              <el-radio-button label="syncOS">
                <template #default>
                  <svg-icon icon-class="auto_mode" style="font-weight: bold;font-size: 18px;"/>
                </template>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div class="el-drawer__footer">
        <el-button type="primary" @click="onSubmit">{{ $t('layout.ThemeConfig.submit') }}</el-button>
        <el-button @click="onRestoreDefault">{{ $t('layout.ThemeConfig.restore') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import { defaultTheme } from '@/settings'

export default {
  name: 'ThemeConfig',
  props: {
    show: Boolean
  },
  data() {
    return {
      innerShow: false,
      form: Object.assign({}, defaultTheme)
    }
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
    }),
  },
  watch: {
    show(val) {
      this.innerShow = val
      this.loadTheme()
    }
  },
  created() {
    this.loadTheme()
  },
  methods: {
    loadTheme() {
      this.form = Object.assign({}, defaultTheme, this.theme)
    },
    onSubmit() {
      this.$store.dispatch('settings/saveTheme', this.form)
      this.innerShow = false
    },
    onRestoreDefault() {
      this.$store.dispatch('settings/saveTheme', defaultTheme)
      this.innerShow = false
    }
  }
}
</script>

<style lang='scss' scoped>
.el-drawer__footer {
  border-top: 1px solid var(--color-neutral-2);
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  text-align: right;
}
::v-deep {
  .el-form {
    padding: 0 12px;
    .el-form-item {
      display: flex;
      align-items: center;
      .el-form-item__label {
        flex: 1;
      }
    }
  }
}
.eu-form-item__layout {
  align-items: flex-start !important;
  flex-direction: column;

  ::v-deep .el-radio-button__inner {
    background-color: unset !important;
    padding: 0;
    border: none;
  }

  .svg-icon {
    width: 75px;
    height: 50px;

    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-medium);
  }

  .is-active {
    .svg-icon {
      box-shadow: 0 0 2px 2px var(--color-primary);
    }
  }

  .el-radio-button + .el-radio-button {
    margin-left: 12px;
  }
}
</style>
