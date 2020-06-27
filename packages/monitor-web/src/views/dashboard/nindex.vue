<template>
  <div class="dashboard">
    <!-- <mapScene/> -->
    <mapTochoose />
  </div>
</template>

<script>
import mapTochoose from "@/components/scene/mapTochoose.vue";
export default {
  name: "DiscountFigure",
  components: {
    mapTochoose
  },
  data: function() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.dashboard {
  height: 100%;
  overflow-x: hidden;
}
.iframe_chart_conten {
  width: 100%;
  height: calc(100% - 20px);
  overflow-x: hidden;
}
</style>
