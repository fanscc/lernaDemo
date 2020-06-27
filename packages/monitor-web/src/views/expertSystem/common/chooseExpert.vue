<template>
  <el-dialog :visible.sync="dialogVisible" title="选择专家" width="1000px">
    <div>
      <specialis :choice-expert="true" @choiceExpert="choiceExpert" />
    </div>
  </el-dialog>
</template>

<script>
import specialis from "../setSpecialist.vue";
import { atAddSpecialty } from "@/api/expertSystem";
export default {
  components: {
    specialis
  },
  data() {
    return {
      dialogVisible: false,
      topicId: ""
    };
  },
  methods: {
    open(topicId) {
      this.dialogVisible = true;
      this.topicId = topicId;
    },
    choiceExpert(selectArr) {
      // 调区接口刷新聊天框
      this.dialogVisible = false;
      let params = {
        topicId: this.topicId,
        uid: selectArr.map(item => item.id).join(",")
      };
      atAddSpecialty(params).then(res => {
        console.log(res);
        this.$message.success("添加专家成功");
        this.$emit("initAtExpert", true);
      });
    }
  }
};
</script>
