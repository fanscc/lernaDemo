<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      unique-opened
    >
      <Logo></Logo>
      <div class="menu_tree_scroll scroll_hidden">
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import Logo from "./Logo";
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.menu_tree_scroll {
  height: calc(100% - 56px);
  overflow-y: auto;
  overflow-x: hidden;
}
/*滚动条样式*/
.menu_tree_scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}

.menu_tree_scroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #8899a7;
}

.menu_tree_scroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  background: #ededed;
}
</style>
