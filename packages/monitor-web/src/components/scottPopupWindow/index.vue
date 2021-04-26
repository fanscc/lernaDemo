<template>
  <el-dialog
    class="scottPopupWindow"
    title="定位位置"
    :visible.sync="dialogVisible"
    width="1100px"
  >
    <div class="contenText">
      选中的经纬度: {{ center }}
      <el-button type="primary" @click="sureSave">确定选择</el-button>
    </div>
    <div class="info">
      <label>定位位置描述:</label>
      <input id="tipinput" type="text" />
    </div>
    <div id="mapDialog"></div>
  </el-dialog>
</template>

<script>
export default {
  name: "scottPopupWindow",
  data() {
    return {
      tip: "",
      dialogVisible: false,
      marker: null,
      map: null,
      type: 1, // 1,选择中点2选择图片左下脚经纬度3选择图片右上角经纬度
      center: [116.397428, 39.90923]
    };
  },
  methods: {
    open(num) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.init();
        this.type = num;
      });
    },
    init() {
      this.map = new AMap.Map("mapDialog", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 16, //初始化地图层级
        center: this.center //初始化地图中心点
      });
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
      this.map.on("click", e => {
        if (this.marker) {
          this.map.remove(this.marker);
        }
        let nCenter = [e.lnglat.getLng(), e.lnglat.getLat()];
        this.center = nCenter;
        this.marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: this.center,
          offset: new AMap.Pixel(-8, -25)
        });
        this.map.add(this.marker);
      });
    },
    sureSave() {
      this.dialogVisible = false;
      this.$emit("sureSave", this.center, this.type);
    }
  }
};
</script>

<style>
.amap-sug-result {
  z-index: 9999;
}
</style>
<style lang="scss" scoped>
#mapDialog {
  height: 540px;
}
.scottPopupWindow {
  /deep/ .el-dialog__body {
    padding: 0 10px;
  }
  .contenText {
    background: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
  }
}
.info {
  padding: 10px;
  border-radius: 0.25rem;
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  width: 350px;
  border-width: 0;
  right: 10px;
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
</style>
