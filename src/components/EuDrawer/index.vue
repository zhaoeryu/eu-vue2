<script>
export default {
  name: 'EuDrawer',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '700px'
    },
    isShowFooter: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<template>
  <el-drawer
    :title="title"
    :size="size"
    direction="rtl"
    class="eu-drawer"
    append-to-body
    v-bind="$attrs"
    @close="$emit('update:visible', false)"
  >
    <div class="drawer-body flex flex-direction">
      <div class="flex-sub" style="overflow-y: auto;">
        <slot></slot>
      </div>
      <div v-if="isShowFooter" class="drawer-body__footer padding align-center flex justify-between">
        <div>
          <slot name="footer-left"></slot>
        </div>
        <div>
          <slot name="footer-right"></slot>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>

</style>
