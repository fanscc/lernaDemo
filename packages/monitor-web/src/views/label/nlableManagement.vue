<template>
  <div class="nlableManagement">
    <div class="classFlex">
      <el-select
        v-model="groupId"
        @click="switchGroup"
        filterable
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in grounpList"
          :key="item.groupId"
          :label="item.groupName"
          :value="item.groupId"
        >
        </el-option>
      </el-select>
    </div>
    <div id="map_conten"></div>
    <operation v-if="operationShow" ref="operationDom"></operation>
  </div>
</template>

<script>
import { getGroup } from "@/api/equipment";
import { getBaseThing } from "@/api/label/index";
import operation from "./operation.vue";
export default {
  name: "nlableManagement",
  data() {
    return {
      groupId: "",
      grounpList: [],
      overlayList: [],
      center: [113.354708, 23.166403],
      operationShow: false
    };
  },
  created() {
    this.getEnums();
    this.initMap();
  },
  components: {
    operation
  },
  methods: {
    search() {},
    getEnums() {
      getGroup().then(res => {
        this.grounpList = res.result;
      });
    },
    switchGroup(val) {
      console.log(val);
    },
    initMap() {
      this.$nextTick(() => {
        this.map = new AMap.Map("map_conten", {
          zoom: 17, //初始化地图层级
          center: this.center //初始化地图中心点
        });
        this.map.add(new AMap.TileLayer.Satellite());
        this.initData();
      });
    },
    initData() {
      getBaseThing().then(res => {
        this.overlayList = [];
        res.result.forEach(ite => {
          this.createMarker(ite.longitude, ite.latitude, ite.name, ite.id);
        });
        // 地图自适应
        this.map.setFitView(null, false, [150, 60, 100, 60]);
      });
    },
    createMarker(lng, lat, name, id) {
      let markerx = new AMap.Marker({
        icon: require(`@/assets/TreeIcon.png`),
        offset: new AMap.Pixel(-17, -40),
        position: [lng, lat],
        map: this.map,
        title: name,
        label: {
          direction: "top",
          content: `<div class='labelContent'>${name}</div>`,
          offset: new AMap.Pixel(-5, -5)
        },
        extData: {
          id: id,
          name: name
        }
      });
      this.overlayList.push(markerx);
      markerx.on("click", e => {
        this.operationShow = true;
        this.$nextTick(() => {
          let markId = e.target._opts.extData.id;
          let name = e.target._opts.extData.name;
          this.$refs.operationDom.open(markId, name);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.nlableManagement {
  height: 100%;
  padding: 0 10px;
  .classFlex {
    height: 40px;
    display: flex;
    align-items: center;
  }
  #map_conten {
    height: calc(100% - 50px);
  }
}
</style>

<style>
.amap-marker-label {
  border: 1px solid #53c4f7;
  border-radius: 2px;
}
.labelContent {
  font-size: 16px;
  padding: 2px;
  font-weight: bold;
}
</style>
