<template>
  <div class="conditioner" @click.self="setSwitch">
    <p>传感器{{ sensor }}(电磁阀)</p>
    <div>
      <p>
        <span>状态:</span>
        <span>关</span>
      </p>
    </div>
    <switchCompent ref="switchCompentDom" />
  </div>
</template>
<script>
import switchCompent from "./common/switch";
export default {
  components: {
    switchCompent
  },
  props: {
    sensor: {
      type: Number,
      default: 1001
    }
  },
  methods: {
    setSwitch() {
      this.$refs.switchCompentDom.open({ nodeId: 1 });
    }
  }
};
</script>

<style lang="scss" scoped>
.conditioner {
  margin-left: 20px;
  padding-left: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 150px;
  height: 194px;
  cursor: pointer;
  color: #409eff;
  border: 1px solid #eee;
}
</style>
