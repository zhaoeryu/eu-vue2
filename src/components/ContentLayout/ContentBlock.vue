<script>

export default {
  name: 'ContentBlock',
  data() {
    return {}
  }
}
</script>

<template>
  <div class="content-block">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
* ~ .content-block {
  margin-top: 12px;
}
.content-block {
  background-color: var(--theme-base-second-bg);
  width: 100%;
  box-sizing: border-box;
}
.content-body {
  padding: 0 12px 12px;
}
</style>
