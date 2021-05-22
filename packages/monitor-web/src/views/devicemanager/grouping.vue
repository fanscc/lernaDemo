<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-button
        v-permission="['ADMIN', 'GROUP_ALL', 'GROUP_ADD']"
        type="primary"
        icon="el-icon-plus"
        @click="centerDialogVisible = true"
        >新增</el-button
      >
    </div>

    <div ref="topictable" class="chart_conten_table">
      <el-table
        v-loading="loading"
        :data="tableData"
        :cell-style="bodyStyle"
        :header-cell-style="headerStyle"
        stripe
        border
        show-overflow-tooltip
        style="width: 100%"
        height="100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <h3>
                一区地块信息
                <el-button
                  type="primary"
                  style="margin-left: 8px;"
                  @click="editArea(props.row)"
                  >编辑区块</el-button
                >
              </h3>
              <el-form-item label="区块名称:">
                <span>{{ props.row.groupName }}</span>
              </el-form-item>
              <el-form-item label="区块面积:">
                <span>{{ props.row.groupName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="groupId" label="分组Id" />
        <el-table-column prop="groupName" label="别名" />
        <el-table-column fixed="right" label="操作" width="180" center>
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN', 'GROUP_ALL', 'GROUP_EDIT']"
              type="success"
              size="mini"
              @click="editgroup(scope.row)"
              >编辑</el-button
            >
            <el-button type="success" size="mini" @click="addArea(scope.row)"
              >添加地块</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增分组 -->
    <el-dialog
      wdith="600px"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      title="新增分组"
      center
    >
      <span>
        <el-form
          ref="addruleForm"
          :model="addruleForm"
          :rules="rules"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="别名" prop="addOtherName">
            <el-input
              style="width: 200px;"
              v-model="addruleForm.addOtherName"
            />
          </el-form-item>
          <el-form-item label="背景图左下角经纬度" prop="c">
            <el-input
              style="width: 200px;"
              v-model="addruleForm.leftBottomPoint"
            />
            <el-button type="primary" size="mini" @click="selectPoint(2, 'add')"
              >去选择地址</el-button
            >
          </el-form-item>
          <el-form-item label="背景图右上角经纬度" prop="c">
            <el-input
              style="width: 200px;"
              v-model="addruleForm.topRightPoint"
            />
            <el-button type="primary" size="mini" @click="selectPoint(3, 'add')"
              >去选择地址</el-button
            >
          </el-form-item>
          <el-form-item label="上传分组封面">
            <cropUploadPic v-if="centerDialogVisible" v-model="picName"
          /></el-form-item>
          <el-form-item label="上传分组全景图">
            <cropUploadPic v-if="centerDialogVisible" v-model="map2d"
          /></el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroup">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog
      :visible.sync="editVisible"
      title="编辑分组"
      :close-on-click-modal="false"
      center
    >
      <span>
        <el-form
          ref="editruleForm"
          :model="editruleForm"
          :rules="rules"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="别名" prop="editOtherName">
            <el-input
              style="width: 200px;"
              v-model="editruleForm.editOtherName"
            />
          </el-form-item>
          <el-form-item label="背景图左下角经纬度" prop="c">
            <el-input
              style="width: 200px;"
              v-model="editruleForm.leftBottomPoint"
            />
            <el-button
              type="primary"
              size="mini"
              @click="selectPoint(2, 'edit')"
              >去选择地址</el-button
            >
          </el-form-item>
          <el-form-item label="背景图右上角经纬度" prop="c">
            <el-input
              style="width: 200px;"
              v-model="editruleForm.topRightPoint"
            />
            <el-button
              type="primary"
              size="mini"
              @click="selectPoint(3, 'edit')"
              >去选择地址</el-button
            >
          </el-form-item>
          <el-form-item label="分组图片" prop="editOtherName">
            <img style="width:120px;height: 80px;" :src="editruleForm.pic" />
          </el-form-item>
          <el-form-item label="替换分组图片">
            <cropUploadPic v-if="editVisible" v-model="picName"
          /></el-form-item>
          <el-form-item label="分组全景图" prop="editOtherName">
            <img style="width:120px;height: 80px;" :src="editruleForm.map2d" />
          </el-form-item>
          <el-form-item label="替换分组全景图">
            <cropUploadPic v-if="editVisible" v-model="map2d"
          /></el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsaveGroup">确 定</el-button>
      </span>
    </el-dialog>
    <scottPopupWindow
      ref="scottPopupWindowDom"
      @sureSave="sureSave"
    ></scottPopupWindow>

    <!-- 添加区块信息 -->
    <addAreaDialog ref="addAreaDialogDom"></addAreaDialog>
  </div>
</template>

<script>
import {
  getGroup,
  addGroup,
  editGroup,
  deleteGroup,
  getsearchGroup
} from "@/api/equipment";
import { Loading } from "element-ui";
import cropUploadPic from "@/components/uploadAvatar/index";
import scottPopupWindow from "@/components/scottPopupWindow/index";
import addAreaDialog from "./addAreaDialog";
export default {
  name: "Gateway",
  data: function() {
    return {
      loading: false,
      selectValue: "",
      inputValue: "",
      centerDialogVisible: false, // 显示新增组名的弹窗
      editVisible: false, // 编辑
      editOtherName: "", // 编辑别名
      editId: "",
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
      },
      picName: "",
      map2d: "",
      addruleForm: {
        addOtherName: "", // 别名
        centralPoint: "",
        leftBottomPoint: "",
        topRightPoint: ""
      },
      editruleForm: {
        editOtherName: "", // 编辑别名
        centralPoint: "",
        leftBottomPoint: "",
        topRightPoint: ""
      },
      type: "add",
      rules: {
        addOtherName: [
          { required: true, message: "请输入别名", trigger: "blur" }
        ],
        editOtherName: [
          { required: true, message: "请输入别名", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    cropUploadPic,
    scottPopupWindow,
    addAreaDialog
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.loading = true;
      getGroup()
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetValue() {
      this.selectValue = "";
    },
    editgroup(item) {
      this.editId = item.groupId;
      this.editVisible = true;
      this.editruleForm.editOtherName = item.groupName;
      this.picName = item.groupImage;
      this.map2d = item.map2d;
      this.editruleForm.pic = `https://zckj.gudonger.com/${item.groupImage}`;
      this.editruleForm.map2d = `https://zckj.gudonger.com/${item.map2d}`;
      this.editruleForm.leftBottomPoint = `${item.ldLat},${item.ldLon}`;
      this.editruleForm.topRightPoint = `${item.rtLat},${item.rtLon}`;
    },
    saveGroup() {
      // 新增组名
      this.$refs["addruleForm"].validate(valid => {
        if (valid) {
          console.log(22, this.leftBottomPoint);
          const params = {
            groupName: this.addruleForm.addOtherName,
            groupImage: `/base/org/1/file?file=${this.picName}`,
            ldLat: this.addruleForm.leftBottomPoint.split(",")[1],
            ldLon: this.addruleForm.leftBottomPoint.split(",")[0],
            rtLat: this.addruleForm.topRightPoint.split(",")[1],
            rtLon: this.addruleForm.topRightPoint.split(",")[0],
            map2d: `/base/org/1/file?file=`
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          addGroup(params)
            .then(() => {
              this.$notify({
                title: "新建成功",
                type: "success",
                duration: 2500
              });
              this.centerDialogVisible = false;
              this.init();
              this.addOtherName = "";
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    },
    editsaveGroup() {
      // 编辑保存别名
      this.$refs["editruleForm"].validate(valid => {
        if (valid) {
          const params = {
            groupName: this.editruleForm.editOtherName,
            groupImage: `/base/org/1/file?file=${this.picName}`,
            ldLat: this.leftBottomPoint.split(",")[1],
            ldLon: this.leftBottomPoint.split(",")[0],
            rtLat: this.topRightPoint.split(",")[1],
            rtLon: this.topRightPoint.split(",")[0],
            map2d: `/base/org/1/file?file=${this.map2d}`
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          editGroup(params, this.editId)
            .then(() => {
              this.$notify({
                title: "编辑成功",
                type: "success",
                duration: 2500
              });
              this.editVisible = false;
              this.init();
              this.editOtherName = "";
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    },
    deleteGroup(row) {
      const groupId = row.groupId;
      this.$confirm("确定删除该分组吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          deleteGroup(groupId)
            .then(() => {
              this.$notify({
                title: "删除成功",
                type: "success",
                duration: 2500
              });
            })
            .finally(() => {
              loadingInstance.close();
            });
        })
        .catch(() => {});
    },
    search() {
      const groupId = this.selectValue;
      if (!groupId) {
        this.init();
        return;
      }
      this.loading = true;
      getsearchGroup(groupId)
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 选择经纬度
    selectPoint(num, type) {
      this.type = type;
      if (this.type === "edit") {
        if (num === 1) {
          this.$refs.scottPopupWindowDom.open(
            num,
            this.addruleForm.centralPoint
          );
        } else if (num === 2) {
          this.$refs.scottPopupWindowDom.open(
            num,
            this.addruleForm.leftBottomPoint
          );
        } else {
          this.$refs.scottPopupWindowDom.open(
            num,
            this.addruleForm.topRightPoint
          );
        }
      } else {
        this.$refs.scottPopupWindowDom.open(num);
      }
    },
    sureSave(center, type) {
      // // 1,选择中点2选择图片左下脚经纬度3选择图片右上角经纬度4表示勾勒区域
      if (type === 1) {
        if (this.type === "add") {
          this.addruleForm.centralPoint = center.join(",");
        } else {
          this.editruleForm.centralPoint = center.join(",");
        }
      } else if (type === 2) {
        if (this.type === "add") {
          this.addruleForm.leftBottomPoint = center.join(",");
        } else {
          this.editruleForm.leftBottomPoint = center.join(",");
        }
      } else {
        if (this.type === "add") {
          this.addruleForm.topRightPoint = center.join(",");
        } else {
          this.editruleForm.topRightPoint = center.join(",");
        }
      }
    },
    /**
     * 地块信息
     */
    addArea(row) {
      this.$refs.addAreaDialogDom.open(row);
    },
    /**
     * 编辑地块
     */
    editArea(row) {
      this.$refs.addAreaDialogDom.open(row, id);
    }
  }
};
</script>

<style lang="scss" scoped>
.chart_conten {
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  .chart_conten_search {
    padding: 20px 0;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .mB_10 {
    margin-bottom: 10px;
  }
  .chart_conten_table {
    height: calc(100% - 124px);
  }
  .flex_aligin {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p {
      min-width: 100px;
      text-align: right;
      margin-right: 5px;
    }
    .fe-input-content {
      width: 200px;
    }
  }
  /deep/ .el-dialog {
    width: 610px;
    max-height: 70%;
    overflow: auto;
  }
}
</style>
