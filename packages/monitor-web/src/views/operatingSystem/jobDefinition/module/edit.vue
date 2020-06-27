<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit" />
    <eForm ref="form"  :is-add="false"  />
  </div>
</template>
<script>
import eForm from "./form";
import {addCrop, editCrop, editWork} from "../../../../api/operatingSystem";
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
      this.$refs.form.form = JSON.parse(JSON.stringify(this.data));
      this.$refs.form.dialog = true;
    },

    editTo(newData){
      Object.keys(this.data).forEach(key => {
        this.data[key] = newData[key]
      });

      //等待接口
      editWork(newData)
        .then(res=>{
          console.log(res)
          this.$emit("update:data", JSON.parse(JSON.stringify(this.data)));
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
