<script>
import { add, update } from '@/api/system/sysNotice'
import { NoticeTypeEnums } from '@/utils/enums'

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
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '公告类型不能为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '公告描述不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '公告内容不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '公告状态不能为空', trigger: 'change' }
        ],
      },

      noticeTypeEnums: NoticeTypeEnums
    }
  },
  computed: {
    title() {
      return this.form.id ? '修改通知公告' : '新增通知公告'
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
    width="700px"
    @open="onDialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="公告描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入公告描述" clearable />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公告类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="item in noticeTypeEnums" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="公告内容" prop="content">
        <eu-editor v-model="form.content" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
