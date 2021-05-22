<template>
  <el-dialog
    :title="areaId ? '编辑地块' : '新增地块'"
    class="addArea"
    :visible.sync="dialogVisible"
    width="800px"
    @closed="closed"
  >
    <span>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-table-expand"
      >
        <el-form-item label="区块名称:" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="区块面积:" prop="areaRegion">
          <span>{{ ruleForm.areaRegion }}</span>
        </el-form-item>
        <el-form-item label="区块颜色:" prop="color">
          <span>{{ ruleForm.color }}</span>
        </el-form-item>
        <el-form-item label="勾勒区域" prop="path">
          <el-button type="primary" @click="selecArea">{{
            ruleForm.path.length > 0 ? "重新选择区域" : "选择区域"
          }}</el-button>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveArea">确 定</el-button>
    </span>

    <!-- 地图勾勒区域 -->
    <scottPopupWindow
      ref="scottPopupWindowDom"
      @sureSave="sureSave"
    ></scottPopupWindow>
  </el-dialog>
</template>

<script>
import scottPopupWindow from "@/components/scottPopupWindow/index";
export default {
  name: "addAreaDialog",
  components: {
    scottPopupWindow
  },
  data() {
    return {
      dialogVisible: false,
      groundId: "",
      areaId: "",
      ruleForm: {
        name: "",
        color: "",
        areaRegion: "",
        path: []
      },
      rules: {
        name: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    open(row) {
      this.groundId = row.id;
      this.areaId = row.areaId;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    // 选择区域
    selecArea() {
      let num = this.ruleForm.path.length === 0 ? 4 : 5;
      this.$refs.scottPopupWindowDom.open(
        num,
        "113.618365, 23.583407",
        this.ruleForm.path
      );
    },
    sureSave(obj) {
      console.log(obj);
      this.ruleForm.color = obj.color;
      this.ruleForm.path = obj.path;
      this.ruleForm.areaRegion = obj.editArea;
    },
    saveArea() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(valid);
        }
      });
    },
    closed() {
      this.ruleForm = {
        name: "",
        color: "",
        areaRegion: "",
        path: []
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.addArea {
  height: 100%;
}
</style>
