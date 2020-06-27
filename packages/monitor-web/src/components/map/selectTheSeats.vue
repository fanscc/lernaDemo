<template>
  <baidu-map
    :center="addresscenter"
    :zoom="16"
    class="mapDom fixed_center"
    @ready="handler"
    @click="getPoint"
  >
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']"
      anchor="BMAP_ANCHOR_RIGHT"
    />
    <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" />
    <bm-marker :position="center" />
    <bm-view class="map" />
    <bm-control :offset="{ left: '100px', height: '10px' }">
      <bm-auto-complete v-model="keyword" :sug-style="{ zIndex: 1 }">
        <el-input
          v-model="keyword"
          placeholder="输入需要搜索的地址"
          style="margin-bottom: 10px;"
        />
        <p
          style="background: #fff;margin: 0 0 5px 0;height:40px;line-height:40px;padding: 0 10px"
        >
          <label>选中的经度:</label> <span>{{ center.lng }}</span>
        </p>
        <p
          style="background: #fff;margin: 0 0 5px 0;height:40px;line-height:40px; padding: 0 10px"
        >
          <label>选中的维度:</label> <span>{{ center.lat }}</span>
        </p>
        <el-button @click="emitParent">确定</el-button>
      </bm-auto-complete>
    </bm-control>
    <bm-local-search
      :keyword="keyword"
      :auto-viewport="true"
      style="display: none"
    />
  </baidu-map>
</template>

<script>
import { Loading } from "element-ui";
export default {
  data() {
    return {
      keyword: "",
      addresscenter: {
        lng: "",
        lat: ""
      },
      center: {
        lng: "",
        lat: ""
      },
      loadingInstance: null,
      resolve_self: null
    };
  },
  methods: {
    handler({ BMap }) {
      // 获取当前坐标
      const _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          _this.addresscenter = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
          if (_this.resolve_self) {
            _this.loadingInstance.close();
            _this.resolve_self(_this.addresscenter);
          }
        },
        { enableHighAccuracy: true }
      );
    },
    getPoint(e) {
      this.$set(this.center, "lng", e.point.lng);
      this.$set(this.center, "lat", e.point.lat);
    },
    emitParent() {
      this.$emit("emitAdress", this.center);
    },
    getAdress() {
      if (!this.addresscenter.lng) {
        this.loadingInstance = Loading.service({ fullscreen: true });
        return new Promise(resolve => {
          this.resolve_self = resolve;
        });
      } else {
        return new Promise(resolve => {
          resolve(this.addresscenter);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mapDom {
  width: 1000px;
  height: 600px;
  background: #ddd;
}
.map {
  width: 100%;
  height: 100%;
  padding: 10px;
  .BMap_cpyCtrl.BMap_noprint.anchorBL {
    display: none;
  }
}
.fixed_center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
}
/deep/ .anchorBL,
/deep/ .BMap_cpyCtrl {
  display: none !important;
}
</style>
