<template>
  <!-- 控制电磁阀 -->
  <el-dialog
    v-loading="loading"
    :visible.sync="sensorShow"
    title="控制电磁阀"
    width="300px"
    center
  >
    <span>
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
      radio2: 2,
      sensorShow: false,
      nodeId: 0,
      loading: false
    };
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
