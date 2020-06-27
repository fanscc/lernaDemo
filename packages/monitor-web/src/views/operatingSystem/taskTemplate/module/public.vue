<template>
  <span>
  <!--          <el-button type="success" size="mini" icon="el-icon-finished" style="margin-right: 2px;">发布</el-button>-->
  <el-button  type="success" size="mini" @click="toPublic" style="margin-right: 3px;">发布</el-button>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    title= "发布任务模板"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
  <el-form-item  label="执行时间" v-if="!disabled" >
        <el-date-picker
          :disabled="disabled"
          v-model="form.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 370px;">
        </el-date-picker>
  </el-form-item>
    <el-form-item  label="执行时间" v-if="disabled" >
      <el-tooltip class="item" effect="dark" :disabled="!disabled" content="不循环没有执行时间" placement="bottom-start">
        <el-date-picker
          :disabled="disabled"
          type="daterange"
          v-model="form.time"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 370px;">
        </el-date-picker>
      </el-tooltip>
    </el-form-item>
<!--      <el-form-item label="备注" prop="remark">-->
<!--        <el-input type="textarea" :rows="2" v-model="form.remark" style="width: 370px;" />-->
<!--      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
      >发布</el-button
      >
    </div>
  </el-dialog>
  </span>
</template>

<script>

  import {publicTemplate} from "../../../../api/operatingSystem";

  export default {

    name:'public',
    props: {
      disabled:{
        type: Boolean,
        default: false,
      },
      scope:{
        type: Object,
      }
    },
    data: function () {
      return {
        loading: false,
        dialog: false,
        form: {},
        time:'',
        rules: {
          time: [{required: true, message: "请输入时间", trigger: "change"}],
        },
      };
    },
    beforeUpdate() {

    },
    methods: {
      cancel() {
        this.resetForm();
      },
      toPublic(){
        this.dialog = true;
      },
      doSubmit(){
        console.log("23")
        console.log(this.form)
        this.$refs.form.validate(value=>{
          if (value) {

            this.resetForm();

            this.loading = true;
            let requstData = {};
            requstData["id"] = this.scope.row.id;
            if (Array.isArray(this.form.time)){
              requstData["startTime"] = this.form.time[0];
              requstData["endTime"] = this.form.time[1];
            }
            console.log(this)
            publicTemplate(requstData).then(res=>{
              console.log(this)
              this.$parent.$parent.$parent.init();
              this.$notify({
                title: "发布成功",
                type: "success",
                duration: 2500
              });
            }).finally(()=>{
              this.loading = false;
              this.dialog = false;
            })

          }
        })

      },
      resetForm() {
        this.dialog = false;
        this.$refs["form"].resetFields();
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
