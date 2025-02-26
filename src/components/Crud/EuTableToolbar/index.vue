<script>
import EuSortDialog from '@/components/Crud/EuSortDialog/index.vue'
import VxeTableColumnSettingDialog from '@/components/VxeTableColumnSettingDialog/index.vue'
import EuVxeSortDialog from '@/components/Crud/EuSortDialog/EuVxeSortDialog.vue'

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
  components: { EuVxeSortDialog, VxeTableColumnSettingDialog, EuSortDialog },
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
    },
    onOpenTableColumnSettingDialog() {
      const isVxe = this.isVxeTable()
      if (isVxe) {
        this.$refs.vxeTableColumnSettingDialog.open(this.refTable)
      } else {
        this.$refs.tableColumnSettingDialog.open(this.refTable)
      }
    },
    isVxeTable() {
      return this.refTable.$options.name === 'VxeTable'
    },
    onOpenSortDialog() {
      const isVxe = this.isVxeTable()
      if (isVxe) {
        this.$refs.vxeSortDialog.open(this.refTable)
      } else {
        this.$refs.sortDialog.open(this.refTable)
      }
    }
  }
}
</script>

<template>
  <el-row :gutter="16" class="eu-table-toolbar">
    <el-col :span="18" :xs="24" class="eu-table-toolbar__left">
      <slot name="left"></slot>
      <el-button v-if="fullOptShow.add" v-permissions="fullPermission.add" type="primary"
        icon="el-icon-plus" plain @click="$emit('add')">
        {{ $t('crud.EuTableToolbar.add') }}
      </el-button>
      <el-button v-if="fullOptShow.del" v-permissions="fullPermission.del"
        :disabled="multipleDisabled" type="danger" icon="el-icon-delete" plain
        @click="$emit('batchDel')">
        {{ $t('crud.EuTableToolbar.del') }}
      </el-button>
      <el-button v-if="fullOptShow.export" v-permissions="fullPermission.export" type="warning"
        icon="el-icon-download" plain @click="$emit('export')">
        {{ $t('crud.EuTableToolbar.export') }}
      </el-button>
      <el-button v-if="fullOptShow.import" v-permissions="fullPermission.import"
        icon="el-icon-upload" @click="$emit('import')">
        {{ $t('crud.EuTableToolbar.import') }}
      </el-button>
      <slot name="right"></slot>
    </el-col>
    <el-col :span="6" :xs="24" class="eu-table-toolbar__right">
      <el-button-group>
        <slot name="toolLeft"></slot>
        <el-button v-if="fullOptShow.refresh" icon="el-icon-refresh"
          @click="$emit('refresh')"></el-button>
        <el-button v-if="fullOptShow.searchToggle" icon="el-icon-search"
          @click="$emit('update:searchToggle', !searchToggle)"></el-button>
        <el-button v-if="fullOptShow.sort" icon="el-icon-sort"
          @click="onOpenSortDialog"></el-button>
        <el-button v-if="fullOptShow.columnSetting" icon="el-icon-setting"
          @click="onOpenTableColumnSettingDialog"></el-button>
        <slot name="toolRight"></slot>
      </el-button-group>
    </el-col>

    <table-column-setting-dialog ref="tableColumnSettingDialog" />
    <vxe-table-column-setting-dialog ref="vxeTableColumnSettingDialog" />
    <eu-sort-dialog ref="sortDialog" v-model="innerSort" @complete="onSortComplete" />
    <eu-vxe-sort-dialog ref="vxeSortDialog" v-model="innerSort" @complete="onSortComplete" />
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
