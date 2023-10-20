<template>
  <li class="el-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="[paddingStyle, itemStyle, { backgroundColor }]"
    :class="{
      'is-active': active,
      'is-disabled': disabled
    }"
    @click="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <template>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>
<script>
import Menu from 'element-ui/packages/menu/src/menu-mixin';
import Emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'ElMenuItem',

  componentName: 'ElMenuItem',

  mixins: [Menu, Emitter],

  props: {
    index: {
      default: null,
      validator: val => typeof val === 'string' || val === null
    },
    route: [String, Object],
    disabled: Boolean
  },
  computed: {
    active() {
      return this.index === this.rootMenu.activeIndex;
    },
    hoverBackground() {
      return this.rootMenu.hoverBackground;
    },
    backgroundColor() {
      return this.rootMenu.backgroundColor || '';
    },
    activeTextColor() {
      return this.rootMenu.activeTextColor || '';
    },
    textColor() {
      return this.rootMenu.textColor || '';
    },
    mode() {
      return this.rootMenu.mode;
    },
    itemStyle() {
      const style = {
        color: this.active ? this.activeTextColor : this.textColor
      };
      if (this.mode === 'horizontal' && !this.isNested) {
        style.borderBottomColor = this.active
          ? (this.rootMenu.activeTextColor ? this.activeTextColor : '')
          : 'transparent';
      }
      return style;
    },
    isNested() {
      return this.parentMenu !== this.rootMenu;
    }
  },
  methods: {
    onMouseEnter() {
      /* eslint-disable */
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.hoverBackground;
    },
    onMouseLeave() {
      /* eslint-disable */
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.backgroundColor;
    },
    handleClick() {
      if (!this.disabled) {
        this.dispatch('ElMenu', 'item-click', this);
        this.$emit('click', this);
      }
    }
  },
  mounted() {
    this.parentMenu.addItem(this);
    this.rootMenu.addItem(this);
  },
  beforeDestroy() {
    this.parentMenu.removeItem(this);
    this.rootMenu.removeItem(this);
  }
};
</script>
