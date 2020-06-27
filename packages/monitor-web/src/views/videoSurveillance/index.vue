<template>
  <div class="video_control">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="监控" name="first"></el-tab-pane>
      <el-tab-pane label="云台控制" name="second"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="currently"></component>
    </keep-alive>
  </div>
</template>

<script>
import live from "./common/live.vue";
import consoleControl from "./common/consoleControl.vue";
export default {
  name: "video_index",
  components: {
    live,
    consoleControl
  },
  data() {
    return {
      activeName: "first",
      currently: live
    };
  },
  methods: {
    handleClick(val) {
      if (val.name === "first") {
        this.currently = live;
      } else {
        this.currently = consoleControl;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.video_control {
  height: 100%;
}
</style>
