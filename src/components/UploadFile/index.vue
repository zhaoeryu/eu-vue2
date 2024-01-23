<template>
  <el-upload
    ref="uploadFile"
    v-bind="$attrs"

    :action="action"
    :headers="headers"
    :file-list="files"

    :on-success="successHandle"
    :on-remove="removeHandle"
    :on-preview="previewHandle"
    :before-remove="beforeRemoveHandle"
    :on-error="errorHandle"
    :before-upload="beforeUploadHandle"
    :on-exceed="exceedHandle"
  >
    <!-- 触发文件选择框的内容 -->
    <el-button v-if="!$slots.trigger" type="primary">{{ $t('crud.UploadFile.trigger') }}</el-button>
    <slot v-else name="trigger"></slot>
    <!-- 提示说明文字 -->
    <div v-if="tip && !$slots.tip" class="el-upload__tip">{{ tip }}</div>
    <slot v-else name="tip"></slot>
    <!-- 图片预览 -->
    <el-image-viewer v-if="previewShow" :url-list="[previewUrl]" :on-close="() => previewShow = false" append-to-body></el-image-viewer>
  </el-upload>
</template>

<script>
import { REQUEST_HEADER_TOKEN } from '@/utils/constants'
import { getToken } from '@/utils/auth'
import { defaultSetting } from '@/settings'
import { downloadFile } from '@/utils'

