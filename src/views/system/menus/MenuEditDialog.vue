<script>
import IconSelect from '@/components/IconSelect/index.vue'
import { add, update } from '@/api/system/menu'

export default {
  name: 'MenuEditDialog',
  components: { IconSelect },
  data() {
    return {
      show: false,

      list: [],
      formLoading: false,
      form: {
        id: null,
        menuName: null,
        menuIcon: null,
        sortNum: 999,
        permission: null,
        path: null,
        componentName: null,
        component: null,
        status: null,
        visible: null,
        cache: null,
        embed: null,
        embedUrl: null,
        dot: null,
        badge: null,
        menuType: null,
        parentId: null,
        showHeader: true,
        showFooter: true,
        alwaysShow: null,

        _parentIds: []
      },
      rules: {
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择菜单状态', trigger: 'change' }],
        sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? '修改菜单' : '新增菜单'
    }
  },
  methods: {
    open(row, list) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.list = list
      this.show = true
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }

        // 设置直接父级ID
        if (this.form._parentIds.length) {
          this.form.parentId = this.form._parentIds[this.form._parentIds.length - 1]
        } else {
          this.form.parentId = null
        }

        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(() => {
          this.$message.success(this.form.id ? '修改成功' : '新增成功')
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
  }
}
</script>

<template>
  <el-dialog :title="title" :visible.sync="show" width="600px" :close-on-click-modal="false" @open="onDialogOpen">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <el-cascader
              v-model="form._parentIds"
              :options="list"
              :props="{ checkStrictly: true, value: 'id', label: 'menuName', children: 'children' }"
              placeholder="请选择上级菜单"
              clearable
              filterable
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio-button :label="0">正常</el-radio-button>
              <el-radio-button :label="1">停用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="sortNum">
            <el-input-number v-model="form.sortNum" placeholder="请输入显示排序" :min="0" :max="9999" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType !== 3" :span="12">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="form.path" placeholder="请输入路由地址" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType !== 3" :span="12">
          <el-form-item label="菜单图标" prop="menuIcon" class="el-form-item_menu-icon">
            <icon-select :active-icon.sync="form.menuIcon">
              <template #reference>
                <el-input v-model="form.menuIcon" placeholder="请选择菜单图标" readonly>
                  <template #prefix>
                    <svg-icon v-if="form.menuIcon" :icon-class="form.menuIcon" />
                  </template>
                </el-input>
              </template>
            </icon-select>
          </el-form-item>
        </el-col>
        <template v-if="form.menuType === 2">
          <el-col :span="12">
            <el-form-item label="是否内嵌" prop="embed">
              <el-switch v-model="form.embed" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <template v-if="form.embed">
            <el-col :span="24">
              <el-form-item label="内嵌链接" prop="embedUrl">
                <el-input v-model="form.embedUrl" placeholder="请输入内嵌链接" maxlength="255" />
              </el-form-item>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="12">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="form.component" placeholder="以'@/views/'作为相对路径" maxlength="64" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件Name" prop="componentName">
                <el-input v-model="form.componentName" placeholder="请输入组件Name" maxlength="20" />
              </el-form-item>
            </el-col>
          </template>
        </template>
        <el-col v-if="form.menuType !== 1" :span="12">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="form.permission" placeholder="请输入权限标识" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType !== 3" :span="12">
          <el-form-item label="菜单栏显示" prop="hidden">
            <el-switch v-model="form.visible" :active-value="true" :inactive-value="false" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType === 1" :span="12">
          <el-form-item label="保持显示" prop="alwaysShow">
            <template #label>
              <el-tooltip class="item" effect="dark" content="当该目录的子菜单只有一项时，该目录是否保持显示。true：显示该目录，false：该目录隐藏直接显示子菜单" placement="top">
                <span>
                  <span>保持显示</span>
                  <i class="el-icon-info" />
                </span>
              </el-tooltip>
            </template>
            <el-switch v-model="form.alwaysShow" :active-value="true" :inactive-value="false" />
          </el-form-item>
        </el-col>
        <template v-if="form.menuType === 2">
          <el-col :span="12">
            <el-form-item label="是否缓存" prop="cache">
              <el-switch v-model="form.cache" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示Header" prop="showHeader">
              <el-switch v-model="form.showHeader" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示Footer" prop="showFooter">
              <el-switch v-model="form.showFooter" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="dot" prop="dot">
              <el-switch v-model="form.dot" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="badge" prop="badge">
              <el-input v-model="form.badge" placeholder="请输入badge" maxlength="5" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
::v-deep .el-form-item--small .el-form-item__content {
  height: 32px;
}
</style>
