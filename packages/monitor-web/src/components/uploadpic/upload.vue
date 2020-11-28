<template>
  <div>
    <el-upload
      ref="upload"
      :before-upload="beforeAvatarUpload"
      :on-success="success_method"
      :action="action_url"
      :data="formData"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :class="[formData.key !== '' && !multiple ? 'dispalyHidden' : '']"
      class="upload_style"
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal="modeSHow" size="tiny">
      <img :src="dialogImageUrl" width="100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { getsearchGroup } from "@/api/aliOss/getSignature";
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    addMacId: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      formData: {
        key: "",
        policy: "",
        success_action_status: "200",
        OSSAccessKeyId: "",
        callback: "",
        signature: "",
        name: ""
      },
      modeSHow: false,
      action_url: ""
    };
  },
  methods: {
    // 获取签名
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        getsearchGroup("gate").then(res => {
          if (res.code === 0) {
            const datas = res.result;
            this.formData.key = `${datas.dir}/${file.name}_${+new Date()}`;
            this.formData.policy = datas.policy;
            this.formData.OSSAccessKeyId = datas.accessId;
            this.formData.signature = datas.signature;
            this.formData.name = file.name;
            this.action_url = datas.host;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    success_method() {
      const picName = `${this.formData.key}`;
      console.log(1, picName);
      this.$emit("input", picName);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.formData.key = "";
      this.$emit("input", "");
      this.$emit("remove", file);
    }
  }
};
</script>
<style lang="scss" scoped>
.hidden_input {
  display: none;
}
.upload_style {
  & /deep/ div.el-upload {
    width: 88px;
    height: 88px;
    line-height: 88px;
  }
}
.dispalyHidden {
  & /deep/ div.el-upload {
    display: none;
  }
}
</style>
