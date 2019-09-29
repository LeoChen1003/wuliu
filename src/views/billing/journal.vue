<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{$t('billing.account')}}</div>
      <div class="timePicker">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        ></el-date-picker>
      </div>
    </div>
    <div class="content">
      <el-tabs tab-position="left" v-model="tabActive" style="height:100%" type="card">
        <el-tab-pane :label="$t('billing.gaurantee')">
          <div class="container">
            <div class="center">
              <el-table :data="[{},{},{}]" border>
                <el-table-column :label="$t('billing.date')"></el-table-column>
                <el-table-column :label="$t('billing.transactionType')"></el-table-column>
                <el-table-column :label="$t('billing.documentNo')"></el-table-column>
                <el-table-column :label="$t('billing.increase')"></el-table-column>
                <el-table-column :label="$t('billing.decrease')"></el-table-column>
                <el-table-column :label="$t('billing.balance')"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('billing.freight')">
          <div class="container">
            <div class="center">
              <el-table :data="[{},{},{}]" border>
                <el-table-column :label="$t('billing.date')"></el-table-column>
                <el-table-column :label="$t('billing.transactionType')"></el-table-column>
                <el-table-column :label="$t('billing.documentNo')"></el-table-column>
                <el-table-column :label="$t('billing.increase')"></el-table-column>
                <el-table-column :label="$t('billing.decrease')"></el-table-column>
                <el-table-column :label="$t('billing.balance')"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      tabActive: 0,
      value1: []
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  .statusHeader {
    display: flex;
    .status-txt {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      width: 225px;
    }
    .timePicker {
      height: 42px;
      line-height: 40px;
      padding-left: 30px;
    }
  }
  .content {
    height: 100%;
    .container {
      display: flex;
      padding: 20px;
      .center {
        width: 99%;
        margin-right: 1%;
      }
    }
  }
}
</style>

<style>
.billing .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0px;
  width: 224px;
}
</style>