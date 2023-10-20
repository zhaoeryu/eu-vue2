<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px;">
      <!-- 工具栏 -->
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
      />
      <!-- 编辑器 -->
      <Editor
        v-model="html"
        :defaultConfig="editorConfig"
        style="height: 400px; overflow-y: hidden;"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
// https://www.wangeditor.com/v5/for-frame.html#%E9%85%8D%E7%BD%AE
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  name: 'EuEditor',
  props: {
    value: String
  },
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {}
      }
    }
  },
  computed: {
    html: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    onCreated(editor) {
      // 【注意】一定要用 Object.seal() 否则会报错
      this.editor = Object.seal(editor)
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) {
      return
    }
    editor.destroy()
  },
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>