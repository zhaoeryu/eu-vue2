<script>
export default {
  name: 'ContentFooter',
  data() {
    return {}
  }
}
</script>

<template>
  <div class="content-footer">
    <!-- 左侧 -->
    <div>
      <slot name="left"></slot>
    </div>
    <!-- 中间 -->
    <div class="mid">
      <slot name="default"></slot>
    </div>
    <!-- 右侧 -->
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));

  height: 50px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--theme-base-second-bg);
  padding: 0 12px;
  box-shadow: 0 0 10px 0 var(--color-border-2);

  &>div {
    flex: 1;
    &:last-child {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .mid {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
