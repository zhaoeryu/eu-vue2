<script>
import ContentBlock from '@/components/ContentLayout/ContentBlock.vue'

export default {
  name: 'ContentLayout',
  components: { ContentBlock },
  props: {
    isError: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<template>
  <div>
    <div class="page-container">
      <content-block v-if="isError">
        <el-empty
          :description="errorText"
        >
          <slot name="error"></slot>
        </el-empty>
      </content-block>
      <template v-else>
        <slot></slot>
      </template>
    </div>
    <slot v-if="!isError" name="footer"></slot>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  // 减去底部fixed高度
  margin-bottom: 50px;
}
</style>
