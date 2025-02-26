<script>
import PasswordStrengthProgress from '@/views/system/personal-center/PasswordStrengthProgress.vue'
import i18n from '@/plugins/i18n'
import { resetPwd } from '@/api/system/user'

export default {
  name: 'ResetPasswordDialog',
  components: { PasswordStrengthProgress },
  data() {
    return {
      show: false,
      loading: false,
      form: {
        userId: null,
        password: null
      },
      rules: {
        password: [
          { required: true, message: i18n.t('personal-center.tab2.newPassword.required'), trigger: 'blur' },
          { min: 6, max: 30, message: i18n.t('personal-center.tab2.password.placeholder'), trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    open(userId) {
      Object.assign(this.$data, this.$options.data())
      this.show = true
      this.form.userId = userId
    },
    onSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          resetPwd(this.form.userId, this.form.password).then(() => {
            this.$alert(this.$t('user.confirm.resetPwd.successMessage', { newPassword: this.form.password }), this.$t('general.confirm.title'), {
              confirmButtonText: this.$t('general.confirm.confirm'),
              callback: () => {
                this.show = false
                this.$emit('complete')
              }
            });
            this.loading = false
            this.show = false
          })
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :title="$t('user.column.operation.resetPwd')"
    :visible.sync="show"
    width="500px"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="$t('personal-center.tab2.newPassword')" prop="password">
        <el-input v-model="form.password" :placeholder="$t('personal-center.tab2.password.placeholder')" maxlength="30" show-password />
      </el-form-item>
      <el-form-item :label="$t('personal-center.tab2.newPasswordStrength')">
        <password-strength-progress :password="form.password" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="loading" type="primary" @click="onSave">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
