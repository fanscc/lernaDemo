<template>
  <div class="node-map-wrap">
    <div class="node-map-wrap_nav">
      <!-- <selfCascader :path="PATH" @gateSwitch="gateSwitch" /> -->
      <el-select
        v-model="selectGate"
        filterable
        placeholder="请选择"
        @change="gatewaySwicth"
      >
        <el-option
          v-for="item in gatewayArr"
          :key="item.gateId"
          :label="item.gateAlias"
          :value="item.gateId"
        >
        </el-option>
      </el-select>
      <p class="dashboard-container_nav_title">
        <font style="color: #42b983;margin-right:4px">{{ gateName }}</font
        >网关下标注了坐标的所有节点的信息
      </p>
    </div>
    <div v-if="isGps === 1 && mapImg" class="node-map-container">
      <img
        ref="imgContenDom"
        :src="mapImg"
        alt="路径不对"
        class="node-map-bg"
      />
      <el-popover
        v-for="point of pointList"
        :key="point.nodeId"
        v-model="point.visible"
        trigger="manual"
      >
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
          v-show="point['sensorValues'] && point['sensorValues'].length === 0"
          class="no-data"
        >
          暂无传感器
        </div>
        <div
          slot="reference"
          :style="{ left: point.xWidth + 'px', top: point.yHeight + 'px' }"
          class="point"
          @click="point.visible = !point.visible"
        >
          <i class="iconbiaodiandidian iconfont positionIcon" />
        </div>
      </el-popover>
    </div>
    <div v-if="isGps === 2" class="node-map-container">
      <mapScene :map-potion-info="mapPotionInfo" @parentShow="parentShow" />
    </div>
    <div v-if="!mapImg && isGps === 1" class="gate_no_text">
      该网关下没有设置场景图片
    </div>
    <dialogTime ref="timeSwitch" />
    <airconditdialog ref="airconditDom" />
    <switchdialog ref="switchDom" />
    <routeMap ref="routeMapDom" />
  </div>
</template>

