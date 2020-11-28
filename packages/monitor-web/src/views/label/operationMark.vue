<template>
  <el-dialog
    class="operationDialog"
    :title="id ? '操作详情' : '新增操作'"
    center
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="handleClose"
  >
    <div>
      <p v-if="type === 'detail'">这是一段信息</p>
      <el-input
        v-else
        type="textarea"
        :rows="4"
        placeholder="操作内容"
        v-model="dataFrom.conten"
      >
      </el-input>
      <div v-if="type === 'detail'">
        <img style="max-width: 500px;" src="~@/assets/logo/logo.png" alt="" />
      </div>
      <div style="margin-top: 20px;">
        <uploadPic
          v-if="dialogVisible"
          :multiple="true"
          @remove="remove"
          v-model="picName"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-if="type !== 'detail'" type="primary" @click="save"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import uploadPic from "@/components/uploadpic/upload";
export default {
  name: "operationMark",
  components: {
    uploadPic
  },
  data() {
    return {
      dialogVisible: false,
      id: "",
      type: "detail",
      picName: "",
      dataFrom: {
        conten: "",
        picName: ""
      }
    };
  },
  watch: {
    picName(val) {
      if (val) {
        this.dataFrom.picName += "," + val;
      }
    }
  },
  methods: {
    open(id = "") {
      this.dialogVisible = true;
      this.id = id;
      this.type = this.id ? "detail" : "add";
    },
    handleClose(done) {
      done();
    },
    remove(file) {
      // 删除
      let picArr = this.dataFrom.picName.split(",");
      for (let i = 0; i < picArr.length; i++) {
        let item = picArr[i];
        if (!item) continue;
        if (item.indexOf(file.name) !== -1) {
          picArr.splice(i, 1);
          this.dataFrom.picName = picArr.join(",");
          return;
        }
      }
    },
    save() {
      this.dataFrom.picName = this.dataFrom.picName.substring(1);
      console.log(this.dataFrom);
    }
  }
};
</script>

<style lang="scss" scoped>
.operationDialog {
  & /deep/ .el-dialog {
    height: 78%;
    overflow: auto;
  }
}
</style>
