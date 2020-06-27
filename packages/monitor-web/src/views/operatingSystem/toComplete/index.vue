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
<!--      <el-table-column prop="area" label="地块" />-->
      <el-table-column prop="crop" label="作物" />
<!--      <el-table-column prop="executor" label="执行人"/>-->
      <el-table-column prop="creator" label="创建人" />
<!--      <el-table-column prop="operate" label="事件">-->
<!--      </el-table-column>-->
<!--      <el-table-column min-width="140px" prop="planTime" label="计划时间">-->
<!--      </el-table-column>-->
<!--      <el-table-column min-width="140px" prop="doTime" label="执行时间">-->
<!--      </el-table-column>-->
<!--      <el-table-column min-width="150px" prop="remark" label="备注" />-->
<!--      <el-table-column prop="state"  label="状态">-->
<!--        <template slot-scope="scope">-->
<!--          <div>-->
<!--            {{scope.row.state===0?'未开始':'进行中'}}-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-popover :ref="scope.row.id" placement="top" width="150">
            <p>确定开始作业吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="start(scope.row.id)">确定</el-button>
            </div>
            <el-tooltip slot="reference" :disabled="scope.row.state===0"  content="已经开始" placement="left">
              <el-button type="primary" size="mini" :disabled="scope.row.state!==0">开始</el-button>
            </el-tooltip>
          </el-popover>
<!--          <el-tooltip :disabled="scope.row.state===0"  content="已经开始" placement="left">-->
<!--            <el-button @click="start(scope.row.id)" type="primary" size="mini" :disabled="scope.row.state!==0">开始</el-button>-->
<!--          </el-tooltip>-->
          <el-tooltip :disabled="scope.row.state===1"  content="还未开始" placement="left">
            <complete :scope="scope"></complete>
<!--            <el-button @click="complete(scope.row.id)" :disabled="scope.row.state!==1" type="success" size="mini">完成</el-button>-->
          </el-tooltip>

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
    <detail ref="detail"></detail>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import complete from "./module/complete";
import detail from "./module/detail";
import {startWord} from "../../../api/operatingSystem";
export default {
  components: {eHeader,complete,detail},
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      scope:{},
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
      this.url = "system/task/search";
      this.params = { pageNum: this.page+1, pageSize: this.size};
      if (this.query.alias) {
        this.params["alias"] = this.query.alias;
      }
      if (this.query.crop) {
        this.params["crop"] = this.query.crop;
      }
      return true;
    },
    start(id){
      this.delLoading = true;
      startWord(id).then(res=>{
        console.log(res)
        this.delLoading = false;
        this.$refs[id].doClose();
        this.init();
        this.$notify({
          title: "开始作业",
          type: "success",
          duration: 2500
        });
      }).finally(()=>{
        this.loading = false
      })
    },
    subDelete(scope) {
      this.delLoading = true;
      // del(id)
      //   .then(() => {
      this.delLoading = false;
      this.$refs[scope.row.id].doClose();
      // console.log(this.data)
      // console.log(scope)
      this.data.splice(scope.$index,1)
      // this.data.splice(row.)
      this.init();
      //   this.$notify({
      //     title: "删除成功",
      //     type: "success",
      //     duration: 2500
      //   });
      // })
      // .catch(err => {
      //   this.delLoading = false;
      //   this.$refs[id].doClose();
      //   console.log(err.response.data.message);
      // });
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
