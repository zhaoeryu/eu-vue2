<template>
  <el-popover
    ref="refMessageBoxPopover"
    placement="bottom-start"
    width="fit-content"
    popper-class="message-box-popover"
    trigger="click">
    <div class="message-box-wrapper">
      <nav class="message-box-wrapper__header">
        <ul>
          <li :class="{ active: active === 0 }" @click="onChecked(0)">{{ $t('message.head1.text') }}{{ unReadMessageCount1 }}</li>
          <li :class="{ active: active === 1 }" @click="onChecked(1)">{{ $t('message.head2.text') }}{{ unReadMessageCount2 }}</li>
        </ul>
      </nav>
      <div v-loading="loading" :element-loading-text="$t('message.loading')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
        <div class="message-box-wrapper__body">
          <ul v-if="showList.length">
            <li v-for="(item, index) in showList" :key="index" class="message-box-wrapper__body-item" :class="{ read: item.read }" @click="onItemChecked(item)">
              <eu-avatar shape="square" :size="40" :src="item.avatar" :nickname="item.publisher" class="message-box-wrapper__body-item__avatar" />
              <div class="message-box-wrapper__body-item__content">
                <div class="message-box-wrapper__body-item__content-title">{{ item.title }}</div>
                <div class="message-box-wrapper__body-item__content-description">{{ item.description }}</div>
                <div class="message-box-wrapper__body-item__content-time">{{ item.time }}</div>
              </div>
            </li>
          </ul>
          <el-empty v-else :description="$t('message.noData')" />
        </div>
        <div v-if="showList.length" class="message-box-wrapper__footer">
          <div @click="$refs.refMessageBoxPopover.doToggle()">{{ $t('message.close') }}</div>
          <div @click="onAllRead">{{ $t('message.allRead') }}</div>
        </div>
      </div>
    </div>
    <template #reference>
      <div @click="onRefresh()">
        <slot name="reference" :message-count="allUnReadMessageCount"></slot>
      </div>
    </template>
    <sys-notice-view-dialog ref="sysNoticeViewDialog" />
  </el-popover>
</template>

<script>
import { page as noticePage } from '@/api/system/sysNotice'
import EuAvatar from '@/components/EuAvatar/index.vue'
import SysNoticeViewDialog from '@/views/system/sysNotice/SysNoticeViewDialog.vue'
import { STORAGE_KEY_READ_MESSAGE } from '@/utils/constants'
import { NoticeTypeEnums } from '@/utils/enums'
export default {
  name: 'Message',
  components: { SysNoticeViewDialog, EuAvatar },
  data() {
    return {
      active: NoticeTypeEnums.INFO.value,
      list: [],
      loading: false
    }
  },
  computed: {
    unReadMessageCount1() {
      const count = this.list
        .filter(item => item.type === NoticeTypeEnums.INFO.value)
        .filter(item => !item.read).length
      if (count < 1) {
        return ''
      }
      return `(${count > 99 ? '99+' : count})`
    },
    unReadMessageCount2() {
      const count = this.list
        .filter(item => item.type === NoticeTypeEnums.ANNOUNCEMENT.value)
        .filter(item => !item.read).length
      if (count < 1) {
        return ''
      }
      return `(${count > 99 ? '99+' : count})`
    },
    allUnReadMessageCount() {
      return this.list.filter(item => !item.read).length
    },
    showList() {
      // 对结果进行排序，未读的排在前面
      return this.list.filter(item => item.type === this.active)
        .sort((a, b) => {
          if (a.read && !b.read) {
            return 1
          }
          if (!a.read && b.read) {
            return -1
          }
          return 0
        })
    },
  },
  mounted() {
    this.onRefresh()
  },
  methods: {
    onChecked(index) {
      this.active = index
      this.onRefresh()
    },
    onRefresh() {
      this.loading = true
      noticePage({
        sort: ['create_time,desc'],
        status: 0
      }).then(res => {
        const readMessage = localStorage.getItem(STORAGE_KEY_READ_MESSAGE)
        const readMessageList = readMessage ? JSON.parse(readMessage) : []
        this.list = res.data.records.map(item => {
          return {
            ...item,
            read: readMessageList.includes(item.id),
            time: this.dayjs(item.createTime).fromNow()
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onItemChecked(item) {
      item.read = true
      const readMessage = localStorage.getItem(STORAGE_KEY_READ_MESSAGE)
      const readMessageList = readMessage ? JSON.parse(readMessage) : []
      readMessageList.push(item.id)
      localStorage.setItem(STORAGE_KEY_READ_MESSAGE, JSON.stringify(readMessageList))
      this.$refs.sysNoticeViewDialog.open(item)
    },
    onAllRead() {
      const readMessageList = this.list.map(item => item.id)
      this.list.forEach(item => item.read = true)
      localStorage.setItem(STORAGE_KEY_READ_MESSAGE, JSON.stringify(readMessageList))
    }
  }
}
</script>

<style lang="scss">
.message-box-popover {
  padding: 0 !important;
  background: var(--theme-base-second-bg) !important;
}
</style>

<style lang='scss' scoped>
@import "~@/assets/styles/mixin.scss";
.message-box-wrapper {
  width: 350px;
  box-sizing: border-box;
}
.message-box-wrapper__header {
  padding: 0 16px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background-color: var(--color-border-1, #ebeef5);
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    line-height: 3em;
    li {
      text-align: center;
      position: relative;
      min-width: 70px;
      box-sizing: border-box;
      cursor: pointer;
      &.active:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        box-sizing: border-box;
        border-color: transparent transparent var(--color-primary);
        border-style: none solid solid;
        border-width: 0 8px 5px;
        height: 0;
        width: 70px;
      }
      &.active,&:hover {
        color: var(--color-primary);
      }
      & + li {
        margin-left: 12px;
      }
    }
  }
}
.message-box-wrapper__body {
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
  @include scrollBar;
  .message-box-wrapper__body-item {
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    position: relative;
    cursor: pointer;
    .message-box-wrapper__body-item__content {
      margin-left: 12px;
      flex: 1;
      .message-box-wrapper__body-item__content-title {
        font-size: 14px;
        font-weight: 500;
      }
      .message-box-wrapper__body-item__content-description {
        color: #909399;
        margin: 5px 0;
      }
      .message-box-wrapper__body-item__content-time {
        color: #C0C4CC;
      }
    }
    & + .message-box-wrapper__body-item {
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 12px;
        right: 0;
        width: calc(100% - 12px - 12px);
        height: 1px;
        background: var(--color-border-1, #ebeef5);
      }
    }
    &:hover {
      background: var(--color-secondary-hover, #f5f7fa);
    }
    &.read {
      opacity: 0.4;
    }
  }
}
.message-box-wrapper__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  line-height: 2.5em;
  font-size: 13px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background: var(--color-border-1, #ebeef5);
  }
  >div {
    flex: 1;
    text-align: center;
    position: relative;
    cursor: pointer;
    &:first-child:after {
      content: '';
      position: absolute;
      top: 20%;
      right: 0;
      width: 1px;
      height: 60%;
      background: var(--color-border-1, #ebeef5);
    }
    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
