<template>
  <div class="airshow">
    <ve-gauge :data="chartData" :settings="chartSettings" />
  </div>
</template>
<script>
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        temperature: "温度"
      },
      dataName: {
        temperature: "°C"
      },
      seriesMap: {
        temperature: {
          min: 0,
          max: 80,
          axisLine: {
            lineStyle: {
              color: [[0.09, "lime"], [0.82, "#1e90ff"], [1, "#ff4500"]],
              width: 3
            }
          },
          axisTick: {
            length: 15,
            lineStyle: {
              color: "auto",
              shadowColor: "#fff",
              shadowBlur: 10
            }
          }
        }
      }
    };
    return {
      chartData: {
        columns: ["type", "value"],
        rows: [{ type: "temperature", value: 60 }]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.airshow {
  width: 100%;
}
</style>
