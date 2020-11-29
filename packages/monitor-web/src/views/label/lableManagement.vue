<template>
  <div style="height: 100%;">
    <div class="node-map-wrap_nav">
      <!-- <selfCascader :path="PATH" @gateSwitch="gateSwitch" /> -->
      <div class="classFlex">
        <el-select
          v-model="tags"
          multiple
          filterable
          clear
          placeholder="请选择"
        >
          <el-option
            v-for="item in groupArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          style="width: 160px"
          v-model="markName"
          placeholder="标注名称"
        ></el-input>
        <el-button
          type="primary"
          style="height:28px;margin-top: 4px;"
          @click="search"
          >查询</el-button
        >
      </div>
    </div>
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
      <template v-if="locationPoint.length > 0">
        <bm-label
          v-for="item in locationPoint"
          :key="item.lng + item.lat + item.name"
          :content="item.name"
          :position="{ lng: item.lng, lat: item.lat }"
          :labelStyle="{ color: 'red', fontSize: '12px' }"
          :offset="{ width: 0, height: -75 }"
          title="Hover me"
        />
      </template>
      <bm-control class="sample">
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
            <input type="text" value="" id="addinfoName" />
          </el-form-item>
          <el-form-item label="标点类别">
            <select id="addtag" style="width: 162px">
              <option
                :value="item.id"
                v-for="item in groupArr"
                :key="item.id"
                >{{ item.name }}</option
              >
            </select>
          </el-form-item>
          <el-form-item label="备注">
            <textarea type="text" value="" id="addinfoRemark" />
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
          <p><span>名称:</span><span id="detaisName"></span></p>
          <p><span>备注:</span><span id="detaisbrief"></span></p>
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
            <input type="text" value="" id="editinfoName" />
          </el-form-item>
          <el-form-item label="标点类别">
            <select id="edittag" style="width: 162px">
              <option
                :value="item.id"
                v-for="item in groupArr"
                :key="item.id"
                >{{ item.name }}</option
              >
            </select>
          </el-form-item>
          <el-form-item label="备注">
            <textarea type="text" value="" id="editinfoRemark" />
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
    <operation v-if="operationShow" ref="operationDom"></operation>
  </div>
</template>

