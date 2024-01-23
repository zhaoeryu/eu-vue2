<script>
import { getDeptIdsByRoleId, update } from '@/api/system/role'
import { DataScopeEnums } from '@/utils/enums'
import { list as deptList } from '@/api/system/dept'
import { handleTreeData } from '@/utils'
import i18n from '@/plugins/i18n'

export default {
  name: 'DataScopeDialog',
  data() {
    return {
      show: false,

      formLoading: false,
      form: {
        dataScope: null
      },
      rules: {
        dataScope: [{ required: true, message: i18n.t('role.dataScopeDialog.form.dataScope.required'), trigger: 'change' }]
      },
      formExtra: {
        expand: false,
        checkedAll: false,
        checkStrictly: true,
        filterKeyword: null
      },

      dataScopeEnums: DataScopeEnums,
      deptList: [],
      deptTree: []
    }
  },
  computed: {
    title() {
      return this.$t('role.dataScopeDialog.title')
    }
  },
  watch: {
    // 根据名称筛选部门树
    'formExtra.filterKeyword'(val) {
      this.$refs.deptTree.filter(val);
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.show = true

      this.formLoading = true
      Promise.all([
        deptList(),
        getDeptIdsByRoleId(this.form.id)
      ]).then(res => {
        this.deptList = res[0].data
        this.deptTree = handleTreeData(this.deptList)

        this.$nextTick(() => {
          try {
            (res[1].data || []).forEach(key => {
              this.$refs.deptTree.setChecked(key, true, false)
            })
          } catch (err) {
            console.error(err)
          }
        })
        this.formLoading = false
      })
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }

        let checkedIds = []
        if (DataScopeEnums.CUSTOM.value === this.form.dataScope) {
          const checkedKeys = this.$refs.deptTree.getCheckedKeys()
          const halfCheckedKeys = this.$refs.deptTree.getHalfCheckedKeys()
          checkedIds = [...checkedKeys, ...halfCheckedKeys]
        }

        const reqPayload = {
          ...this.form,
          // 2: 表示本次操作为分配数据权限
          operAction: 2,
          deptIds: checkedIds
        }

        this.formLoading = true
        update(reqPayload).then(() => {
          this.$message.success(this.$t('role.dataScopeDialog.success'))
          this.show = false
          this.$emit('complete')
        }).finally(() => {
          this.formLoading = false
        })
      })
    },
    onDialogOpen() {
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.deptList;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.deptTree.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.deptTree.setCheckedNodes(value ? this.deptTree: []);
    },
    onFilterNode(value, node) {
      if (!value) {
        return true
      }
      return node.deptName.indexOf(value) !== -1;
    },
  }
}
</script>

<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :close-on-click-modal="false"
    width="700px"
    @open="onDialogOpen"
  >
    <template #title>
      <div>
        <span class="el-dialog__title">{{ title }}</span>
        <span> - [{{ form.roleName }}]</span>
      </div>
    </template>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="$t('role.dataScopeDialog.form.dataScope')" prop="dataScope">
        <el-radio-group v-model="form.dataScope">
          <el-radio-button
            v-for="item in dataScopeEnums"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.dataScope === dataScopeEnums.CUSTOM.value" :label="$t('role.dataScopeDialog.form.dataPermission')">
        <div style="display: flex;margin-bottom: 12px;">
          <div style="flex: 1;">
            <el-checkbox v-model="formExtra.expand" @change="handleCheckedTreeExpand($event)">{{ $t('role.dataScopeDialog.form.dataPermission.expand') }}</el-checkbox>
            <el-checkbox v-model="formExtra.checkedAll" @change="handleCheckedTreeNodeAll($event)">{{ $t('role.dataScopeDialog.form.dataPermission.checkedAll') }}</el-checkbox>
            <el-checkbox v-model="formExtra.checkStrictly">{{ $t('role.dataScopeDialog.form.dataPermission.checkStrictly') }}</el-checkbox>
          </div>
          <el-input :placeholder="$t('role.dataScopeDialog.form.dataPermission.filterKeyword')" v-model="formExtra.filterKeyword" style="width: 200px;" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-tree
          :data="deptTree"
          show-checkbox
          ref="deptTree"
          node-key="id"
          :empty-text="$t('role.dataScopeDialog.form.dataPermission.emptyText')"
          :check-strictly="!formExtra.checkStrictly"
          :filter-node-method="onFilterNode"
          default-expand-all
          :props="{ label: 'deptName', children: 'children' }"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
