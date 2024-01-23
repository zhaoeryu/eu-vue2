<script>

export default {
  name: 'ImportDialog',
  props: {
    uploadUrl: {
      type: String,
      required: true
    },
    tplExportUrl: {
      type: String,
      required: true
    },
    sizeLimit: {
      type: Number,
      default: 20
    },
    reqData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      show: false,
      stepActive: 0,
      formLoading: false,
      importMode: 0,
      file: '',

      uploadResult: {
        updateCount: 0,
        addCount: 0
      }
    }
  },
  computed: {
    uploadData() {
      return {
        importMode: this.importMode,
        ...(this.reqData || {})
      }
    }
  },
  methods: {
    open() {
      Object.assign(this.$data, this.$options.data())
      this.show = true
    },
    onExportTemplate() {
      this.download(this.tplExportUrl, {}, `${this.$t('crud.ImportDialog.tplFilePrefix')}_${new Date().getTime()}.xlsx`)
    },
    onSuccessCallback(response) {
      if (response.code !== 200) {
        this.$message.error(response.msg)
      } else {
        this.stepActive++
        Object.assign(this.uploadResult, response.data)
        this.$emit('complete')
      }
    },
    onComplete() {
      this.show = false
    }
  }
}
</script>

<template>
  <el-dialog
    :title="$t('crud.ImportDialog.title')"
    :visible.sync="show"
    width="600px"
    append-to-body
  >
    <el-steps :active="stepActive" :align-center="true" finish-status="success">
      <el-step :title="$t('crud.ImportDialog.steps1Title')"></el-step>
      <el-step :title="$t('crud.ImportDialog.steps2Title')"></el-step>
    </el-steps>
    <div v-if="stepActive === 0">
      <div style="padding: 10px 40px;">
        <div class="import-mode">
          <span>{{ $t('crud.ImportDialog.importMode') }}</span>
          <el-radio-group v-model="importMode">
            <el-radio :label="0">{{ $t('crud.ImportDialog.importMode.add') }}</el-radio>
            <el-radio :label="1">{{ $t('crud.ImportDialog.importMode.update') }}</el-radio>
            <el-radio :label="2">{{ $t('crud.ImportDialog.importMode.addAndUpdate') }}</el-radio>
          </el-radio-group>
        </div>
        <ul class="import-tip">
          <li>
            <span>{{ $t('crud.ImportDialog.tip') }}</span>
            <span style="cursor: pointer;color: var(--color-primary);" @click="onExportTemplate">{{ $t('crud.ImportDialog.tip.standardTpl') }}</span>
          </li>
          <li>{{ $t('crud.ImportDialog.tip.support', { sizeLimit }) }}</li>
          <slot name="importTip"></slot>
        </ul>
      </div>
      <upload-file
        v-model="file"
        :upload-api="uploadUrl"
        :single-mode="true"
        :size-limit="sizeLimit"
        :tip="`${$t('crud.ImportDialog.upload.tip', { sizeLimit })}`"
        :data="uploadData"
        :on-success-callback="onSuccessCallback"
        accept=".xls,.xlsx"
        class="import-upload"
        drag
      >
        <template #trigger>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" v-html="$t('crud.ImportDialog.upload.text')"></div>
        </template>
      </upload-file>
    </div>
    <div v-if="stepActive === 1">
      <el-result icon="success">
        <template #subTitle>
          <p>
            <span>{{ $t('crud.ImportDialog.success.update') }}</span>
            <span class="text-success" style="padding: 0 0.5em;">{{ uploadResult.updateCount }}</span>
            <span>{{ $t('crud.ImportDialog.success.add') }}</span>
            <span class="text-success" style="padding: 0 0.5em;">{{uploadResult.addCount }}</span>
            <span>{{ $t('crud.ImportDialog.success.suffix') }}</span>
          </p>
        </template>
      </el-result>
    </div>
    <template v-if="stepActive > 0" #footer>
      <el-button @click="stepActive = 0">{{ $t('crud.ImportDialog.complete.prev') }}</el-button>
      <div style="flex: 1;">
        <el-button class="eu-submit-btn" type="primary" @click="onComplete">{{ $t('crud.ImportDialog.complete.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
::v-deep {
  .el-dialog__footer {
    border-top: 1px solid var(--color-border);
    display: flex;
  }

  .el-result {
    padding-top: 80px;
    padding-bottom: 80px;
  }

  // 步骤条样式
  .el-steps {
    margin-bottom: 24px;
  }
  .el-step__icon {
    width: 20px;
    height: 20px;
    &.is-text {
      color: #fff;
      background-color: var(--color-primary);
      border-radius: 50%;
      border: 1px solid var(--color-primary);
    }
  }
  .el-step__title {
    font-size: 13px;
    &.is-success {
      color: #333;
    }
  }
  .el-step__line {
    background-color: unset;
  }
  .is-success {
    .el-step__line:before {
      background: var(--color-primary);
    }
  }
  .is-process {
    font-weight: unset;
    color: var(--color-primary);
    .el-step__line:before {
      background: -webkit-linear-gradient(left,var(--color-primary),#ebeff7);
      color: transparent;
    }
  }
  .is-wait {
    color: #999;
    .el-step__icon {
      background-color: transparent;
      &.is-text {
        color: #999;
        border-color: #d9d9d9;
      }
    }
  }
  .el-step__line:before {
    content: "";
    width: 150px;
    height: 1px;
    background: #ebeff7;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%,-50%,0);
  }
  .el-step__line-inner {
    display: none;
  }
}

.import-mode {

}
.import-tip {
  list-style-type: square;
  list-style-position: inside;
  padding-top: 20px;
  color: var(--color-text-3);
  line-height: 22px;
}
::v-deep .import-upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
