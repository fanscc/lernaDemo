<template>
  <div class="operation">
    <el-drawer size="500px" :visible.sync="drawer" :direction="direction">
      <p slot="title" class="header">操作管理</p>
      <div>
        <el-button type="primary" @click="addOperation" class="add_btn"
          >新增操作</el-button
        >
      </div>
      <span>
        <el-timeline v-if="activities.length > 0">
          <el-timeline-item
            v-for="(activity, index) in activities"
            color="#0bbd87"
            :key="index"
            :timestamp="String(activity.recordTime)"
          >
            <span class="conten_btn" @click="openMark(activity)">{{
              activity.detail
            }}</span>
          </el-timeline-item>
        </el-timeline>
        <div v-else style="text-align: center;font-size: 18px;">
          暂无操作记录
        </div>
      </span>
    </el-drawer>
    <operationMark
      ref="operationMarkDom"
      @refresh="init"
      v-if="operationMarkVisition"
    ></operationMark>
  </div>
</template>
<script>
import operationMark from "./operationMark.vue";
import { getBaseThingRecord } from "@/api/label/index";
export default {
  name: "operation",
  components: {
    operationMark
  },
  data() {
    return {
      id: "",
      drawer: false,
      operationMarkVisition: false,
      direction: "rtl",
      activities: []
    };
  },
  methods: {
    open(id) {
      this.drawer = true;
      this.id = id;
      this.init();
    },
    init() {
      getBaseThingRecord({ thingId: this.id }).then(res => {
        this.activities = res.result;
      });
    },
    openMark(activity) {
      this.operationMarkVisition = true;
      this.$nextTick(() => {
        this.$refs.operationMarkDom.open(this.id, activity);
      });
    },
    addOperation() {
      this.operationMarkVisition = true;
      this.$nextTick(() => {
        this.$refs.operationMarkDom.open(this.id);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.operation {
  & /deep/ .el-drawer__header {
    margin-bottom: 5px;
  }
  .add_btn {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
.header {
  text-align: center;
}
.conten_btn {
  cursor: pointer;
  color: #1890ff;
  font-size: 18px;
  font-weight: bold;
}
</style>
