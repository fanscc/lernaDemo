<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    title= "新增任务模板"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="任务别名" prop="alias">
        <el-input v-model="form.alias" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="地块" prop="area">
        <el-select v-model="form.area"  placeholder="单选" style="width: 370px;">
        <el-option
          v-for="item in areas"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      </el-form-item>
      <el-form-item label="作物" prop="crop">
        <el-select v-model="form.crop" placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in crops"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行人" prop="executor">
        <el-select v-model="form.executor"  placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in executors"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="事件" prop="work">
        <el-select v-model="form.work"  placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in works"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="循环情况" prop="repeat">
        <el-select v-model="form.repeat" @change="handleDay" placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in repeats"
            :key="item.value"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="day" v-if="form.repeat!==2">
        <el-date-picker type="dates" v-model="form.day" placeholder="单选"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="星期" prop="day" v-if="form.repeat===2">
        <el-select v-model="form.day"  placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in days"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-time-picker format="HH:mm" value-format="HH:mm" v-model="times.time1" placeholder="单选或空" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="form.remark" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
  const days = [
    {value:"星期一"},
    {value:"星期二"},
    {value:"星期三"},
    {value:"星期四"},
    {value:"星期五"},
    {value:"星期六"},
    {value:"星期日"},
  ];
  const repeats = [
    {
      value: 0,
      lable: "不循环"
    },    {
      value: 1,
      lable: "月循环"
    },    {
      value: 2,
      lable: "周循环"
    },    {
      value: 3,
      lable: "日循环"
    },
  ];
  const areas = [
    {
      id: 1,
      name: "荔枝"
    }, {
      id: 2,
      name: "李子"
    }
  ];
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },

  },
  data: function () {
    return {
      repeatBeforeUpdate:5,
      loading: false,
      dialog: false,
      times:{},
      form: {},
      rules: {
        // name: [{required: true, message: "请输入名称", trigger: "blur"}],
      },
      days,repeats,
      //后台接口获取
      areas, crops:[...areas], executors:[...areas], works:[...areas],

    };
  },
  beforeUpdate() {
    if (this.form.time!==undefined&&this.form.time.length!==0)
    this.form.time.forEach((value,index)=>{
      let timeKey = "time"+(index+1);
      this.times[timeKey] = value;
    })
    if (this.form.repeat!==undefined&&this.form.repeat!==""){
      this.repeatBeforeUpdate = this.form.repeat;
    }
    // console.log(this.form)
  },
  methods: {
    handleDay(repeatUpdated) {
      if (this.repeatBeforeUpdate===0||this.repeatBeforeUpdate===1||
        this.repeatBeforeUpdate===3&&repeatUpdated===2){
        this.form.day.length = 0;
      }else if (repeatUpdated===0||repeatUpdated===1||repeatUpdated===3&&this.repeatBeforeUpdate===2){
        this.form.day.length = 0;
      }
    },
    cancel() {
      this.resetForm();
    },
    isSuccess(){
      this.loading = false
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // if (this.form.name.length===0) {
          //   this.$message({
          //     message: "名称不能为空",
          //     type: "error"
          //   });
          // } else {
          this.form.time = Object.values(this.times);
            this.loading = true;
            if(this.isAdd===false) {
              this.$parent.editTo(JSON.parse(JSON.stringify(this.form)))
            } else {
              this.$parent.addTo(JSON.parse(JSON.stringify(this.form)))
            }
          // }
        }
      });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        id: "",
        name: "",
        tag: ""
      };
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
