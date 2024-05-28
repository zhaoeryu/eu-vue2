<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="12" :xs="24">
        <div class="page-body">
          <eu-editor v-model="content" />
        </div>
      </el-col>
      <el-col :span="12" :xs="24">
        <div class="page-body">
          <m-block-header title="预览" />
          <div v-html="content"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'EditorComponent',
  data() {
    return {
      content: ''
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
