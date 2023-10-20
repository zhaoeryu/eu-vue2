<script>
import { add, update } from '@/api/system/dictDetail'

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
          { required: true, message: '请输入字典Label', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '请输入字典VALUE', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入字典排序', trigger: 'blur' }
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
            message: '保存成功!'
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
      <el-form-item label="字典Label" prop="dictLabel">
        <el-input v-model="form.dictLabel" placeholder="请输入字典Label" maxlength="32" />
      </el-form-item>
      <el-form-item label="字典Value" prop="dictValue">
        <el-input v-model="form.dictValue" placeholder="请输入字典VALUE" maxlength="30" />
      </el-form-item>
      <el-form-item label="字典排序" prop="sortNum">
        <el-input-number v-model="form.sortNum" :min="0" :max="999" />
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
