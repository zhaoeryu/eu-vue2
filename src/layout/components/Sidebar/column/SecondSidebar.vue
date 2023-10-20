<script>
import SecondSidebarItem from '@/layout/components/Sidebar/column/SecondSidebarItem.vue'
import { smoothScrollToBottom, smoothScrollToTop } from '@/utils/sliding-scroll'

export default {
  name: 'SecondSidebar',
  components: { SecondSidebarItem },
  data() {
    return {
      secondNavUpIndicatorShow: false,
      secondNavDownIndicatorShow: false,
    }
  },
  props: {
    secondNavList: {
      type: Array,
      required: true
    },
    rootPath: {
      type: String,
      required: false
    },
  },
  mounted() {
    // 首次渲染后，如果二级菜单内容需要滚动，则显示滚动指示器
    this.$nextTick(() => {
      this.onSelfNavScroll()
    })
  },
  methods: {
    onSelfNavScroll() {
      this.onNavScroll({
        target: this.$el.querySelector('.eu-nav-scroll')
      })
    },
    onNavScroll({ target }) {
      // console.log(target)
      // console.log(target.scrollHeight, target.offsetHeight, target.scrollTop)
      if (target.offsetHeight >= target.scrollHeight) {
        // 不需要滚动
        this.secondNavUpIndicatorShow = false
        this.secondNavDownIndicatorShow = false
        return
      }
      this.secondNavUpIndicatorShow = target.scrollTop > 0
      this.secondNavDownIndicatorShow = (target.scrollTop + target.offsetHeight) < target.scrollHeight
    },
    onNavUpScroll({ target }) {
      smoothScrollToTop({
        duration: 300,
        element: target.parentNode.nextElementSibling
      })
    },
    onNavDownScroll({ target }) {
      smoothScrollToBottom({
        duration: 300,
        element: target.parentNode.previousElementSibling
      })
    },
  }
}
</script>

<template>
  <nav class="eu-nav-scroll-wrapper">
    <div class="eu-nav-up-indicator" :class="{ 'eu-nav-indicator-hide': !secondNavUpIndicatorShow }">
      <div class="eu-op" @click="onNavUpScroll">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
    <ul class="eu-nav-scroll" @scroll="onNavScroll">
      <template v-for="(item, index) in secondNavList">
        <second-sidebar-item
          :item="item"
          :root-path="rootPath"
          :key="index"
          @item-click="$emit('item-click', $event)"
        />
      </template>
    </ul>
    <div class="eu-nav-down-indicator" :class="{ 'eu-nav-indicator-hide': !secondNavDownIndicatorShow }">
      <div class="eu-op" @click="onNavDownScroll">
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
// 滚动指示器
.eu-nav-scroll-wrapper {
  .eu-nav-up-indicator,.eu-nav-down-indicator {
    height: 64px;
    margin: 2px;
    display: flex;
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    transition: opacity .15s linear;
    .eu-op {
      cursor: pointer;
      height: 20px;
      line-height: 20px;
      width: 100%;
      background-color: rgba(0, 0, 0, .06);
      text-align: center;
      font-size: 14px;
      color: #333;
      >i {
        pointer-events: none;
      }
    }
  }
  .eu-nav-up-indicator {
    top: 0;
    align-items: flex-start;
    background: linear-gradient(0deg,rgba(255, 255, 255, 0),#fff 44%);
  }
  .eu-nav-down-indicator {
    bottom: 0;
    align-items: flex-end;
    background: linear-gradient(-180deg,rgba(255, 255, 255, 0),#fff 44%);
  }
}
.eu-nav-indicator-hide {
  opacity: 0 !important;
  height: 0 !important;
}
// 菜单滚动区域
.eu-nav-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  position: relative;
  &::-webkit-scrollbar{
    width: 0;
  }
}
// 折叠菜单
.sidebar-collapsed {
  .eu-nav-sidebar__second {
    width: 0 !important;
    overflow: hidden;
  }
}
// 隐藏二级菜单
.eu-nav-second-sidebar-hidden {
  .eu-nav-sidebar__second {
    width: 0 !important;
    overflow: hidden;
  }
}
</style>
