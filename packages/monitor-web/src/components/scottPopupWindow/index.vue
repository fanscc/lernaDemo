<template>
  <el-dialog
    class="scottPopupWindow"
    title="定位位置"
    :visible.sync="dialogVisible"
    width="1100px"
  >
    <div class="contenText" v-if="type !== 4 && type !== 5">
      选中的经纬度: {{ center }}
      <el-button type="primary" @click="sureSave">确定选择</el-button>
    </div>
    <div
      v-if="type === 4"
      style="margin-bottom: 10px;display: flex;align-items: center;"
    >
      区域填充颜色:<el-color-picker v-model="color"></el-color-picker>
      <el-button type="primary" @click="drawArea">{{
        editType ? "绘制区域" : "保存区域"
      }}</el-button>
      <span style="font-size:12px;color:#ddd;margin-left:10px;"
        >(点击鼠标左键后开始绘制,双击绘制完成)</span
      >
      <el-button type="primary" @click="anewDrawArea" v-if="addEdit"
        >修改绘制区域</el-button
      >
    </div>
    <div class="contenText" v-if="type === 5">
      <el-button type="primary" @click="editArea">{{
        editType ? "编辑区域" : "保存区域点"
      }}</el-button>
      <!-- <el-button type="primary" @click="sureSave">确定选择</el-button> -->
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
      polygon: null,
      polyEditor: null,
      mouseTool: null, // 绘制区域
      editType: true, // true编辑区域点, false保存区域点
      color: "#1791fc",
      path: [], // 区域经纬度数组
      areaConten: "", // 区域面积
      addEdit: true,
      type: 1, // 1,选择中点2选择图片左下脚经纬度3选择图片右上角经纬度4表示勾勒区域
      center: [116.397428, 39.90923]
    };
  },
  methods: {
    open(num, center) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (center) {
          this.center = center.split(",");
        }
        this.type = num;
        this.init();
      });
    },
    init() {
      this.map = new AMap.Map("mapDialog", {
        resizeEnable: true, //是否监控地图容器尺寸变化
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
      if (this.type !== 4) {
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
      } else if (this.type === 4) {
        this.setImg();
        this.map.plugin(["AMap.MouseTool"], () => {
          this.mouseTool = new AMap.MouseTool(this.map);
        });
      } else if (this.type === 5) {
        this.setImg();
        // 勾勒区域
        let path = [
          [113.618365, 23.583407],
          [113.618337, 23.583054],
          [113.618326, 23.582959],
          [113.618273, 23.582812],
          [113.618218, 23.582703],
          [113.618145, 23.582596],
          [113.61802, 23.582489],
          [113.617923, 23.582385],
          [113.617897, 23.582345],
          [113.617838, 23.582154],
          [113.617814, 23.581969],
          [113.617889, 23.581969],
          [113.61792, 23.581777],
          [113.617981, 23.58175],
          [113.618073, 23.581752],
          [113.618175, 23.581762],
          [113.618118, 23.581988],
          [113.618183, 23.582083],
          [113.618292, 23.582186],
          [113.618359, 23.582226],
          [113.618489, 23.582333],
          [113.618799, 23.582455],
          [113.619135, 23.582554],
          [113.619407, 23.582772],
          [113.619568, 23.582973],
          [113.619652, 23.583129],
          [113.619704, 23.583274],
          [113.619741, 23.583453],
          [113.619754, 23.583567],
          [113.61977, 23.58369],
          [113.619691, 23.58374],
          [113.619507, 23.583605],
          [113.619367, 23.583509],
          [113.619192, 23.58342],
          [113.619113, 23.583383]
        ];
        this.polygon = new AMap.Polygon({
          path: path,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: this.color,
          zIndex: 50
        });

        this.map.add(this.polygon);
        // 缩放地图到合适的视野级别
        this.map.setFitView([this.polygon]);

        this.map.plugin(["AMap.PolyEditor"], () => {
          this.polyEditor = new AMap.PolyEditor(this.map, this.polygon);
        });
      }
    },
    setImg() {
      let imageLayer = new AMap.ImageLayer({
        url: require(`@/assets/img/huanong.png`),
        bounds: new AMap.Bounds(
          [113.617252, 23.579628],
          [113.624573, 23.585551]
        ),
        zooms: [2, 25]
      });
      imageLayer.setMap(this.map);
    },
    drawArea() {
      // 绘制区域
      this.editType = !this.editType;
      if (!this.editType) {
        this.mouseTool.polygon({
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 6,
          // eslint-disable-next-line no-dupe-keys
          strokeOpacity: 0.2,
          fillColor: this.color,
          fillOpacity: 0.4,
          strokeStyle: "solid"
        });
        this.mouseTool.on("draw", e => {
          // event.obj 为绘制出来的覆盖物对象
          this.path = e.obj.getPath();
          this.areaConten = e.obj.getArea();
          this.mouseTool.close();
        });
      } else {
        // 保存
        if (!this.addEdit) {
          // 已经编辑过了
          // 保存区域点
          let editPath = this.polygon.getPath();
          let editArea = this.polygon.getArea();
          this.$emit("sureSave", { path: editPath, editArea: editArea });
          this.dialogVisible = false;
        } else {
          this.$emit("sureSave", {
            path: this.path,
            editArea: this.areaConten
          });
          this.dialogVisible = false;
        }
      }
    },
    // 重新绘制区域
    anewDrawArea() {
      if (this.path.length === 0) return;
      this.mouseTool.close(true);
      this.polygon = new AMap.Polygon({
        path: this.path,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: this.color,
        zIndex: 50
      });
      this.map.add(this.polygon);
      this.map.setFitView([this.polygon]);

      this.map.plugin(["AMap.PolyEditor"], () => {
        this.polyEditor = new AMap.PolyEditor(this.map, this.polygon);
        this.polyEditor.open();
        this.addEdit = false;
      });
    },
    editArea() {
      // 编辑区域
      this.editType = !this.editType;
      if (!this.editType) {
        this.polyEditor.open();
      } else {
        // 保存区域点
        let editPath = this.polygon.getPath();
        let editArea = this.polygon.getArea();
        console.log(11, editPath);
        console.log(22, editArea);
      }
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
