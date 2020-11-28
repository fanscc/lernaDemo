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
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            color="#0bbd87"
            :key="index"
            :timestamp="activity.timestamp"
          >
            <span class="conten_btn" @click="openMark(activity)">{{
              activity.content
            }}</span>
          </el-timeline-item>
        </el-timeline>
      </span>
    </el-drawer>
    <operationMark
      ref="operationMarkDom"
      v-if="operationMarkVisition"
    ></operationMark>
  </div>
</template>
<script>
import operationMark from "./operationMark.vue";
export default {
  name: "operation",
  components: {
    operationMark
  },
  data() {
    return {
      drawer: false,
      operationMarkVisition: false,
      direction: "rtl",
      activities: [
        {
          content: "活动按期开始",
          timestamp: "2018-04-15"
        },
        {
          content: "通过审核",
          timestamp: "2018-04-13"
        },
        {
          content: "创建成功",
          timestamp: "2018-04-11"
        }
      ]
    };
  },
  methods: {
    open() {
      this.drawer = true;
    },
    openMark(activity) {
      this.operationMarkVisition = true;
      this.$nextTick(() => {
        this.$refs.operationMarkDom.open(activity.content);
      });
    },
    addOperation() {
      this.operationMarkVisition = true;
      this.$nextTick(() => {
        this.$refs.operationMarkDom.open();
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
