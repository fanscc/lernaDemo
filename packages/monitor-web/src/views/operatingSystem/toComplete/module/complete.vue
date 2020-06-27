<template>
  <span>
  <!--          <el-button type="success" size="mini" icon="el-icon-finished" style="margin-right: 2px;">发布</el-button>-->
<!--  <el-button type="success" size="mini" @click="complete" style="margin-right: 3px;">完成</el-button>-->
    <el-button style="margin-left: 7px;" @click="complete(scope.row.id)" :disabled="scope.row.state!==1" type="success" size="mini">完成</el-button>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    title= "完成作业"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >

      <el-form-item label="执行反馈" prop="doRemark">
        <el-input type="textarea" :rows="2" v-model="form.doRemark" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
      >完成</el-button
      >
    </div>
  </el-dialog>
  </span>
</template>

<script>

  import {complishWord} from "../../../../api/operatingSystem";

  export default {

    name:'complete',
    props: {
      scope: {
        type: Object,
        required: true
      },
    },
    data: function () {
      return {
        loading: false,
        dialog: false,
        form: {},
        rules: {
          doRemark: [{required: true, message: "请输入备注", trigger: "blur"}],
        },
      };
    },
    beforeUpdate() {
      console.log(this.scope)
    },
    methods: {
      cancel() {
        this.resetForm();
      },
      complete(){
        this.dialog = true;
      },
      doSubmit(){
        this.$refs.form.validate(value=>{
          if (value) {
            this.loading = true;
            complishWord({id:this.scope.row.id,doRemark:this.form.doRemark}).then(res=>{
              console.log(res)
            }).finally(()=>{
              this.loading =false;
              this.dialog = false;
              this.$parent.$parent.$parent.$parent.init();
              this.$notify({
                title: "完成作业",
                type: "success",
                duration: 2500
              });
            })

            this.resetForm();
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
