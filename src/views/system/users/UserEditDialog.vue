<script>
import { page as postList } from '@/api/system/post'
import { page as roleList } from '@/api/system/role'
import { add, update } from '@/api/system/user'
import i18n from '@/plugins/i18n'

export default {
  name: 'UserEditDialog',
  data() {
    return {
      show: false,
      formLoading: false,
      form: {
        nickname: null,
        dept: null,
        username: null,
        mobile: null,
        email: null,
        sex: null,
        status: null,
        deptId: null,
        postIds: null,
        roleIds: null,
        remark: null,
        _deptIds: null,
      },
      rules: {
        nickname: [
          { required: true, message: i18n.t('user.edit.form.nickname.required'), trigger: 'blur' }
        ],
        username: [
          { required: true, message: i18n.t('user.edit.form.username.required'), trigger: 'blur' }
        ],
        // mobile: [
        //   { required: true, message: i18n.t('user.edit.form.mobile.required'), trigger: 'blur' },
        //   { pattern: /^1[3456789]\d{9}$/, message: i18n.t('user.edit.form.mobile.pattern'), trigger: 'blur' }
        // ],
        sex: [
          { required: true, message: i18n.t('user.edit.form.sex.required'), trigger: 'blur' }
        ],
      },

      postList: [],
      roleList: [],
      deptTree: [],
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('user.edit.title') : this.$t('user.add.title')
    }
  },
  methods: {
    open(row, deptTree) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.deptTree = deptTree
      this.show = true

      this.loadPostList()
      this.loadRoleList()
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }

        if (this.form._deptIds && this.form._deptIds.length) {
          this.form.deptId = this.form._deptIds[this.form._deptIds.length - 1]
        } else {
          this.form.deptId = null
        }

        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(res => {
          this.$message.success(this.form.id ? this.$t('user.edit.success') : this.$t('user.add.success', {
            password: res.data
          }))
          this.show = false
          this.$emit('complete')
        }).finally(() => {
          this.formLoading = false
        })
      })
    },
    loadPostList() {
      postList({ page: 1, size: 999 }).then(res => {
        this.postList = res.data.records
      })
    },
    loadRoleList() {
      roleList({ page: 1, size: 999 }).then(res => {
        this.roleList = res.data.records
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
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.nickname')" prop="nickname">
            <el-input v-model="form.nickname" :placeholder="$t('user.edit.form.nickname.placeholder')" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.username')" prop="username">
            <el-input v-model="form.username" :placeholder="$t('user.edit.form.username.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.mobile')" prop="mobile">
            <el-input v-model="form.mobile" :placeholder="$t('user.edit.form.mobile.placeholder')" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.sex')" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="1">{{ $t('user.edit.form.sex.man') }}</el-radio>
              <el-radio :label="0">{{ $t('user.edit.form.sex.woman') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.email')" prop="email">
            <el-input v-model="form.email" :placeholder="$t('user.edit.form.email.placeholder')" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.deptId')" prop="deptId">
            <el-cascader
              v-model="form._deptIds"
              :options="deptTree"
              :props="{ checkStrictly: true, value: 'id', label: 'deptName', children: 'children' }"
              :placeholder="$t('user.edit.form.deptId.placeholder')"
              clearable
              filterable
              style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.postIds')" prop="postIds">
            <el-select v-model="form.postIds" multiple :placeholder="$t('user.edit.form.postIds.placeholder')" clearable filterable style="width: 100%;">
              <el-option v-for="item in postList" :key="item.id" :label="item.postName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('user.edit.form.roleIds')" prop="roleIds">
            <el-select v-model="form.roleIds" multiple :placeholder="$t('user.edit.form.roleIds.placeholder')" clearable filterable style="width: 100%;">
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('user.edit.form.remark')" prop="remark">
            <el-input v-model="form.remark" type="textarea" :placeholder="$t('user.edit.form.remark.placeholder')"></el-input>
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
.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
