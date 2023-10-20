<template>
  <div class="editor-wrapper">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

// 替换主题这里需修改名称
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/javascript/javascript'

export default {
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.editor.setValue(value)
      }
    },
    mode: {
      handler(value) {
        if (!value) {
          return
        }
        if (this.editor) {
          this.editor.setOption('mode', value)
        }
      },
      immediate: true
    },
    height(value) {
      this.editor.setSize('auto', value)
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: this.mode,
      lineNumbers: true,
      lint: true,
      lineWrapping: true,
      tabSize: 2,
      cursorHeight: 1,
      theme: 'darcula',
      readOnly: true
    })
    this.editor.setSize('auto', this.height)
    this.editor.setValue(this.value)
  }
}
</script>

<style lang='scss' scoped>
.editor-wrapper {
  font-size: 13px;
}
</style>
