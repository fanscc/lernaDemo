<template>
  <!-- 控制电磁阀 -->
  <el-dialog
    v-loading="loading"
    :title="titleName"
    :visible.sync="sensorShow"
    width="60%"
    center
  >
    <span v-if="solenoidType == 8">
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
    <span v-if="solenoidType == 9">
      <div>
        <p class="mB_10">设置:</p>
        <el-radio-group v-model="radio2">
          <el-radio :label="2">开</el-radio>
          <el-radio :label="3">关</el-radio>
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
      radio2: 1,
      sensorShow: false,
      nodeId: 0,
      loading: false
    };
  },
  computed: {
    titleName() {
      return this.solenoidType === 8 ? "设置空调" : "控制电磁阀";
    }
  },
  watch: {},
  methods: {
    open(obj) {
      this.nodeId = obj.nodeId;
      this.sensorShow = true;
    },
    saveSure() {
      const params = {
        nodeId: this.nodeId,
        sensor: this.solenoidType,
        cmd: this.solenoidType === 8 ? 4 : this.radio2
      };
      const datas = {};
      if (this.solenoidType === 8) {
        datas.temperature = this.temperature;
        datas.mode = this.radio1;
      }
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
