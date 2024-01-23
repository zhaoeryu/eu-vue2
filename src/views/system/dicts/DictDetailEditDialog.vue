<script>
import { add, update } from '@/api/system/dictDetail'
import i18n from '@/plugins/i18n'

export default {
  name: 'DictDetailEditDialog',
  data() {
    return {
      show: false,
      formLoading: false,
      form: {
        dictKey: null,
        dictLabel: null,
        dictValue: null,
        sortNum: 999,
        status: null,
        remark: null
      },
      rules: {
        // dictKey: [
        //   { required: true, message: '请输入字典KEY', trigger: 'blur' }
        // ],
        dictLabel: [
          { required: true, message: i18n.t('dict.detail.edit.form.dictLabel.required'), trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: i18n.t('dict.detail.edit.form.dictValue.required'), trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: i18n.t('dict.detail.edit.form.sortNum.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: i18n.t('dict.detail.edit.form.status.required'), trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('dict.detail.edit.title') : this.$t('dict.detail.add.title')
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.show = true
      this.form = Object.assign(this.form, row)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }

        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(() => {
          this.$message({
            type: 'success',
            message: this.$t('general.confirm.save.success')
          })
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
  <el-dialog :title="title" :visible.sync="show" width="500px" :close-on-click-modal="false" append-to-body @open="onDialogOpen">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item :label="$t('dict.detail.edit.form.dictLabel')" prop="dictLabel">
        <el-input v-model="form.dictLabel" :placeholder="$t('dict.detail.edit.form.dictLabel.placeholder')" maxlength="32" />
      </el-form-item>
      <el-form-item :label="$t('dict.detail.edit.form.dictValue')" prop="dictValue">
        <el-input v-model="form.dictValue" :placeholder="$t('dict.detail.edit.form.dictValue.placeholder')" maxlength="30" />
      </el-form-item>
      <el-form-item :label="$t('dict.detail.edit.form.sortNum')" prop="sortNum">
        <el-input-number v-model="form.sortNum" :min="0" :max="999" />
      </el-form-item>
      <el-form-item :label="$t('dict.detail.edit.form.status')" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">{{ $t('dict.detail.edit.form.status.normal') }}</el-radio>
          <el-radio :label="1">{{ $t('dict.detail.edit.form.status.disable') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('dict.detail.edit.form.remark')" prop="remark">
        <el-input v-model="form.remark" type="textarea" :placeholder="$t('dict.detail.edit.form.remark.placeholder')" maxlength="200" />
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
