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
      <bm-label
        v-for="(item, index) in locationPoint"
        :key="index"
        content="我爱北京天安门"
        :position="{ lng: item.lng, lat: item.lat }"
        :labelStyle="{ color: 'red', fontSize: '12px' }"
        :offset="{ width: -35, height: -75 }"
        title="Hover me"
      />
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
        <img style="width: 32px; height: 32px;" src="../../assets/iconBZ.png" />
        <span style="color: red">停下来后点击地图标记</span>
      </span>
    </baidu-map>
    <div class="nodeInfo" ref="infoWindowDom">
      <div class="node-title">
        <span>添加标记</span>
      </div>
      <div>
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="名称">
            <input type="text" value="" id="infoName" />
          </el-form-item>
          <el-form-item label="备注">
            <textarea type="text" value="" id="infoRemark" />
          </el-form-item>
        </el-form>
        <div
          class="bj_footer"
          style="display: flex;justify-content: center;align-items: center;"
        >
          <el-button type="primary" @click="save" id="save">保存</el-button>
          <el-button type="danger" id="cancel">删除</el-button>
        </div>
      </div>
    </div>
    <div class="nodeInfo" ref="detailInfoWindowDom">
      <div class="node-title">
        <span>标记详情</span>
      </div>
      <div>
        <div>
          <p><span>名称:</span><span>最好的茶业树</span></p>
          <p><span>备注:</span><span>需要好好培养</span></p>
        </div>
        <div
          class="bj_footer"
          style="display: flex;justify-content: center;align-items: center;"
        >
          <el-button type="primary" id="edit">修改</el-button>
          <el-button type="plain" id="operation">操作管理</el-button>
          <el-button type="danger" id="cancel">删除</el-button>
        </div>
      </div>
    </div>
    <div class="nodeInfo" ref="editInfoWindowDom">
      <div class="node-title">
        <span>编辑标记</span>
      </div>
      <div>
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="名称">
            <input type="text" value="" id="infoName" />
          </el-form-item>
          <el-form-item label="备注">
            <textarea type="text" value="" id="infoRemark" />
          </el-form-item>
        </el-form>
        <div
          class="bj_footer"
          style="display: flex;justify-content: center;align-items: center;"
        >
          <el-button type="primary" id="save">保存</el-button>
          <el-button type="danger" id="cancel">删除</el-button>
        </div>
      </div>
    </div>
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
      },
      infoWindow: null, // 新增信息框
      detailInfoWindow: null, // 详情信息框
      editInfowindow: null, // 编辑信息框
      markObject: null // 现在展开的是哪个
    };
  },
  created() {},
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
          require("@/assets/iconBZ.png"),
          new this.$refs.map.BMap.Size(32, 32),
          { anchor: new this.$refs.map.BMap.Size(10, 50) }
        );
        let marker = new this.$refs.map.BMap.Marker(point, {
          icon: myIcon
        });
        this.$refs.map.map.addOverlay(marker);
        marker.openInfoWindow(_this.infoWindow);
        this.markObject = marker;
        //判断窗口的打开状态
        if (!_this.infoWindow.isOpen()) {
          //如果没有打开，则监听打开事件，获取按钮，添加事件
          _this.infoWindow.addEventListener("open", function() {
            document.getElementById("save").onclick = function() {
              _this.save();
            };
            document.getElementById("cancel").onclick = function() {
              _this.remove(_this.markObject);
            };
          });
        } else {
          //如果已经打开，直接获取按钮，添加事件
          document.getElementById("save").onclick = function() {
            _this.save();
          };
          document.getElementById("cancel").onclick = function() {
            _this.remove(_this.markObject);
          };
        }
        marker.addEventListener("click", function() {
          _this.markObject = this;
          this.openInfoWindow(_this.detailInfoWindow);
          //判断窗口的打开状态
          if (!_this.detailInfoWindow.isOpen()) {
            //如果没有打开，则监听打开事件，获取按钮，添加事件
            _this.detailInfoWindow.addEventListener("open", function() {
              document.getElementById("edit").onclick = function() {
                _this.edit();
              };
              document.getElementById("cancel").onclick = function() {
                _this.remove(_this.markObject);
              };
              document.getElementById("operation").onclick = function() {
                _this.operation();
              };
            });
          } else {
            //如果已经打开，直接获取按钮，添加事件
            document.getElementById("edit").onclick = function() {
              _this.edit();
            };
            document.getElementById("cancel").onclick = function() {
              _this.remove(_this.markObject);
            };
            document.getElementById("operation").onclick = function() {
              _this.operation();
            };
          }
        });
      });
    },
    handler({ BMap }) {
      this.$refs.map.map.setMapType(BMAP_SATELLITE_MAP);
      console.log(BMap);
      this.$nextTick(() => {
        let sContent = this.$refs.infoWindowDom.innerHTML;
        this.infoWindow = new this.$refs.map.BMap.InfoWindow(sContent, {
          offset: { width: 20, height: -50 }
        });
        let detailInfoWindow = this.$refs.detailInfoWindowDom.innerHTML;
        this.detailInfoWindow = new this.$refs.map.BMap.InfoWindow(
          detailInfoWindow,
          {
            offset: { width: 20, height: -50 }
          }
        );
        let editConten = this.$refs.editInfoWindowDom.innerHTML;
        this.editInfowindow = new this.$refs.map.BMap.InfoWindow(editConten, {
          offset: { width: 20, height: -50 }
        });
      });
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
    save(type) {
      console.log(type);
      var name = document.getElementById("infoName").value;
      var remark = document.getElementById("infoRemark").value;
      console.log(55, name);
      console.log(551, remark);
    },
    edit() {
      this.markObject.openInfoWindow(this.editInfowindow);
      let _this = this;
      if (!this.editInfowindow.isOpen()) {
        //如果没有打开，则监听打开事件，获取按钮，添加事件
        this.editInfowindow.addEventListener("open", function() {
          document.getElementById("save").onclick = function() {
            _this.save();
          };
          document.getElementById("cancel").onclick = function() {
            _this.remove(_this.markObject);
          };
        });
      } else {
        //如果已经打开，直接获取按钮，添加事件
        document.getElementById("save").onclick = function() {
          _this.save();
        };
        document.getElementById("cancel").onclick = function() {
          _this.remove(_this.markObject);
        };
      }
    },
    remove(target) {
      this.$refs.map.map.removeOverlay(target);
    },
    operation() {
      alert("填写操作记录");
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
  display: none;
  color: #000;
  box-shadow: 0 0 5px #000;
  background: #fff;
  padding: 20px;
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
.markMove {
  position: absolute;
}
.addFrom {
  width: 400px;
  position: absolute;
  transform: translate(-50%, -100%);
  margin-top: -64px;
  z-index: 9999999;
}
</style>
