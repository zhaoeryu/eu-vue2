<script>
export default {
  name: 'EuAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      validator(val) {
        if (typeof val === 'string') {
          return ['large', 'medium', 'small'].includes(val);
        }
        return typeof val === 'number';
      },
      default: 30
    },
    fontSize: {
      type: Number,
      default: 16
    },
    shape: {
      type: String,
      default: 'square'
    }
  },
  computed: {
    showName() {
      // 显示最后一个字符
      return this.nickname && this.nickname.slice(-1)
    },
    avatarTextStyle() {
      return {
        fontSize: `${this.fontSize}px`
      }
    }
  },
}
</script>

<template>
  <el-avatar :shape="shape" :size="size" :src="src" style="vertical-align: middle;" @error="() => true">
    <div :style="avatarTextStyle">{{ showName }}</div>
  </el-avatar>
</template>
