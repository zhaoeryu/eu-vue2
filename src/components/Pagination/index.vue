<template>
  <el-pagination
    v-bind="$attrs"
    :background="background"
    :layout="innerLayout"
    :current-page.sync="currentPage"
    :page-sizes="pageSizes"
    :page-size.sync="pageSize"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import { mapGetters } from 'vuex'
const PAGE_LAYOUT_BLACKLIST = ['jumper', 'pager']
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:page', 1)
        this.$emit('update:limit', val)
      }
    },
    ...mapGetters({
      isMobileDevice: 'settings/isMobileDevice',
    }),
    innerLayout() {
      if (this.isMobileDevice && this.layout) {
        return this.layout.split(/\s*,\s*/).filter(item => !PAGE_LAYOUT_BLACKLIST.includes(item)).join(',')
      }
      return this.layout
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
    }
  }
}
</script>
