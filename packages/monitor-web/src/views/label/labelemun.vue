<template>
  <div class="app-container">
    <eHeader :query="query" />
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
    >
      <el-table-column prop="name" label="标注名称" />
      <el-table-column prop="tag" label="描述" />
      <el-table-column label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <edit :data.sync="scope.row" />
          <el-popover :ref="scope.row.id" placement="top" width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[scope.row.id].doClose()"
                >取消</el-button
              >
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope)"
                >确定</el-button
              >
            </div>
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import { delCrop } from "../../api/operatingSystem";

export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
      this.loading = false;
    });
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = "/system/crop";
      // const sort = "sort,asc";
      this.params = { pageNum: this.page + 1, pageSize: this.size };
      const value = this.query.value;
      if (value) {
        this.params["name"] = value;
        this.url = "/system/crop/search";
      }
      return true;
    },
    subDelete(scope) {
      this.delLoading = true;
      delCrop(scope.row.id)
        .then(() => {
          this.delLoading = false;
          this.$refs[scope.row.id].doClose();
          this.init();
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          this.delLoading = false;
          this.$refs[id].doClose();
          console.log(err.response.data.message);
        });
    }
  }
};
</script>

<style scoped></style>
