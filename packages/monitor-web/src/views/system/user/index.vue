<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col>
        <eHeader
          :query="query"
          :sup_this="sup_this"
          :dicts="dicts"
          :choose_user="choose_user"
          :user-radio="userRadio"
          :specialty_arr="specialty_arr"
          v-on="$listeners"
        />
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          ref="multipleUserTable"
          :data="data"
          size="small"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <el-table-column
            v-if="choose_user"
            label="序号"
            width="50"
            align="center"
          >
            <template slot-scope="props">
              <span class="tran_box">
                <el-radio v-model="userRadio.id" :label="props.row.id"
                  >&nbsp;&nbsp;</el-radio
                >
              </span>
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
                  v-if="
                    scope.row.enabled &&
                      scope.row.enabled.toString() === item.value
                  "
                  :type="scope.row.enabled ? '' : 'info'"
                  >{{ item.label }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!choose_user"
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建日期"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="
              checkPermission([
                'ADMIN',
                'USER_ALL',
                'USER_EDIT',
                'USER_DELETE'
              ]) && !choose_user
            "
            label="操作"
            width="125"
            align="center"
          >
            <template slot-scope="scope">
              <edit
                v-permission="['ADMIN', 'USER_ALL', 'USER_EDIT']"
                :dicts="dicts"
                :data="scope.row"
                :sup_this="sup_this"
                :specialty_arr="specialty_arr"
              />
              <el-popover
                v-permission="['ADMIN', 'USER_ALL', 'USER_DELETE']"
                :ref="scope.row.id"
                placement="top"
                width="180"
              >
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
                    @click="subDelete(scope.row.id)"
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import initDict from "@/mixins/initDict";
import { del } from "@/api/user";
import { getDepts } from "@/api/dept";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import { specialtyList } from "@/api/expertSystem";
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  props: {
    choose_user: {
      type: Boolean,
      default: false
    },
    choose_user_arr: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      delLoading: false,
      sup_this: this,
      deptName: "",
      depts: [],
      deptId: null,
      defaultProps: {
        children: "children",
        label: "name"
      },
      userRadio: {},
      specialty_arr: [], // 专业下拉框
      multipleSelection: []
    };
  },
  created() {
    this.getDeptDatas();
    this.$nextTick(() => {
      this.init();
      // 加载数据字典
      this.getDict("user_status");
    });
    // 获取专业下拉框
    specialtyList().then(res => {
      this.specialty_arr = res.result;
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
    checkPermission,
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
      if (this.choose_user) {
        this.params["enabled"] = true;
      }
      return true;
    },
    subDelete(id) {
      this.delLoading = true;
      del(id)
        .then(() => {
          this.delLoading = false;
          this.$refs[id].doClose();
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
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.userRadio = row;
    }
  }
};
</script>

<style scoped></style>
