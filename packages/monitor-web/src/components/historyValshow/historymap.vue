<template>
  <div class="history">
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
        />
      </el-form-item>
      <el-form-item label="结束时间:" prop="fromTime">
        <el-date-picker
          v-model="ValidateForm.fromTime"
          :default-value="new Date()"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-button type="primary" @click="timeChage">查询</el-button>
      <el-button type="primary" @click="playback">回放轨迹</el-button>
    </el-form>
    <baidu-map
      ref="map"
      v-if="mapShow"
      :center="center"
      :zoom="18"
      class="map"
      @ready="handler"
    >
      <bm-map-type
        :map-types="[
          'BMAP_NORMAL_MAP',
          'BMAP_SATELLITE_MAP',
          'BMAP_HYBRID_MAP'
        ]"
        anchor="BMAP_ANCHOR_TOP_LEFT"
      />
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <bm-marker :position="position" :rotation="rotation" :icon="mapObjs" />
      <bm-polyline
        :path="polylinePath"
        :stroke-opacity="0.8"
        :stroke-weight="5"
        stroke-color="#48a132"
      />
    </baidu-map>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { getSersorhistory } from "@/api/equipment";
export default {
  props: {
    nodeId: {
      type: [String, Number],
      default: ""
    },
    sensor: {
      type: [String, Number],
      default: ""
    },
    gateId: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
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
      mapShow: false,
      center: { lng: 116.423493, lat: 39.907445 },
      position: {
        lat: "",
        lng: ""
      },
      mapObjs: {
        url: "http://developer.baidu.com/map/jsdemo/img/car.png",
        size: { width: 32, height: 20 }
      },
      rotation: 0,
      polylinePath: []
    };
  },
  destroyed() {
    this.clearTimes();
    this.mapShow = false;
  },
  methods: {
    show() {
      this.polylinePath = [];
      this.mapShow = true;
    },
    clearTimes() {
      if (this.times) {
        clearInterval(this.times);
        this.times = null;
      }
    },
    handler() {
      this.$refs.map.map.setMapType(BMAP_SATELLITE_MAP);
      this.$nextTick(() => {
        this.timeChage();
      });
    },
    getAngle(n, next) {
      var ret;
      var w1 = (n.lat / 180) * Math.PI;
      var j1 = (n.lng / 180) * Math.PI;

      var w2 = (next.lat / 180) * Math.PI;
      var j2 = (next.lng / 180) * Math.PI;

      ret =
        4 * Math.pow(Math.sin((w1 - w2) / 2), 2) -
        Math.pow(Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2)), 2);
      ret = Math.sqrt(ret);

      // var temp = Math.sin(Math.abs(j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
      var temp = Math.sin((j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
      ret = ret / temp;

      ret = (Math.atan(ret) / Math.PI) * 180;
      ret += 90;

      // 这里用如此臃肿的if..else是为了判定追踪单个点的具体情况,从而调整ret的值
      if (j1 - j2 < 0) {
        // console.log('j1<j2')
        if (w1 - w2 < 0) {
          // console.log('w1<w2')
          ret;
        } else {
          // console.log('w1>w2')
          ret = -ret + 180;
        }
      } else {
        // console.log('j1>j2')
        if (w1 - w2 < 0) {
          // console.log('w1<w2')
          ret = 180 + ret;
        } else {
          // console.log('w1>w2')
          ret = -ret;
        }
      }
      return ret + 90;
    },
    playback() {
      if (this.times) {
        clearInterval(this.times);
        this.times = null;
      }
      let len = this.polylinePath.length;
      let indexs = 0;
      this.times = setInterval(() => {
        if (indexs >= len) {
          clearInterval(this.times);
          this.times = null;
          return;
        }
        let ite = this.polylinePath[indexs];
        if (indexs > 1) {
          this.rotation =
            this.getAngle(ite, this.polylinePath[indexs - 1]) || 0;
        }
        this.position.lng = ite.lng;
        this.position.lat = ite.lat;
        indexs++;
      }, 30);
    },
    timeChage() {
      if (this.times) {
        clearInterval(this.times);
        this.times = null;
      }
      this.$refs.checkValidateForm.validate(valid => {
        if (valid) {
          if (!this.ValidateForm.toTime || !this.ValidateForm.fromTime) return;
          this.polylinePath = [];
          this.position.lng = "";
          this.position.lat = "";
          const time = new Date(this.ValidateForm.toTime).getTime();
          const toTime = new Date(this.ValidateForm.fromTime).getTime();
          const params = {
            sensor: this.sensor,
            fromTime: time,
            toTime: toTime
          };
          const loadingInstance = Loading.service({ fullscreen: true });
          getSersorhistory(this.gateId, this.nodeId, params)
            .then(res => {
              let datas = res.result.filter(
                i => i.value1 !== 0 || i.value2 !== 0
              );
              datas.forEach(ite => {
                this.polylinePath.push(new BMap.Point(ite.value1, ite.value2));
              });
              const view = this.$refs.map.map.getViewport(this.polylinePath);
              this.center = view.center;
              this.zoom = view.zoom;
              let ite = this.polylinePath[this.polylinePath.length - 1];
              if (ite) {
                this.position.lng = ite.lng;
                this.position.lat = ite.lat;
              }
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
