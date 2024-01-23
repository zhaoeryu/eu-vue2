<template>
  <div class="not-found-page">
    <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 200px;">
      <img :src="require('@/assets/images/unauthorized.png')" alt="" width="200">
      <div class="not-found">
        <div class="not-found__404">{{ $t('401.title') }}</div>
        <div class="not-found__desc">
          <p>{{ $t('401.desc1') }}</p>
          <p>{{ $t('401.desc2') }}</p>
        </div>
        <el-button type="primary" @click="$router.back()">{{ $t('401.back') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Unauthorized'
}
</script>

<style lang='scss' scoped>
body[eu-theme='dark'] {
  img {
    filter: invert(0.5);
  }
}
.not-found-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.not-found {
  //margin-bottom: 200px;
  margin-left: 100px;
}
.not-found__404 {
  font-size: 20px;
}
.not-found__desc {
  margin: 30px 0;
  color: #606266;
  font-size: 14px;
  p {
    line-height: 2.5em;
  }
}
.el-button {
  letter-spacing: 0.1em;
}
</style>
