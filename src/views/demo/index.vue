<template>
  <div>
    <import-dialog
      ref="importDialog"
      upload-url="/api/system/user/import"
      tpl-export-url="/api/system/user/export-template"
    />
    <eu-sort-dialog ref="sortDialog" />
  </div>
</template>

<script>
import ImportDialog from '@/components/ImportDialog/index.vue'
import EuSortDialog from '@/components/Crud/EuSortDialog/index.vue'

export default {
  name: 'Demo',
  components: { EuSortDialog, ImportDialog },
  mounted() {
    this.$refs.sortDialog.open()
  }
}
</script>

<style lang='scss' scoped>

</style>
