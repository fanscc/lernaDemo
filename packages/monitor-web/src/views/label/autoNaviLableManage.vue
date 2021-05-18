<template>
  <el-dialog
    title="添加标注"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    center
    :close-on-click-modal="false"
    width="1100px"
    @closed="close"
  >
    <span>
      <div class="lab_conten">
        <div class="node-map-wrap_nav">
          <!-- <selfCascader :path="PATH" @gateSwitch="gateSwitch" /> -->
          <div class="classFlex">
            <el-button type="primary" @click="addMark">确认</el-button>
            <label style="margin-left: 20px;">经纬度:</label>
            <span>
              {{ center }}
            </span>
          </div>
        </div>
        <div class="info">
          <label>定位位置描述:</label>
          <input id="tipinput" type="text" />
        </div>
        <div id="mapConten"></div>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "autoNaviLableManage",
  data() {
    return {
      map: null,
      marker: null,
      groupArr: [],
      groupId: "",
      center: [],
      dialogVisible: false
    };
  },
  created() {},
  methods: {
    open(centerPosition) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.center = centerPosition;
        this.map = new AMap.Map("mapConten", {
          zoom: 17, //初始化地图层级
          center: this.center //初始化地图中心点
        });
        this.map.add(new AMap.TileLayer.Satellite());
        //输入提示
        this.map.plugin(["AMap.AutoComplete", "AMap.PlaceSearch"], () => {
          let autoOptions = {
            city: "",
            input: "tipinput"
          };
          let auto = new AMap.AutoComplete(autoOptions);
          let placeSearch = new AMap.PlaceSearch({
            map: this.map
          }); //构造地点查询类
          auto.on("select", e => {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name); //关键字查询查询
          }); //注册监听，当选中某条记录时会触发
        });
        this.addMarker();
        this.showMark();
      });
    },
    addMark() {
      this.map.setDefaultCursor("pointer");
      this.dialogVisible = false;
      this.$emit("positionCenter", this.center);
    },
    showMark() {
      this.marker = new AMap.Marker({
        icon: require(`@/assets/TreeIcon.png`),
        position: this.center,
        offset: new AMap.Pixel(-8, -25)
      });
      this.map.add(this.marker);
    },
    addMarker() {
      let _this = this;
      this.map.on("click", e => {
        if (_this.marker) {
          _this.map.remove(_this.marker);
        }
        let nCenter = [e.lnglat.getLng(), e.lnglat.getLat()];
        _this.center = nCenter;
        _this.marker = new AMap.Marker({
          icon: require(`@/assets/TreeIcon.png`),
          position: _this.center,
          offset: new AMap.Pixel(-8, -25)
        });
        _this.map.add(_this.marker);
      });
    },
    close() {
      this.groupId = "";
      this.center = [];
    }
  }
};
</script>
<style>
.amap-sug-result {
  z-index: 9999999;
}
</style>
<style lang="scss" scoped>
.lab_conten {
  height: 600px;
  padding: 0 10px;
  position: relative;
  .classFlex {
    height: 40px;
    display: flex;
    align-items: center;
  }
  #mapConten {
    height: calc(100% - 50px);
  }
  .info {
    padding: 10px;
    border-radius: 0.25rem;
    position: absolute;
    top: 50px;
    left: 190px;
    transform: translateX(-50%);
    background-color: white;
    width: 350px;
    border-width: 0;
    right: 10px;
    z-index: 99;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    #tipinput {
      width: 100%;
      background: #fff;
      border: 1px solid #ddd;
      height: 30px;
      outline: none;
      line-height: 30px;
    }
  }
}
</style>
