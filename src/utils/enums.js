import i18n from '@/plugins/i18n'
/**
 * 设备类型
 */
export const DeviceTypeEnums = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile'
}

/**
 * 权限判断模式
 */
export const PermissionModeEnums = {
  AND: 'and',
  OR: 'or'
}

/**
 * 操作日志 - 业务类型
 */
export const BusinessTypeEnums = {
  OTHER: { label: i18n.t('const.BusinessTypeEnums.OTHER'), value: 0 },
  QUERY: { label: i18n.t('const.BusinessTypeEnums.QUERY'), value: 1 },
  INSERT: { label: i18n.t('const.BusinessTypeEnums.INSERT'), value: 2 },
  UPDATE: { label: i18n.t('const.BusinessTypeEnums.UPDATE'), value: 3 },
  DELETE: { label: i18n.t('const.BusinessTypeEnums.DELETE'), value: 4 },
  EXPORT: { label: i18n.t('const.BusinessTypeEnums.EXPORT'), value: 5 },
  EXPORT_TEMPLATE: { label: i18n.t('const.BusinessTypeEnums.EXPORT_TEMPLATE'), value: 6 },
  IMPORT: { label: i18n.t('const.BusinessTypeEnums.IMPORT'), value: 7 },
  LOGIN: { label: i18n.t('const.BusinessTypeEnums.LOGIN'), value: 8 },
  LOGOUT: { label: i18n.t('const.BusinessTypeEnums.LOGOUT'), value: 9 },
  KICKOUT: { label: i18n.t('const.BusinessTypeEnums.KICKOUT'), value: 10 },
  FORCE_LOGOUT: { label: i18n.t('const.BusinessTypeEnums.FORCE_LOGOUT'), value: 11 },
  PAUSE_RESUME_JOB: { label: i18n.t('const.BusinessTypeEnums.PAUSE_RESUME_JOB'), value: 12 },
  EXEC_JOB: { label: i18n.t('const.BusinessTypeEnums.EXEC_JOB'), value: 13 }
}

/**
 * 菜单类型
 */
export const MenuTypeEnums = {
  DIR: { label: i18n.t('const.MenuTypeEnums.DIR'), value: 1 },
  MENU: { label: i18n.t('const.MenuTypeEnums.MENU'), value: 2 },
  BUTTON: { label: i18n.t('const.MenuTypeEnums.BUTTON'), value: 3 }
}

export const DataScopeEnums = {
  ALL: { label: i18n.t('const.DataScopeEnums.ALL'), value: 1 },
  CUSTOM: { label: i18n.t('const.DataScopeEnums.CUSTOM'), value: 2 },
  DEPT: { label: i18n.t('const.DataScopeEnums.DEPT'), value: 3 },
  DEPT_AND_CHILD: { label: i18n.t('const.DataScopeEnums.DEPT_AND_CHILD'), value: 4 },
  SELF: { label: i18n.t('const.DataScopeEnums.SELF'), value: 5 }
}

export const NoticeTypeEnums = {
  INFO: { label: i18n.t('const.NoticeTypeEnums.INFO'), value: 0 },
  ANNOUNCEMENT: { label: i18n.t('const.NoticeTypeEnums.ANNOUNCEMENT'), value: 1 }
}

/**
 * 根据value获取label
 * @param {Object} enums 枚举对象
 * @param {Number} value 要查找的value
 * @param {String} field 要返回的字段
 * @param {String} defaultValue 如果没有找到对应的label，返回默认值
 * @returns {String} label
 */
export function enumsParse(enums, value, field = 'label', defaultValue = null) {
  let fieldValue = null
  Object.keys(enums).forEach(key => {
    if (enums[key].value === value) {
      fieldValue = enums[key][field]
    }
  })
  return fieldValue || defaultValue
}
export function enumsParseLabel(enums, value, defaultValue = null) {
  return enumsParse(enums, value, 'label', defaultValue)
}

/**
 * enums 转换为 list
 * @param {Object} enums 待转换的enums
 * @returns {Array}
 */
export function enumsConvertToList(enums) {
  return Object.keys(enums).map(key => enums[key])
}
