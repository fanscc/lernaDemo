<template>
  <!-- 控制电磁阀 -->
  <el-dialog
    :visible.sync="sensorShow"
    :title="titleName"
    :close-on-click-modal="false"
    width="300px"
    center
  >
    <el-radio-group>
      <div>
        <p class="mB_10">设置:</p>
        <el-radio-group v-model="radio2">
          <el-radio :label="2">开</el-radio>
          <el-radio :label="3">关</el-radio>
        </el-radio-group>
      </div>
    </el-radio-group>
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
      radio2: 2,
      sensorShow: false,
      nodeId: 0,
      solenoid: "",
      loading: false
    };
  },
  computed: {
    titleName() {
      return parseInt((this.solenoid - 0) / 1000) === 16
        ? "控制继电器"
        : "控制电磁阀";
    }
  },
  watch: {},
  methods: {
    open(obj) {
      this.nodeId = obj.nodeId;
      this.solenoid = obj.sensor;
      this.sensorShow = true;
    },
    saveSure() {
      const params = {
        nodeId: this.nodeId,
        sensor: this.solenoid,
        cmd: this.radio2
      };
      this.loading = true;
      solenoidValve(params)
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
<style lang="scss" scope></style>
