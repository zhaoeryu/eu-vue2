<script>
import { assignRole, getUserInfo } from '@/api/system/user'
import { page as roleList } from '@/api/system/role'

export default {
  name: 'AssignRoleDialog',
  data() {
    return {
      show: false,
      loading: false,
      roleIds: [],
      roleId: '',
      userId: null,
      roleList: []
    }
  },
  computed: {
    assignRoleList() {
      return this.roleIds.map(id => {
        const role = this.roleList.find(item => item.id === id)
        if (role) {
          return role
        }
      }).filter(item => item)
    }
  },
  methods: {
    open(userId) {
      Object.assign(this.$data, this.$options.data())
      this.userId = userId
      this.show = true
      this.loading = true
      Promise.all([
        roleList({ page: 1, size: 999 }),
        getUserInfo(userId)
      ]).then(res => {
        this.roleList = res[0].data.records || []
        this.roleIds = res[1].data.roleIds || []
      }).finally(() => {
        this.loading = false
      })
    },
    onRemoveRole(tag) {
      this.roleIds = this.roleIds.filter(item => item !== tag.id)
    },
    onAssignRoleSelectChange(roleId) {
      this.roleIds.push(roleId)
      this.roleId = null
    },
    onAssignRoleSave() {
      this.loading = true
      assignRole({
        id: this.userId,
        roleIds: this.roleIds
      }).then(() => {
        this.$message.success('分配角色成功')
        this.show = false
        this.$emit('success')
      }).finally(() => {
        this.loading = false
      })
    },
    onDialogClose() {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<template>
  <el-dialog title="分配角色" :visible.sync="show" width="700px" @close="onDialogClose">
    <div class="assign-role-wrapper">
      <el-tag
        :key="tag.id"
        v-for="tag in assignRoleList"
        closable
        :disable-transitions="false"
        @close="onRemoveRole(tag)">
        {{tag.roleName}}
      </el-tag>
      <el-select v-model="roleId" @change="onAssignRoleSelectChange" placeholder="请选择角色" filterable class="input-new-tag">
        <el-option v-for="item in roleList" :disabled="assignRoleList.some(v => v.id === item.id)" :key="item.id" :label="item.roleName" :value="item.id" />
      </el-select>
    </div>

    <div slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="onAssignRoleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.assign-role-wrapper {
  .el-tag {
    height: 32px;
    line-height: 32px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
