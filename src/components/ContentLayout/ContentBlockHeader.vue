<script>
export default {
  name: 'ContentBlockHeader',
  props: {
    label: String,
    value: {
      type: String,
      default: '-'
    }
  },
  data() {
    return {}
  }
}
</script>

<template>
  <div class="content-block-header">
    <div>
      {{ label }}: {{ value || '-' }}
    </div>
    <div class="content-block-header__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-block-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-color: var(--color-border);
  }
  .content-block-header__right {
    .el-tag ~ .el-tag {
      margin-left: 8px;
    }
  }
}
</style>
