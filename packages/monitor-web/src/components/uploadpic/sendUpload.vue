<template>
  <div>
    <el-button :disabled="loading" type="primary" @click="upload"
      >发送图片</el-button
    >
    <input
      ref="fileDom"
      type="file"
      name="file"
      style="display: none"
      @change="change"
    />
  </div>
</template>

<script>
import { getsearchGroup, uploadWangEditor } from "@/api/aliOss/getSignature";
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        key: "",
        policy: "",
        success_action_status: "200",
        OSSAccessKeyId: "",
        callback: "",
        signature: "",
        name: ""
      },
      action_url: ""
    };
  },
  methods: {
    upload() {
      this.$refs.fileDom.click();
    },
    change(file) {
      const files = file.target.files;
      // 判断只能发送图片
      const imgArr = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!imgArr.includes(files[0].type)) {
        this.$message.warning("只能发送图片");
        return;
      }
      if (files) {
        const imgItem = {
          type: 2,
          name: "专家A",
          text: window.URL.createObjectURL(files[0]),
          coontenType: 2,
          status: 1
        };
        this.$emit("change", files[0], imgItem);
        this.beforeAvatarUpload(files)
          .then(formData => {
            uploadWangEditor(this.action_url, formData, this.onUploadProgress)
              .then(() => {
                this.$emit(
                  "success",
                  `/base/org/1/file?file=${this.formData.key}`,
                  imgItem
                );
                this.$refs.fileDom.value = "";
              })
              .catch(() => {
                this.$message.error("图片上传失败,请稍后再试");
                this.$emit("error", imgItem);
              });
          })
          .catch(() => {
            this.$message.error("获取上传签名失败,请稍后再试");
            this.$emit("error", imgItem);
          });
      }
    },
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        const val = Number(
          ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)
        );
        this.$emit("input", val);
      }
    },
    // 获取签名
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        getsearchGroup("gate").then(res => {
          if (res.code === 0) {
            const datas = res.result;
            this.formData.key = `${datas.dir}/${file[0].name}_${+new Date()}`;
            this.formData.policy = datas.policy;
            this.formData.OSSAccessKeyId = datas.accessId;
            this.formData.signature = datas.signature;
            this.formData.name = file[0].name;
            this.action_url = datas.host;
            const formData = new FormData();
            Object.keys(this.formData).forEach(key => {
              formData.append(key, this.formData[key]);
            });
            formData.append("file", file[0], file.name);
            resolve(formData);
          } else {
            reject();
          }
        });
      });
    }
  }
};
</script>
