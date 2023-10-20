<template>
  <div class="page-container">
    <div class="page-body">
      <m-block-header title="字典mixins" />
      <ul>
        <li v-for="(item, index) in dict.dict['job_group']" :key="index">{{ item.label }} - {{ item.value }}</li>
      </ul>
      <m-block-header title="点击上传文件" />
      <upload-file
        v-model="file"
        upload-api="/api/upload/uploadFile"
        :multiple="true"
        :limit="10"
        tip="单个文件不超过10MB"
      />

      <m-block-header title="用户头像上传" />
      <upload-file
        v-model="image"
        upload-api="/api/upload/uploadFile"
        :show-file-list="false"
        :single-mode="true"
        accept="image/*"
        list-type="picture-avatar"
      >
        <template #trigger>
          <img v-if="image" :src="image" alt="" class="avatar">
          <i v-else class="el-icon-plus"></i>
        </template>
      </upload-file>

      <m-block-header title="文件缩略图" />
      <upload-file
        v-model="imageList"
        upload-api="/api/upload/uploadFile"
        :multiple="true"
        accept="image/*"
        :limit="10"
        list-type="picture-card">
        <template #trigger>
          <i class="el-icon-plus"></i>
        </template>
      </upload-file>

      <m-block-header title="上传文件列表控制" />
      <upload-file
        v-model="file"
        upload-api="/api/upload/uploadFile"
        :multiple="true"
        :limit="10"
        tip="单个文件不超过10MB"
        list-type="picture"
      />

      <m-block-header title="拖拽上传" />
      <upload-file
        v-model="file"
        upload-api="/api/upload/uploadFile"
        :multiple="true"
        :limit="10"
        tip="单个文件不超过10MB"
        drag
      >
        <template #trigger>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </template>
      </upload-file>

      <m-block-header title="单文件上传" />
      <upload-file
        v-model="file"
        upload-api="/api/upload/uploadFile"
        :single-mode="true"
        :limit="10"
        tip="单个文件不超过10MB"
      />
    </div>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'

export default {
  name: 'index',
  dicts: ['job_group'],
  components: { UploadFile },
  data() {
    return {
      file: null,
      image: null,
      imageList: null
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
