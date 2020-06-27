<template>
  <div class="cascader">
    <el-cascader v-model="nodevalue" :props="props" style="width:250px;" />
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "Cascader",
  props: {
    // 代表着几级级联暂时最多支持3级
    series: {
      type: Number,
      default: 1
    },
    // 后台的接口url
    path: {
      type: Array,
      default: () => []
    },
    // 显示的名字
    nameArr: {
      type: Array,
      default: () => [
        { name: "groupName", id: "groupId" },
        { name: "gateAlias", id: "gateId" },
        { name: "nodeName", id: "nodeId" }
      ]
    }
  },
  data() {
    const _that = this;
    return {
      options: [], // 数据
      props: {
        // 名字转换
        label: "name",
        value: "items",
        children: "children",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level === 0) {
            // 第一级
            _that.level_frist(_that, resolve);
          } else if (level === 1) {
            // 获取第2级菜单
            _that.level_second(node, _that, resolve, level);
          } else if (level === 2) {
            // 获取三级菜单
            _that.level_three(node, _that, resolve, level);
          }
        }
      },
      nodevalue: [] // 选中的信息
    };
  },
  watch: {
    nodevalue(val) {
      if (val.length === this.series + 1) {
        this.$emit("gateSwitch", val);
      }
    }
  },
  created() {},
  methods: {
    level_frist(_that, resolve) {
      // 第一级
      request({
        url: _that.path[0],
        method: "get"
      }).then(res => {
        const nodes = res.result.map(item => ({
          name: item[_that.nameArr[0].name],
          groupId: item[_that.nameArr[0].id],
          items: {
            name: item[_that.nameArr[0].name],
            groupId: item[_that.nameArr[0].id]
          }
        }));
        resolve(nodes);
      });
    },
    level_second(node, _that, resolve, level) {
      // 获取第2级菜单
      const groupId = node.data.groupId;
      request({
        url: _that.path[1] + "=" + groupId,
        method: "get",
        noloading: true
      }).then(res => {
        const nodes = res.result.map(item => ({
          name: item[_that.nameArr[1].name],
          gateId: item[_that.nameArr[1].id],
          map: item.map || "",
          items: {
            name: item[_that.nameArr[1].name],
            gateId: item[_that.nameArr[1].id],
            map: item.map || "",
            isGps: item.isGps || 2
          },
          leaf: level === _that.series
        }));
        resolve(nodes);
      });
    },
    level_three(node, _that, resolve, level) {
      const gateId = node.data.gateId;
      request({
        url: _that.path[2] + `/${gateId}/node`,
        method: "get",
        noloading: true
      }).then(res => {
        const nodes = res.result.map(item => ({
          name: item[_that.nameArr[2].name],
          nodeId: item[_that.nameArr[2].id],
          lon: item.lon || "",
          lat: item.lat || "",
          items: {
            name: item[_that.nameArr[2].name],
            nodeId: item[_that.nameArr[2].id],
            lon: item.lon || "",
            lat: item.lat || ""
          },
          leaf: level === _that.series
        }));
        resolve(nodes);
      });
    }
  }
};
</script>

<style lang="sass" scoped></style>