<script>
import { getGate, getNodeValue } from "@/api/equipment";
import mapScene from "@/components/scene/mapScene";
import dialogTime from "@/components/historyValshow/index";
import airconditdialog from "@/components/historyValshow/airconditdialog";
import switchdialog from "@/components/historyValshow/switch";
import routeMap from "@/components/historyValshow/routeMap";
const uid = JSON.parse(localStorage.getItem("userId"));
const PATH = [
  `/newman/user/${uid}/group`,
  `/newman/user/${uid}/gate?groupId`,
  `/newman/gate`
];
let imgContenW = 0;
let imgContenH = 0;
export default {
  name: "SceneView",
  components: {
    mapScene,
    dialogTime,
    airconditdialog,
    switchdialog,
    routeMap
  },
  data() {
    return {
      PATH: PATH,
      pointList: [], // 室内的标注点
      gateName: "", // 选择的那个网关别名
      gateId: "", // 选择的那个网关先默认选择62
      mapImg: "", // 网关背景图片
      isGps: 0, // 判断是室内还是室外1室内2室外
      mapPotionInfo: [], // 地图的标注点
      timers: null,
      gatewayArr: [], // 网关列表
      selectGate: "" // 选中的网关
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    clearInterval(this.timers);
    this.timers = null;
  },
  methods: {
    async init() {
      // 初始化的时候就不去选择了请求网关接口默认选中第一个网关
      const arrVals = (await this.getGaet()) || "";
      console.log(arrVals);
      if (arrVals && arrVals[1].name) {
        this.selectGate = arrVals[1].gateId;
        this.gateSwitch(arrVals);
      }
    },
    getGaet() {
      return new Promise((resolve, reject) => {
        getGate()
          .then(res => {
            this.gatewayArr = res.result;
            const arrVals = [
              {},
              {
                name: res.result[0] ? res.result[0].gateAlias : "",
                gateId: res.result[0] ? res.result[0].gateId : "",
                map: res.result[0] ? res.result[0].map : "",
                isGps: res.result[0] ? res.result[0].isGps || 2 : ""
              }
            ];
            resolve(arrVals);
          })
          .catch(() => {
            reject("");
          });
      });
    },
    gatewaySwicth(val) {
      let items = {};
      for (let i = 0; i < this.gatewayArr.length; i++) {
        let item = this.gatewayArr[i];
        if (item.gateId === val) {
          items.name = item.gateAlias || "";
          items.gateId = item.gateId || "";
          items.map = item.map || "";
          items.isGps = item.isGps || 2;
          break;
        }
      }
      this.gateSwitch([{}, items]);
    },
    sensorType(type) {
      return this.$utils.fliterSensorName(type, true);
    },
    showAction(item) {
      const num = parseInt(item.sensor / 1000);
      if (num === 8) {
        this.$refs.airconditDom.open({
          nodeId: item.nodeId,
          sensor: item.sensor
        });
      } else if (num === 9 || num === 16) {
        this.$refs.switchDom.open({ nodeId: item.nodeId, sensor: item.sensor });
      } else if (num === 15) {
        this.$refs.routeMapDom.open();
      } else {
        this.$refs.timeSwitch.open({
          nodeId: item.nodeId,
          sensor: item.sensor,
          gateId: this.gateId
        });
      }
    },
    parentShow(item) {
      this.showAction(item);
    },
    initializationData(booleStr) {
      getNodeValue(this.gateId).then(res => {
        if (this.isGps === 1) {
          // 室内
          // 先过滤掉坐标为0的点和之前设置的大于1的脏数据
          const positionArr = res.result.filter(i => {
            return (
              (i.xRcs !== 0 && i.xRcs <= 1 && i.yRcs <= 1) ||
              (i.yRcs !== 0 && i.xRcs <= 1 && i.yRcs <= 1)
            );
          });
          if (booleStr || this.pointList.length !== positionArr.length) {
            this.pointList = positionArr;
            this.$nextTick(() => {
              this.pointList.map(item => {
                this.$set(item, "visible", true);
                this.$set(item, "xWidth", item.xRcs * imgContenW);
                this.$set(item, "yHeight", item.yRcs * imgContenH);
              });
            });
          } else {
            positionArr.forEach((i, index) => {
              this.pointList[index].nodeName = i.nodeName;
              this.pointList[index].sensorValues = i.sensorValues;
            });
          }
        } else {
          // 室外
          if (this.mapPotionInfo.length === 0) {
            this.mapPotionInfo = res.result;
          } else {
            this.mapPotionInfo.map((o, index) => {
              this.$set(
                this.mapPotionInfo,
                "sensorValues",
                res.result[index].sensorValues
              );
            });
          }
        }
      });
    },
    gateSwitch(val) {
      this.mapImg = "";
      if (this.timers) {
        clearInterval(this.timers);
      }
      this.timers = null;
      this.mapPotionInfo = [];
      this.gateName = val[1].name;
      this.gateId = val[1].gateId;
      this.isGps = 0;
      if (val[1].isGps === 1) {
        this.mapImg = val[1].map ? `/base/org/1/file?file=${val[1].map}` : "";
        this.$nextTick(() => {
          this.isGps = val[1].isGps;
          this.$nextTick(() => {
            try {
              this.$refs.imgContenDom.onload = () => {
                imgContenW = this.$refs.imgContenDom.clientWidth;
                imgContenH = this.$refs.imgContenDom.clientHeight;
                this.initializationData(true);
                this.timers = setInterval(() => {
                  this.initializationData();
                }, 10000);
              };
            } catch (error) {
              console.log("加载图片异常");
            }
          });
        });
      } else {
        this.$nextTick(() => {
          this.isGps = val[1].isGps;
          this.initializationData(true);
          this.timers = setInterval(() => {
            this.initializationData();
          }, 10000);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.node-map {
  height: 800px;
  &-wrap {
    height: 100%;
  }
  &-bg {
    width: 100%;
  }
  &-container {
    position: relative;
    height: calc(100% - 40px);
    .point {
      position: absolute;
      cursor: pointer;
      .point-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
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
.el-popover {
  padding: 0 12px 12px 12px;
  border-radius: 8px;
  min-height: 100px;
}
.positionIcon {
  font-size: 30px;
  color: darkorange;
}
.node-map-wrap_nav {
  position: relative;
  height: 40px;
  line-height: 40px;
}
.dashboard-container_nav_title {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
}
.gate_no_text {
  position: absolute;
  left: 50%;
  top: 100px;
  transform: translate(-50%, -50%);
  padding: 30px 0;
  text-align: center;
  font-size: 20px;
  color: red;
}
</style>
