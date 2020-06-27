<template>
  <div class="home_center">
    <div class="provinceInfo" v-if="showInfoStatus">
      <div class="top-pro">
        <h3 class="address">{{ title }}</h3>
      </div>
      <ul>
        <li>
          <span class="titles">网关数总数：</span>
          <span>{{ gatewayTotal }}</span>
        </li>
        <li>
          <span class="titles">节点总数：</span>
          <span>{{ nodeTotal }}</span>
        </li>
      </ul>
    </div>
    <div id="center" style="width: 100%;"></div>
    <dialogMap ref="dialogMapDom"></dialogMap>
  </div>
</template>

<script>
// @ is an alias to /src
import provinces from "@/assets/js/provinces";
import { yellow } from "color-name";
import dialogMap from "./dialogMap";
import axios from "axios";
export default {
  name: "center",
  data() {
    return {
      baseOption: {},
      chartInstance: "",
      showInfoStatus: true,
      title: "",
      gatewayTotal: 0,
      nodeTotal: 0,
      geoCoordMap: {
        广州市: { value: 32 },
        清远市: { value: 22 },
        桂林市: { value: 13 },
        湛江市: { value: 6 }
      }
    };
  },
  created() {
    this.baseOption = {
      tooltip: {
        trigger: "item",
        formatter: function(params) {
          return (
            params.name +
            " : " +
            (params.data.value[2] ? params.data.value[2] : 0)
          );
        },
        extraCssText: "height:20px;"
      },
      toolbox: {
        show: false,
        orient: "vertical",
        left: "500",
        top: "center"
      },
      // center: [103.49,36.03],
      animationDuration: 10000,
      animationEasing: "cubicOut", //
      animationDurationUpdate: 1000 // 翻页时候的动画时间
    };
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    initMap() {
      this.chartInstance = this.$echarts.init(
        document.getElementById("center")
      );
      this.getMap("华南大区");
      this.initAction();
    },
    initAction() {
      let vm = this;
      this.chartInstance.on("mouseover", params => {
        vm.showInfoStatus = true;
        vm.title = params.name;
        vm.gatewayTotal = params.data.value[2] || 0;
        vm.nodeTotal = 10;
      });
      this.chartInstance.on("mouseout", () => {
        //  vm.showInfoStatus = false;
        vm.title = "";
        vm.gatewayTotal = 0;
        vm.nodeTotal = 0;
      });
      this.chartInstance.on("click", params => {
        console.log(params);
        this.$refs.dialogMapDom.init({ name: "英德", gateId: 88, isGps: 2 });
      });
    },
    convertData(geoCoordMap, data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          let valueArr = data[i].value.slice(0); // [1,2]
          valueArr.push(geoCoord.value);
          res.push({
            name: data[i].name,
            value: valueArr
          });
          valueArr = null;
        }
      }
      console.log(res);
      return res;
    },
    mapConvertData(geoCoordMap, data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          let valueArr = data[i].value.slice(0); // [1,2]
          valueArr.push(geoCoord.value);
          res.push({
            name: data[i].name,
            value: valueArr
          });
          valueArr = null;
        } else {
          res.push({
            name: data[i].name,
            value: data[i].value
          });
        }
      }
      return res;
    },
    // 渲染地图
    renderMap(mamName, data) {
      let vm = this;
      this.baseOption.series = [
        {
          name: "散点",
          type: "scatter",
          coordinateSystem: "geo",
          data: vm.convertData(vm.geoCoordMap, data),
          symbolSize: function(val) {
            return val[2] / 10;
          },
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: "#05C3F9"
            }
          }
        },
        {
          type: "map",
          map: mamName,
          geoIndex: 0,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
              textStyle: {
                color: "#fff"
              }
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "#031525",
              borderColor: "#3B5077"
            },
            emphasis: {
              areaColor: "#2B91B7"
            }
          },
          animation: false,
          data: vm.mapConvertData(vm.geoCoordMap, data)
        },
        {
          name: "点",
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "pin", //气泡
          symbolSize: function(val) {
            let sizeVal = val[2] * 3;
            if (sizeVal < 40) {
              sizeVal = 40;
            }
            if (sizeVal > 130) {
              sizeVal = 130;
            }
            return sizeVal;
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
                fontSize: 9
              },
              formatter: function(params) {
                return params.value[2];
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#F62157" //标志颜色
            }
          },
          zlevel: 6,
          data: vm.convertData(vm.geoCoordMap, data),
          animation: false
        },
        {
          name: "Top 5",
          type: "effectScatter",
          coordinateSystem: "geo",
          data: vm.convertData(vm.geoCoordMap, data),
          symbolSize: function(val) {
            return val[2] / 1.2;
          },
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke"
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: "yellow",
              shadowBlur: 10,
              shadowColor: "yellow"
            }
          },
          zlevel: 1
        }
      ];
      this.baseOption.visualMap = {
        show: true,
        min: 0,
        max: 30,
        left: "left",
        top: "bottom",
        text: ["高", "低"], // 文本，默认为数值文本
        calculable: true,
        hoverLink: true,
        seriesIndex: [1],
        inRange: {
          // color: ['#3B5077', '#031525'] // 蓝黑
          // color: ["#ffc0cb", "#800080"] // 红紫
          // color: ['#3C3B3F', '#605C3C'] // 黑绿
          // color: ["#0f0c29", "#302b63", "#24243e"] // 黑紫黑
          // color: ['#23074d', '#cc5333'] // 紫红
          color: ["#00467F", "#A5CC82"] // 蓝绿
          // color: ["#1488CC", "#2B32B2"] // 浅蓝
          // color: ["#00467F", "#A5CC82"] // 蓝绿
          // color: ['#00467F', '#A5CC82'] // 蓝绿
          // color: ['#00467F', '#A5CC82'] // 蓝绿
          // color: ['#00467F', '#A5CC82'] // 蓝绿
        },
        textStyle: {
          color: yellow
        }
      };
      this.baseOption.geo = {
        map: mamName,
        roam: true, // 控制是地图是否可以放大缩小
        regions: [
          {
            name: "南海诸岛",
            value: 0,
            itemStyle: {
              normal: {
                opacity: 0,
                label: {
                  show: false
                }
              }
            }
          }
        ],
        label: {
          normal: {
            show: false,
            textStyle: {
              color: "#999",
              fontSize: 13
            }
          },
          emphasis: {
            show: false,
            textStyle: {
              color: "#fff",
              fontSize: 13
            }
          }
        },
        zoom: 1,
        left: "center",
        top: "center",
        layoutCenter: ["50%", "50%"], //地图中心位置
        itemStyle: {
          normal: {
            areaColor: "#2d4391",
            borderColor: "#72EFEA",
            borderWidth: 1,
            opacity: 0.7
          },
          emphasis: {
            areaColor: "#72EFEA",
            opacity: 1,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        }
      };
      //渲染地图
      setTimeout(function() {
        vm.chartInstance.setOption(vm.baseOption);
      }, 100);
    },
    getMap(params) {
      // let index = this.dataToolTip.findIndex(item => {
      //   return item.name === params;
      // });
      let arrName = ["广东", "广西", "海南", "福建", "云南", "贵州"];
      let allApi = arrName.map(item => {
        return axios.get(`/mapJson/provinces/${provinces[item]}.json`);
      });
      Promise.all(allApi).then(res => {
        let provincesData = {
          type: "FeatureCollection",
          UTF8Encoding: true,
          features: []
        };
        let data;
        res.map(item => {
          data = item.data.features;
          provincesData.features = [...provincesData.features, ...data];
        });
        this.$echarts.registerMap(params, provincesData);
        let d = [];
        for (let i = 0; i < provincesData.features.length; i++) {
          d.push({
            name: provincesData.features[i].properties.name,
            value: provincesData.features[i].properties.cp
          });
        }
        this.renderMap(params, d);
      });
    }
  },
  components: {
    dialogMap
  }
};
</script>

<style lang="scss" scoped>
.home_center {
  width: 50%;
  height: 100%;

  position: relative;
}
ul,
li {
  list-style: none;
}
.provinceInfo {
  // background: #24419a;
  position: absolute;
  top: 50px;
  left: 50%;
  z-index: 8;
  transform: translateX(-50%);
  background: url("../../../assets/img/tk_bg.png") center no-repeat;
  background-size: contain;
  width: 335px;
  height: 120px;
  margin: 0 auto;
  .top-pro {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 30px;
    h3 {
      font-size: 24px;
      margin: 10px 0;
      font-weight: normal;
    }
    .address {
      color: #fff;
      width: 100%;
      height: 30px;
      text-align: center;
    }
    .sort {
      color: #ff9900;
    }
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      box-sizing: border-box;
      line-height: 30px;
      color: #ff9900;
      padding: 0 30px;
      .titles {
        color: #fff;
        width: 60%;
        display: inline-block;
      }
    }
  }
}
#center {
  height: 100%;
}
</style>
