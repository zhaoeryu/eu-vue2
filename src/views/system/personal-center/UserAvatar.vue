<template>
  <div class="user-avatar">
    <div class="user-avatar-img" @click="onUploadAvatar">
      <el-avatar shape="square" :size="100" :src="avatar"></el-avatar>
    </div>
    <el-dialog :title="$t('personal-center.UpdateAvatar.title')" :visible.sync="dialogVisible" width="800px" @opened="modalOpened"  @close="closeDialog" custom-class="user-avatar-upload-dialog">
      <el-row>
        <el-col :span="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            :outputType="options.outputType"
            :maxImgSize="210"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :span="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex;">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            style="margin-right: 30px;"
            accept="image/*"
          >
            <el-button style="width: 150px;">
              {{ $t('personal-center.UpdateAvatar.trigger') }}
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
          <el-button icon="el-icon-plus" @click="changeScale(1)"></el-button>
          <el-button icon="el-icon-minus" @click="changeScale(-1)"></el-button>
          <el-button icon="el-icon-refresh-left" @click="rotateLeft()"></el-button>
          <el-button icon="el-icon-refresh-right" @click="rotateRight()"></el-button>
        </div>
        <div style="flex: 1;">
          <el-button @click="dialogVisible = false">{{ $t('general.form.cancel') }}</el-button>
          <el-button :loading="formLoading" type="primary" @click="onSave">{{ $t('general.form.submit') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import { mapGetters } from 'vuex'
import { uploadAvatar } from '@/api/system/user'
import { uploadFile } from '@/api/upload'
import { dataURLtoFile } from '@/utils'

export default {
  name: 'UserAvatar',
  components: { VueCropper },
  data() {
    return {
      formLoading: false,
      dialogVisible: false,
      options: {
        //裁剪图片的地址
        img: null,
        // 是否默认生成截图框
        autoCrop: true,
        // 默认生成截图框宽度
        autoCropWidth: 200,
        // 默认生成截图框高度
        autoCropHeight: 200,
        // 固定截图框大小 不允许改变
        fixedBox: true,
        // 默认生成截图为PNG格式
        outputType: 'png'
      },
      previews: {},
      // 是否显示cropper
      visible: false,
      resizeHandler: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    avatar() {
      return this.user && this.user.avatar || require('@/assets/images/default_avatar.png')
    }
  },
  methods: {
    onUploadAvatar() {
      this.options.img = this.avatar
      this.dialogVisible = true
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true;
    },
    // 刷新组件
    refresh() {
      this.$refs.cropper.refresh();
    },
    realTime(data) {
      this.previews = data;
    },
    // 关闭窗口
    closeDialog() {
      this.visible = false;
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf('image/') === -1) {
        this.$message.error(this.$t('personal-center.UpdateAvatar.format'));
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    onSave() {
      this.formLoading = true
      this.$refs.cropper.getCropData((data) => {
        const formData = new FormData();
        formData.append('file', dataURLtoFile(data, 'avatar.png'));
        uploadFile(formData).then(res => {
          uploadAvatar({
            avatar: res.link
          }).then(() => {
            this.$message.success(this.$t('personal-center.UpdateAvatar.success'))
            this.$store.dispatch('user/GetInfo')
            this.dialogVisible = false
          }).finally(() => {
            this.formLoading = false
          })
        }).catch(() => {
          this.formLoading = false
        })
      })
    }
  }
}

</script>

<style lang='scss' scoped>
.user-avatar {
  .user-avatar-img {
    position: relative;
    cursor: pointer;
    height: 100px;
    width: 100px;
    &:hover:before {
      content: '+';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #00000080;
      border-radius: 4px;
      line-height: 100px;
      width: 100px;
      text-align: center;
      color: #fff;
      font-size: 40px;
    }
  }
  .avatar-upload-preview {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 4px;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;
  }
}

::v-deep .user-avatar-upload-dialog {
  .el-dialog__footer {
    display: flex;
  }
}
</style>
