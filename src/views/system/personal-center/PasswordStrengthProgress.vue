<script>
import { detection } from '@/utils/password-detection'

export default {
  name: 'PasswordStrengthProgress',
  props: {
    password: {
      type: String,
      required: false
    }
  },
  computed: {
    passwordStrength() {
      if (!this.password || this.password.length === 0) {
        return ''
      }
      return detection(this.password).code
    }
  },
}
</script>

<template>
  <ul class="password-strength-progress">
    <li :class="{ weak: passwordStrength === 'weak' }">弱</li>
    <li :class="{ normal: passwordStrength === 'normal' }">一般</li>
    <li :class="{ strong: passwordStrength === 'strong' }">强</li>
    <li :class="{ safe: passwordStrength === 'safe' }">安全</li>
  </ul>
</template>

<style scoped lang="scss">
.password-strength-progress {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
  gap: 1em;
  li {
    flex: 1;
    text-align: center;
    background-color: var(--color-border-1);
    border-radius: 6px;
    min-height: 2em;
    line-height: 2em;
  }
  .weak {
    color: var(--color-white);
    background-color: var(--color-danger);
  }
  .normal {
    color: var(--color-white);
    background-color: var(--color-warning);
  }
  .strong {
    color: var(--color-white);
    background-color: rgb(var(--arcoblue-6));
  }
  .safe {
    color: var(--color-white);
    background-color: var(--color-success);
  }

}
</style>
