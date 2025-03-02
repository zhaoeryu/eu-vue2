<script>
import ContentBlock from '@/components/ContentLayout/ContentBlock.vue'
import ContentFooter from '@/components/ContentLayout/ContentFooter.vue'
import ContentLayout from '@/components/ContentLayout/ContentLayout.vue'
import ContentBlockHeader from '@/components/ContentLayout/ContentBlockHeader.vue'
import PageModeMixin from '@/mixins/PageModeMixin'

export default {
  name: 'DemoEdit',
  mixins: [
    PageModeMixin({
      permissions: [
        'demo:edit'
      ],
      listPath: '/crud',
    })
  ],
  components: { ContentBlockHeader, ContentLayout, ContentFooter, ContentBlock },
  data() {
    return {
      loading: false,
      isError: false,
      errorText: null,
      submitLoading: false,
      form: {

      }
    }
  },
  computed: {
    businessAllowEdit() {
      return true
    }
  },
  created() {
    if (!this.isAddMode) {
      const { params } = this.$route
      this.form.id = params.id
      this.doLoadData()
    }
  },
  methods: {
    doLoadData() {
      if (!this.form.id) {
        this.isError = true
        // 获取不到id，提示错误
        this.errorText = '链接地址缺少参数'
        return
      }
      // 获取数据
      this.loading = true
      Promise.resolve().then(res => {
        this.form = res.data || {}
      }).finally(() => {
        // this.loading = false
      })
      setTimeout(() => {
        this.loading = false
      }, 3000)
    },
    onSubmit() {
      this.submitLoading = true
      setTimeout(() => {
        this.submitLoading = false
        this.onSubmitSuccess()
      }, 1000)
    }
  }
}
</script>

<template>
  <content-layout
    :is-error="isError"
    :error-text="errorText"
  >
    <template #error>
      <el-button type="primary" @click="onCancel">{{ $t('general.back.prev') }}</el-button>
    </template>

    <content-block v-if="loading">
      <eu-loading style="height: 300px;" />
    </content-block>
    <content-block v-else>
      <content-block-header
        v-if="!isAddMode"
        label="编号"
        value="BH2025010001"
      >
        <template #right>
          <span>无需审批</span>
          <el-divider direction="vertical" />
          <el-tag type="info">待确认</el-tag>
          <el-tag type="success">待确认</el-tag>
          <el-tag type="warning">待确认</el-tag>
          <el-tag type="primary">待确认</el-tag>
        </template>
      </content-block-header>
      <m-block-header :title="$t('general.info.basic')" :background="false" style="margin-top: unset;" />
      <div class="content-body">
        <el-form label-position="right" label-width="120px" :disabled="!allowEdit">
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input :disabled="!isAddMode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input :disabled="!isAddMode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </content-block>

    <!-- 底部 -->
    <template #footer>
      <content-footer>
        <el-button @click="onCancel">取消</el-button>
        <el-button
          v-if="allowEdit"
          :loading="submitLoading"
          type="primary"
          @click="onSubmit"
        >保存</el-button>
        <template v-if="!isAddMode" #right>
          <el-button>操作日志</el-button>
        </template>
      </content-footer>
    </template>
  </content-layout>
</template>

<style scoped lang="scss">

</style>
