<template>
  <div class="taskManag">
    <el-form
      ref="form"
      :model="form"
      style="margin-top: 6px;"
      label-width="100px"
    >
      <el-form-item label="任务标题:" prop="title">
        <span>{{ form.title }}</span>
      </el-form-item>
      <el-form-item label="任务类型:">
        <span>{{ form.type | typeName }}</span>
      </el-form-item>
      <p class="actionTitle">操作要求:</p>
      <div style="padding-left: 100px;" v-html="form.content" />
      <p class="actionTitle">完成描述:</p>
      <div ref="editor" class="editor" />
      <!-- <el-form-item label="处理人" prop="user">
        <el-input v-model="form.user" readonly="readonly" style="width: 40%"/>
        <el-button style="margin-left:20px;" size="medium" type="primary" @click="dialogVisible=true">选择分配人</el-button>
      </el-form-item> -->
      <p class="footer_btn">
        <el-button style="margin-left:20px;" type="primary" @click="goBack"
          >取消</el-button
        >
        <el-button
          :loading="loading"
          style="margin-left:20px;"
          type="primary"
          @click="doSubmit"
          >提交</el-button
        >
      </p>
    </el-form>
  </div>
</template>

<script>
import E from "wangeditor";
import mapState from "@/store/index";
import { looktask, goTaskResult, UpDataTaskResult } from "@/api/task";
import { Loading } from "element-ui";
export default {
  name: "ByEdit",
  filters: {
    typeName(val) {
      const objs = {
        "1": "扫码",
        "2": "拍照",
        "3": "打卡",
        "4": "其他"
      };
      if (val) {
        const valArr = val.split(",");
        let str = "";
        valArr.map(o => {
          str += objs[o] + ",";
        });
        return str.substring(0, str.length - 1);
      }
      return "";
    }
  },
  data() {
    return {
      loading: false,
      editId: "", // 那个任务id
      form: { title: "", content: "", type: "" },
      details: "",
      state: "", // 状态判断是否是修改接口
      dialogVisible: false
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const rolesArr = mapState.getters.roles;
      if (!rolesArr.includes("ADMIN")) {
        vm.$router.replace({ path: "/401" });
      }
    });
  },
  computed: {},
  mounted() {
    const editor = new E(this.$refs.editor);
    this.editId = this.$route.query.id;
    editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
    // 不可修改
    editor.customConfig.uploadImgHeaders = this.headers;
    // 自定义文件名，不可修改，修改后会上传失败
    // editor.customConfig.uploadFileName = 'file'
    // 上传到哪儿，按需选择
    // editor.customConfig.uploadImgServer = this.imagesUploadApi // 上传图片到服务器
    editor.customConfig.onchange = html => {
      this.details = html;
    };
    editor.create();
    const loadingInstance = Loading.service({
      fullscreen: true,
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.5)"
    });
    looktask(this.editId)
      .then(res => {
        this.form.title = res.result.title;
        this.form.content = res.result.content;
        this.form.type = res.result.type || "";
        this.state = res.result.state;
        editor.txt.html(res.result.detail);
      })
      .finally(() => {
        loadingInstance.close();
      });
  },
  methods: {
    chooseUser(val) {
      this.dialogVisible = false;
      const userArr = val.map(item => item.username);
      this.form.user = userArr.join(",");
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const params = {
            taskId: this.editId,
            detail: this.details
          };
          let Api = null;
          if (this.state === 2) {
            delete params.taskId;
            Api = UpDataTaskResult(this.editId, params);
          } else {
            Api = goTaskResult(params);
          }
          Api.then(() => {
            this.$notify({
              title: "提交成功",
              type: "success",
              duration: 2500
            });
            this.$router.push({ path: "/taskManagement/taskManagement" });
          });
        } else {
          return false;
        }
      });
    },
    goBack() {
      const view = { path: "/taskManagementIndex/byEdit" };
      const toPath = { path: "/taskManagement/taskManagement" };
      this.$utils.closeTag(view, toPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.taskManag {
  width: 1000px;
  h3 {
    margin-left: 20px;
  }
  .footer_btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .choose_user_dialog {
    z-index: 10001 !important;
    .el-dialog {
      min-width: 800px;
      height: 80%;
      overflow: auto;
    }
  }
}
.actionTitle {
  width: 100px;
  text-align: right;
  padding-right: 12px;
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}
.editor {
  text-align: left;
  margin: 20px;
}
</style>
