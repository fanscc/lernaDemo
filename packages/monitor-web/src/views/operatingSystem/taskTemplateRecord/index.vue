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
      <el-table-column prop="alias" label="任务别名">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="()=>{$refs.detail.dialogVisible=true;$refs.detail.data=scope.row}">{{scope.row.alias}}</div>
        </template>
      </el-table-column>
<!--      <el-table-column prop="area" label="地块">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-html="formatterColumn(scope.row.area.name)"></div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="crop" label="作物">
        <template slot-scope="scope">
          <div v-html="formatterColumn(scope.row.crop.name)"></div>
        </template>
      </el-table-column>
      <el-table-column prop="executor" label="执行人">
        <template slot-scope="scope">
          <div v-html="formatterColumn(scope.row.executor.name)"></div>
        </template>
      </el-table-column>
<!--      <el-table-column prop="work" label="事件">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-html="formatterColumn(scope.row.work.name)"></div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="repeat" label="循环情况">
        <template slot-scope="scope">
          <div v-html="formatterColumn(scope.row.repeat.name)"></div>
        </template>
      </el-table-column>
<!--      <el-table-column prop="day" label="日期或星期">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-html="formatterColumnForDate(scope.row.day)"></div>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="time" label="时间">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-html="formatterColumnForDate(scope.row.time)"></div>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="remark" label="备注" />-->
<!--      <el-table-column prop="creator" label="创建人" />-->
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <detail ref="detail"></detail>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import detail from "./module/detail";
export default {
  components: {eHeader,detail},
  mixins: [initData],
  data() {
    return {
      delLoading: false,
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
      this.loading = false
    });
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = "system/templet/getPublished";
      this.params = { pageNum: this.page+1, pageSize: this.size};
      if (this.query.alias){
        this.params["alias"] = this.query.alias;
        this.url = "system/templet/getPublished";
      }
      if (this.query.crop){
        this.params["crop"] = this.query.crop;
        this.url = "system/templet/search";
      }
      return true;
    },
    formatterColumn(cellValue) {
      console.log(cellValue)
      let value = cellValue.join(' \n ');
      return value
    },
    formatterColumnForDate(cellValue){
      let value = cellValue.split(',').join(' \n ');
      return value
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