export default {
  name: 'UploadFile',
  props: {
    /**
     * 上传接口
     */
    uploadApi: {
      type: String,
      required: true
    },
    /**
     * 文件地址，多个文件使用，分隔
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * 文件大小限制：单位MB
     */
    sizeLimit: {
      type: Number,
      required: false,
      default: 10
    },
    /**
     * 是否禁用删除: 默认不禁用
     */
    delEnable: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * 提示说明的内容
     */
    tip: {
      type: String,
      required: false
    },
    /**
     * 是否单个文件模式
     * 单个文件模式下，文件列表只会保存最后一次上传成功的文件，重复上传会进行覆盖
     */
    singleMode: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * 上传成功的回调
     */
    onSuccessCallback: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      headers: {
        [REQUEST_HEADER_TOKEN]: getToken()
      },
      // 文件列表：用于和el-upload组件进行双向绑定
      files: [],

      previewShow: false,
      previewUrl: '',
    }
  },
  watch: {
    // 如果外部value变化，则更新文件列表。
    // 初始化时，如果value有值，就创建文件列表
    value: {
      handler: function (val) {
        if (!val) {
          // 如果value为空，则清空文件列表
          this.files.splice(0, this.files.length)
          return
        }

        let urls = val.split(',').filter(item => item && item !== 'null')
        if (this.singleMode) {
          // 单个文件模式下，只保留最后一个文件
          urls = urls.slice(-1)
        }
        urls.forEach(url => {
          const isExists = this.files.some(file => file.response && file.response.link === url)
          if (isExists) {
            return
          }
          this.files.push({
            name: url.substring(url.lastIndexOf('/') + 1, url.length),
            url: url,
            response: {
              link: url
            }
          })
        })
      },
      immediate: true
    }
  },
  computed: {
    action() {
      return defaultSetting.BASE_API + this.uploadApi
    }
  },
  methods: {
    /**
     * 点击文件列表中已上传文件时的回调
     */
    previewHandle() {
      const link = arguments[0].response.link
      const s_1 = link.lastIndexOf('/') + 1
      const s_2 = link.lastIndexOf('.')
      const ext = link.substring(s_2 + 1, link.length)
      const fileName = link.substring(s_1, s_2)
      if (['png', 'jpg', 'jpeg', 'gif'].indexOf(ext.toLowerCase()) === -1) {
        // 非图片类型，下载
        downloadFile(link, fileName + ext)
      } else {
        this.previewShow = true
        this.previewUrl = link;
      }
    },
    /**
     * 删除文件之前的回调，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
     * @returns {boolean} 是否取消移除
     */
    beforeRemoveHandle() {
      return this.delEnable
    },
    /**
     * 文件列表移除文件时的回调
     * @param {Object} file 被移除的文件
     * @param {Array} fileList 文件列表
     */
    removeHandle(file, fileList) {
      this.syncValue(file, fileList, true)
    },
    /**
     * 文件上传成功时的回调
     * @param {Object} response 上传成功服务器的响应数据
     * @param {Object} file 上传成功的文件
     * @param {Array} fileList 文件列表
     */
    successHandle(response, file, fileList) {
      const isContinue = this.onSuccessCallback && this.onSuccessCallback(response, file, fileList)
      if (isContinue !== undefined && !isContinue) {
        // 回调返回false，不进行后续处理
        return
      }
      if (!this.verifySuccessResponse(response, !this.onSuccessCallback)) {
        // 校验失败
        this.files = fileList.filter(item => item.response.link)
        return
      }

      this.syncValue(file, fileList)
    },
    /**
     * 校验服务器返回的结果
     * @param {Object} response 服务器的响应数据
     * @param {boolean} isTip 是否提示错误信息
     * @returns {boolean}
     */
    verifySuccessResponse(response, isTip) {
      if (response && response.link) {
        return true
      }
      if (isTip) {
        this.$message.error(response.msg || this.$t('crud.UploadFile.uploadFail'))
      }
      return false
    },
    /**
     * 同步操作结果给v-model绑定的值
     * @param {Object} file 本次操作的文件
     * @param {Array} fileList 文件列表
     * @param {boolean} isRemove 是否是移除操作
     */
    syncValue(file, fileList, isRemove = false) {
      if (file.status !== 'success') {
        // 非成功状态不进行处理
        return
      }

      if (this.singleMode) {
        // 单个文件模式下，文件列表只会保存最后一次上传成功的文件，重复上传会进行覆盖
        this.files = isRemove ? fileList : [file]
      } else {
        this.files = fileList
      }
      // 从文件列表中获取文件地址，拼接成字符串(多个文件，分隔)，同步给v-model绑定的值
      const urls = this.files.filter(item => item.response && item.response.link)
        .map(item => item.response.link)
        .join(',')
      this.$emit('input', urls)
    },
    /**
     * 文件上传失败时的回调
     * @param {Error} e 错误对象
     */
    errorHandle(e) {
      this.$message.error(e.message && e.message.message || e.message || this.$t('crud.UploadFile.uploadFail'))
    },
    /**
     * 上传文件之前的回调，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
     * @param {Object} file 文件对象
     * @returns {boolean} 是否停止上传
     */
    beforeUploadHandle(file) {
      const isLtM = file.size / 1024 / 1024 < this.sizeLimit
      if (!isLtM) {
        this.$message.error(this.$t('crud.UploadFile.size.limit', { limit: this.sizeLimit }))
      }
      return isLtM
    },
    /**
     * 文件超出个数限制时的回调
     */
    exceedHandle() {
      this.$message.warning(this.$t('crud.UploadFile.number.limit', { limit: this.$refs.uploadFile.limit }))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  // 禁用上传动画
  .el-upload-list__item {
    transition: none !important;
  }
  // 图片列表模式下，新增按钮居中
  .el-upload--picture-card {
    text-align: center;
    width: 80px;
    height: 80px;
    line-height: 86px;
  }
  // 图片列表模式下，图片大小
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
  }
  // 头像模式
  .el-upload--picture-avatar {
    background-color: var(--theme-nav-second-bg, #fbfdff);
    border: 1px dashed var(--color-border-2, #c0ccda);
    border-radius: 6px;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    cursor: pointer;
    line-height: 86px;
    vertical-align: top;
    text-align: center;
    &:hover {
      border-color: #155bd4;
      color: #155bd4;
    }
    i {
      font-size: 28px;
      color: var(--theme-text-primary-color, #8c939d);
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
  }
}
</style>
