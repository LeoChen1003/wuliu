<template>
  <div class="">
    <Platform :auditStatus="'STOPED'" />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Platform from "./component/platform";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Platform
  },
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
<style lang="scss" scoped>
//@import url(); 引入公共css类
</style>
