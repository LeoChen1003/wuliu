<!-- member index -->
<template>
  <div class="wrapper member">
    <el-tabs v-model="tabActive" tab-position="left" style="height:100%">
      <el-tab-pane name="t" :label="$t('member.Addressbook')"><div class="container"></div></el-tab-pane>
      <el-tab-pane name="s" :label="$t('member.UserManagement')"><div class="container"></div></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getInfo } from "@/api/member";

let self;
export default {
  data() {
    return {
      tabActive: "t",
    };
  },
  watch: {},
  mounted() {
    self = this;
    // self.loadData();
  },
  methods: {
    loadData() {
      self.loadData_info();
    },
    // 载入基础资料`
    loadData_info() {
      getInfo().then(res => {
        self.setForm.exchange = res.data.site.exchange;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  box-sizing: border-box;
  height: calc(100vh - 91px);
}

.container {
  height: calc(100vh - 91px);
  padding: 20px;
  padding-left: 40px;
  overflow: scroll;
}
</style>
<style>
.member .el-form-item {
  margin-bottom: 15px;
}

.member .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
  line-height: 16px;
  height: 50px;
}

.member .el-tabs__content {
  background-color: #fff;
}

.member .el-tabs__active-bar {
  width: 0;
  height: 0;
  background-color: #fff;
}

.member .el-tabs--left .el-tabs__active-bar.is-left {
  width: 0;
  height: 0;
}

.member .el-tabs__nav-wrap::after {
  background-color: #fff;
}

.member .el-tabs--left .el-tabs__nav-wrap.is-left {
  width: 185px;
  padding-top: 20px;
}

.member .el-tabs--left .el-tabs__header.is-left {
  margin-left: 10px;
  background-color: #fff;
}
</style>
