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
  </div>
</template>

<script>
// @ is an alias to /src
import provinces from "@/assets/js/provinces";
import { yellow } from "color-name";
export default {
  name: "home",
  data() {
    return {
      baseOption: {},
      chartInstance: "",
      showInfoStatus: true,
      title: "",
      gatewayTotal: 0,
      nodeTotal: 0,
      dataToolTip: [
        //地图数据
        {
          name: "新疆大区",
          arrName: ["新疆"],
          value: 1
        },
        {
          name: "晋蒙西大区",
          arrName: ["山西", "内蒙古"],
          value: 2
        },
        {
          name: "山东大区",
          arrName: ["山东"],
          value: 3
        },
        {
          name: "陕甘宁青大区",
          arrName: ["陕西", "甘肃", "宁夏", "青海"],
          value: 4
        },
        {
          name: "北京大区",
          arrName: ["北京"],
          value: 5
        },
        {
          name: "安徽大区",
          arrName: ["安徽"],
          value: 6
        },
        {
          name: "津冀大区",
          arrName: ["天津", "河北"],
          value: 7
        },
        {
          name: "常温川藏渝大区",
          arrName: ["重庆", "四川", "西藏"],
          value: 8
        },
        {
          name: "江苏大区",
          arrName: ["江苏"],
          value: 9
        },
        {
          name: "常温云贵广大区",
          arrName: ["云南", "广西", "贵州"],
          value: 10
        },
        {
          name: "河南大区",
          arrName: ["河南"],
          value: 11
        },
        {
          name: "上海大区",
          arrName: ["上海"],
          value: 12
        },
        {
          name: "常温华中大区",
          arrName: ["湖南", "湖北"],
          value: 13
        },
        {
          name: "广东海南大区",
          arrName: ["广东", "海南"],
          value: 14
        },
        {
          name: "常温闽赣大区",
          arrName: ["福建", "江西"],
          value: 15
        },
        {
          name: "浙江大区",
          arrName: ["浙江"],
          value: 16
        },
        {
          name: "东北大区",
          arrName: ["黑龙江", "吉林", "辽宁"],
          value: 17
        }
      ],
      geoCoordMap: {
        新疆大区: [86.24, 39.54],
        晋蒙西大区: [112.32, 42.5],
        山东大区: [117.28, 36.13],
        陕甘宁青大区: [98.2, 36.22],
        北京大区: [116.15, 40.08],
        安徽大区: [117.04, 30.39],
        津冀大区: [115.49, 38.03],
        常温川藏渝大区: [88.2, 33.32],
        江苏大区: [120.15, 33.08],
        常温云贵广大区: [105.04, 25.08],
        河南大区: [113.23, 33.03],
        上海大区: [122.25, 31.08],
        常温华中大区: [112.14, 29.08],
        广东海南大区: [113.15, 23.08],
        常温闽赣大区: [117.43, 26.53],
        浙江大区: [120.24, 29.31],
        东北大区: [125.42, 44.05]
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
            (params.value[2] ? params.value[2] : params.value)
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
      this.$axios.get("/mapJson/china.json").then(res => {
        this.china = res.data;
        let params = {
          names: ["北京"],
          properties: {
            name: "北京大区"
          }
        };
        let params1 = {
          names: ["黑龙江", "吉林", "辽宁"],
          properties: {
            name: "东北大区"
          }
        };
        let params2 = {
          names: ["山东"],
          properties: {
            name: "山东大区"
          }
        };
        let params3 = {
          names: ["新疆"],
          properties: {
            name: "新疆大区"
          }
        };
        let params4 = {
          names: ["山西", "内蒙古"],
          properties: {
            name: "晋蒙西大区"
          }
        };
        let params5 = {
          names: ["陕西", "甘肃", "宁夏", "青海"],
          properties: {
            name: "陕甘宁青大区"
          }
        };
        let params6 = {
          names: ["安徽"],
          properties: {
            name: "安徽大区"
          }
        };
        let params7 = {
          names: ["天津", "河北"],
          properties: {
            name: "津冀大区"
          }
        };
        let params8 = {
          names: ["重庆", "四川", "西藏"],
          properties: {
            name: "常温川藏渝大区"
          }
        };
        let params9 = {
          names: ["江苏"],
          properties: {
            name: "江苏大区"
          }
        };
        let params10 = {
          names: ["云南", "广西", "贵州"],
          properties: {
            name: "常温云贵广大区"
          }
        };
        let params11 = {
          names: ["河南"],
          properties: {
            name: "河南大区"
          }
        };
        let params12 = {
          names: ["上海"],
          properties: {
            name: "上海大区"
          }
        };
        let params13 = {
          names: ["浙江"],
          properties: {
            name: "浙江大区"
          }
        };
        let params14 = {
          names: ["湖南", "湖北"],
          properties: {
            name: "常温华中大区"
          }
        };
        let params15 = {
          names: ["广东", "海南"],
          properties: {
            name: "广东海南大区"
          }
        };
        let params16 = {
          names: ["福建", "江西"],
          properties: {
            name: "常温闽赣大区"
          }
        };
        this.mergeProvinces(this.china, params.names, params.properties);
        this.mergeProvinces(this.china, params1.names, params1.properties);
        this.mergeProvinces(this.china, params2.names, params2.properties);
        this.mergeProvinces(this.china, params3.names, params3.properties);
        this.mergeProvinces(this.china, params4.names, params4.properties);
        this.mergeProvinces(this.china, params5.names, params5.properties);
        this.mergeProvinces(this.china, params6.names, params6.properties);
        this.mergeProvinces(this.china, params7.names, params7.properties);
        this.mergeProvinces(this.china, params8.names, params8.properties);
        this.mergeProvinces(this.china, params9.names, params9.properties);
        this.mergeProvinces(this.china, params10.names, params10.properties);
        this.mergeProvinces(this.china, params11.names, params11.properties);
        this.mergeProvinces(this.china, params12.names, params12.properties);
        this.mergeProvinces(this.china, params13.names, params13.properties);
        this.mergeProvinces(this.china, params14.names, params14.properties);
        this.mergeProvinces(this.china, params15.names, params15.properties);
        this.mergeProvinces(this.china, params16.names, params16.properties);
        console.log(this.china);
        this.$echarts.registerMap("china", this.china);
        this.renderMap("china", this.dataToolTip);
        this.initAction();
      });
    },
    initAction() {
      let vm = this;
      this.chartInstance.on("mouseover", params => {
        vm.showInfoStatus = true;
        vm.title = params.name;
        vm.gatewayTotal = 2;
        vm.nodeTotal = 10;
      });
      this.chartInstance.on("mouseout", () => {
        //  vm.showInfoStatus = false;
        vm.title = "";
        vm.gatewayTotal = 0;
        vm.nodeTotal = 0;
      });
      this.chartInstance.on("click", params => {
        this.getMap(params.name);
      });
    },
    convertData(geoCoordMap, data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          // {name: 'cc', value: [88,11, 2]}
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
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
              show: true
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
          data: data
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
          data: vm.convertData(
            vm.geoCoordMap,
            data
              .sort(function(a, b) {
                return b.value - a.value;
              })
              .slice(0, 5)
          ),
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
        max: 20,
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
        // roam: true, // 控制是地图是否可以放大缩小
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
    // 合并区块1
    mergeProvinces(chinaJson, names, properties) {
      let features = chinaJson.features;
      let polygons = [];
      let polygons2 = [];
      // 将指定省的polygon保存下来，并将省的数据从地图中删除
      for (let i = 0, iLen = names.length; i < iLen; i++) {
        let polygonsCoordinates = [];
        let polygonsEncodeOffsets = [];
        for (let j = 0, jLen = features.length; j < jLen; j++) {
          if (features[j].properties.name === names[i]) {
            if (features[j].geometry.coordinates[0].constructor === String) {
              //合并coordinates
              for (
                let l = 0;
                l < features[j].geometry.coordinates.length;
                l++
              ) {
                polygonsCoordinates.push(features[j].geometry.coordinates[l]);
              }
            } else if (
              features[j].geometry.coordinates[0].constructor === Array
            ) {
              for (
                let k = 0;
                k < features[j].geometry.coordinates.length;
                k++
              ) {
                for (
                  let d = 0;
                  d < features[j].geometry.coordinates[k].length;
                  d++
                ) {
                  polygonsCoordinates.push(
                    features[j].geometry.coordinates[k][d]
                  );
                }
              }
            }
            if (features[j].geometry.encodeOffsets[0].constructor === String) {
              //合并encodeOffsets
              polygonsEncodeOffsets.push(features[j].geometry.encodeOffsets);
            } else if (
              features[j].geometry.encodeOffsets[0].constructor === Array
            ) {
              for (
                let k = 0;
                k < features[j].geometry.encodeOffsets.length;
                k++
              ) {
                if (
                  features[j].geometry.encodeOffsets[k][0].constructor === Array
                ) {
                  for (
                    let e = 0;
                    e < features[j].geometry.encodeOffsets[k].length;
                    e++
                  ) {
                    polygonsEncodeOffsets.push(
                      features[j].geometry.encodeOffsets[k][e]
                    );
                  }
                } else {
                  polygonsEncodeOffsets.push(
                    features[j].geometry.encodeOffsets[k]
                  );
                }
              }
            }
            features.splice(j, 1);
            break;
          }
        }
        polygons.push(polygonsCoordinates);
        polygons2.push(polygonsEncodeOffsets);
      }
      for (let a = 0; a < names.length; a++) {
        let feature = {
          id: features.length.toString(),
          type: "FeatureCollection",
          geometry: {
            type: "Polygon",
            coordinates: polygons[a],
            encodeOffsets: polygons2[a]
          },
          properties: {
            name: properties.name || "",
            childNum: polygons[a].length
          }
        };
        if (properties.cp) {
          feature.properties.cp = properties.cp;
        }

        // 将新的合并区域添加到地图中
        features.push(feature);
      }
      chinaJson.features = features;
    },
    getMap(params) {
      // let index = this.dataToolTip.findIndex(item => {
      //   return item.name === params;
      // });
      let arrName = ["广东", "广西", "海南", "福建", "云南", "贵州"];
      let allApi = arrName.map(item => {
        return this.$axios.get(`/mapJson/provinces/${provinces[item]}.json`);
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
            name: provincesData.features[i].properties.name
          });
        }
        this.renderMap(params, d);
      });
    }
  },
  components: {}
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
