<script>
import { add, update } from '@/api/system/job'
import i18n from '@/plugins/i18n'

export default {
  name: 'JobEditDialog',
  data() {
    return {
      show: false,

      // 执行方式：0：springBean，1：class
      invokeMode: 'springBean',
      formLoading: false,
      form: {
        jobName: null,
        jobGroup: null,
        cron: null,
        invokeClassName: null,
        springBeanName: null,
        methodName: null,
        methodParams: null,
        status: 0,
        misfirePolicy: 0,
        concurrent: 0,
        pauseAfterFailure: 0,
        alarmEmail: null
      },
      rules: {
        jobName: [
          { required: true, message: i18n.t('job.edit.form.jobName.required'), trigger: 'blur' }
        ],
        jobGroup: [
          { required: true, message: i18n.t('job.edit.form.jobGroup.required'), trigger: 'blur' }
        ],
        cron: [
          { required: true, message: i18n.t('job.edit.form.cron.required'), trigger: 'blur' }
        ],
        invokeClassName: [
          { required: true, message: i18n.t('job.edit.form.invokeClassName.required'), trigger: 'blur' }
        ],
        springBeanName: [
          { required: true, message: i18n.t('job.edit.form.springBeanName.required'), trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: i18n.t('job.edit.form.methodName.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: i18n.t('job.edit.form.status.required'), trigger: 'blur' }
        ],
        misfirePolicy: [
          { required: true, message: i18n.t('job.edit.form.misfirePolicy.required'), trigger: 'blur' }
        ],
        concurrent: [
          { required: true, message: i18n.t('job.edit.form.concurrent.required'), trigger: 'blur' }
        ],
        pauseAfterFailure: [
          { required: true, message: i18n.t('job.edit.form.pauseAfterFailure.required'), trigger: 'blur' }
        ],
      },
    }
  },
  computed: {
    title() {
      return this.form.id ? this.$t('job.edit.title') : this.$t('job.add.title')
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.form = Object.assign(this.form, row)
      this.show = true
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }

        this.formLoading = true
        const reqPromise = this.form.id ? update(this.form) : add(this.form)
        reqPromise.then(() => {
          this.$message.success(this.form.id ? this.$t('job.edit.success') : this.$t('job.add.success'))
          this.show = false
          this.$emit('complete')
        }).finally(() => {
          this.formLoading = false
        })
      })
    },
    onDialogOpen() {
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
  }
}
</script>

<template>
  <el-dialog :title="title" :visible.sync="show" width="800px" :close-on-click-modal="false" @open="onDialogOpen">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" :hide-required-asterisk="true">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.jobName')" prop="jobName">
            <el-input v-model="form.jobName" :placeholder="$t('job.edit.form.jobName.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.jobGroup')" prop="jobGroup">
            <el-input v-model="form.jobGroup" :placeholder="$t('job.edit.form.jobGroup.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.cron')" prop="cron">
            <el-input v-model="form.cron" :placeholder="$t('job.edit.form.cron.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">{{ $t('job.edit.form.status.normal') }}</el-radio>
              <el-radio :label="1">{{ $t('job.edit.form.status.stopped') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.invokeMode')" style="height: 32px;">
            <el-radio-group v-model="invokeMode">
              <el-radio-button label="springBean">SpringBean</el-radio-button>
              <el-radio-button label="class">Class</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="invokeMode === 'springBean'" :span="12">
          <el-form-item label="SpringBean" prop="springBeanName">
            <el-input v-model="form.springBeanName" :placeholder="$t('job.edit.form.springBeanName.placeholder')" maxlength="64" />
          </el-form-item>
        </el-col>
        <el-col v-else-if="invokeMode === 'class'" :span="12">
          <el-form-item label="Class" prop="invokeClassName">
            <el-input v-model="form.invokeClassName" :placeholder="$t('job.edit.form.invokeClassName.placeholder')" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.methodName')" prop="methodName">
            <el-input v-model="form.methodName" :placeholder="$t('job.edit.form.methodName.placeholder')" maxlength="64" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.methodParams')" prop="methodParams">
            <el-input v-model="form.methodParams" :placeholder="$t('job.edit.form.methodParams.placeholder')" maxlength="512" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('job.edit.form.misfirePolicy')" prop="misfirePolicy">
        <el-radio-group v-model="form.misfirePolicy">
          <el-radio :label="0">{{ $t('job.edit.form.misfirePolicy.default') }}</el-radio>
          <el-radio :label="1">{{ $t('job.edit.form.misfirePolicy.fireNow') }}</el-radio>
          <el-radio :label="2">{{ $t('job.edit.form.misfirePolicy.fireOnce') }}</el-radio>
          <el-radio :label="3">{{ $t('job.edit.form.misfirePolicy.ignore') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('job.edit.form.alarmEmail')" prop="alarmEmail">
            <el-input v-model="form.alarmEmail" :placeholder="$t('job.edit.form.alarmEmail.placeholder')" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('job.edit.form.concurrent')" prop="concurrent">
            <el-switch v-model="form.concurrent" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('job.edit.form.pauseAfterFailure')" prop="pauseAfterFailure">
            <el-switch v-model="form.pauseAfterFailure" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('general.form.cancel') }}</el-button>
      <el-button :loading="formLoading" class="eu-submit-btn" type="primary" @click="onSubmit">{{ $t('general.form.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
