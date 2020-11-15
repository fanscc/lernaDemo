<template>
  <div class="taskManag">
    <h3>创建任务</h3>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      style="margin-top: 6px;"
      label-width="100px"
    >
      <el-form-item label="任务标题:" prop="title">
        <el-input v-model="form.title" style="width: 40%" />
      </el-form-item>
      <el-form-item label="任务类型:" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="1" name="type">
            扫码
          </el-checkbox>
          <el-checkbox label="2" name="type">
            拍照
          </el-checkbox>
          <el-checkbox label="3" name="type">
            打卡
          </el-checkbox>
          <el-checkbox label="4" name="type">
            其他
          </el-checkbox>
        </el-checkbox-group></el-form-item
      >
      <el-form-item label="操作要求:" prop="content" class="fuwenben">
        <div ref="editor" class="editor" />
      </el-form-item>
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
          >保存</el-button
        >
      </p>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      class="choose_user_dialog"
      title="提示"
      width="80%"
    >
      <chooserUserTable :choose_user="true" @chooseUser="chooseUser" />
    </el-dialog>
  </div>
</template>

<script>
import chooserUserTable from "../system/user/index";
import E from "wangeditor";
import mapState from "@/store/index";
import { addtask, edittask, looktask } from "@/api/task";
import { Loading } from "element-ui";
export default {
  components: {
    chooserUserTable
  },
  data() {
    return {
      loading: false,
      form: { title: "", content: "", type: [] },
      tos: [
        {
          value: ""
        }
      ],
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        type: [
          { required: true, message: "任务类型不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "操作要求不能为空", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      typePage: "add" // 判断是否是编辑页面
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
  created() {},
  mounted() {
    this.typePage = this.$route.query.id ? "edit" : "add";
    const editId = this.$route.query.id;
    const editor = new E(this.$refs.editor);
    // editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
    // 不可修改
    editor.config.uploadImgHeaders = this.headers;
    // 自定义文件名，不可修改，修改后会上传失败
    // editor.customConfig.uploadFileName = 'file'
    // 上传到哪儿，按需选择
    // editor.customConfig.uploadImgServer = this.imagesUploadApi // 上传图片到服务器
    editor.config.onchange = html => {
      this.form.content = html;
    };
    editor.create();
    if (editId) {
      // 编辑页面
      const loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      looktask(editId)
        .then(res => {
          this.form.title = res.result.title;
          this.form.content = res.result.content;
          this.form.type = res.result.type.split(",");
          editor.txt.html(this.form.content);
        })
        .finally(() => {
          loadingInstance.close();
        });
    }
  },
  methods: {
    chooseUser(val) {
      this.dialogVisible = false;
      const userArr = val.map(item => item.username);
      this.form.user = userArr.join(",");
    },
    doSubmit() {
      /** *
       * 新增任务
       */
      this.$refs["form"].validate(valid => {
        if (valid) {
          const params = {
            title: this.form.title,
            content: this.form.content,
            type: this.form.type.join(",")
          };
          const getApi = {
            add: addtask,
            edit: edittask
          };
          if (this.typePage === "edit") {
            // 编辑页面
            const editId = this.$route.query.id;
            getApi[this.typePage](editId, params).then(() => {
              this.$notify({
                title: "编辑成功",
                type: "success",
                duration: 2500
              });
              this.$router.push({ path: "/taskManagement/taskList" });
            });
          } else {
            getApi[this.typePage](params).then(() => {
              this.$notify({
                title: "新建成功",
                type: "success",
                duration: 2500
              });
              this.$router.push({ path: "/taskManagement/taskList" });
            });
          }
        } else {
          return false;
        }
      });
    },
    goBack() {
      const view = { path: this.$route.path };
      const toPath = { path: "/taskManagement/taskList" };
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
.fuwenben {
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
    margin-top: 20px;
  }
}
</style>
