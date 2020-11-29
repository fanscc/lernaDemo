<template>
  <el-dialog
    class="operationDialog"
    :title="
      type === 'detail' ? '操作详情' : type === 'add' ? '新增操作' : '编辑操作'
    "
    center
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="handleClose"
  >
    <div v-if="type === 'detail'">
      <el-button type="primary" @click="edit">修改</el-button>
    </div>
    <div>
      <p v-if="type === 'detail'">{{ dataFrom.detail }}</p>
      <el-input
        style="margin-top: 20px;"
        v-else
        type="textarea"
        :rows="4"
        placeholder="操作内容"
        v-model="dataFrom.detail"
      >
      </el-input>
      <div style="margin-top: 20px;">
        <span>操作时间:</span>
        <el-date-picker
          :disabled="type === 'detail'"
          v-model="dataFrom.recordTime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </div>
      <div style="margin-top: 20px;" v-if="type === 'detail'">
        <img
          v-for="(item, index) in imagesArr"
          :key="index"
          style="max-width: 500px;"
          :src="item.url"
          alt=" "
        />
      </div>
      <div style="margin-top: 20px;" v-else>
        <uploadPic
          v-if="dialogVisible"
          :multiple="true"
          @remove="remove"
          v-model="images"
          :file-list="imagesArr"
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
      imagesArr: [],
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
  computed: {},
  methods: {
    open(thingId = "", row = {}) {
      this.dialogVisible = true;
      this.dataFrom.thingId = thingId;
      this.type = row.id ? "detail" : "add";
      console.log(2, row);
      Object.keys(row).forEach(key => {
        this.dataFrom[key] = row[key];
        if (key === "images") {
          let imagesArr = (row.images && row.images.split(",")) || [];
          this.imagesArr = imagesArr.map(item => {
            return {
              url: `http://zckj.gudonger.com/base/org/1/file?file=${item}`,
              name: (item && item.split("/")[2]) || ""
            };
          });
        }
      });
    },
    handleClose(done) {
      this.images = "";
      Object.keys(this.dataFrom).forEach(key => {
        this.dataFrom[key] = "";
      });
      this.imagesArr = [];
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
    edit() {
      this.type = "edit";
    },
    save() {
      if (this.dataFrom.images.indexOf(",") === 0) {
        this.dataFrom.images = this.dataFrom.images.substring(1);
      }
      console.log(this.dataFrom);
      if (this.dataFrom.id) {
        editBaseThingRecord(this.dataFrom, this.dataFrom.id).then(() => {
          this.$message.success("操作记录更新成功");
          this.dialogVisible = false;
          this.$emit("refresh");
        });
      } else {
        addBaseThingRecord(this.dataFrom).then(() => {
          this.$message.success("操作记录新增成功");
          this.dialogVisible = false;
          this.$emit("refresh");
        });
      }
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
