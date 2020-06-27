<template>
  <baidu-map
    ref="map"
    :center="markerPoint"
    :zoom="16"
    class="map"
    @click="getPoint"
  >
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']"
      anchor="BMAP_ANCHOR_TOP_LEFT"
    />
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
    <bm-marker :position="selectPoint" />
    <bm-control>
      <div style="margin-top: 8px;margin-left: 100px;">
        <p
          style="background: #fff;margin: 0 0 5px 0;height:40px;line-height:40px; padding: 0 10px"
        >
          <label>选中的经度:</label> <span>{{ selectPoint.lng }}</span>
        </p>
        <p
          style="background: #fff;margin: 0 0 5px 0;height:40px;line-height:40px; padding: 0 10px"
        >
          <label>选中的维度:</label> <span>{{ selectPoint.lat }}</span>
        </p>
        <el-button type="primary" @click="save">确认选择</el-button>
      </div>
    </bm-control>
  </baidu-map>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      show: true,
      markerPoint: { lng: 116.404, lat: 39.915 },
      selectPoint: {}
    };
  },
  methods: {
    getPoint(e) {
      this.$set(this.selectPoint, "lng", e.point.lng);
      this.$set(this.selectPoint, "lat", e.point.lat);
    },
    save() {
      this.$emit("emitAdress", this.selectPoint);
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>
