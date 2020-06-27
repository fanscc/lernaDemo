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
        <el-cascader :options="areas" v-model="form.area" :props="{emitPath:false,value:'id',label:'name',multiple:true,checkStrictly:true}"
                     @visible-change="updateUsers" placeholder="可多选" clearable style="width: 370px;"></el-cascader>
      </el-form-item>
      <el-form-item label="作物" prop="crop">
        <el-select v-model="form.crop" clearable placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in crops"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行人" prop="executor">
        <el-select v-model="form.executor" clearable multiple placeholder="可多选" style="width: 370px;">
          <el-option
            v-for="item in executors"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="事件" prop="work">
        <el-select v-model="form.work" multiple clearable placeholder="可多选" style="width: 370px;">
          <el-option
            v-for="item in works"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="循环情况" prop="repeat">
        <el-select v-model="form.repeat" clearable @change="handleDay" placeholder="单选" style="width: 370px;">
          <el-option
            v-for="item in repeats"
            :key="item.value"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="day" v-if="form.repeat===0">
        <el-date-picker type="date" clearable v-model="form.day[0]" placeholder="单选"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="日期" prop="day" v-if="form.repeat===1">
        <el-date-picker type="dates" clearable v-model="form.day" placeholder="可多选"
            format="MM-dd" value-format="MM-dd" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="星期" prop="day" v-if="form.repeat===2">
        <el-select v-model="form.day" clearable multiple placeholder="可多选" style="width: 370px;">
          <el-option
            v-for="item in days"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <template v-for="(item,index) in times" >
          <el-time-picker :key="index" clearable format="HH:mm" value-format="HH:mm" v-model="form.time[index]" placeholder="单选或空" style="width: 120px;" />
        </template>
        <el-tooltip class="item" effect="dark" :disabled="form.repeat!==0" content="不循环情况下只能输入一个时间" placement="right">
          <el-button icon="el-icon-plus" size="mini" @click="addNewTime" :disabled="form.repeat===0"></el-button>
        </el-tooltip>
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
  import {getCrop, getFarm, getUsers, getWork} from "../../../../api/operatingSystem";
  import {initData} from "../../../../api/data";

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
      times:[{}],
      form: {executor:[],work:[],time:[],day:[]},
      rules: {
        alias: [{required: true, message: "请输入任务别名", trigger: "blur"}],
        area: [{required: true, message: "请选择地块", trigger: "change"}],
        crop: [{required: true, message: "请选择作物", trigger: "change"}],
        executor: [{required: true, message: "请选择执行人", trigger: "change"}],
        work: [{required: true, message: "请选择事件", trigger: "change"}],
        repeat: [{required: true, message: "请选择循环方式", trigger: "change"}],
        day: [{required: true, message: "请选择日期或星期", trigger: "change"}],
        time: [{required: true, message: "请选择时间", trigger: "change"}],
      },
      days,repeats,
      //后台接口获取
      areas:[], crops:[], executors:[], works:[],

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(){
        let areas = await getFarm();
      let params = { pageNum: 1, pageSize: 9999};
      let crops = await getCrop(params);
      let works = await getWork(params);
      // https://test.nongruiyun.com/api/users?page=0&size=10&sort=id,desc&enabled=true
      let users = await initData("api/users",{page:0,size:9999,sort:"id,desc",enabled:true})
      let tables = {};//储存各个块
      areas.result.forEach(item=>{
          //根据parent分块
          if (tables[item.parent+'']===undefined){
            tables[item.parent+''] = [];
          }
          tables[item.parent+''].push(item);
        })
        //根据id与parent整合
        Object.keys(tables).forEach(index=>{
          tables[index].forEach(item=>{
            //根据type创建children
            if (item.type===1){
              item["children"] = [];
              if (tables[item.id]!==undefined)
                item.children = tables[item.id];
            }
          });
        });
      console.log(tables["0"])
      this.areas = [...tables["0"]];
      this.crops = crops.result.list;
      this.works = works.result.list;
      this.executors = users.content;
    },
    handleDay() {
      if (this.form.day!==undefined)
        this.form.day.length = 0;
      this.times = [{}];
      this.form.time.length = 0;
    },
    updateUsers(e){
      // console.log("43124")
      // console.log(e)
      // if(!e){
      //   console.log({"area":this.form.area});
      //   getUsers({"area":this.form.area}).then(res=>{
      //     console.log(res)
      //   })
      // }
    },
    addNewTime(){
      this.times.push({})
    },
    cancel() {
      this.resetForm();
    },
    isSuccess(){
      this.loading = false
      this.resetForm();
    },
    doSubmit() {
      //过滤空元素
      //forEach/filter等缺点：当数组元素含有null时，会报错
      if (this.form.time!==undefined&&this.form.time!==null&&this.form.time>-1){
        let tempArr = [];
        // console.log(this.form.time)
        for (let i in this.form.time){
          if (this.form.time[i]!==undefined&&this.form.time[i]!==null&&this.form.time[i].length>-1){
            tempArr.push(this.form.time[i]);
          }
        }
        this.form.time = [...tempArr];//用第一层深拷贝，不要改变双向数据绑定的地址
      }

      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
            this.loading = true;
          //day,time转字符串
          let formTemp = {};
          formTemp["id"] = this.form.id;
          formTemp["alias"] = this.form.alias;
          formTemp["area"] = this.form.area;
          formTemp["crop"] = this.form.crop;
          formTemp["executor"] = this.form.executor;
          // formTemp["executor"] = "27";
          formTemp["work"] = this.form.work;
          formTemp["repeat"] = this.form.repeat;
          formTemp["remark"] = this.form.remark;
          // formTemp["day"] = this.form.day.join(",");
          formTemp["day"] = this.form.day;
          formTemp["time"] = this.form.time;
          // formTemp["time"] = this.form.time.join(",");
          if(this.isAdd===false) {
              this.$parent.editTo(JSON.parse(JSON.stringify(formTemp)));
            } else {
              this.$parent.addTo(JSON.parse(JSON.stringify(formTemp)));
            }
        }
      });
    },
    resetForm() {
      this.times = [{}]
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
