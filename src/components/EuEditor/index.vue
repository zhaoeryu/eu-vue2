<template>
  <div>
    <Editor
      v-model="html"
      :init="init"
      :disabled="disabled"
      ref="editorRef"
      :key="key"
    ></Editor>
  </div>
</template>

<script>
import { uploadFile } from '@/api/upload'
import i18n from '@/plugins/i18n'

import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default';
// 列表插件
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
// 上传图片插件
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
// 表格插件
import 'tinymce/plugins/table'
// 自动识别链接插件
import 'tinymce/plugins/autolink'
// 预览插件
import 'tinymce/plugins/preview'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/link'
import 'tinymce/plugins/searchreplace'

tinymce._setBaseUrl('/tinymce')
const content_style =
  `
  p { margin: 5px 0px;}
`

// 语言配置
const LanguageConfig = i18n.locale === 'zh_CN' ? {
  // 根据自己文件的位置，填写正确的路径，注意/可以直接访问到public文件
  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
} : {}

export default {
  name: 'EuEditor',
  props: {
    value: String,
    placeholder: {
      type: String,
      default: 'Please enter content...'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  components: {
    Editor
  },
  data() {
    return {
      key: new Date().getTime(),
      init: {
        // inline: true,
        placeholder: this.placeholder,
        ...LanguageConfig,
        ...(window.document.querySelector('body[eu-theme=\'dark\']') !== null ? {
          skin_url: '/tinymce/skins/ui/oxide-dark',
          skin: 'oxide-dark',
        } : {
          skin_url: '/tinymce/skins/ui/oxide',
          skin: 'oxide',
        }),
        height: this.height,
        // max_height: 500,
        // max_width: 500,
        // min_height: 100,
        // min_width: 400,
        formats: {
          underline: { inline: 'u' },
          strikethrough: { inline: 's' },
        },
        plugins: 'lists advlist image table autolink preview code fullscreen link searchreplace',
        toolbar: 'fullscreen searchreplace | bold italic underline strikethrough forecolor backcolor | link unlink | alignleft aligncenter alignright alignjustify | bullist numlist | image table | formatselect | fontsizeselect | outdent indent',
        // 溢出工具栏按钮将显示在主工具栏下方
        toolbar_mode: 'wrap',
        content_style: content_style,
        // 隐藏右下角的powered by tinyMCE
        branding: false,
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        // 配置了此方法,即可手动选择图片
        images_upload_handler: (blobInfo, success, failure) => {
          const formData = new FormData()
          formData.append('file', blobInfo.blob());
          uploadFile(formData).then(res => {
            success(res.link)
          }).catch(e => {
            failure(e)
          })
        },
        // eslint-disable-next-line no-unused-vars
        urlconverter_callback: (url, node, on_save, name) => {
          return url
        },
        resize: true,
        remove_trailing_brs: false
      },
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
}
</script>

<style lang="scss" scoped>
::v-deep {
  .tox-tinymce {
    border-radius: 6px;
  }
}
</style>
