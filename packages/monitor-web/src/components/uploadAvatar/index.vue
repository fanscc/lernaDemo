<template>
  <div>
    <div class="avatar-uploader-wrap">
      <!-- step1 -->
      <div
        class="avatar-uploader__choose avatar-uploader_left"
        v-show="!photo && !isSuccess"
      >
        <button class="avatar-uploader_left__btn" @click="handleClick">
          +选择图片
        </button>
        <p>只支持JPG,PNG,GIF,大小不超过5M</p>
        <input
          type="file"
          v-show="false"
          ref="fileinput"
          accept=".jpg, .jpeg, .png, .gif"
          @change="handleChange"
        />
      </div>
      <!-- step2 -->
      <div class="avatar-uploader__edit" v-show="photo || isSuccess">
        <div class="avatar-uploader_left avatar-uploader__edit-area">
          <vueCropper
            ref="cropper"
            :img="cropper.img"
            :info="false"
            :autoCrop="cropper.autoCrop"
            :fixedBox="cropper.fixedBox"
            @realTime="realTime"
            :outputType="cropper.outputType"
            :fixed="cropper.fixed"
            :fixedNumber="cropper.fixedNumber"
          ></vueCropper>
        </div>
        <input
          type="file"
          v-show="false"
          ref="fileinput"
          accept=".jpg, .jpeg, .png, .gif"
          @change="handleChange"
        />
        <button class="avatar-uploader_left__btn" @click="handleClick">
          +重新选择
        </button>
        <button class="avatar-uploader_left__btn" @click="rotateRight">
          +旋转90°
        </button>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button
        type="primary"
        size="mini"
        @click="summitAvata()"
        :disabled="!cropper.img"
        :loading="loading"
        >{{ initUpload ? "上传" : "重新上传" }}</el-button
      >
    </div>
  </div>
</template>

<script>
import vueCropper from "vue-cropper";
import { getsearchGroup, uploadWangEditor } from "@/api/aliOss/getSignature";
export default {
  props: {
    // 用户当前头像的url
    photo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      cropper: {
        img: this.photo,
        autoCrop: true,
        fixedBox: false,
        fixed: true,
        fixedNumber: [1.8, 1],
        outputType: "png"
      },
      isSuccess: false,
      previews: {},
      formData: {},
      action_url: "",
      initUpload: true,
      loading: false
      // step: 2
    };
  },
  components: {
    vueCropper
  },
  methods: {
    handleClick(e) {
      if (e.target !== this.$refs.fileinput) {
        e.preventDefault();
        if (document.activeElement !== this.$refs) {
          this.$refs.fileinput.click();
        }
      }
    },
    // 检测选择的文件是否合适
    checkFile(file) {
      // 仅限图片
      if (file.type.indexOf("image") === -1) {
        this.$message({
          message: "请选择合适的文件类型",
          type: "warning"
        });
        return false;
      }
      // 超出大小
      if (file.size / 1024 > 30120) {
        this.$message({
          message: "图片大小超出30MB，请重新选择",
          type: "warning"
        });
        return false;
      } else {
        // console.log((file.size / 1024).toFixed(1) + 'KB')
      }
      return true;
    },
    // 设置图片源
    setSourceImg(file) {
      let that = this;
      let fr = new FileReader();
      fr.onload = function() {
        that.cropper.img = fr.result;
      };
      fr.readAsDataURL(file);
    },
    // 触发input框的change事件选择图片
    handleChange(e) {
      e.preventDefault();
      let files = e.target.files || e.dataTransfer.files;
      console.log(this.$refs);
      this.$refs.cropper.rotate = 0; //重置要裁剪的图片的旋转角度
      this.isSuccess = true;
      if (this.checkFile(files[0])) {
        this.setSourceImg(files[0]);
      }
    },
    // 点击向右旋转
    rotateRight(e) {
      e.preventDefault();
      this.$refs.cropper.rotateRight();
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    },
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        getsearchGroup("gate").then(res => {
          if (res.code === 0) {
            const datas = res.result;
            this.formData.key = `${datas.dir}/grouping_${+new Date()}`;
            this.formData.policy = datas.policy;
            this.formData.OSSAccessKeyId = datas.accessId;
            this.formData.signature = datas.signature;
            this.formData.name = "grouping";
            this.action_url = datas.host;
            const formData = new FormData();
            Object.keys(this.formData).forEach(key => {
              formData.append(key, this.formData[key]);
            });
            formData.append("file", file, "grouping");
            resolve(formData);
          } else {
            reject();
          }
        });
      });
    },
    uploadAvatar(data) {
      this.beforeAvatarUpload(data).then(formData => {
        uploadWangEditor(this.action_url, formData)
          .then(() => {
            this.$message.success("图片上传成功");
            this.loading = false;
            this.initUpload = false;
            this.$emit("input", `${this.formData.key}`);
          })
          .catch(() => {
            this.loading = false;
            this.$message.error("图片上传失败,请稍后再试");
          });
      });
    },
    //点击确定上传裁剪完的头像图片（blob类型）
    summitAvata() {
      this.loading = true;
      this.$refs.cropper.getCropBlob(data => {
        this.uploadAvatar(data);
      });
    }
    /* -------------------------------头像上传组件end--------------------------------*/
  },
  watch: {
    // 实时预览
    previews: function() {
      this.$refs.cropper.getCropData(data => {
        this.previews.url = data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$area-height: 280px;
.avatar-uploader {
  &-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }
  &_left {
    height: $area-height;
    width: 450px;
    font-size: 13px;
    color: #999999;
    position: relative;
    background: #ecf2f6;
    &__btn {
      color: #999999;
      width: 88px;
      height: 34px;
      border: none;
      background: #fff;
      outline: none;
      border: 1px solid #cecece;
      border-radius: 82px;
    }
  }
  &__choose {
    p {
      margin-top: 56%;
      width: 100%;
      text-align: center;
    }
    button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &__edit {
    &-area {
      overflow: hidden;
      &-img {
        object-fit: cover;
      }
    }
    button {
      margin-top: 13px;
    }
    button:last-child {
      float: right;
    }
  }
  $top: 30px;
  &__preview {
    background: #ecf2f6;
    text-align: center;
    width: 158px;
    padding-top: $top;
    height: $area-height - $top;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 13px;
    &-title {
      color: #999999;
    }
    img {
      background: #fff;
      margin-top: 5px;
      border-radius: 500px;
    }
    &-120 {
      height: 60px;
      width: 60px;
    }
    &-65 {
      height: 45px;
      width: 45px;
    }
    &-40 {
      height: 30px;
      width: 30px;
    }
  }
}
</style>

<style lang="scss" scoped>
// 小的弹窗用el-messagebox，大弹窗有复杂交互的用el-dialog
// 弹窗（el-dialog）样式修改
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
