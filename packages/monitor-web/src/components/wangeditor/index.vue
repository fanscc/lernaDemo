<template>
  <div>
    <div ref="editor" class="editor" />
  </div>
</template>

<script>
import E from "wangeditor";
import { getsearchGroup, uploadWangEditor } from "@/api/aliOss/getSignature";
export default {
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
      action_url: "",
      details: ""
    };
  },
  mounted() {
    const editor = new E(this.$refs.editor);
    editor.customConfig.zIndex = 1;
    editor.customConfig.customAlert = info => {
      // info 是需要提示的内容
      this.$message.error(info);
    };
    editor.customConfig.onchange = html => {
      this.details = html;
      this.$emit("editorChild", this.details);
    };
    editor.customConfig.customUploadImg = (files, insert) => {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      this.beforeAvatarUpload(files)
        .then(formData => {
          uploadWangEditor(this.action_url, formData)
            .then(() => {
              // 上传代码返回结果之后，将图片插入到编辑器中
              this.$message.success("图片上传成功");
              insert(`/base/org/1/file?file=${this.formData.key}`);
            })
            .catch(() => {
              this.$message.error("图片上传失败");
            });
        })
        .catch(() => {
          this.$message.error("获取上传签名失败");
        });
    };
    editor.create();
  },
  methods: {
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
