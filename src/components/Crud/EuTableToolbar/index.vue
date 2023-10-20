<script>
import EuSortDialog from '@/components/Crud/EuSortDialog/index.vue'

const DEFAULT_OPT_SHOW = {
  add: true,
  del: true,
  export: true,
  import: true,

  refresh: true,
  searchToggle: true,
  columnSetting: true,
  sort: true
}
const DEFAULT_PERMISSION = {
  add: [],
  del: [],
  export: [],
  import: []
}
export default {
  name: 'EuTableToolbar',
  components: { EuSortDialog },
  props: {
    multipleDisabled: {
      type: Boolean,
      default: true
    },
    permission: {
      type: Object,
      default: () => {
        return { }
      }
    },
    optShow: {
      type: Object,
      default: () => {
        return { }
      }
    },
    refTable: Object,
    sort: {
      type: Array || String,
      default: () => []
    },
    searchToggle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      innerSort: []
    }
  },
  computed: {
    fullOptShow() {
      return Object.assign({}, DEFAULT_OPT_SHOW, this.optShow)
    },
    fullPermission() {
      return Object.assign({}, DEFAULT_PERMISSION, this.permission)
    }
  },
  mounted() {
    this.innerSort = this.sort || []
  },
  methods: {
    onSortComplete() {
      this.$emit('update:sort', this.innerSort);
      this.$emit('sort')
    }
  }
}
</script>

<template>
  <el-row :gutter="16" class="eu-table-toolbar">
    <el-col :span="18" :xs="24" class="eu-table-toolbar__left">
      <slot name="left"></slot>
      <el-button v-if="fullOptShow.add" v-permissions="fullPermission.add" type="primary" icon="el-icon-plus" plain @click="$emit('add')">添加</el-button>
      <el-button v-if="fullOptShow.del" v-permissions="fullPermission.del" :disabled="multipleDisabled" type="danger" icon="el-icon-delete" plain @click="$emit('batchDel')">删除</el-button>
      <el-button v-if="fullOptShow.export" v-permissions="fullPermission.export" type="warning" icon="el-icon-download" plain @click="$emit('export')">导出</el-button>
      <el-button v-if="fullOptShow.import" v-permissions="fullPermission.import" icon="el-icon-upload" @click="$emit('import')">导入</el-button>
      <slot name="right"></slot>
    </el-col>
    <el-col :span="6" :xs="24" class="eu-table-toolbar__right">
      <el-button-group>
        <slot name="toolLeft"></slot>
        <el-button v-if="fullOptShow.refresh" icon="el-icon-refresh" @click="$emit('refresh')"></el-button>
        <el-button v-if="fullOptShow.searchToggle" icon="el-icon-search" @click="$emit('update:searchToggle', !searchToggle)"></el-button>
        <el-button v-if="fullOptShow.sort" icon="el-icon-sort" @click="$refs.sortDialog.open(refTable)"></el-button>
        <el-button v-if="fullOptShow.columnSetting" icon="el-icon-setting" @click="$refs.tableColumnSettingDialog.open(refTable)"></el-button>
        <slot name="toolRight"></slot>
      </el-button-group>
    </el-col>

    <table-column-setting-dialog ref="tableColumnSettingDialog" />
    <eu-sort-dialog ref="sortDialog" v-model="innerSort" @complete="onSortComplete" />
  </el-row>
</template>

<style lang="scss" scoped>
@import "~@/assets/styles/screen";
.eu-table-toolbar {
  margin-bottom: 12px;
  // 解决左侧工具栏为空时，右侧工具栏会偏移的问题
  .eu-table-toolbar__left:empty {
    height: 1px;
  }
  .eu-table-toolbar__right {
    text-align: right;
  }
}
@media only screen and (max-width: $screen-md) {
  .eu-table-toolbar {
    margin-bottom: 12px;
    .eu-table-toolbar__right {
      text-align: left;
      margin-top: 12px;
    }
  }
}
</style>
