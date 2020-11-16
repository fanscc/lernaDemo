<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="to" />
    <eForm
      ref="form"
      :sup_this="sup_this"
      :is-add="false"
      :dicts="dicts"
      :specialty_arr="specialty_arr"
    />
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
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    },
    specialty_arr: {
      type: Array,
      required: true
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form;
      _this.getRoles();
      _this.getDepts();
      _this.getRoleLevel();
      _this.roleIds = [];
      _this.form = {
        id: this.data.id,
        username: this.data.username,
        phone: this.data.phone,
        email: this.data.email,
        enabled: this.data.enabled.toString(),
        roles: [],
        dept: { id: this.data.dept ? this.data.dept.id : "" },
        job: { id: this.data.job ? this.data.job.id : "" },
        majorId: this.data.majorId,
        expertIntroduction: this.data.expertIntroduction
      };
      this.data.roles.forEach(function(data) {
        _this.roleIds.push(data.id);
      });
      _this.dialog = true;
      _this.deptId = this.data.dept ? this.data.dept.id : null;
      _this.jobId = this.data.job ? this.data.job.id : null;
      _this.getJobs(_this.deptId);
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
