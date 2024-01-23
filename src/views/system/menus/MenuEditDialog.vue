<script>
import IconSelect from '@/components/IconSelect/index.vue'
import { add, update } from '@/api/system/menu'
import i18n from '@/plugins/i18n'

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
        menuType: [{ required: true, message: i18n.t('menu.edit.form.menuType.required'), trigger: 'change' }],
        menuName: [{ required: true, message: i18n.t('menu.edit.form.menuName.required'), trigger: 'blur' }],
        status: [{ required: true, message: i18n.t('menu.edit.form.status.required'), trigger: 'change' }],
        sortNum: [{ required: true, message: i18n.t('menu.edit.form.sortNum.required'), trigger: 'blur' }],
        path: [{ required: true, message: i18n.t('menu.edit.form.path.required'), trigger: 'blur' }],
        component: [{ required: true, message: i18n.t('menu.edit.form.component.required'), trigger: 'blur' }],
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('menu.edit.title') : this.$t('menu.add.title')
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
          this.$message.success(this.form.id ? this.$t('menu.edit.success') : this.$t('menu.add.success'))
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
          <el-form-item :label="$t('menu.edit.form.parentId')" prop="parentId">
            <el-cascader
              v-model="form._parentIds"
              :options="list"
              :props="{ checkStrictly: true, value: 'id', label: 'menuName', children: 'children' }"
              :placeholder="$t('menu.edit.form.parentId.placeholder')"
              clearable
              filterable
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('menu.edit.form.menuType')" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="1">{{ $t('const.MenuTypeEnums.DIR') }}</el-radio>
              <el-radio :label="2">{{ $t('const.MenuTypeEnums.MENU') }}</el-radio>
              <el-radio :label="3">{{ $t('const.MenuTypeEnums.BUTTON') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('menu.edit.form.menuName')" prop="menuName">
            <el-input v-model="form.menuName" :placeholder="$t('menu.edit.form.menuName.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('menu.edit.form.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio-button :label="0">{{ $t('menu.edit.form.status.normal') }}</el-radio-button>
              <el-radio-button :label="1">{{ $t('menu.edit.form.status.disabled') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('menu.edit.form.sortNum')" prop="sortNum">
            <el-input-number v-model="form.sortNum" :placeholder="$t('menu.edit.form.sortNum.placeholder')" :min="0" :max="9999" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType !== 3" :span="12">
          <el-form-item :label="$t('menu.edit.form.path')" prop="path">
            <el-input v-model="form.path" :placeholder="$t('menu.edit.form.path.placeholder')" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType !== 3" :span="12">
          <el-form-item :label="$t('menu.edit.form.menuIcon')" prop="menuIcon" class="el-form-item_menu-icon">
            <icon-select :active-icon.sync="form.menuIcon">
              <template #reference>
                <el-input v-model="form.menuIcon" :placeholder="$t('menu.edit.form.menuIcon.placeholder')" readonly>
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
            <el-form-item :label="$t('menu.edit.form.embed')" prop="embed">
              <el-switch v-model="form.embed" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <template v-if="form.embed">
            <el-col :span="24">
              <el-form-item :label="$t('menu.edit.form.embedUrl')" prop="embedUrl">
                <el-input v-model="form.embedUrl" :placeholder="$t('menu.edit.form.embedUrl.placeholder')" maxlength="255" />
              </el-form-item>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="12">
              <el-form-item :label="$t('menu.edit.form.component')" prop="component">
                <el-input v-model="form.component" :placeholder="$t('menu.edit.form.component.placeholder')" maxlength="64" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('menu.edit.form.componentName')" prop="componentName">
                <el-input v-model="form.componentName" :placeholder="$t('menu.edit.form.componentName.placeholder')" maxlength="20" />
              </el-form-item>
            </el-col>
          </template>
        </template>
        <el-col v-if="form.menuType !== 1" :span="12">
          <el-form-item :label="$t('menu.edit.form.permission')" prop="permission">
            <el-input v-model="form.permission" :placeholder="$t('menu.edit.form.permission.placeholder')" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType !== 3" :span="12">
          <el-form-item :label="$t('menu.edit.form.visible')" prop="hidden">
            <el-switch v-model="form.visible" :active-value="true" :inactive-value="false" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menuType === 1" :span="12">
          <el-form-item :label="$t('menu.edit.form.alwaysShow')" prop="alwaysShow">
            <template #label>
              <el-tooltip class="item" effect="dark" :content="$t('menu.edit.form.alwaysShow.tooltip')" placement="top">
                <span>
                  <span>{{ $t('menu.edit.form.alwaysShow') }}</span>
                  <i class="el-icon-info" />
                </span>
              </el-tooltip>
            </template>
            <el-switch v-model="form.alwaysShow" :active-value="true" :inactive-value="false" />
          </el-form-item>
        </el-col>
        <template v-if="form.menuType === 2">
          <el-col :span="12">
            <el-form-item :label="$t('menu.edit.form.cache')" prop="cache">
              <el-switch v-model="form.cache" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menu.edit.form.showHeader')" prop="showHeader">
              <el-switch v-model="form.showHeader" :active-value="true" :inactive-value="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menu.edit.form.showFooter')" prop="showFooter">
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
              <el-input v-model="form.badge" :placeholder="$t('menu.edit.form.badge.placeholder')" maxlength="5" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
::v-deep .el-form-item--small .el-form-item__content {
  height: 32px;
}
</style>
