<template>
  <div class="sensor">
    <component
      ref="detailDom"
      :sensor="sensor"
      :value="value"
      :node-id="nodeId"
      :is="componsName"
    />
  </div>
</template>
<script>
import temperature from "./common/temperature";
import humidity from "./common/humidity";
import pressure from "./common/pressure";
import illumination from "./common/illumination";
import voltage from "./common/voltage";
import conditioner from "./common/conditioner";
import solenoid from "./common/solenoid";
export default {
  components: {
    temperature,
    humidity,
    pressure,
    illumination,
    voltage
  },
  props: {
    sensor: {
      type: Number,
      default: 1001
    },
    value: {
      type: Number,
      default: 20
    },
    nodeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    componsName() {
      const num = parseInt(this.sensor / 1000);
      const objs = {
        1: temperature,
        2: humidity,
        3: pressure,
        4: temperature,
        5: humidity,
        6: illumination,
        7: voltage,
        8: conditioner,
        9: solenoid
      };
      return objs[num];
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.sensor {
  width: 160px;
  margin-left: 20px;
  cursor: pointer;
  .sensor_nav {
    color: #409eff;
    text-align: center;
  }
}
</style>
