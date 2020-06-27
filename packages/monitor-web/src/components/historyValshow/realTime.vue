<template>
  <baidu-map
    v-if="mapShow"
    ref="map"
    :center="center"
    :zoom="18"
    class="map"
    @ready="handler"
  >
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']"
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
</template>

<script>
import { getNodeValue } from "@/api/equipment";
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
    return {
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
  },
  methods: {
    clearTimes() {
      if (this.times) {
        clearInterval(this.times);
        this.times = null;
        this.mapShow = false;
      }
    },
    show() {
      this.polylinePath = [];
      this.mapShow = true;
    },
    handler() {
      this.$refs.map.map.setMapType(BMAP_SATELLITE_MAP);
      this.$nextTick(() => {
        this.times = setInterval(() => {
          this.realLocation();
        }, 1000);
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
    realLocation() {
      getNodeValue(this.gateId).then(res => {
        try {
          let sensorValue = res.result
            .filter(i => i.nodeId === this.nodeId)[0]
            .sensorValues.filter(j => j.sensor === this.sensor)[0];
          let ite = new BMap.Point(sensorValue.value1, sensorValue.value2);
          if (ite.lat && ite.lng) {
            if (this.polylinePath.length >= 1) {
              this.rotation =
                this.getAngle(
                  ite,
                  this.polylinePath[this.polylinePath.length - 1]
                ) || 0;
            }
            this.polylinePath.push(ite);
            this.position.lat = ite.lat;
            this.position.lng = ite.lng;
            this.center.lat = ite.lat;
            this.center.lng = ite.lng;
          }
          console.log(this.position);
        } catch (error) {
          return this.$message.error("数据返回异常");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
