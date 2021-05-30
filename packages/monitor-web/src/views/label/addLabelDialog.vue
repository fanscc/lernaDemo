<template>
  <el-dialog
    title="添加标注"
    center
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @closed="resetForm"
  >
    <span>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="所属分组" prop="groupId">
          <el-select
            style="width: 100%;"
            v-model="ruleForm.groupId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in grounpList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="标记类别" prop="tag">
          <el-select
            style="width: 100%;"
            v-model="ruleForm.tag"
            placeholder="请选择"
          >
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纬度" prop="markPosition">
          <span>{{ markPosition }}</span>
          <el-button
            type="primary"
            style="margin-left: 20px;"
            @click="selectMap"
            >选择地址</el-button
          >
        </el-form-item>
        <el-form-item label="备注" prop="brief">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ruleForm.brief"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveLabel">保存</el-button>
    </span>
    <autoNaviLableManage
      v-if="mapShow"
      @positionCenter="positionCenter"
      ref="autoNaviLableManageDom"
    ></autoNaviLableManage>
  </el-dialog>
</template>

<script>
import { baseTag, addBaseThing, editBaseThing } from "@/api/label/index";
import { getGroup } from "@/api/equipment";
import autoNaviLableManage from "./autoNaviLableManage.vue";
export default {
  name: "addLabelDialog",
  data() {
    return {
      dialogVisible: false,
      labelList: [],
      id: "",
      grounpList: [],
      ruleForm: {
        groupId: "",
        name: "",
        tag: "",
        brief: ""
      },
      rules: {
        groupId: [{ required: true, message: "请选择分组", trigger: "change" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        tag: [{ required: true, message: "请选择标注类别", trigger: "change" }]
      },
      mapShow: false,
      markPosition: []
    };
  },
  components: {
    autoNaviLableManage
  },
  created() {
    this.getEmuns();
  },
  methods: {
    open(row) {
      this.dialogVisible = true;
      if (row) {
        // 编辑页面
        this.id = row.id;
        this.ruleForm.name = row.name;
        this.ruleForm.groupId = row.groupId;
        this.ruleForm.tag = row.tags[0].id;
        this.ruleForm.brief = row.brief;
        this.markPosition = [row.longitude, row.latitude];
      }
    },
    getEmuns() {
      baseTag().then(res => {
        this.labelList = res.result;
      });
      getGroup().then(res => {
        this.grounpList = res.result;
      });
    },
    positionCenter(position) {
      this.markPosition = position;
    },
    saveLabel() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // 判断是否选择了经纬度
          if (this.markPosition.length === 0) {
            return this.$message.warning("请先选择地址");
          }
          let datas = {
            groupId: this.ruleForm.groupId,
            name: this.ruleForm.name,
            brief: this.ruleForm.brief,
            longitude: this.markPosition[0],
            latitude: this.markPosition[1]
          };
          if (this.id === "") {
            addBaseThing(datas, this.ruleForm.tag).then(() => {
              this.$message.success("新增标点成功");
              this.dialogVisible = false;
              this.$emit("refresh");
            });
          } else {
            editBaseThing(datas, this.id, this.ruleForm.tag).then(() => {
              this.$message.success("编辑标点成功");
              this.dialogVisible = false;
              this.$emit("refresh");
            });
          }
        }
      });
    },
    selectMap() {
      if (!this.ruleForm.groupId && this.markPosition.length === 0) {
        return this.$message.warning("请先选择分组");
      }
      this.mapShow = true;
      this.$nextTick(() => {
        let centerPosition =
          this.markPosition.length > 0
            ? this.markPosition
            : [116.397428, 39.90923];
        this.$refs.autoNaviLableManageDom.open(centerPosition);
      });
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.id = "";
      this.ruleForm = {
        groupId: "",
        name: "",
        tag: "",
        brief: ""
      };
    }
  }
};
</script>
