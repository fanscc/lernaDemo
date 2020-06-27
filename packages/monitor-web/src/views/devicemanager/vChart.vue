<template>
  <ve-line
    :data="chartData"
    :data-zoom="dataZoom"
    :extend="extend"
    :mark-line="markLine"
    :mark-point="markPoint"
  >
    <div v-if="chartData.rows.length === 0" class="data-empty">暂无数据</div>
  </ve-line>
</template>

<script>
import "v-charts/lib/style.css";
export default {
  props: {
    sensorsArr: {
      type: Array,
      default() {
        return [];
      }
    },
    activeSensorChrild: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    this.markLine = {
      data: [
        {
          name: "平均线",
          type: "average"
        }
      ]
    };
    this.markPoint = {
      data: [
        {
          name: "最大值",
          type: "max"
        },
        {
          name: "最小值",
          type: "min"
        },
        {
          name: "平均值",
          type: "average"
        }
      ]
    };
    this.dataZoom = [
      {
        type: "slider",
        start: 0,
        end: 500
      }
    ];
    this.extend = {
      "xAxis.0.axisLabel.rotate": 45,
      tooltip: {
        triggerOn: "mousemove"
      }
    };
    return {
      chartData: {
        columns: ["日期"],
        rows: []
      },
      dataEmpty: true
    };
  },
  watch: {
    sensorsArr(val) {
      if (this.chartData.columns.length === 1) {
        this.chartData.columns.push(this.activeSensorChrild);
      }
      this.chartData.rows = [];
      const arr = [];
      val.map(o => {
        const obj = {
          日期: this.$utils.formatDate(o.st, "hh:mm")
        };
        obj[this.activeSensorChrild] = o.value.value1;
        arr.push(obj);
      });
      this.chartData.rows = arr.slice();
    },
    activeSensorChrild(val) {
      this.chartData.columns = this.chartData.columns.slice(0, 1);
      this.chartData.columns.push(val);
    }
  }
};
</script>
<style lang="scss" scope>
.data-empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
