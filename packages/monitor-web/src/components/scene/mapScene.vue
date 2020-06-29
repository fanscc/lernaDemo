<template>
  <baidu-map
    ref="map"
    :center="centerPoint"
    :zoom="zoom"
    :map-click="false"
    class="map"
    @ready="handler"
  >
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']"
      anchor="BMAP_ANCHOR_TOP_LEFT"
    />
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
    <bm-overlay
      v-for="(point, index) in mapPotionInfo"
      :key="index"
      :class="{ sample: true, active }"
      pane="labelPane"
      @draw="draw(point, $event.map, $event.el)"
    >
      <div v-show="point.show" class="nodeInfo">
        <div class="node-title">
          <i class="iconjiedian iconfont" />
          <span>节点{{ point.nodeName }}</span>
        </div>
        <ul class="data-list">
          <li
            v-for="(sensor, index) in point['sensorValues']"
            :key="index"
            class="node-item"
            @click="showAction(sensor)"
          >
            <div class="sensor">
              <div>
                <i
                  :class="sensorType(sensor.sensor).iconName"
                  class="iconfont"
                />
              </div>
              <p class="sensor-name">
                {{ sensorType(sensor.sensor).name
                }}{{ parseFloat(sensor.sensor) % 1000 }}
              </p>
            </div>
            <div class="sensor-info">
              <span class="val">{{
                sensor.value1 + "" + sensorType(sensor.sensor).unit ||
                  "暂无数据"
              }}</span>
            </div>
          </li>
        </ul>
        <div
          v-if="point['sensorValues'] && point['sensorValues'].length === 0"
          class="no-data"
        >
          暂无传感器
        </div>
      </div>
      <div
        style="position:absolute;left:95px; bottom: -50px;cursor:point"
        title="点击可以控制节点信息显示隐藏"
        @click="swicth(point)"
      >
        <svg-icon
          id="position"
          icon-class="position"
          fill="#e02f2f"
          style="height: 30px;width: 30px;"
        />
      </div>
    </bm-overlay>
  </baidu-map>
</template>

<script>
export default {
  props: {
    mapPotionInfo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: false,
      show: true,
      zoom: 16,
      resolve_self: null,
      centerPoint: { lng: "", lat: "" }
    };
  },
  watch: {
    mapPotionInfo: {
      handler(val) {
        if (val && val.length > 0 && !this.centerPoint.lng) {
          val.map(o => {
            this.$set(o, "show", false);
          });
          this.readNodes();
        }
      },
      deep: true
    }
  },
  methods: {
    draw(region, map, el) {
      const pixel = map.pointToOverlayPixel({
        lng: region.lon,
        lat: region.lat
      });
      el.style.left = pixel.x + "px";
      el.style.top = pixel.y + "px";
    },
    handler() {
      this.$refs.map.map.setMapType(BMAP_SATELLITE_MAP);
      if (this.resolve_self) {
        this.resolve_self();
      }
    },
    sensorType(type) {
      return this.$utils.fliterSensorName(type, true);
    },
    swicth(point) {
      point.show = !point.show;
    },
    showAction(sensor) {
      // 节点控制
      this.$emit("parentShow", sensor);
    },
    readNodes() {
      // 根据所有经纬度计算中心center和zoom
      const array = [];
      this.mapPotionInfo.forEach(item => {
        array.push({ lng: item.lon, lat: item.lat });
      });
      if (!this.$refs.map) {
        new Promise(resolve => {
          this.resolve_self = resolve;
        }).then(() => {
          const view = this.$refs.map.map.getViewport(array);
          this.centerPoint = view.center;
          this.zoom = view.zoom;
        });
      } else {
        if (this.$refs.map.map) {
          const view = this.$refs.map.map.getViewport(array);
          this.centerPoint = view.center;
          this.zoom = view.zoom;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
}
.sample {
  width: 220px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  transform: translate(-50%, -100%);
  margin-top: -35px;
  margin-left: 0;
}
.sample.active {
  background: rgba(0, 0, 0, 0.75);
}
.sample:hover {
  z-index: 9999;
}
.nodeInfo {
  color: #000;
  box-shadow: 0 0 5px #000;
  background: #fff;
  p,
  ul {
    margin: 0;
    padding: 0;
  }
  ul > li {
    list-style: none;
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
</style>
