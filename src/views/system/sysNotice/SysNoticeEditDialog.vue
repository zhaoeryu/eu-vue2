<script>
import { add, update } from '@/api/system/sysNotice'
import { NoticeTypeEnums } from '@/utils/enums'
import i18n from '@/plugins/i18n'

export default {
  name: 'SysNoticeEditDialog',
  data() {
    return {
      show: false,

      formLoading: false,
      form: {
        title: null,
        type: null,
        description: null,
        content: null,
        status: null,
      },
      rules: {
        title: [
          { required: true, message: i18n.t('sysNotice.edit.form.title.required'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: i18n.t('sysNotice.edit.form.type.required'), trigger: 'change' }
        ],
        description: [
          { required: true, message: i18n.t('sysNotice.edit.form.description.required'), trigger: 'blur' }
        ],
        content: [
          { required: true, message: i18n.t('sysNotice.edit.form.content.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: i18n.t('sysNotice.edit.form.status.required'), trigger: 'change' }
        ],
      },

      noticeTypeEnums: NoticeTypeEnums
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('sysNotice.edit.title') : this.$t('sysNotice.add.title')
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
          this.$message.success(this.form.id ? this.$t('sysNotice.edit.success') : this.$t('sysNotice.add.success'))
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
    width="700px"
    @open="onDialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item :label="$t('sysNotice.edit.form.title')" prop="title">
        <el-input v-model="form.title" :placeholder="$t('sysNotice.edit.form.title.placeholder')" clearable />
      </el-form-item>
      <el-form-item :label="$t('sysNotice.edit.form.description')" prop="description">
        <el-input v-model="form.description" :placeholder="$t('sysNotice.edit.form.description.placeholder')" clearable />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('sysNotice.edit.form.type')" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="item in noticeTypeEnums" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('sysNotice.edit.form.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">{{ $t('sysNotice.edit.form.status.normal') }}</el-radio>
              <el-radio :label="1">{{ $t('sysNotice.edit.form.status.disabled') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('sysNotice.edit.form.content')" prop="content">
        <eu-editor v-model="form.content" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>
