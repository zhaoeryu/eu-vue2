<script>
import { add, update } from '@/api/system/post'
import i18n from '@/plugins/i18n'

export default {
  name: 'PostEditDialog',
  data() {
    return {
      show: false,

      formLoading: false,
      form: {
        postName: null,
        code: null,
        status: null
      },
      rules: {
        postName: [
          { required: true, message: i18n.t('posts.form.postName.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: i18n.t('posts.form.code.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: i18n.t('posts.form.status.required'), trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('posts.edit.title') : this.$t('posts.add.title')
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.show = true
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }

        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(() => {
          this.$message.success(this.form.id ? this.$t('posts.edit.success') : this.$t('posts.add.success'))
          this.show = false
          this.$emit('complete')
        }).finally(() => {
          this.formLoading = false
        })
      })
    },
    onDialogOpen() {
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
  }
}
</script>

<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :close-on-click-modal="false"
    width="500px"
    @open="onDialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="$t('posts.form.postName')" prop="postName">
        <el-input v-model="form.postName" :placeholder="$t('posts.form.postName.placeholder')" maxlength="20" />
      </el-form-item>
      <el-form-item :label="$t('posts.form.code')" prop="code">
        <el-input v-model="form.code" :placeholder="$t('posts.form.code.placeholder')" maxlength="20" />
      </el-form-item>
      <el-form-item :label="$t('posts.form.status')" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">{{ $t('posts.form.status.normal') }}</el-radio>
          <el-radio :label="1">{{ $t('posts.form.status.disabled') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
