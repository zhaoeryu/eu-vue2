import { PageMode } from '@/utils/enums'
import i18n from '@/plugins/i18n'
export default function PageModeMixin(options = {
  permissions: []
}) {
  return {
    data() {
      return {
        _x_page_path: null
      }
    },
    computed: {
      pageMode() {
        const { path } = this.$route
        if (path.includes('/edit')) {
          return PageMode.Edit.value
        } else {
          return PageMode.Add.value
        }
      },
      /**
       * 是否新增模式
       * @returns {boolean}
       */
      isAddMode() {
        return this.pageMode === PageMode.Add.value
      },
      /**
       * 是否编辑模式
       * @returns {boolean}
       */
      isEditMode() {
        return this.pageMode === PageMode.Edit.value
      },
      /**
       * 是否详情模式
       * @returns {boolean}
       */
      isDetailMode() {
        return this.pageMode === PageMode.Detail.value
      },
      /**
       * 当前页面模式的名称
       * @returns {*|string}
       */
      modeLabel() {
        return Object.values(PageMode).find(item => item.value === this.pageMode)?.label || ''
      },
      /**
       * 业务状态是否允许编辑
       * @returns {boolean}
       */
      businessAllowEdit() {
        // 默认允许编辑，子组件可以重写该方法
        return this.isEditMode
      },
      /**
       * 是否有编辑权限
       * @returns {boolean}
       */
      hasEditPermission() {
        return this.$permission(options.permissions)
      },
      /**
       * 是否允许编辑：需同时满足以下条件
       * 1. 当前页面非新增模式
       * 2. 业务状态允许编辑
       * 3. 拥有编辑权限
       * @returns {boolean}
       */
      allowEdit() {
        return this.isAddMode || (this.businessAllowEdit && this.hasEditPermission)
      }
    },
    mounted() {
      this._x_page_path = this.$route.path
    },
    beforeDestroy() {
      // 从Tab栏中移除当前缓存
      this.$store.dispatch('tabsView/delVisitedView', {
        path: this._x_page_path
      })
    },
    methods: {
      onCancel() {
        this.$router.back()
      },
      /**
       * 提交成功后的处理
       */
      onSubmitSuccess() {
        if (this.isAddMode) {
          this.$message.success(i18n.t('general.submit.add.success'))
          this.onCancel()
        } else {
          this.$confirm(i18n.t('general.submit.update.success.tips'), i18n.t('general.submit.update.success'), {
            confirmButtonText: i18n.t('general.submit.update.success.tips.goPrev'),
            cancelButtonText: i18n.t('general.submit.update.success.tips.stay'),
            type: 'success',
            center: true
          }).then(() => {
            this.onCancel()
          }).catch(() => {

          });
        }
      }
    }
  }
}
