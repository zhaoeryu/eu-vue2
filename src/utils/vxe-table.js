export const TABLE_FINGERPRINT = (ctx, refTableName) => {
  return `${ctx.$route?.fullPath || '-'}#${ctx.$options?.name || '-'}#${refTableName}`
}
