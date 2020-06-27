<template>
  <ve-histogram
    :tooltip-visible="true"
    :x-axis="xAxis"
    :y-axis="yAxis"
    :title="title"
    :series="series"
  ></ve-histogram>
</template>

<script>
export default {
  data() {
    this.yAxis = [
      {
        axisLabel: {
          show: true,
          textStyle: {
            color: "white", //这里是改变字体颜色
            fontSize: 12 //字体大小
          }
        },
        axisLine: {
          show: true, //是否显示Y轴线
          lineStyle: {
            color: "#fff", //Y轴线颜色
            width: 1, //线的大小
            type: "solid" //Y轴线的类型
          }
        },
        offset: 6 //偏移量
      }
    ];
    this.xAxis = [
      {
        data: ["桂林市", "清远市", "广州市", "湛江市"],
        name: "城市",
        axisLabel: {
          show: true,
          interval: 0, //横轴信息全部显示
          textStyle: {
            color: "white", //这里是改变字体颜色
            fontSize: 12 //字体大小
          }
        }
      }
    ];
    this.series = [
      {
        name: "网关数量",
        type: "bar",
        barWidth: "50%", //这里是改变柱子的宽度
        data: [13, 32, 22, 6],
        label: { show: true, position: "top", fontSize: 18 },
        itemStyle: {
          //通常情况下：
          normal: {
            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
            color: function(params) {
              var colorList = ["#65d186", "#f67287", "#f29e3c", "#c05bdd"]; //每根柱子的颜色
              return colorList[params.dataIndex];
            }
          }
        }
      }
    ];
    this.title = {
      text: "华南地区网关数量统计",
      x: "center",
      textStyle: {
        color: "#fff", //标题颜色
        fontWeight: "bold", //粗体
        fontSize: 24 //字体大小
      }
    };
    return {};
  }
};
</script>
