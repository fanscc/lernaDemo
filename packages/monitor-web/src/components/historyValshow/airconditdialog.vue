<template>
  <el-dialog
    :visible.sync="sensorShow"
    :close-on-click-modal="false"
    title="设置空调"
    width="500px"
  >
    <span>
      <div>
        <p class="mB_10">温度:</p>
        <el-input
          v-model="temperature"
          placeholder="温度只能设置为16-32℃的正整数"
          class="fe-input-content"
        />
      </div>
      <div>
        <p class="mB_10">模式:</p>
        <el-radio-group v-model="radio1">
          <el-radio :label="0">自动</el-radio>
          <el-radio :label="1">制冷</el-radio>
          <el-radio :label="2">干燥</el-radio>
          <el-radio :label="3">风</el-radio>
          <el-radio :label="4">制热</el-radio>
        </el-radio-group>
      </div>
      <div>
        <p>开启设置</p>
        <el-radio-group v-model="radio2">
          <el-radio :label="0">开</el-radio>
          <el-radio :label="1">关</el-radio>
        </el-radio-group>
      </div>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="sensorShow = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="saveSure"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { solenoidValve } from "@/api/equipment";
export default {
  data() {
    return {
      temperature: "",
      radio1: 0,
      radio2: 0,
      sensorShow: false,
      nodeId: 0,
      solenoid: "",
      loading: false
    };
  },
  watch: {},
  methods: {
    open(obj) {
      this.nodeId = obj ? obj.nodeId : "";
      this.solenoid = obj ? obj.sensor : "";
      this.sensorShow = true;
    },
    saveSure() {
      const params = {
        nodeId: this.nodeId,
        sensor: this.solenoid,
        cmd: this.radio2 === 0 ? 4 : 3
      };
      const datas = {};
      const rel = /^[1-9]\d*$/;
      if (
        !rel.test(this.temperature) ||
        parseFloat(this.temperature) > 32 ||
        parseFloat(this.temperature) < 16
      ) {
        this.$notify({
          title: "温度只能设置为16-32℃的正整数",
          type: "error",
          duration: 2500
        });
        return;
      }
      datas.temperature = this.temperature;
      datas.mode = this.radio1;
      this.loading = true;
      solenoidValve(params, datas)
        .then(() => {
          this.$notify({
            title: "设置成功",
            type: "success",
            duration: 2500
          });
          this.sensorShow = false;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scope>
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
