<template>
  <div class="nlableManagement">
    <div class="classFlex">
      <el-select v-model="groupId" filterable clearable placeholder="请选择">
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
  </div>
</template>

<script>
import { getGroup } from "@/api/equipment";
export default {
  name: "nlableManagement",
  data() {
    return {
      groupId: "",
      grounpList: [],
      center: [116.397428, 39.90923]
    };
  },
  created() {
    this.getEnums();
    this.initMap();
  },
  methods: {
    search() {},
    getEnums() {
      getGroup().then(res => {
        this.grounpList = res.result;
      });
    },
    initMap() {
      this.$nextTick(() => {
        this.map = new AMap.Map("map_conten", {
          zoom: 17, //初始化地图层级
          center: this.center //初始化地图中心点
        });
        this.map.add(new AMap.TileLayer.Satellite());
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
