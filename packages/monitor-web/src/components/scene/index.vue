<template>
  <div class="scene_conten">
    <el-button type="primary" style="margin-bottom: 10px;" @click="savePosition"
      >确 定</el-button
    >
    <div
      id="scene"
      ref="scene_Dom"
      :style="{ backgroundImage: 'url(' + gatePic + ')' }"
      @click="selectedImg"
    >
      <svg-icon
        v-show="isShow"
        id="position"
        :style="{ left: styleObject.left + 'px', top: styleObject.top + 'px' }"
        icon-class="position"
        style="height: 30px;width: 30px;position:absolute"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "Scene",
  props: {
    gatePic: {
      type: String,
      default: require("../../assets/scene/scene.jpg")
    }
  },
  data() {
    return {
      isShow: false,
      styleObject: {
        left: 0,
        top: 0
      }
    };
  },
  methods: {
    selectedImg(e) {
      const x = e.offsetX;
      const y = e.offsetY;
      this.addImg(x, y);
    },
    addImg(x, y) {
      this.isShow = true;
      this.styleObject.left = x - 15;
      this.styleObject.top = y - 15;
    },
    savePosition() {
      const x = this.styleObject.left / this.$refs.scene_Dom.clientWidth;
      const y = this.styleObject.top / this.$refs.scene_Dom.clientHeight;
      this.$emit("styleObject_method", {
        left: x.toFixed(2),
        top: y.toFixed(2)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#scene {
  width: 100%;
  height: 320px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  position: relative;
}
</style>
