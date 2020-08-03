<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>
        </div>
        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col> -->
      <el-col>
        <eHeader :query="query" :sup_this="sup_this" :dicts="dicts" />
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          :data="data"
          size="small"
          style="width: 100%;"
        >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="filter-item"
                size="mini"
                type="success"
                @click="allocation(scope.row)"
              >分配分组</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="email"
            label="邮箱"
          />
          <el-table-column label="部门 / 岗位">
            <template slot-scope="scope">
              <div>
                {{ scope.row.dept && scope.row.dept.name }} /
                {{ scope.row.job && scope.row.job.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-for="item in dicts" :key="item.id">
                <el-tag
                  v-if="scope.row.enabled.toString() === item.value"
                  :type="scope.row.enabled ? '' : 'info'"
                >{{ item.label }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建日期"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
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
      </el-col>
    </el-row>
    <allocationGate ref="gateDom" />
  </div>
</template>

<script>
  import initData from "@/mixins/initData";
  import initDict from "@/mixins/initDict";
  import { getDepts } from "@/api/dept";
  import { parseTime } from "@/utils/index";
  import eHeader from "./module/header";
  import allocationGate from "./module/gateList";
  export default {
    components: { eHeader, allocationGate },
    mixins: [initData, initDict],
    data() {
      return {
        a: true,
        height: document.documentElement.clientHeight - 180 + "px;",
        sup_this: this,
        deptName: "",
        depts: [],
        deptId: null,
        defaultProps: {
          children: "children",
          label: "name"
        }
      };
    },
    created() {
      this.getDeptDatas();
      this.$nextTick(() => {
        this.init();
        // 加载数据字典
        this.getDict("user_status");
      });
    },
    mounted: function() {
      const that = this;
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 180 + "px;";
      };
    },
    methods: {
      parseTime,
      beforeInit() {
        this.url = "api/users";
        const sort = "id,desc";
        const query = this.query;
        const type = query.type;
        const value = query.value;
        const enabled = query.enabled;
        this.params = {
          page: this.page,
          size: this.size,
          sort: sort,
          deptId: this.deptId
        };
        if (type && value) {
          this.params[type] = value;
        }
        if (enabled !== "" && enabled !== null) {
          this.params["enabled"] = enabled;
        }
        return true;
      },
      getDeptDatas() {
        const sort = "id,desc";
        const params = { sort: sort };
        if (this.deptName) {
          params["name"] = this.deptName;
        }
        getDepts(params).then(res => {
          this.depts = res.content;
        });
      },
      handleNodeClick(data) {
        if (data.pid === 0) {
          this.deptId = null;
        } else {
          this.deptId = data.id;
        }
        this.init();
      },
      allocation(row) {
        const obj = {
          name: row.username,
          id: row.id
        };
        this.$refs.gateDom.openDialog(obj);
      }
    }
  };
</script>

<style scoped></style>
