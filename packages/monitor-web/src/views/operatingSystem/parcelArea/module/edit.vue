<template>
  <span>
<!--    <el-button type="text" size="mini" @click="() => edit()">-->
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="() => edit()">
<!--      编辑-->
    </el-button>
    <eForm ref="form" :disabled="disabled"  :is-add="false" />
  </span>
</template>
<script>
import eForm from "./form";
import {editFarm} from "../../../../api/operatingSystem";
export default {
  components: { eForm },
  data() {
    return {
      disabled: false,
      requestData:{},
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },

  },
  methods: {
    edit() {
      if (this.data.children!==undefined&&this.data.children!==null&&this.data.children.length!==0){
        this.disabled = true;
      }else this.disabled = false;
      this.$refs.form.form = JSON.parse(JSON.stringify(this.data.data));
      this.$refs.form.dialog = true;
    },
    editSuccess(newData) {

      this.data.data = JSON.parse(JSON.stringify(newData))
      if (this.data.data.type===1&&this.data.children===undefined){
        this.$set(this.data,'children',[]);//触发视图更新
      }else delete this.data.children
      this.updateFarm(this.data.data);


    },
    updateFarm(data){
      this.requestData = data;
      console.log("45459783284")
      console.log(this.requestData)
      editFarm(this.requestData)
      .then(res=>{
        console.log(res)
        this.$emit("editData");
        this.$notify({
          title: "修改成功",
          type: "success",
          duration: 2500
        });
        // this.$emit("editData");
      })
      .finally(()=>{
        this.$refs.form.isSuccess(true);
      })
    }
  }
};
</script>

<style scoped>

</style>
