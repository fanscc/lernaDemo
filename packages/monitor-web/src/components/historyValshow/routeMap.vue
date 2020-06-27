<template>
  <el-dialog
    :visible.sync="sensorShow"
    :close-on-click-modal="false"
    @close="clearTimes"
    title="轨迹显示"
    center
    class="map_dialog"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="实时位置" name="first"> </el-tab-pane>
      <el-tab-pane label="历史轨迹查看" name="second"> </el-tab-pane>
    </el-tabs>
    <component :is="who" v-bind="obj" ref="bdMapDom"></component>
  </el-dialog>
</template>

<script>
import realTime from "./realTime";
import historymap from "./historymap";
export default {
  components: { realTime, historymap },
  data() {
    return {
      sensorShow: false,
      obj: {},
      activeName: "first",
      who: "realTime"
    };
  },
  methods: {
    open(obj) {
      this.sensorShow = true;
      this.obj = obj;
      this.$nextTick(() => {
        this.$refs.bdMapDom.show();
      });
    },
    handleClick(tab) {
      console.log(tab.name);
      if (tab.name === "first") {
        this.who = "realTime";
        this.$nextTick(() => {
          this.$refs.bdMapDom.show();
        });
      } else if (tab.name === "second") {
        this.who = "historymap";
        this.$nextTick(() => {
          this.$refs.bdMapDom.show();
        });
      }
    },
    clearTimes() {
      this.$refs.bdMapDom.clearTimes();
    }
  }
};
</script>

<style lang="scss" scoped>
.map_dialog {
  & /deep/ .el-dialog {
    width: 80%;
    height: 78%;
    min-width: 1000px;
    .el-dialog__body {
      height: calc(100% - 120px);
      .history {
        height: calc(100% - 55px);
      }
    }
  }
  & /deep/ .map {
    height: calc(100% - 60px);
    min-height: 400px;
    & /deep/ .BMap_Marker {
      & > div > img {
        width: 100%;
      }
    }
  }
}
</style>
