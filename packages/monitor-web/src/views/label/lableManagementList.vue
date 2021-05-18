<template>
  <div class="labelList">
    <div class="labelAdd">
      <el-input
        style="width: 160px"
        v-model="markName"
        placeholder="标注名称"
        clearable
      ></el-input>
      <el-select
        clearable
        v-model="tags"
        multiple
        filterable
        clear
        placeholder="请选择"
      >
        <el-option
          v-for="item in groupArr"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        style="height:28px;margin-top: 4px;"
        @click="search"
        >查询</el-button
      >
      <el-button type="primary" icon="el-icon-plus" @click="addMark"
        >新增标注</el-button
      >
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :cell-style="bodyStyle"
        :header-cell-style="headerStyle"
        stripe
        border
        show-overflow-tooltip
        style="width: 100%"
        max-height="600px"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="标注名称" />
        <el-table-column prop="latitude" label="经度" />
        <el-table-column prop="longitude" label="纬度" />
        <el-table-column prop="tags" label="品类">
          <template slot-scope="scope">
            <span>{{ scope.row.tags[0].name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brief" label="备注" />
        <el-table-column fixed="right" label="操作" width="180" center>
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editLabel(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="deleted(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <addLabelDialog ref="addLabelDialogDom" @refresh="search"></addLabelDialog>
  </div>
</template>

<script>
import { baseTag, getBaseThing, deleteBaseThing } from "@/api/label/index";
import addLabelDialog from "./addLabelDialog.vue";
export default {
  name: "lableManagementList",
  data() {
    return {
      markName: "", // 标注名称
      tags: [], // 品类
      groupArr: [], // 品类枚举
      loading: false,
      tableData: [],
      bodyStyle: {
        "font-size": "12px",
        padding: "0",
        height: "40px"
      },
      headerStyle: {
        "font-size": "12px",
        "font-weight": "blod",
        color: "rgba(49, 65, 86, 0.82)",
        padding: "0",
        height: "40px"
      }
    };
  },
  components: {
    addLabelDialog
  },
  created() {
    this.search();
    this.getEmuns();
  },
  methods: {
    search() {
      this.getMark({ name: this.markName }, this.tags.join(","));
    },
    getMark(name, tags) {
      this.loading = true;
      getBaseThing(name, tags)
        .then(res => {
          this.loading = false;
          this.tableData = res.result;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getEmuns() {
      baseTag().then(res => {
        this.groupArr = res.result;
      });
    },
    addMark() {
      this.$refs.addLabelDialogDom.open();
    },
    editLabel(row) {
      this.$refs.addLabelDialogDom.open(row);
    },
    deleted(row) {
      this.$confirm("此操作将永久该标点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBaseThing(row.id).then(() => {
            this.$message.success("标点删除成功");
            this.search();
          });
        })
        .catch();
    }
  }
};
</script>

<style lang="scss" scoped>
.labelList {
  height: 100%;
  padding: 10px;
  .labelAdd {
    margin-bottom: 10px;
  }
}
</style>
