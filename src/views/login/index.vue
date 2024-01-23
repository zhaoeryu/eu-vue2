<template>
  <div class="page-login">
    <!-- 上升的泡泡 -->
    <bubbles />
    <div class="login-body">
      <div class="left-container">
        <p class="left-container__title">{{ $t('login.banner.title') }}</p>
        <p class="left-container__desc">{{ $t('login.banner.desc') }}</p>
        <img :src="require('@/assets/images/login_banner.png')" width="250" alt="" style="margin-top: 20px;">
      </div>
      <!-- 登录表单 -->
      <el-form :model="form" :rules="rules" ref="form">
        <h3>{{ $t('login.form.title') }}&nbsp;{{ defaultSetting.title }}</h3>
        <el-form-item prop="username">
          <el-input v-model="form.username" :placeholder="$t('login.form.username.placeholder')" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" :placeholder="$t('login.form.password.placeholder')" maxlength="30" show-password></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="verifyCode" class="verify-code-form-item">
          <el-input v-model="form.verifyCode" :placeholder="$t('login.form.captcha.placeholder')" maxlength="4" style="margin-right: 16px;" ></el-input>
          <div class="verify-code" @click="getCaptcha">
            <img v-if="captchaImg" :src="captchaImg" >
            <span v-else>{{ $t('login.form.captcha.refresh') }}</span>
          </div>
        </el-form-item>
        <!-- 记住我 -->
        <el-form-item prop="rememberMe">
          <el-checkbox v-model="form.rememberMe">{{ $t('login.form.remember.label') }}</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button :loading="loginLoading" @click="onSubmit" style="width: 100%;background-color: #155bd4;border-color: #155bd4;" type="primary">
            {{ $t('login.form.submit') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { captcha } from '@/api/system/login'
import { encrypt } from '@/utils/rsaEncrypt'
import {
  STORAGE_KEY_PASSWORD,
  STORAGE_KEY_REMEMBER_ME,
  STORAGE_KEY_USERNAME
} from '@/utils/constants'
import Bubbles from '@/views/login/Bubbles.vue'

export default {
  name: 'Login',
  components: { Bubbles },
  data() {
    return {
      captchaImg: null,
      form: {
        username: null,
        password: null,
        uuid: null,
        verifyCode: null,
        rememberMe: false
      },
      rules: {
        username: [
          { required: true, message: this.$t('login.form.username.rule'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('login.form.password.rule'), trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: this.$t('login.form.captcha.rule'), trigger: 'blur' }
        ]
      },
      loginLoading: false,
      redirect: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // 记录来源页面，用于登录成功后回到来源页面
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    // 加载验证码
    this.getCaptcha()
    // 从缓存中读取用户名和密码进行填充
    this.form.username = Cookies.get(STORAGE_KEY_USERNAME) || null
    this.form.password = Cookies.get(STORAGE_KEY_PASSWORD) || null
    this.form.rememberMe = Cookies.get(STORAGE_KEY_REMEMBER_ME) && Boolean(Cookies.get(STORAGE_KEY_REMEMBER_ME)) || true
  },
  methods: {
    getCaptcha() {
      captcha().then(res => {
        this.form.uuid = res.uuid
        this.captchaImg = res.img
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loginLoading = true
        const reqPayload = { ...this.form }
        const rememberMe = reqPayload.rememberMe
        delete reqPayload.rememberMe
        // 密码超过了30位，说明是加密过的，不需要再加密
        reqPayload.password = reqPayload.password.length > 30 ? reqPayload.password : encrypt(reqPayload.password)
        this.$store.dispatch('user/Login', reqPayload).then(() => {
          // 如果勾选了记住我，则将用户名和密码存入cookie，否则清除cookie
          if (this.form.rememberMe) {
            Cookies.set(STORAGE_KEY_USERNAME, reqPayload.username, { expires: this.defaultSetting.rememberMeDefaultDays })
            Cookies.set(STORAGE_KEY_PASSWORD, reqPayload.password, { expires: this.defaultSetting.rememberMeDefaultDays })
            Cookies.set(STORAGE_KEY_REMEMBER_ME, rememberMe, { expires: this.defaultSetting.rememberMeDefaultDays })
          } else {
            Cookies.remove(STORAGE_KEY_USERNAME)
            Cookies.remove(STORAGE_KEY_PASSWORD)
            Cookies.remove(STORAGE_KEY_REMEMBER_ME)
          }
          // 登录成功后回到到来源页面，如果没有来源页面就跳转到首页
          this.$router.push({ path: this.redirect || '/' })
        }).catch(() => {
          // 登录失败刷新验证码
          this.getCaptcha()
        }).finally(() => {
          this.loginLoading = false
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/styles/screen";
// 登录表单
.el-form {
  background-color: var(--theme-base-second-bg);
  border-radius: 4px;
  padding: 25px;
  width: 360px;
  z-index: 2;
  h3 {
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
    color: var(--color-text-1);
  }
  .el-form-item {
    margin-bottom: 20px;
    &.verify-code-form-item {
      ::v-deep {
        .el-form-item__content {
          display: flex;
        }
      }
      .verify-code {
        cursor: pointer;
        width: 150px;
        background-color: #868e96;
        line-height: 32px;
        height: 32px;
        box-sizing: border-box;
        text-align: center;
        //overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        span {
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
}

// 页面背景
.page-login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  background: linear-gradient(-45deg, #4190F7, #7B3AEB);
  background-size: 600% 600%;
  animation: gradientBG 10s ease infinite;
}
body[eu-theme='dark'] .page-login {
  background: linear-gradient(-45deg, #1d2129, #00308f);
  background-size: 600% 600%;
  animation: gradientBG 10s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

// 桌面端
@media (min-width: $screen-md) {
  .login-body {
    background-color: var(--theme-base-second-bg);
    border-radius: 4px;
    position: relative;
    z-index: 1;
    padding: 24px 0;
    .left-container {
      width: 330px;
      display: inline-block;
      text-align: center;
      height: 100%;
      .left-container__title {
        font-size: 20px;
        font-weight: 500;
        line-height: 2em;
        color: var(--color-text-1);
      }
      .left-container__desc {
        font-size: 14px;
        line-height: 2em;
        color: var(--color-text-3);
      }
    }
    .el-form {
      display: inline-block;
    }
    &:before {
      content: '';
      position: absolute;
      left: 330px;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 100%;
      background: var(--color-border-1);
    }
  }
}

// 移动端
@media (max-width: $screen-md) {
  .left-container {
    display: none;
  }
}
</style>
