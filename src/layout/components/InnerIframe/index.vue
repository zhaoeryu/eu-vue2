<template>
  <div
    style="height: 100%;"
    v-loading="loading"
    :element-loading-text="$t('layout.InnerIframe.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <iframe
      :id="iframeId"
      style="width: 100%; height: 100%"
      :src="src"
    ></iframe>
  </div>
</template>

<script>
import md5 from 'md5';
export default {
  name: 'InnerIframe',
  data() {
    return {
      loading: false
    };
  },
  computed: {
    iframeId() {
      return 'iframe_' + md5(this.src);
    },
    src() {
      return this.$route.meta.embedUrl
    }
  },
  mounted() {
    const _this = this
    const iframe = document.querySelector('#' + this.iframeId);
    // iframe页面loading控制
    if (iframe.attachEvent) {
      this.loading = true;
      iframe.attachEvent('onload', function () {
        _this.loading = false;
      });
    } else {
      this.loading = true;
      iframe.onload = function () {
        _this.loading = false;
      };
    }
  }
};
</script>
