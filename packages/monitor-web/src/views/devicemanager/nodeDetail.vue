<template>
  <div class="nodeDetail">
    <baidu-map
      v-loading="loading"
      :center="center"
      :zoom="zoom"
      class="map"
      element-loading-text="正在定位当前位置"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @ready="handler"
    >
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <bm-control>
        <el-cascader
          :options="options"
          :props="props"
          v-model="nodevalue"
          placeholder="请先选中节点"
          @active-item-change="handleItemChange"
        />
        <div v-show="nodeDataArr['空气']" class="displayInline">
          <datasPlays
            ref="datasPlays"
            :node-data-arr="nodeDataArr"
            @showHistoryVal="showHistoryVal"
          />
        </div>
      </bm-control>
      <bm-marker
        :position="autoLocationPoint"
        animation="BMAP_ANIMATION_BOUNCE"
      />
    </baidu-map>
    <!-- 历史数据展示 -->
    <dialogTime ref="timeSwitch" />
    <!-- 电磁阀控制 -->
    <airconditdialog ref="airconditDom" />
    <switchdialog ref="switchDom" />
    <routeMap ref="routeMapDom" />
  </div>
</template>
<script>
import { getGroup, getsearchGroup, getNodeValue } from "@/api/equipment";
import datasPlays from "./datasPlays";
import dialogTime from "@/components/historyValshow/index";
import airconditdialog from "@/components/historyValshow/airconditdialog";
import switchdialog from "@/components/historyValshow/switch";
import routeMap from "@/components/historyValshow/routeMap";
export default {
  name: "NodeDetail",
  components: {
    airconditdialog,
    switchdialog,
    datasPlays,
    dialogTime,
    routeMap
  },
  data() {
    return {
      loading: true,
      center: { lng: 0, lat: 0 }, // 经纬度
      autoLocationPoint: { lng: 0, lat: 0 },
      zoom: 15, // 地图展示级别
      options: [],
      props: {
        label: "name",
        value: "id",
        children: "children"
      },
      nodevalue: [], // 选中的节点信息
      nodeDataArr: {}, // 节点下面的传感器信息
      activeSensor_chrild: "空气温度", // 显示点击设备下面的4个指标的哪一个
      solenoidType: 8
    };
  },
  watch: {
    nodevalue(val) {
      // 根据节点信息，先实现点位
      this.resetNode();
      const nodedetail = val[2];
      this.center.lng = nodedetail.lon;
      this.center.lat = nodedetail.lat;
      this.autoLocationPoint.lng = nodedetail.lon;
      this.autoLocationPoint.lat = nodedetail.lat;
      // 查询节点的历史信息
      this.sensorShow(nodedetail);
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 先获取组件信息
      getGroup().then(res => {
        res.result.map((item, index) => {
          // const its = this.$utils.deepClone(item)
          item.children = [];
          item.name = item.groupName;
          item.id = {
            groupId: item.groupId,
            index: index
          };
        });
        this.options = res.result;
      });
    },
    resetNode() {
      this.nodeDataArr = {}; // 节点下面的传感器信息
      this.$refs.datasPlays.resetNode();
    },
    handler({ BMap }) {
      // 获取当前坐标
      const _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          _this.loading = false;
          _this.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
          _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }; // 自定义覆盖物
        },
        { enableHighAccuracy: true }
      );
    },
    handleItemChange(val) {
      // 根据选中的分组获取网关
      if (val.length === 1) {
        // 点击的第一级获取网关
        const groupId = val[0].groupId;
        getsearchGroup(groupId, true).then(res => {
          res.result.map((item, ind) => {
            // const it = this.$utils.deepClone(item)
            item.name = item.gateAlias;
            item.id = {
              gateId: item.gateId,
              index: ind
            };
            item.children = [];
          });
          this.options[val[0].index].children = res.result;
        });
      } else if (val.length === 2) {
        // 点击的第2级别获取节点
        const groupId = val[1].gateId;
        getNodeValue(groupId, true).then(res => {
          res.result.map(item => {
            item.name = item.nodeName;
            item.id = {
              nodeId: item.nodeId,
              lon: item.lon,
              lat: item.lat,
              sensors: item.sensors,
              sensorValues: item.sensorValues,
              gateId: item.gateId
            };
          });
          this.options[val[0].index].children[val[1].index].children =
            res.result;
        });
      }
    },
    sensorShow(list) {
      const nodeData = {
        空气: [],
        土壤: [],
        设备: [],
        其他: []
      };
      if (list.sensorValues && list.sensorValues.length > 0) {
        list.sensorValues.map(i => {
          const o = parseInt(i.sensor / 1000) || 1;
          const _initSensor = this.$utils.fliterSensorName(i.sensor, true);
          const objMap = {
            name: _initSensor.name,
            iconName: _initSensor.iconName,
            unit: _initSensor.unit,
            sensor: i.sensor,
            value: i.value1 || 0,
            value2: i.value2 || 0,
            nodeId: list.nodeId,
            gateId: list.gateId
          };
          const equipment = [8, 9, 16];
          if (o <= 3 || o === 6) {
            nodeData["空气"].push(objMap);
          } else if (equipment.includes(o)) {
            nodeData["设备"].push(objMap);
          } else if (o > 3 && o <= 5) {
            nodeData["土壤"].push(objMap);
          } else {
            nodeData["其他"].push(objMap);
          }
        });
      }
      this.nodeDataArr = nodeData;
    },
    showHistoryVal(val) {
      this.activeSensor_chrild = val.name;
      if (parseInt(val.sensor / 1000) === 8) {
        this.$refs.airconditDom.open({
          nodeId: this.nodeId,
          sensor: val.sensor
        });
      } else if (
        parseInt(val.sensor / 1000) === 9 ||
        parseInt(val.sensor / 1000) === 16
      ) {
        this.$refs.switchDom.open({ nodeId: this.nodeId, sensor: val.sensor });
      } else if (parseInt(val.sensor / 1000) === 15) {
        this.$refs.routeMapDom.open();
      } else {
        this.$refs.timeSwitch.open({
          nodeId: val.nodeId,
          sensor: val.sensor,
          gateId: val.gateId
        });
      }
    }
  }
};
</script>

<style lang="scss" scope>
.nodeDetail {
  height: 100%;
}
.map {
  width: 100%;
  height: 100%;
  .BMap_cpyCtrl.BMap_noprint.anchorBL {
    display: none;
  }
}
.buttonSwitch {
  ul {
    display: flex;
    li {
      span {
        padding: 10px;
        font-size: 16px;
        color: #42b983;
        cursor: pointer;
      }
      span.active {
        background: #42b983;
        color: #fff;
      }
    }
  }
}
.Vchart_conten {
  position: absolute;
  left: 200px;
  top: 0;
  width: 600px;
  height: 400px;
  padding: 30px;
  padding-bottom: 50px;
  background: #fff;
  .closeChart {
    position: absolute;
    right: 20px;
    top: 20px;
    color: red;
    font-size: 22px;
    cursor: pointer;
  }
}
.displayInline {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  margin-left: 100px;
  background: #fff;
  z-index: 9999999;
  width: 980px;
}
.BMap_noprint {
  display: flex;
}
.anchorBL {
  display: none;
}
ul,
li {
  list-style: none;
}
</style>
