<template>
  <div style="height: 100%;position: relative;">
    <baidu-map
      v-loading="loading"
      element-loading-text="获取位置中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      ref="map"
      :center="centerPoint"
      :zoom="zoom"
      :map-click="false"
      class="map"
      @ready="handler"
      @click="getPoint"
      @mousemove="moveICON"
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
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
      <!-- <bm-marker
        v-for="(ite, index) in locationPoint"
        :key="index"
        :position="ite"
        :icon="mapObjs"
        :offset="{ width: 30, height: -20 }"
      /> -->
      <bm-overlay
        v-for="(point, index) in locationPoint"
        :key="index"
        class="addFrom"
        pane="labelPane"
        @draw="draw(point, $event.map, $event.el)"
      >
        <div v-show="point.show" class="nodeInfo">
          <div class="node-title">
            <span>添加标记</span>
          </div>
          <div>
            <el-form label-width="80px" :model="formLabelAlign">
              <el-form-item label="名称">
                <el-input v-model="formLabelAlign.name"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formLabelAlign.remark"></el-input>
              </el-form-item>
            </el-form>
            <div class="bj_footer">
              <el-button type="primary" @click="save">保存</el-button>
              <el-button type="danger">删除</el-button>
            </div>
          </div>
        </div>
      </bm-overlay>

      <bm-control class="sample" :offset="{ left: '500px', height: '210px' }">
        <bm-auto-complete v-model="location" :sug-style="{ zIndex: 1 }">
          <el-input
            style="width: 250px;"
            v-model="location"
            placeholder="输入位置"
          ></el-input>
        </bm-auto-complete>
        <el-button
          type="warning"
          icon="el-icon-coordinate"
          circle
          @click="addMark"
        ></el-button>
      </bm-control>
      <bm-local-search
        :keyword="location"
        :auto-viewport="true"
        style="display: none"
      />
      <span
        class="markMove"
        v-if="dragFlag"
        :style="{
          left: iconMarkPosition.left + 'px',
          top: iconMarkPosition.top + 'px'
        }"
      >
        <img
          style="width: 64px; height: 64px;"
          src="https://zckj.gudonger.com/base/org/1/file?file=1/gate/BZ.png_1606202652700"
        />
        <span style="color: red">停下来后点击地图标记</span>
      </span>
    </baidu-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      active: false,
      zoom: 20,
      resolve_self: null,
      location: "",
      locationPoint: [],
      mapObjs: {
        // url: "http://developer.baidu.com/map/jsdemo/img/car.png",
        url:
          "https://zckj.gudonger.com/base/org/1/file?file=1/gate/BZ.png_1606202652700",
        size: { width: 64, height: 64 }
      },
      centerPoint: { lng: "113.318977", lat: "23.114155" },
      dragFlag: false,
      iconMarkPosition: {
        left: 0,
        top: 0
      },
      formLabelAlign: {
        // 新增标注
        name: "",
        remark: ""
      }
    };
  },
  methods: {
    draw(region, map, el) {
      const pixel = map.pointToOverlayPixel({
        lng: region.lng,
        lat: region.lat
      });
      el.style.left = pixel.x + "px";
      el.style.top = pixel.y + "px";
    },
    moveICON(e) {
      if (this.dragFlag) {
        e = e || window.event;
        this.iconMarkPosition.left = e.clientX - 35;
        this.iconMarkPosition.top = e.clientY - 130;
      }
    },
    addMark(e) {
      this.dragFlag = true;
      this.$nextTick(() => {
        e = e || window.event;
        this.iconMarkPosition.left = e.clientX - 35;
        this.iconMarkPosition.top = e.clientY - 130;
      });
    },
    add_mark(ite) {
      let _this = this;
      this.$nextTick(() => {
        let point = new this.$refs.map.BMap.Point(ite.lng, ite.lat);
        let myIcon = new this.$refs.map.BMap.Icon(
          "https://zckj.gudonger.com/base/org/1/file?file=1/gate/BZ.png_1606202652700",
          new this.$refs.map.BMap.Size(64, 64),
          { anchor: new this.$refs.map.BMap.Size(10, 50) }
        );
        let marker = new this.$refs.map.BMap.Marker(point, {
          icon: myIcon
        });
        this.$refs.map.map.addOverlay(marker);
        _this.$set(ite, "show", true);
        marker.addEventListener("click", function() {
          _this.$set(ite, "show", !ite.show);
        });
      });
    },
    handler({ BMap }) {
      this.$refs.map.map.setMapType(BMAP_SATELLITE_MAP);
      console.log(BMap);
    },
    getPoint(e) {
      if (!this.dragFlag) return;
      this.dragFlag = false;
      this.locationPoint.push({
        lng: e.point.lng,
        lat: e.point.lat
      });
      this.add_mark(this.locationPoint[this.locationPoint.length - 1]);
    },
    save() {
      alert(1);
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
}
.sample {
  width: 500px;
  line-height: 30px;
  text-align: left;
  position: absolute;
  top: 50px !important;
  left: 20px !important;
  /deep/ .el-form-item--mini .el-form-item__label {
    color: #ffba00;
    font-size: 18px;
  }
  z-index: 9999;
}
.nodeInfo {
  color: #000;
  box-shadow: 0 0 5px #000;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p,
  ul {
    margin: 0;
    padding: 0;
  }
  ul > li {
    list-style: none;
  }
  .bj_footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.nodeInfo::after {
  content: "";
  width: 0;
  height: 0;
  border-width: 10px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  position: absolute;
  bottom: -20px;
  left: 50%;
  margin-left: -10px;
}
.node-title {
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: rebeccapurple;
  .data-icon {
    width: 18px;
    height: 18px;
  }
}
.data-list {
  padding-left: 0;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
}
.no-data {
  margin-top: 20px;
  text-align: center;
}
.node-item {
  display: flex;
  margin-bottom: 5px;
  cursor: pointer;
  .sensor {
    box-sizing: border-box;
    width: 70px;
    color: #fff;
    text-align: center;
    border-radius: 3px 0 0 3px;
    background-color: #42b78c;
    font-size: 12px;
    .sensor-name {
      line-height: 20px;
      height: 20px;
      font-size: 12px;
      margin: 0;
    }
  }
  .sensor-info {
    position: relative;
    flex: 1;
    font-size: 14px;
    line-height: 40px;
    padding: 0 8px;
    background: #9aa;
    color: #fff;
    border-radius: 0 3px 3px 0;
    .val {
      margin-right: 20px;
    }
    .chart {
      position: absolute;
      right: 5px;
      top: 50%;
      margin-top: -7.5px;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
  }
  .sensor-icon {
    width: 15px;
    line-height: 15px;
    height: 15px;
    color: #aaa;
    fill: #bbb;
  }
}
.markMove {
  position: absolute;
}
.addFrom {
  width: 400px;
  position: absolute;
  transform: translate(-50%, -100%);
  margin-top: -64px;
}
</style>
