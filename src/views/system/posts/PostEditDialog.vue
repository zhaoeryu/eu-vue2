<script>
import { add, update } from '@/api/system/post'

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
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入岗位编码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择岗位状态', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? '修改岗位' : '新增岗位'
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
    width="500px"
    @open="onDialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="form.postName" placeholder="请输入岗位名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="岗位编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入岗位编码" maxlength="20" />
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
