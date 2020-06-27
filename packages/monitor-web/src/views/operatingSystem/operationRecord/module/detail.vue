<template>
  <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="700px">
    <div class="context">
      <div class="item-container">
        <div class="item">
          <span class="lable">任务别名:</span>
          <span class="item-context">{{data.alias}}</span>
        </div>
        <div class="item">
          <span class="lable">地块:</span>
          <span class="item-context">{{data.area}}</span>
        </div>
      </div>

      <div class="item-container">

        <div class="item">
          <span class="lable">计划时间:</span>
          <span class="item-context">{{data.planTime}}</span>
        </div>
        <div class="item">
          <span class="lable">事件:</span>
          <span class="item-context">{{data.operate}}</span>
        </div>
      </div>

      <div class="item-container">
        <div class="item">
          <span class="lable">执行时间:</span>
          <span class="item-context">{{data.doTime}}</span>
        </div>
        <div class="item">
          <span class="lable">作物:</span>
          <span class="item-context">{{data.crop}}</span>
        </div>
      </div>

      <div class="item-container">

        <div class="item">
          <span class="lable">执行人:</span>
          <span class="item-context">{{data.executor}}</span>
        </div>
        <div class="item">
          <span class="lable">创建人:</span>
          <span class="item-context">{{data.creator}}</span>
        </div>
      </div>

      <div class="item-container">


        <div class="item">
          <span class="lable">执行反馈:</span>
          <span class="item-context">{{data.doRemark}}</span>
        </div>
        <div class="item">
          <span class="lable">备注:</span>
          <span class="item-context">{{data.planRemark}}</span>
        </div>
      </div>

    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">返回</el-button>
<!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "detail",
    data() {
      return {
        dialogVisible:false,
        data:{}
      }
    },
    updated() {
      console.log("1")
      console.log(this.data)
    },
    methods:{

  },
  }
</script>

<style lang="scss" scoped>
.context{
  /*.item+.item{*/
  /*  margin-top: 15px;*/
  /*}*/
  .item-container{
    display: flex;
    align-items: start;
  }
  .item{
    flex: 1;
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    align-items: start;
    line-height: 30px;
    .lable {
      margin-right: 5px;
      font-weight: 600;
      width: 80px;
      text-align: right;
      font-size: 15px;
    }
    .item-context{
      flex: 1;

    }
  }
}
</style>
