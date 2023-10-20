<script>
import { add, update } from '@/api/system/dept'

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
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择部门状态', trigger: 'change' }
        ]
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? '修改部门' : '新增部门'
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
          this.$message.success(this.form.id ? '修改成功' : '新增成功')
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
          <el-form-item label="上级部门" prop="parentId">
            <el-cascader
              v-model="form._parentIds"
              :options="list"
              :props="{ checkStrictly: true, value: 'id', label: 'deptName', children: 'children' }"
              placeholder="请选择上级部门"
              clearable
              filterable
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入部门名称" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="排序" prop="sortNum">
            <el-input-number v-model="form.sortNum" :min="0" :max="9999" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
