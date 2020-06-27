<template>
  <div>

    <div class="custom-tree-node-container">
      <el-tooltip class="item" effect="dark" content="添加最大地块" placement="top">
      <Add class="maxAdd" @addNewData="addNewData" :nodeType="0"/>
      </el-tooltip>
      <el-tree
        :data="data"
        node-key="data.name"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{node.data.data.name}}</span>
          <span class="handle-container">
            <span  class="handle">
            <el-tooltip class="item" effect="dark" :content="node.data.data.type===1?'添加此地块的子地块':'此地块没有子地块'" placement="left">
              <Add :data.sync="data" @addNewData="addNewData" :nodeType="node.data.data.type" />
            </el-tooltip>
            <Edit :data="data" @editData="editData" />
            <el-button
              type="danger"
              size="mini"
              class="el-icon-delete"
              @click="() => remove(node, data)"
            >
            </el-button>
              </span>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import Add from "./module/add";
import Edit from "./module/edit";
import {delFarm, getFarm} from "../../../api/operatingSystem";

export default {
  components: { Add, Edit },
  name: "index",
  data() {
    return {
      data:[],
      newData: {},
    };
  },
  methods: {
    addNewData(){
      this.init();
      this.$notify({
        title: "增加成功",
        type: "success",
        duration: 2500
      });
    },
    editData(){
      this.init();
    },
    remove(node, data) {
      // console.log(node)
      let parent = node.parent;
      let children = parent.data.children || parent.data;
      // let index = children.findIndex(d => d.id === data.id);
      this.$confirm('此操作将删除此地块以及它的子地块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        children.splice(parseInt(node.data.data.id), 1);
        console.log(typeof parseInt(node.data.data.id))
        console.log(parseInt(node.data.data.id))
        delFarm(parseInt(node.data.data.id))
        .then(res=>{
          console.log(res)
          this.init();
            this.$notify({
              title: "删除成功",
              type: "success",
              duration: 2500
            });

        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async init(){
      let data = await getFarm();
      let tables = {};//储存各个块
        data.result.forEach(item=>{
            //根据parent分块
          if (tables[item.parent+'']===undefined){
            tables[item.parent+''] = [];
          }
          tables[item.parent+''].push({"data":item});
        })
        //根据id与parent整合
        Object.keys(tables).forEach(index=>{
          tables[index].forEach(item=>{
            //根据type创建children
            if (item.data.type===1){
              item["children"] = [];
              if (tables[item.data.id]!==undefined)
                item.children = tables[item.data.id];
            }
          });
        });
        // this.data.splice(0,this.data.length-1)
      this.data = [...tables["0"]];
      // this.data = JSON.parse(JSON.stringify(tables["0"]))
    }
  },
  mounted() {
    this.init()
  }
};
</script>

<style lang="scss" scoped>
  .custom-tree-node-container{
    display: block;
    width: 90%;
    height: 80vh;
    /*border: 1px solid #000000;*/
    margin: 2vh auto;
    .maxAdd{
      display: inline-block;
      margin: 0 0 10px 20px;
    }
    .el-tree-node__content{
      height: 100px;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding: 8px;
      .handle-container {
        width: 200px;
        .handle{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
          .el-button--mini span{
            font-size: 14px;
          }
      }
    }
    }
  }


</style>
