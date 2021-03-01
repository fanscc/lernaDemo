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
      <el-form-item label="时间选择:">
        <el-date-picker
          v-model="ValidateForm.timeArr"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="timeChage"
        >
        </el-date-picker>
      </el-form-item>
      <el-button type="warning" :loading="loading" @click="download"
        >下载数据</el-button
      >
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
import { getToken } from "@/utils/auth";
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
    return {
      loading: false,
      ValidateForm: {
        timeArr: [new Date(new Date().getTime() - 3600000 * 12), new Date()]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let y = new Date().getFullYear();
              let m = new Date().getMonth() + 1;
              let d = new Date().getDate();
              let startToime = new Date(`${y}-${m}-${d} 00:00:00`).getTime();
              start.setTime(startToime);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      rules: {},
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
      let oldTime = 0;
      val.map(o => {
        if (o.sTime - oldTime > 1000) {
          oldTime = o.sTime;
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
      this.activeSensorChrild = this.$utils.fliterSensorName(
        this.sensor,
        true
      ).name;
      this.$nextTick(() => {
        this.timeChage();
      });
    },
    timeChage() {
      this.$refs.checkValidateForm.validate(valid => {
        if (valid) {
          if (
            !this.ValidateForm.timeArr ||
            this.ValidateForm.timeArr.length === 0
          ) {
            return this.$message.warning("请先选择时间");
          }
          const time = new Date(this.ValidateForm.timeArr[0]).getTime();
          const toTime = new Date(this.ValidateForm.timeArr[1]).getTime();
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
    download() {
      if (
        !this.ValidateForm.timeArr ||
        this.ValidateForm.timeArr.length === 0
      ) {
        return this.$message.warning("请先选择时间");
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      const time = new Date(this.ValidateForm.timeArr[0]).getTime();
      const toTime = new Date(this.ValidateForm.timeArr[1]).getTime();
      let url = `/newman/gate/${this.gateId}/node/${
        this.nodeId
      }/history_excel?sensor=${
        this.sensor
      }&fromTime=${time}&toTime=${toTime}&token=${"Bearer " + getToken()}`;
      this.$message.success("下载中,请稍等...");
      window.location.href = url;
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
