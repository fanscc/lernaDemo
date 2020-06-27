<template>
  <div class="conditioner">
    <div @click="setTemperature">
      <p>传感器{{ sensor }}(空调)</p>
      <div>
        <p>
          <span>模式:</span>
          <span>制冷</span>
        </p>
        <p>
          <span>温度:</span>
          <span>27℃</span>
        </p>
      </div>
    </div>
    <airconditdialog ref="airconditdialogDom" />
  </div>
</template>
<script>
import airconditdialog from "./common/airconditdialog";
export default {
  components: {
    airconditdialog
  },
  props: {
    sensor: {
      type: Number,
      default: 1001
    },
    value: {
      type: Number,
      default: 20
    }
  },
  methods: {
    setTemperature() {
      this.$refs.airconditdialogDom.openAir();
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
