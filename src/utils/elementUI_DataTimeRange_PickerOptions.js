import i18n from '@/plugins/i18n'
export default {
  shortcuts: [{
    text: i18n.t('elementDatePickerOptions.shortcuts.lastWeek'),
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: i18n.t('elementDatePickerOptions.shortcuts.lastMonth'),
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: i18n.t('elementDatePickerOptions.shortcuts.lastThreeMonths'),
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: i18n.t('elementDatePickerOptions.shortcuts.lastSixMonths'),
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: i18n.t('elementDatePickerOptions.shortcuts.lastYear'),
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
      picker.$emit('pick', [start, end]);
    }
  }]
}
