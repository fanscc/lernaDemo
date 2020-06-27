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
          <div
            style="cursor: pointer"
            @click="
              () => {
                $refs.detail.dialogVisible = true;
                $refs.detail.data = scope.row;
              }
            "
          >
            {{ scope.row.alias }}
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="area" label="地块" />-->
      <el-table-column prop="crop" label="作物" />
      <el-table-column prop="executor" label="执行人"> </el-table-column>
      <!--      <el-table-column prop="creator" label="创建人" />-->
      <!--      <el-table-column prop="operate" label="事件">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column min-width="130px" prop="planTime" label="计划时间">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column min-width="130px" prop="doTime" label="执行时间">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column min-width="150px" prop="remark" label="备注" />-->
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.state == 0
                ? "未开始"
                : scope.row.state == 1
                ? "进行中"
                : "已完成"
            }}
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="操作"-->
      <!--        width="70px"-->
      <!--        align="center"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tooltip class="item" effect="dark" :disabled="scope.row.state===0" content="进行中的任务不能撤回" placement=left>-->
      <!--            <el-popover-->
      <!--              :ref="scope.row.id"-->
      <!--              placement="top"-->
      <!--              width="180"-->
      <!--            >-->
      <!--              <p>确定撤回该任务吗？</p>-->
      <!--              <div style="text-align: right; margin: 0">-->
      <!--                <el-button-->
      <!--                  size="mini"-->
      <!--                  type="text"-->
      <!--                  @click="$refs[scope.row.id].doClose()"-->
      <!--                  >取消</el-button-->
      <!--                >-->
      <!--                <el-button-->
      <!--                  :loading="delLoading"-->
      <!--                  type="primary"-->
      <!--                  size="mini"-->
      <!--                  @click="subDelete(scope)"-->
      <!--                  >确定</el-button-->
      <!--                >-->
      <!--              </div>-->
      <!--              <el-button-->
      <!--                slot="reference"-->
      <!--                type="danger"-->
      <!--                icon="el-icon-delete"-->
      <!--                size="mini"-->
      <!--                :disabled="scope.row.state!==0"-->
      <!--              />-->
      <!--            </el-popover>-->
      <!--          </el-tooltip>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
  components: { eHeader, detail },
  mixins: [initData],
  data() {
    const states = ["未开始", "进行中", "已完成", "已过期"];
    return {
      delLoading: false,
      states
    };
  },
  created() {
    this.data = [];
    this.$nextTick(() => {
      this.init();
      this.loading = false;
    });
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = "system/task/getPublished";
      this.params = { pageNum: this.page + 1, pageSize: this.size };
      if (this.query.alias) {
        this.params["alias"] = this.query.alias;
      }
      if (this.query.crop) {
        this.params["crop"] = this.query.crop;
      }
      return true;
    },
    subDelete(scope) {
      this.delLoading = true;
      // del(id)
      //   .then(() => {
      this.delLoading = false;
      this.$refs[scope.row.id].doClose();
      // console.log(this.data)
      // console.log(scope)
      this.data.splice(scope.$index, 1);
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
