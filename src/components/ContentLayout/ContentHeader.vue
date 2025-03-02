<script>
export default {
  name: 'ContentHeader',
  props: {
    title: String
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<template>
  <el-page-header @back="goBack" :content="title"></el-page-header>
</template>

<style scoped lang="scss">

</style>
