<template>
  <span>
<!--    <el-button type="text" size="mini" @click="() => add()" :disabled="nodeType==2">-->
<!--    <el-button size="mini" type="primary" icon="el-icon-plus" @click="() => add()" v-show="!(nodeType==2)">-->
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="() => add()" :disabled="nodeType==2">
<!--      新增-->
    </el-button>
    <eForm ref="form" :addDate="newData" :is-add="true" />
  </span>
</template>

<script>
  import {addFarm} from "../../../../api/operatingSystem";

  // let id = 100;
  import eForm from "./form";
  import selectTheSeats from "../../../../components/map/selectTheSeats";

  export default {
    components:{ eForm },
    name: "add",
    props:{
      data:{
        type: Object,
      },
      nodeType:{
        type: Number,
        required: true,
      }
    },
    data(){
      return {
        newData: {},
        disabled: true,
        requestData:{}
      }
    },

    methods:{
      add() {
        this.$refs.form.dialog = true
      },

      append(newData) {
        if(newData) {
          let newChild;
              if (newData.type===1) {
                newChild = {data: JSON.parse(JSON.stringify(newData)), children: []};
              } else {
                newData.type = 2
                newChild = {data: JSON.parse(JSON.stringify(newData))};
              }
              if(!this.data){
                newChild.data.parent = 0;
              }
              else if (this.data.data.type === 2) {
                this.$message("已是最小地块，不能再分组");
              }else{
                newChild.data.parent = this.data.data.id
                this.data.children.push(JSON.parse(JSON.stringify(newChild)));
              }
              this.addFarmApi(newChild);
        }
      },
      addFarmApi(data){

        this.requestData = JSON.parse(JSON.stringify(data.data));
        console.log("3429783284")
        console.log(this.requestData)
        addFarm(this.requestData)
        .then(reason => {
          this.$emit("addNewData");
        })
        .catch(reason => {
          console.log(reason)
        })
        .finally(()=>{
          this.$refs.form.isSuccess(true);
        })
      },
    },
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