<script>
import operation from "./operation.vue";
import {
  baseTag,
  getBaseThing,
  addBaseThing,
  editBaseThing,
  deleteBaseThing
} from "@/api/label/index";
export default {
  data() {
    return {
      loading: false,
      active: false,
      operationShow: false,
      zoom: 20,
      resolve_self: null,
      markName: "",
      groupArr: [],
      groupName: "",
      location: "",
      tags: [],
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
        remark: "",
        markType: ""
      },
      infoWindow: null, // 新增信息框
      detailInfoWindow: null, // 详情信息框
      editInfowindow: null, // 编辑信息框
      markObject: null, // 现在展开的是哪个
      markArr: [], // 存放的mark数组
      self_resolve: null,
      self_pormise: null
    };
  },
  components: {
    operation
  },
  created() {
    window.sclick = function(val) {
      console.log(val);
    };
    this.init();
  },
  methods: {
    init() {
      this.self_pormise = new Promise(resolve => {
        this.self_resolve = resolve;
      });
      baseTag().then(res => {
        this.groupArr = res.result;
        this.$nextTick(() => {
          this.self_pormise.then(() => {
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
            this.editInfowindow = new this.$refs.map.BMap.InfoWindow(
              editConten,
              {
                offset: { width: 20, height: -50 }
              }
            );
            this.getMark();
          });
        });
      });
    },
    search() {
      this.getMark({ name: this.markName }, this.tags.join(","));
    },
    getMark(name = "", tags = "") {
      getBaseThing(name, tags).then(res => {
        this.markArr.forEach(item => {
          this.$refs.map.map.removeOverlay(item);
        });
        this.markArr = [];
        this.$refs.map.map.removeOverlay(this.markObject);
        this.locationPoint = [];
        this.locationPoint = res.result.map(item => {
          this.add_mark(
            {
              lng: item.longitude,
              lat: item.latitude
            },
            item.id,
            "init"
          );
          return {
            id: item.id,
            tags: item.tags,
            name: item.name,
            brief: item.brief,
            lng: item.longitude,
            lat: item.latitude
          };
        });
        console.log(33, this.locationPoint);
        const view = this.$refs.map.map.getViewport(this.locationPoint);
        this.centerPoint = view.center;
        this.zoom = view.zoom;
        this.$forceUpdate();
      });
    },
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
        this.iconMarkPosition.left = e.clientX - this.disX + 30;
        this.iconMarkPosition.top = e.clientY - this.disY + 50;
      }
    },
    addMark(e) {
      this.dragFlag = true;
      this.$nextTick(() => {
        e = e || window.event;
        this.disX = e.clientX - e.target.offsetLeft;
        this.disY = e.clientY - e.target.offsetTop;
        this.iconMarkPosition.left = e.clientX - this.disX + 30;
        this.iconMarkPosition.top = e.clientY - this.disY + 50;
      });
    },
    add_mark(ite, id, type) {
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
        marker.id = id;
        this.markArr.push(marker);
        this.$refs.map.map.addOverlay(marker);
        if (type !== "init") {
          marker.openInfoWindow(_this.infoWindow);
        }
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
          _this.markObject = null;
          _this.markObject = this;
          let editDatas = {};
          for (let i = 0; i < _this.locationPoint.length; i++) {
            if (_this.locationPoint[i].id === _this.markObject.id) {
              editDatas = _this.locationPoint[i];
              break;
            }
          }
          this.openInfoWindow(_this.detailInfoWindow);
          document.getElementById("detaisName").innerHTML = editDatas.name;
          document.getElementById("detaisbrief").innerHTML = editDatas.brief;
          //判断窗口的打开状态
          if (!_this.detailInfoWindow.isOpen()) {
            //如果没有打开，则监听打开事件，获取按钮，添加事件
            _this.detailInfoWindow.addEventListener("open", function() {
              document.getElementById("edit").onclick = function() {
                _this.edit(editDatas);
              };
              document.getElementById("cancel").onclick = function() {
                _this.remove();
              };
              document.getElementById("operation").onclick = function() {
                _this.operation();
              };
            });
          } else {
            //如果已经打开，直接获取按钮，添加事件
            document.getElementById("edit").onclick = function() {
              _this.edit(editDatas);
            };
            document.getElementById("cancel").onclick = function() {
              _this.remove();
            };
            document.getElementById("operation").onclick = function() {
              _this.operation();
            };
          }
        });
      });
    },
    handler() {
      this.$refs.map.map.setMapType(BMAP_SATELLITE_MAP);
      this.self_resolve();
    },
    getPoint(e) {
      if (!this.dragFlag) return;
      this.dragFlag = false;
      this.locationPoint.push({
        lng: e.point.lng,
        lat: e.point.lat,
        name: "未保存"
      });
      this.add_mark(this.locationPoint[this.locationPoint.length - 1]);
    },
    save() {
      if (this.markObject.id) {
        let name = document.getElementById("editinfoName").value;
        let remark = document.getElementById("editinfoRemark").value;
        let tag = document.getElementById("edittag").value;
        if (!name) {
          return this.$message.warning("请输入名称");
        }
        if (!tag) {
          return this.$message.warning("请选择标点类型");
        }
        let datas = {
          name: name,
          brief: remark,
          flag: "red",
          latitude: this.markObject.point.lat,
          longitude: this.markObject.point.lng
        };
        editBaseThing(datas, this.markObject.id, tag).then(() => {
          this.$message.success("编辑标点成功");
          this.markObject.closeInfoWindow();
          this.getMark();
        });
      } else {
        let name = document.getElementById("addinfoName").value;
        let remark = document.getElementById("addinfoRemark").value;
        let tag = document.getElementById("addtag").value;
        if (!name) {
          return this.$message.warning("请输入名称");
        }
        if (!tag) {
          return this.$message.warning("请选择标点类型");
        }
        let datas = {
          name: name,
          brief: remark,
          flag: "red",
          latitude: this.markObject.point.lat,
          longitude: this.markObject.point.lng
        };
        addBaseThing(datas, tag).then(() => {
          this.$message.success("新增标点成功");
          this.markObject.closeInfoWindow();
          this.getMark();
        });
      }
    },
    edit(obj) {
      this.markObject.openInfoWindow(this.editInfowindow);
      document.getElementById("editinfoName").value = obj.name;
      document.getElementById("editinfoRemark").value = obj.brief;
      if (obj.tags) {
        document.getElementById("edittag").value = obj.tags;
      }
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
    remove() {
      // 删除对应的locationPoint对应的数据
      if (this.markObject.id) {
        deleteBaseThing(this.markObject.id).then(() => {
          for (let i = 0; i < this.locationPoint.length; i++) {
            if (
              this.locationPoint[i].lng === this.markObject.point.lng &&
              this.locationPoint[i].lat === this.markObject.point.lat
            ) {
              this.locationPoint.splice(i, 1);
              this.$refs.map.map.removeOverlay(this.markObject);
              break;
            }
          }
          this.$message.success("标点删除成功");
        });
      } else {
        for (let i = 0; i < this.locationPoint.length; i++) {
          if (
            this.locationPoint[i].lng === this.markObject.point.lng &&
            this.locationPoint[i].lat === this.markObject.point.lat
          ) {
            this.locationPoint.splice(i, 1);
            break;
          }
        }
        this.$refs.map.map.removeOverlay(this.markObject);
      }
    },
    operation() {
      this.operationShow = true;
      this.$nextTick(() => {
        if (this.markObject.id) {
          this.$refs.operationDom.open(this.markObject.id);
        } else {
          this.$message.warning("请先保存");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  height: calc(100% - 40px);
}
.classFlex {
  display: flex;
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
  padding-right: 50px;
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
</style>
