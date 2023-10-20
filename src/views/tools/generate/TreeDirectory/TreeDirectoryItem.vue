<script>
export default {
  name: 'TreeDirectoryItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    active: {
      type: String
    }
  },
  data() {
    return {
      innerActive: null
    }
  },
  watch: {
    active: {
      handler(value) {
        this.innerActive = value
      },
      immediate: true
    },
    innerActive(value) {
      this.$emit('update:active', value)
    }
  },
  computed: {
    iconType() {
      if (!this.item.type) {
        return null
      }
      switch (this.item.type) {
        case 'java':
          return 'folder_java'
        case 'xml':
          return 'folder_xml'
        case 'js':
          return 'folder_js'
        case 'vue':
          return 'folder_vue'
        case 'sql':
          return 'folder_sql'
      }
      return 'folder_file'
    }
  },
  methods: {
    onChecked() {
      if (!this.item.code || this.item.name === this.innerActive) {
        return
      }
      this.innerActive = this.item.name
    }
  }
}
</script>

<template>
  <details open>
    <summary
      :class="{ active: item.code && active === item.name }"
      @click="onChecked"
    >
      <span class="tree-item" :class="iconType">{{ item.name }}</span>
    </summary>
    <tree-directory-item
      v-for="(v, index) in item.children"
      :key="index"
      :item="v"
      :active.sync="innerActive"
    />
  </details>
</template>
