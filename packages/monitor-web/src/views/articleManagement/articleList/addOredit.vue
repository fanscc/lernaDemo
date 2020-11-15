<template>
  <div class="addOredit" style="margin-bottom: 50px">
    <h3 class="mg_L20">编写文章</h3>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      style="margin-top: 6px;"
      label-width="100px"
    >
      <el-form-item label="文章标题:" prop="title">
        <el-input v-model="form.title" style="width: 300px" />
      </el-form-item>
      <el-form-item label="作者姓名:" prop="author">
        <el-input v-model="form.author" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="发表时间:" prop="publishTs">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          v-model="form.publishTs"
          style="width: 300px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="优先级:" prop="priority">
        <el-input-number
          style="width: 300px;"
          :min="0"
          :max="999"
          controls-position="right"
          v-model.number="form.priority"
        />
      </el-form-item>
      <el-form-item label="文章分类:" prop="category">
        <el-select
          v-model="form.category"
          placeholder="请选择"
          style="width: 300px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章图片:">
        <el-upload
          class="avatar-uploader"
          :action="action_url"
          :data="formData"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUploadForThumbnail"
        >
          <img v-if="form.thumbnail" :src="form.thumbnail" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容:" class="fuwenben">
        <div ref="editor" class="editor" style="width: 1000px;" />
      </el-form-item>
    </el-form>
    <el-button :loading="loading" type="primary" @click="save" class="mg_L160"
      >保存</el-button
    >
    <el-button @click="$router.go(-1)" class="mg_L160">返回</el-button>
  </div>
</template>

<script>
import E from "wangeditor";
import { getsearchGroup, uploadWangEditor } from "@/api/aliOss/getSignature";
import {
  articleInsert,
  articleSelectOne,
  articleUpdate
} from "../../../api/articleManagement";
import { initData } from "../../../api/data";
export default {
  name: "addOreditName",
  data() {
    return {
      loading: false,
      initContent: "",
      form: { priority: 1 },
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
      options: [],
      rules: {
        author: [{ required: true, message: "作者不能为空", trigger: "blur" }],
        publishTs: [
          { required: true, message: "日期不能为空", trigger: "change" }
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        priority: [
          { required: true, message: "优先级不能为空", trigger: "change" }
        ],
        category: [
          { required: true, message: "分类不能为空", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    initData("/cms/category").then(res => {
      this.options = [...res.result];
    });
    let editor = new E(this.$refs.editor);
    const editId = this.$route.query.id;
    editor.config.uploadImgServer = this.action_url; // 上传图片到服务器
    editor.config.customUploadImg = (files, insert) => {
      // insert 是获取图片 url 后，插入到编辑器的方法
      this.beforeAvatarUpload(files)
        .then(formData => {
          uploadWangEditor(this.action_url, formData, this.onUploadProgress)
            .then(() => {
              insert(`/base/org/1/file?file=${this.formData.key}`);
            })
            .catch(() => {
              this.$message.error("图片上传失败,请稍后再试");
            });
        })
        .catch(() => {
          this.$message.error("获取上传签名失败,请稍后再试");
        });
    };
    editor.config.onchange = html => {
      this.form.content = html;
    };
    editor.create();
    if (editId) {
      console.log(editId);
      articleSelectOne(editId).then(res => {
        this.form = { ...res.result };
        editor.txt.html(this.form.content);
      });
    }
  },
  methods: {
    handleAvatarSuccess() {
      this.form.thumbnail = `/base/org/1/file?file=${this.formData.key}`;
      this.form = Object.assign({}, this.form);
    },
    async beforeAvatarUploadForThumbnail(file) {
      await this.beforeAvatarUpload([file]);
      return true;
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
    },
    save: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.$route.query.id) {
            delete this.form["createTs"];
            delete this.form["delFlag"];
            delete this.form["revision"];
            delete this.form["creator"];
            articleUpdate(this.form)
              .then(() => {
                this.$notify({
                  title: "修改成功",
                  type: "success",
                  duration: 2500
                });
                this.loading = false;
                this.$route.push({ path: "/articleManagement/articleList" });
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            articleInsert(this.form)
              .then(() => {
                this.$notify({
                  title: "添加成功",
                  type: "success",
                  duration: 2500
                });
                this.loading = false;
                this.$route.push({ path: "/articleManagement/articleList" });
              })
              .catch(() => {
                this.loading = false;
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.fuwenben {
  & /deep/ .el-form-item__content {
    z-index: 0;
  }
}
.mg_L20 {
  margin-left: 20px;
}
.mg_L160 {
  margin-left: 160px;
}

/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
