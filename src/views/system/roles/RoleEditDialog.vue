<script>
import { add, getMenuIdsByRoleId, update } from '@/api/system/role'
import { list as menuList } from '@/api/system/menu'
import { handleTreeData } from '@/utils'
import i18n from '@/plugins/i18n'

export default {
  name: 'RoleEditDialog',
  data() {
    return {
      show: false,

      formLoading: false,
      formStepActive: 0,
      form: {
        roleName: null,
        description: null,
        roleKey: null,
        status: null,
        dataScope: 1,
      },
      rules: {
        roleName: [{ required: true, message: i18n.t('role.edit.form.roleName.required'), trigger: 'blur' }],
        roleKey: [{ required: true, message: i18n.t('role.edit.form.roleKey.required'), trigger: 'blur' }],
        status: [{ required: true, message: i18n.t('role.edit.form.status.required'), trigger: 'blur' }]
      },
      formExtra: {
        expand: false,
        checkedAll: false,
        checkStrictly: true,
        menuFilterKeyword: null
      },

      menuTree: [],
      menuOriginList: [],
      menuTreeLoading: false,
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('role.edit.title') : this.$t('role.add.title')
    }
  },
  watch: {
    // 根据名称筛选部门树
    'formExtra.menuFilterKeyword'(val) {
      this.$refs.menu.filter(val);
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.show = true

      menuList().then(res => {
        this.menuOriginList = res.data
        this.menuTree = handleTreeData(this.menuOriginList)
      })
    },
    onNext() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }
        this.formStepActive++

        if (this.form.id) {
          this.formLoading = true
          getMenuIdsByRoleId(this.form.id).then(res => {
            try {
              (res.data || []).forEach(key => {
                this.$refs.menu.setChecked(key, true, false)
              })
            } catch (err) {
              console.error(err)
            }
            this.formLoading = false
          })
        }
      })
    },
    onSubmit() {
      // 当前选中的菜单
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 当前选中的半选菜单
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      const checkedIds = [...checkedKeys, ...halfCheckedKeys]
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }
        this.formLoading = true

        const reqPayload = {
          ...this.form,
          // 1: 表示本次操作为分配菜单
          operAction: 1,
          menuIds: checkedIds
        }

        const reqPromise = this.form.id ? update(reqPayload) : add(reqPayload)
        reqPromise.then(() => {
          this.$message.success(this.form.id ? this.$t('role.edit.success') : this.$t('role.add.success'))
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
      let treeList = this.menuTree;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuTree: []);
    },
    onFilterNode(value, node) {
      if (!value) {
        return true
      }
      return node.menuName.indexOf(value) !== -1;
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
    class="role-dialog"
    destroy-on-close
    @open="onDialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-steps :active="formStepActive" :align-center="true" finish-status="success">
        <el-step :title="$t('role.edit.step.roleInfo')"></el-step>
        <el-step :title="$t('role.edit.step.funcPermission')"></el-step>
      </el-steps>
      <template v-if="formStepActive === 0">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('role.edit.form.roleName')" prop="roleName">
              <el-input v-model="form.roleName" :placeholder="$t('role.edit.form.roleName.placeholder')" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('role.edit.form.description')" prop="description">
              <el-input v-model="form.description" :placeholder="$t('role.edit.form.description.placeholder')" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('role.edit.form.roleKey')" prop="roleKey">
              <el-input v-model="form.roleKey" :placeholder="$t('role.edit.form.roleKey.placeholder')" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('role.edit.form.status')" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">{{ $t('role.edit.form.status.normal') }}</el-radio>
                <el-radio :label="1">{{ $t('role.edit.form.status.disable') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="formStepActive === 1">
        <el-form-item :label="$t('role.edit.form.menuPermission')">
          <div style="display: flex;margin-bottom: 12px;">
            <div style="flex: 1;">
              <el-checkbox v-model="formExtra.expand" @change="handleCheckedTreeExpand($event)">{{ $t('role.edit.form.menuPermission.expand') }}</el-checkbox>
              <el-checkbox v-model="formExtra.checkedAll" @change="handleCheckedTreeNodeAll($event)">{{ $t('role.edit.form.menuPermission.checkedAll') }}</el-checkbox>
              <el-checkbox v-model="formExtra.checkStrictly">{{ $t('role.edit.form.menuPermission.checkStrictly') }}</el-checkbox>
            </div>
            <div>
              <el-input
                :placeholder="$t('role.edit.form.menuPermission.filterKeyword')"
                v-model="formExtra.menuFilterKeyword"
                prefix-icon="el-icon-search"
                style="width: 200px;"
                clearable
              />
            </div>
          </div>
          <el-tree
            :data="menuTree"
            show-checkbox
            ref="menu"
            node-key="id"
            :empty-text="$t('role.edit.form.menuPermission.emptyText')"
            :check-strictly="!formExtra.checkStrictly"
            :filter-node-method="onFilterNode"
            :props="{ label: 'menuName', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button v-if="formStepActive > 0" @click="formStepActive--">{{ $t('role.edit.button.prev') }}</el-button>
      <div style="flex: 1;">
        <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
        <el-button v-if="formStepActive < 1" class="eu-submit-btn" type="primary" @click="onNext">{{ $t('role.edit.button.next') }}</el-button>
        <el-button v-else :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
::v-deep {
  .el-dialog__footer {
    border-top: 1px solid #e0e0e0;
    display: flex;
  }
  .el-dialog__body {
    max-height: 500px;
    overflow-y: auto;
  }

  // 步骤条样式
  .el-steps {
    margin-bottom: 24px;
  }
  .el-step__icon {
    width: 20px;
    height: 20px;
    &.is-text {
      color: #fff;
      background-color: #2b6bff;
      border-radius: 50%;
      border: 1px solid #2b6bff;
    }
  }
  .el-step__title {
    font-size: 13px;
    &.is-success {
      color: #333;
    }
  }
  .el-step__line {
    background-color: unset;
  }
  .is-success {
    .el-step__line:before {
      background: #2b6bff;
    }
  }
  .is-process {
    font-weight: unset;
    color: var(--color-primary);
    .el-step__line:before {
      background: -webkit-linear-gradient(left,var(--color-primary),#ebeff7);
      color: transparent;
    }
  }
  .is-wait {
    color: #999;
    .el-step__icon {
      background-color: transparent;
      &.is-text {
        color: #999;
        border-color: #d9d9d9;
      }
    }
  }
  .el-step__line:before {
    content: "";
    width: 150px;
    height: 1px;
    background: #ebeff7;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%,-50%,0);
  }
  .el-step__line-inner {
    display: none;
  }
}
</style>
