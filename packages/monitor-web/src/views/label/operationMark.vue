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
        v-model="dataFrom.detail"
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
          v-model="images"
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
import { addBaseThingRecord, editBaseThingRecord } from "@/api/label/index";
export default {
  name: "operationMark",
  components: {
    uploadPic
  },
  data() {
    return {
      dialogVisible: false,
      type: "detail",
      images: "",
      dataFrom: {
        thingId: "",
        detail: "",
        images: "",
        recordTime: "2020-10-11"
      }
    };
  },
  watch: {
    images(val) {
      if (val) {
        this.dataFrom.images += "," + val;
      }
    }
  },
  methods: {
    open(thingId = "", row = {}) {
      this.dialogVisible = true;
      this.dataFrom.thingId = thingId;
      this.type = row.id ? "detail" : "add";
    },
    handleClose(done) {
      done();
    },
    remove(file) {
      // 删除
      let picArr = this.dataFrom.images.split(",");
      for (let i = 0; i < picArr.length; i++) {
        let item = picArr[i];
        if (!item) continue;
        if (item.indexOf(file.name) !== -1) {
          picArr.splice(i, 1);
          this.dataFrom.images = picArr.join(",");
          return;
        }
      }
    },
    save() {
      this.dataFrom.images = this.dataFrom.images.substring(1);
      console.log(this.dataFrom);
      addBaseThingRecord(this.dataFrom).then(() => {
        this.$message.success("操作记录新增成功");
        this.dialogVisible = false;
        this.$emit("refresh");
      });
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
