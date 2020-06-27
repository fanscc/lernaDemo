<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit" />
    <eForm ref="form"  :is-add="false"  />
  </div>
</template>
<script>
import eForm from "./form";
import {editTemplate} from "../../../../api/operatingSystem";
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },

  },
  methods: {
    edit(){
      console.log(this.data);
      let formTemp = {};
      formTemp["id"] = this.data.id;
      formTemp["alias"] = this.data.alias;
      formTemp["area"] = this.data.area.id;
      formTemp["crop"] = this.data.crop.id[0];
      formTemp["day"] = this.data.day.split(",");
      formTemp["executor"] = this.data.executor.id;
      formTemp["remark"] = this.data.remark;
      formTemp["repeat"] = this.data.repeat.id[0];
      formTemp["work"] = this.data.work.id;
      formTemp["time"] = this.data.time.split(",");
      console.log(formTemp);
      this.$refs.form.form = JSON.parse(JSON.stringify(formTemp));
      this.$refs.form.dialog = true;
    },
    editTo(newData){

      //等待接口
      console.log("563496");
      console.log(newData);
      editTemplate(newData)
      .then(res=>{
        console.log(res)
        console.log(this);
        this.$parent.$parent.$parent.init();
        this.$notify({
          title: "修改成功",
          type: "success",
          duration: 2500
        });
      })
      this.$refs.form.isSuccess(true);
    }
  }
};
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
