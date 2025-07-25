<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    width="230"
    :open-delay="0"
    :close-delay="50"
    trigger="click">
    <template #reference>
      <eu-avatar :src="user.avatar" :nickname="user.nickname" :size="30" />
    </template>
    <div class="eu-pop-inner">
      <el-row>
        <el-col :span="24">
          <div>{{ $t('layout.SidebarHeader.username') }}</div>
          <div>{{ user.username || '-' }}</div>
        </el-col>
        <el-col :span="24">
          <div>{{ $t('layout.SidebarHeader.nickname') }}</div>
          <div>{{ user.nickname || '-' }}</div>
        </el-col>
        <el-col :span="24">
          <div>{{ $t('layout.SidebarHeader.email') }}</div>
          <div>{{ user.email || '-' }}</div>
        </el-col>
        <el-col :span="24">
          <div>{{ $t('layout.SidebarHeader.deptNames') }}</div>
          <div>{{ deptNames || '-' }}</div>
        </el-col>
      </el-row>
      <el-divider direction="horizontal"></el-divider>
      <el-row style="display: flex;">
        <el-col :span="11">
          <el-button type="text" style="width: 100%;" @click="hiddenPopover();$router.push('/personal-center')">
            {{ $t('layout.SidebarHeader.personCenter') }}</el-button>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical" content-position="center"></el-divider>
        </el-col>
        <el-col :span="11">
          <el-button type="text" style="width: 100%;" @click="onLogout">{{ $t('layout.SidebarHeader.logout') }}</el-button>
        </el-col>
      </el-row>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import EuAvatar from '@/components/EuAvatar/index.vue'

export default {
  name: 'SidebarHeader',
  components: { EuAvatar },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    deptNames() {
      return (this.user.deptNames || []).join(' / ') || this.$t('layout.SidebarHeader.noDept')
    }
  },
  methods: {
    hiddenPopover() {
      this.$refs.popover.doClose()
    },
    onLogout() {
      this.$confirm(this.$t('layout.SidebarHeader.logout.confirm.message'), this.$t('layout.SidebarHeader.logout.confirm.title'), {
        confirmButtonText: this.$t('layout.SidebarHeader.logout.confirm.confirmButtonText'),
        cancelButtonText: this.$t('layout.SidebarHeader.logout.confirm.cancelButtonText'),
        type: 'warning'
      }).then(() => {
        this.hiddenPopover()
        this.$store.dispatch('user/Logout').finally(() => {
          location.href = '/'
        })
      }).catch(() => {
        // nothing
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.eu-pop-inner {
  background-color: var(--theme-nav-second-bg);
  color: var(--color-text-2);
}
.el-row {
  .el-col {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 2em;
  }
}
.el-divider--horizontal {
  margin: 12px 0;
}
</style>
