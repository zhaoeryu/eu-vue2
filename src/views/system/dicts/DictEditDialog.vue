<script>
import { add, update } from '@/api/system/dict'

export default {
  name: 'DictEditDialog',
  data() {
    return {
      show: false,

      formLoading: false,
      form: {
        dictKey: null,
        remark: null,
        status: null
      },
      rules: {
        dictKey: [
          { required: true, message: '请输入字典KEY', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择字典状态', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? '修改字典' : '新增字典'
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.show = true
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(() => {
          this.$message.success(`${ this.form.id ? '修改' : '新增' }成功！`)
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
  <el-dialog :title="title" :visible.sync="show" width="500px" :close-on-click-modal="false" @open="onDialogOpen">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="字典KEY" prop="dictKey">
        <el-input v-model="form.dictKey" placeholder="请输入字典KEY" maxlength="30" />
      </el-form-item>
      <el-form-item label="字典状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" maxlength="200" />
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
