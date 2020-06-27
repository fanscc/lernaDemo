<template>
  <el-menu-item
    v-if="sidebarLogo"
    :class="{ 'submenu-title-noDropdown': isCollapse }"
    index="0"
    style="pointer-events: none;height: 56px;padding: 0"
  >
    <!-- 缩小时显示的logo，可以自定义，这里直接使用图标库中的 -->
    <svg-icon v-if="isCollapse" icon-class="run" />
    <!--正常状态下显示的，可以使用本地的logoImg-->
    <div class="logo-con" style="text-align: center;">
      <!-- <img
        src="../../../../assets/logo/logo.png"
        style="width:130px;height:50px;"
      /> -->
      <span style="font-size: 20px;color:#fff;font-weight: bold;"
        >华山众创</span
      >
    </div>
  </el-menu-item>
</template>

<script>
// import logoImg from '@/assets/logo/logo.png'
import { mapState } from "vuex";
export default {
  name: "Logo",
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // logoImg: logoImg
    };
  },
  computed: {
    ...mapState({
      sidebarLogo: state => state.settings.sidebarLogo
    })
  }
};
</script>
<style scoped>
.logo-con {
  position: relative;
  height: 56px;
  background-color: #446cb3;
  padding: 15px 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
