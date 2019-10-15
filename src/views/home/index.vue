<template>
  <div class></div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import store from "@/store";

export default {
  beforeRouteEnter (to, from, next) {
    let curRole = localStorage.getItem('curRole')
    if (curRole == "DEMAND") {
      next({ path: "/booking/priceConsulting" });
    } else if (curRole == "SUPPLY") {
      next({ path: "/market/index" });
    } else if (curRole == "HUB") {
      next({ path: "/billing/payableBill" });
    } else if (curRole == "PLATFORM") {
      next({ path: "/tracking/FTL" });
    } else {
      next();
    }
  },
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {};
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {},
  created () { },
  mounted () { }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>