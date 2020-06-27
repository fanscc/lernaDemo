<template>
  <div class="artic_conten">
    <div class="artic_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="标题">
          <el-input
            v-model="searchFrom.title"
            style="width: 200px"
            clearable
            @keyup.enter.native="getData"
          />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="ml_20"
          @click="getData"
          >搜索</el-button
        >
        <el-button type="primary" @click="add">新增</el-button>
        <el-form-item label="类别">
          <el-select
            @change="getData"
            v-model="searchFrom.category"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="artic_conten_table" v-loading="loading">
      <div
        class="artic_item"
        @click="goArtic(item.id)"
        v-for="item in tableData"
        :key="item.id"
      >
        <div class="artic_item_item">
          <div class="artic_img demo-image__placeholder">
            <el-image :src="item.thumbnail">
              <div slot="placeholder" class="image-slot">
                <div v-loading="true">
                  <div class="artic_img_loading"></div>
                </div>
              </div>
              <div slot="error" class="image-slot">
                <div class="artic_img_loading">
                  <i
                    style="font-size: 50px;position: relative;top: 5px;color: #ccc"
                    class="el-icon-picture-outline"
                  ></i>
                </div>
              </div>
            </el-image>
          </div>
        </div>
        <div class="artic_item_item">
          <div>{{ item.title }}</div>
          <p>
            <span>发表日期:</span>
            <span>{{ item.publishTs }}</span>
          </p>
        </div>
        <div class="artic_btn">
          <el-button type="primary" @click.stop="edit(item)">编辑</el-button>
          <!--          <el-button type="primary" @click.stop="remove(item)">删除</el-button>-->
        </div>
      </div>
      <!--分页组件-->
      <el-pagination
        :total="total"
        style="margin-top: 8px;margin-left: 20px"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import {
  articleCount,
  articleSelectAbstract
} from "../../../api/articleManagement";
import { initData } from "@/api/data";

export default {
  data() {
    return {
      loading: true,
      searchFrom: {
        category: ""
      },
      options: [],
      tableData: [],
      total: 0,
      page: 0,
      size: 10
    };
  },
  methods: {
    add() {
      this.$router.push("/articleManagement_hidden/addOredit");
    },
    edit(row) {
      this.$router.push({
        path: "/articleManagement_hidden/addOredit",
        query: { id: row.id }
      });
    },
    remove(row) {
      console.log(row);
    },
    goArtic(id) {
      let routeUrl = this.$router.resolve({
        path: "/articleDetai"
      });
      window.open(`${routeUrl.href}?id=${id}`, "_blank");
    },
    pageChange(e) {
      this.page = e - 1;
      this.getData();
    },
    sizeChange(e) {
      this.page = 0;
      this.size = e;
      this.getData();
    },
    getData() {
      this.loading = true;
      let requestData = {
        category: this.searchFrom.category,
        offset: this.page * this.size,
        limit: this.size
      };
      if (this.searchFrom.title) requestData["key"] = this.searchFrom.title;
      articleSelectAbstract(requestData).then(res => {
        this.tableData = [...res.result];
        this.loading = false;
      });
      articleCount(requestData).then(res => {
        this.total = res.result;
      });
    }
  },
  mounted() {
    initData("/cms/category").then(res => {
      this.options = [...res.result];
      this.searchFrom["category"] = this.options[0].id;
      this.getData();
    });
  }
};
</script>

<style lang="scss">
.artic_img {
  .el-image__inner,
  .artic_img_loading {
    margin-top: 5px;
    width: 70px;
    height: 50px;
    object-fit: cover;
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.artic_conten {
  height: 100%;
  overflow-x: hidden;
  position: relative;
  .artic_conten_search {
    padding: 20px 0;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .artic_conten_table {
    height: calc(100% - 124px);
    border: 1px solid #ebeef5;
    overflow: auto;
  }
  .artic_item {
    position: relative;
    height: 60px;
    line-height: 60px;
    div,
    p {
      margin: 0;
      padding: 0;
      line-height: 30px;
    }
    p {
      font-size: 12px;
      color: #666;
    }
    .artic_img {
      margin: 0 10px 0 30px;
      height: 60px;
      line-height: 60px;
      /*.el-image__inner{*/
      /*  margin-top: 5px;*/
      /*  width: 50px;*/
      /*  height: 50px;*/
      /*  object-fit: cover;*/
      /*}*/
    }
    display: flex;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
  }
  .artic_btn {
    position: absolute;
    top: 18px;
    right: 20px;
  }
}
</style>
