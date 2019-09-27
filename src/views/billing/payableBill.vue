<template>
  <div class="manage">
    <div class="center">
      <el-table :data="[{},{},{}]" border>
        <el-table-column :label="$t('billing.bookingTime')"></el-table-column>
        <el-table-column :label="$t('billing.trackingNo')"></el-table-column>
        <el-table-column :label="$t('billing.totalAmount')"></el-table-column>
      </el-table>
    </div>
    <div class="right">
      <el-table :data="[{},{},{}]" border>
        <el-table-column :label="$t('billing.supply')"></el-table-column>
        <el-table-column :label="$t('billing.amount')"></el-table-column>
      </el-table>
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
    return {};
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
  .center {
    width: 40%;
  }
  .right {
    width: 40%;
  }
}
</style>