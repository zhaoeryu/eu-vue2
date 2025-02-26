<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="8" :xs="24">
        <div>
          <div style="display: flex;align-items: center;">
            <div>
              <user-avatar />
            </div>
            <div style="margin-left: 16px;">
              <div>
                <span style="font-size: 23px;color: var(--theme-text-primary-color);font-weight: 500;display: inline-block;margin-right: 0.3em;">{{ user.nickname || '-' }}</span>
                <svg-icon v-if="user.sex === 1" icon-class="sex_man" />
                <svg-icon v-else-if="user.sex === 0" icon-class="sex_woman" />
              </div>
              <div style="margin-top: 15px;color: var(--theme-text-second-color);font-size: 14px;">{{ user.mobile || $t('personal-center.noPhone') }}</div>
              <div style="margin-top: 10px;color: var(--theme-text-second-color);font-size: 14px;">{{ deptNames }}</div>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="person-info">
            <div>
              <div>{{ $t('personal-center.prevLoginRegion') }}</div>
              <div>{{ user.prevLoginRegion || '-' }}</div>
            </div>
            <div>
              <div>{{ $t('personal-center.prevLoginTime') }}</div>
              <div>{{ user.prevLoginTime || '-' }}</div>
            </div>
            <el-divider></el-divider>
            <div>
              <div>{{ $t('personal-center.username') }}</div>
              <div>{{ user.username || '-' }}</div>
            </div>
            <div>
              <div>{{ $t('personal-center.email') }}</div>
              <div>{{ user.email || '-' }}</div>
            </div>
            <div>
              <div>{{ $t('personal-center.createTime') }}</div>
              <div>{{ user.createTime || '-' }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" :xs="24">
        <div>
          <el-tabs v-model="tabActive">
            <el-tab-pane :label="$t('personal-center.tab1.title')" name="userinfo">
              <el-form ref="formBasic" :model="userForm" :rules="userRules" label-width="140px" :hide-required-asterisk="true">
                <el-form-item :label="$t('personal-center.tab1.nickname')" prop="nickname">
                  <el-input v-model="userForm.nickname" :placeholder="$t('personal-center.tab1.nickname.placeholder')" maxlength="10" />
                </el-form-item>
                <el-form-item :label="$t('personal-center.tab1.mobile')" prop="mobile">
                  <el-input v-model="userForm.mobile" :placeholder="$t('personal-center.tab1.mobile.placeholder')" maxlength="11" />
                </el-form-item>
                <el-form-item :label="$t('personal-center.tab1.email')" prop="email">
                  <el-input v-model="userForm.email" :placeholder="$t('personal-center.tab1.email.placeholder')" maxlength="50" />
                </el-form-item>
                <el-form-item :label="$t('personal-center.tab1.sex')" prop="sex">
                  <el-radio-group v-model="userForm.sex">
                    <el-radio :label="1">{{ $t('personal-center.tab1.sex.man') }}</el-radio>
                    <el-radio :label="0">{{ $t('personal-center.tab1.sex.woman') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div style="text-align: right;">
                <el-button :loading="userFormLoading" type="primary" style="width: 150px;" @click="onSave">{{ $t('general.form.submit') }}</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('personal-center.tab2.title')" name="updatePassword">
              <el-form ref="formPassword" :model="updatePasswordForm" :rules="updatePasswordRules" label-width="140px" :hide-required-asterisk="true">
                <el-form-item :label="$t('personal-center.tab2.oldPassword')" prop="oldPassword">
                  <el-input v-model="updatePasswordForm.oldPassword" :placeholder="$t('personal-center.tab2.password.placeholder')" maxlength="30" show-password />
                </el-form-item>
                <el-form-item :label="$t('personal-center.tab2.newPassword')" prop="newPassword">
                  <el-input v-model="updatePasswordForm.newPassword" :placeholder="$t('personal-center.tab2.password.placeholder')" maxlength="30" show-password />
                </el-form-item>
                <el-form-item :label="$t('personal-center.tab2.newPasswordStrength')">
                  <password-strength-progress :password="updatePasswordForm.newPassword" />
                </el-form-item>
                <el-form-item :label="$t('personal-center.tab2.confirmPassword')" prop="confirmPassword">
                  <el-input v-model="updatePasswordForm.confirmPassword" :placeholder="$t('personal-center.tab2.password.placeholder')" maxlength="30" show-password />
                </el-form-item>
              </el-form>
              <div style="text-align: right;">
                <el-button :loading="updatePasswordFormLoading" type="primary" style="width: 150px;" @click="onPasswordSave">{{ $t('general.form.submit') }}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserAvatar from '@/views/system/personal-center/UserAvatar.vue'
import { updateProfile, updatePassword } from '@/api/system/user'
import { mapGetters } from 'vuex'
import i18n from '@/plugins/i18n'
import PasswordStrengthProgress from '@/views/system/personal-center/PasswordStrengthProgress.vue'

export default {
  name: 'PersonalCenter',
  components: { PasswordStrengthProgress, UserAvatar },
  data() {
    return {
      tabActive: 'userinfo',

      userFormLoading: false,
      userForm: {
        nickname: null,
        mobile: null,
        email: null,
        sex: null
      },
      userRules: {
        nickname: [
          { required: true, message: i18n.t('personal-center.tab1.nickname.required'), trigger: 'blur' },
          { min: 2, max: 10, message: i18n.t('personal-center.tab1.nickname.pattern'), trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: i18n.t('personal-center.tab1.mobile.required'), trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: i18n.t('personal-center.tab1.mobile.pattern'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: i18n.t('personal-center.tab1.email.required'), trigger: 'blur' },
          { type: 'email', message: i18n.t('personal-center.tab1.email.pattern'), trigger: ['blur', 'change'] }
        ],
        sex: [
          { required: true, message: i18n.t('personal-center.tab1.sex.required'), trigger: 'blur' }
        ]
      },
      updatePasswordFormLoading: false,
      updatePasswordForm: {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      },
      updatePasswordRules: {
        oldPassword: [
          { required: true, message: i18n.t('personal-center.tab2.oldPassword.required'), trigger: 'blur' },
          { min: 6, max: 30, message: i18n.t('personal-center.tab2.password.pattern'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: i18n.t('personal-center.tab2.newPassword.required'), trigger: 'blur' },
          { min: 6, max: 30, message: i18n.t('personal-center.tab2.password.pattern'), trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: i18n.t('personal-center.tab2.newPassword.required'), trigger: 'blur' },
          { min: 6, max: 30, message: i18n.t('personal-center.tab2.password.pattern'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    deptNames() {
      return (this.user.deptNames || []).join(' / ') || this.$t('personal-center.noDept')
    }
  },
  mounted() {
    Object.assign(this.userForm, this.user, {
      id: this.user.userId
    })
  },
  methods: {
    onSave() {
      this.$refs.formBasic.validate((valid) => {
        if (!valid) {
          return
        }
        this.userFormLoading = true
        updateProfile(this.userForm).then(() => {
          this.$message.success(this.$t('general.confirm.save.success'))
          this.$store.dispatch('user/GetInfo')
        }).finally(() => {
          this.userFormLoading = false
        })
      })
    },
    onPasswordSave() {
      this.$refs.formPassword.validate((valid) => {
        if (!valid) {
          return
        }

        // 验证旧密码和新密码是否一致
        if (this.updatePasswordForm.oldPassword === this.updatePasswordForm.newPassword) {
          this.$message.error(this.$t('personal-center.tab2.password.same'))
          return
        }

        // 验证新密码和确认密码是否一致
        if (this.updatePasswordForm.newPassword !== this.updatePasswordForm.confirmPassword) {
          this.$message.error(this.$t('personal-center.tab2.password.different'))
          return
        }

        this.$confirm(this.$t('personal-center.tab2.confirm'), this.$t('general.confirm.title'), {
          confirmButtonText: this.$t('general.confirm.confirm'),
          cancelButtonText: this.$t('general.confirm.cancel'),
          type: 'warning'
        }).then(() => {
          this.updatePasswordFormLoading = true
          updatePassword(this.updatePasswordForm.oldPassword, this.updatePasswordForm.newPassword).then(() => {
            this.$message.success(this.$t('personal-center.tab2.success'))
          }).finally(() => {
            this.updatePasswordFormLoading = false
          })
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-col {
  >div {
    background-color: var(--theme-base-second-bg);
    padding: 16px;
  }
}
.person-info {
  font-size: 14px;
  color: var(--theme-text-primary-color);
  &>div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 2em;
    >div:nth-child(2) {
      color: var(--theme-text-second-color);
    }
  }
}
</style>
