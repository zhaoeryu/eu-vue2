<script>
import { getDeptIdsByRoleId, update } from '@/api/system/role'
import { DataScopeEnums } from '@/utils/enums'
import { list as deptList } from '@/api/system/dept'
import { handleTreeData } from '@/utils'

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
        dataScope: [{ required: true, message: '请选择数据范围', trigger: 'change' }]
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
      return '分配数据权限'
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
          this.$message.success('分配成功')
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
      <el-form-item label="权限范围" prop="dataScope">
        <el-radio-group v-model="form.dataScope">
          <el-radio-button
            v-for="item in dataScopeEnums"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.dataScope === dataScopeEnums.CUSTOM.value" label="数据权限">
        <div style="display: flex;margin-bottom: 12px;">
          <div style="flex: 1;">
            <el-checkbox v-model="formExtra.expand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
            <el-checkbox v-model="formExtra.checkedAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
            <el-checkbox v-model="formExtra.checkStrictly">父子联动</el-checkbox>
          </div>
          <el-input placeholder="输入关键字进行搜索" v-model="formExtra.filterKeyword" style="width: 200px;" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-tree
          :data="deptTree"
          show-checkbox
          ref="deptTree"
          node-key="id"
          empty-text="暂无数据"
          :check-strictly="!formExtra.checkStrictly"
          :filter-node-method="onFilterNode"
          default-expand-all
          :props="{ label: 'deptName', children: 'children' }"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
