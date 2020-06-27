<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit" />
    <eForm ref="form"  :is-add="false"  />
  </div>
</template>
<script>
import eForm from "./form";
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
      let formTemp =  JSON.parse(JSON.stringify(this.data));
      formTemp.area = JSON.parse(JSON.stringify(formTemp.area.id[0]));
      console.log(formTemp);
      this.$refs.form.form = JSON.parse(JSON.stringify(formTemp));
      this.$refs.form.dialog = true;
    },
    editTo(newData){
      Object.keys(this.data).forEach(key => {
        this.data[key] = newData[key]
      });
      this.$emit("update:data", JSON.parse(JSON.stringify(this.data)));
      //等待接口
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
