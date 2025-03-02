/**
 * 打开表格列设置弹窗
 * @param {Object} refTable el-table 组件的 ref
 * @param {String} tableColumnRefName TableColumnSettingDialog 组件的 ref 名称
 */
export function openTableColumnSettingDialog(refTable, tableColumnRefName = 'tableColumnSettingDialog') {
  const ref = this.$refs[tableColumnRefName]
  if (!ref) {
    throw new Error('tableColumnSettingDialog ref is not found')
  }
  ref.open(refTable)
}

export const openNewWindow = (router, params) => {
  let routeData = router.resolve(params);
  window.open(routeData.href, '_blank');
}
