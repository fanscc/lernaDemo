<template>
  <div class="sensor">
    <p class="sensor_nav">
      传感器{{ sensor }}({{
        parseInt(sensor / 1000) === 2 ? "空气湿度" : "土壤湿度"
      }})
    </p>
    <ve-gauge
      :data="chartData"
      :settings="chartSettings"
      :events="chartEvents"
      width="160px"
      height="160px"
    />
    <dialogTime ref="timeSwitch" />
  </div>
</template>
<script>
import dialogTime from "./common/dialog";
export default {
  components: {
    dialogTime
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
  data() {
    const _this = this;
    this.chartSettings = {
      dataName: {
        湿度: "%"
      },
      seriesMap: {
        湿度: {
          min: 0,
          max: 100,
          radius: "100%",
          splitNumber: 5,
          axisLine: {
            lineStyle: {
              color: [[0.3, "#42b983"], [0.6, "#e6a23c"], [1, "#f56c6c"]],
              width: 6,
              shadowColor: "#fff",
              shadowBlur: 10
            }
          },
          axisLabel: {
            textStyle: {
              fontWeight: "bolder",
              color: "#000",
              shadowColor: "#fff",
              shadowBlur: 10
            }
          },
          axisTick: {
            length: 20,
            lineStyle: {
              color: "auto",
              shadowColor: "#fff",
              shadowBlur: 10
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              width: 3,
              color: "auto"
            }
          },
          title: {
            textStyle: {
              fontWeight: "bolder",
              fontSize: 20,
              color: "red"
            }
          }
        }
      }
    };
    this.chartEvents = {
      click: function() {
        _this.$refs.timeSwitch.open();
      }
    };
    return {
      chartData: {
        columns: ["type", "value"],
        rows: [{ type: "湿度", value: this.value }]
      }
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.sensor {
  width: 160px;
  cursor: pointer;
  .sensor_nav {
    color: #409eff;
    text-align: center;
  }
}
</style>
