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
::v-deep h5, .h5 {
  font-size: 14px;
}

::v-deep h4, .h4 {
  font-size: 16px;
  font-weight: bold;
}

::v-deep h3, .h3 {
  font-size: 18px;
  font-weight: bold;
}

::v-deep h2, .h2 {
  font-size: 20px;
  font-weight: bold;
}

::v-deep h1, .h1 {
  font-size: 22px;
  font-weight: bold;
}
::v-deep i {
  font-style: italic
}
::v-deep .w-e-toolbar .w-e-menu i {
  font-style: normal;
}
::v-deep ol {
  list-style-type: decimal;
}
/* ul ol 样式 */
::v-deep ol{
  margin: 10px 0 10px 22px;
  list-style-type: decimal;
}
::v-deep ul{
  margin: 10px 0 10px 22px;
  list-style-type: disc;
}
/* table 样式 */
::v-deep table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
::v-deep table td,
::v-deep table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
  height:32px;
}
::v-deep table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
  background-color: #f1f1f1 ;
}

/* blockquote 样式 */
::v-deep blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  min-height: 24px;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
::v-deep code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
::v-deep pre code {
  display: block;
}
::v-deep a {
  // text-decoration: underline;
  color: #5592e5;
}
</style>
