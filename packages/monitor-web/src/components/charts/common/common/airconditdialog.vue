<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="sensorShow"
    title="设置空调"
    width="500px"
  >
    <span>
      <div>
        <p class="mB_10">温度:</p>
        <el-input v-model="temperature" class="fe-input-content" />
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
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="sensorShow = false">取 消</el-button>
      <el-button type="primary" @click="saveSure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { solenoidValve } from "@/api/equipment";
export default {
  props: {
    solenoidType: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      temperature: "",
      radio1: 0,
      sensorShow: false,
      nodeId: 0,
      loading: false
    };
  },
  watch: {},
  methods: {
    openAir(obj) {
      this.nodeId = obj ? obj.nodeId : 1;
      this.sensorShow = true;
    },
    saveSure() {
      const params = {
        nodeId: this.nodeId,
        sensor: this.solenoidType,
        cmd: 4
      };
      const datas = {};
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
<style lang="scss" scope></style>
