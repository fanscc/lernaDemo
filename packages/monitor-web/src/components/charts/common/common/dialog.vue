<template>
  <el-dialog :visible.sync="showHistroy" class="histroyShow" title="历史数据">
    <el-date-picker
      v-model="Selectime"
      :default-value="new Date()"
      type="datetime"
      placeholder="选择日期时间"
      @change="timeChage"
    />
    <ve-line
      :data="chartData"
      :data-zoom="dataZoom"
      :extend="extend"
      :mark-line="markLine"
      :mark-point="markPoint"
    >
      <div v-if="chartData.rows.length === 0" class="data-empty">暂无数据</div>
    </ve-line>
  </el-dialog>
</template>

<script>
import "v-charts/lib/style.css";
import { getSensorHistoryVal } from "@/api/equipment";
export default {
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
        columns: ["日期", this.activeSensorChrild],
        rows: []
      },
      showHistroy: false,
      initTime: new Date(),
      Selectime: new Date(),
      sensorsArr: [], // 历史数据
      nodeId: "",
      sensor: ""
    };
  },
  computed: {
    activeSensorChrild() {
      if (this.sensor === "") return "";
      const num = parseInt(this.sensor / 1000);
      const objs = {
        1: "空气温度",
        2: "空气湿度",
        3: "气压",
        4: "土壤温度",
        5: "土壤湿度",
        6: "光照",
        7: "电压"
      };
      return objs[num];
    }
  },
  watch: {
    sensorsArr(val) {
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
    }
  },
  methods: {
    open(obj) {
      this.showHistroy = true;
      this.nodeId = obj ? obj.nodeId : 1;
      this.sensor = obj ? obj.sensor : 1001;
      this.timeChage();
    },
    timeChage(val) {
      const timeVal = val || new Date();
      const time = new Date(timeVal).getTime();
      const toTime = parseInt(time / 1000);
      const fromTime = parseInt(toTime - 3600 * 12);
      const params = {
        nodeId: this.nodeId,
        sensor: this.sensor,
        fromTime: fromTime,
        toTime: toTime
      };
      getSensorHistoryVal(params).then(res => {
        this.sensorsArr = [];
        this.sensorsArr = res.result;
      });
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
.histroyShow /deep/ .el-dialog {
  margin-top: 0 !important;
  top: 50%;
  transform: translateY(-50%);
}
</style>
