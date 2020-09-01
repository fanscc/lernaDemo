<template>
  <el-dialog
    :visible.sync="showHistroy"
    :close-on-click-modal="false"
    class="histroyShow"
    title="历史数据"
  >
    <el-form
      ref="checkValidateForm"
      :model="ValidateForm"
      :inline="true"
      :rules="rules"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="起始时间:" prop="toTime">
        <el-date-picker
          v-model="ValidateForm.toTime"
          :default-value="new Date()"
          type="datetime"
          placeholder="选择日期时间"
          @change="timeChage"
        />
      </el-form-item>
      <el-form-item label="结束时间:" prop="fromTime">
        <el-date-picker
          v-model="ValidateForm.fromTime"
          :default-value="new Date()"
          type="datetime"
          placeholder="选择日期时间"
          @change="timeChage"
        />
      </el-form-item>
    </el-form>
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
import { getSersorhistory } from "@/api/equipment";
import { Loading } from "element-ui";
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
        show: true,
        yAxisIndex: [0],
        left: "93%",
        start: 0,
        end: 100
      },
      { type: "inside", show: true, yAxisIndex: [0], start: 30, end: 90 },
      { start: 0, end: 100, height: 20 }
    ];
    this.extend = {
      "xAxis.0.axisLabel.rotate": 45,
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        triggerOn: "mousemove"
      }
    };
    const validatetoTime = (rule, value, callback) => {
      if (
        new Date(value).getTime() >
          new Date(this.ValidateForm.fromTime).getTime() &&
        this.ValidateForm.fromTime
      ) {
        callback(new Error("起始时间不能大于结束时间"));
      } else {
        callback();
      }
    };
    const validatefromTime = (rule, value, callback) => {
      if (
        new Date(value).getTime() >
          new Date(this.ValidateForm.fromTime).getTime() &&
        this.ValidateForm.toTime
      ) {
        callback(new Error("结束时间不能小于起始时间"));
      } else {
        callback();
      }
    };
    return {
      ValidateForm: {
        toTime: new Date(new Date().getTime() - 3600000 * 12),
        fromTime: new Date()
      },
      rules: {
        toTime: [
          { required: true, message: "请输入起始时间", trigger: "change" },
          { validator: validatetoTime, trigger: "change" }
        ],
        fromTime: [{ validator: validatefromTime, trigger: "change" }]
      },
      showHistroy: false,
      initTime: new Date(),
      sensorsArr: [], // 历史数据
      activeSensorChrild: "", // 是什么历史数据
      nodeId: "",
      sensor: "",
      chartData: {
        columns: ["日期", ""],
        rows: []
      }
    };
  },
  watch: {
    sensorsArr(val) {
      this.chartData.columns[1] = this.activeSensorChrild;
      this.chartData.rows = [];
      const arr = [];
      let oldTime = 0
      val.map(o => {
        if (o.sTime - oldTime > 1000) {
          oldTime = o.sTime
          const obj = {
            日期: this.$utils.formatDate(o.sTime, "MM-dd-hh:mm:ss")
          };
          obj[this.activeSensorChrild] = o.value1;
          arr.push(obj);
        }
      });
      this.chartData.rows = arr.slice();
    }
  },
  methods: {
    open(obj) {
      this.showHistroy = true;
      this.nodeId = obj ? obj.nodeId : 1;
      this.sensor = obj ? obj.sensor : 1001;
      this.gateId = obj ? obj.gateId : 0;
      this.activeSensorChrild = this.activeSensorName();
      this.$nextTick(() => {
        this.timeChage();
      });
    },
    timeChage() {
      this.$refs.checkValidateForm.validate(valid => {
        if (valid) {
          const time = new Date(this.ValidateForm.toTime).getTime();
          const toTime = new Date(this.ValidateForm.fromTime).getTime();
          const params = {
            sensor: this.sensor,
            fromTime: time,
            toTime: toTime
          };
          this.$nextTick(() => {
            const loadingInstance = Loading.service({ fullscreen: true });
            getSersorhistory(this.gateId, this.nodeId, params)
              .then(res => {
                this.sensorsArr = [];
                this.sensorsArr = res.result;
              })
              .finally(() => {
                loadingInstance.close();
              });
          });
        }
      });
    },
    activeSensorName() {
      if (this.sensor === "") return "";
      const num = parseInt(this.sensor / 1000);
      const objs = {
        1: "空气温度",
        2: "空气湿度",
        3: "气压",
        4: "土壤温度",
        5: "土壤湿度",
        6: "光照",
        7: "电压",
        10: "电池电压",
        11: "太阳能板电压",
        12: "风速",
        13: "风向",
        14: "二氧化碳",
        15: "GPS",
        16: "继电器",
        17: "电流",
        18: "卡号",
        19: "总电量",
        20: "光合有效值",
        21: "降雨量",
        22: "扭矩",
        23: "油压",
        24: "油量",
        25: "水温",
        26: "发动机转速",
        27: "角度",
        28: "角速度",
        29: "PM1.0",
        30: "PM2.5",
        31: "PM10",
        32: "噪声",
        33: "网关电池"
      };
      return objs[num];
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
  width: 70%;
  min-width: 1000px;
}
</style>
