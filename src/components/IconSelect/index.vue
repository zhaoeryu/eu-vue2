<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    width="fit-content"
    trigger="click"
    append-to-body
    @show="onShow"
  >
    <div class="icon-select-body">
      <el-input v-model="keyword" style="width: 250px;" placeholder="输入要查找的图标拼音" />
      <el-divider></el-divider>
      <div style="max-height: 300px;overflow-y: auto;">
        <el-row>
          <el-col v-for="(icon, index) in filterIcons" :key="index" :span="4" :class="{ 'active': icon === activeIcon }" @click.native="onIconSelected(icon)">
            <div style="text-align: center;">
              <svg-icon :icon-class="icon" />
              <div style="font-size: 12px;color: #909399;">{{ icon }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <template #reference>
      <slot name="reference" ></slot>
    </template>
  </el-popover>
</template>

<script>
import icons from './requireIcons'
export default {
  name: 'IconSelect',
  props: {
    activeIcon: String
  },
  data() {
    return {
      keyword: null,
      iconList: icons,
    }
  },
  computed: {
    filterIcons() {
      if (this.keyword) {
        return this.iconList.filter(item => item.includes(this.keyword))
      }
      return this.iconList
    }
  },
  methods: {
    onShow() {
      // 重置组件数据
      Object.assign(this.$data, this.$options.data())
    },
    onIconSelected(icon) {
      console.log(icon)
      this.$emit('update:activeIcon', icon)
      this.$refs.popover.doClose()
    }
  }
}
</script>

<style lang='scss' scoped>
.icon-select-body {
  width: 700px;
  ::v-deep {
    .el-divider--horizontal {
      margin: 12px 0;
    }
    .svg-icon {
      width: 1.5em;
      height: 1.5em;
    }
  }
  .el-col {
    padding: 6px;
    cursor: pointer;
    user-select: none;
    margin-bottom: 12px;
    &:hover,.active {
      background-color: rgba(21,91,212,.08);
      border-radius: 4px;
    }
  }
}
</style>
