<script>
import { add, update } from '@/api/system/dept'
import i18n from '@/plugins/i18n'

export default {
  name: 'DeptEditDialog',
  data() {
    return {
      show: false,
      list: [],

      formLoading: false,
      form: {
        deptName: null,
        status: null,
        sortNum: 999,

        parentId: null,
        parentIds: null,
        _parentIds: []
      },
      rules: {
        deptName: [
          { required: true, message: i18n.t('dept.edit.form.deptName.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: i18n.t('dept.edit.form.status.required'), trigger: 'change' }
        ]
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('dept.edit.update.title') : this.$t('dept.edit.add.title')
    }
  },
  methods: {
    open(row, list) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.list = list
      this.show = true
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }

        // 设置直接父级ID
        if (this.form._parentIds.length) {
          this.form.parentId = this.form._parentIds[this.form._parentIds.length - 1]
          this.form.parentIds = '0,' + this.form._parentIds.join(',')
        } else {
          this.form.parentId = 0
          this.form.parentIds = '0'
        }

        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(() => {
          this.$message.success(this.form.id ? this.$t('dept.edit.update.success') : this.$t('dept.edit.add.success'))
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
    width="600px"
    @open="onDialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item :label="$t('dept.edit.form.parentId')" prop="parentId">
            <el-cascader
              v-model="form._parentIds"
              :options="list"
              :props="{ checkStrictly: true, value: 'id', label: 'deptName', children: 'children' }"
              :placeholder="$t('dept.edit.form.parentId.placeholder')"
              clearable
              filterable
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('dept.edit.form.deptName')" prop="deptName">
            <el-input v-model="form.deptName" :placeholder="$t('dept.edit.form.deptName.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('dept.edit.form.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">{{ $t('dept.edit.form.status.normal') }}</el-radio>
              <el-radio :label="1">{{ $t('dept.edit.form.status.disabled') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('dept.edit.form.sortNum')" prop="sortNum">
            <el-input-number v-model="form.sortNum" :min="0" :max="9999" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
