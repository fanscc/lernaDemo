<template>
  <div class="nodeDetail">
    <h3 class="nodeDetail_nav">
      {{ nodeName }} <i v-popover:popover class="el-icon-question styleShow" />
    </h3>
    <div
      v-show="sensorValues && sensorValues.length > 0"
      class="temperature_conten"
    >
      <p v-for="(item, index) in sensorValues" :key="index">
        <span class="clickColor" @click="showDialog(item)"
          >{{ fiterName(item.sensor) }}:</span
        >
        <span :style="{ color: item.color }" class="ValueSHow">{{
          valueUnit(item)
        }}</span>
      </p>
    </div>
    <p v-if="(sensorValues && sensorValues.length === 0) || !sensorValues">
      此节点下无传感器或传感器没有接收到值
    </p>
    <dialogTime ref="timeSwitch" />
    <airconditdialog ref="airconditDom" />
    <switchdialog ref="switchDom" />
    <routeMap ref="routeMapDom" />
    <el-popover
      ref="popover"
      placement="top-start"
      trigger="hover"
      content="点击传感器可以查看历史数据"
    />
  </div>
</template>
<script>
import dialogTime from "@/components/historyValshow/index";
import airconditdialog from "@/components/historyValshow/airconditdialog";
import switchdialog from "@/components/historyValshow/switch";
import routeMap from "@/components/historyValshow/routeMap";
export default {
  components: {
    dialogTime,
    airconditdialog,
    switchdialog,
    routeMap
  },
  props: {
    nodeName: {
      type: String,
      default: ""
    },
    sensorValues: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nodeId: {
      type: Number,
      default: 0
    },
    gateId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    fiterName(val) {
      return this.$utils.fliterSensorName(val);
    },
    valueUnit(val) {
      return this.$utils.valueUnit(val);
    },
    showDialog(item) {
      const num = parseInt(item.sensor / 1000);
      if (num === 8) {
        this.$refs.airconditDom.open({
          nodeId: this.nodeId,
          sensor: item.sensor
        });
      } else if (num === 9 || num === 16) {
        this.$refs.switchDom.open({ nodeId: this.nodeId, sensor: item.sensor });
      } else if (num === 15) {
        this.$refs.routeMapDom.open({
          nodeId: this.nodeId,
          sensor: item.sensor,
          gateId: this.gateId
        });
      } else {
        this.$refs.timeSwitch.open({
          nodeId: this.nodeId,
          sensor: item.sensor,
          gateId: this.gateId
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.nodeDetail:hover {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
}
.nodeDetail {
  width: 450px;
  margin-right: 30px;
  margin-bottom: 20px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.08);
  .nodeDetail_nav {
    text-indent: 20px;
    margin: 0;
    height: 40px;
    line-height: 40px;
    background: #1ab394;
    color: #fff;
  }
  .temperature_conten {
    padding: 20px;
    padding-right: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    p {
      width: 46%;
    }
    p:nth-of-type(even) {
      margin-left: 20px;
    }
    .ValueSHow {
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .clickColor {
    color: #409eff;
    cursor: pointer;
  }
  .styleShow {
    float: right;
    transform: translate(-15px, 11px);
  }
}
</style>
