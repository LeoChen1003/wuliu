<template>
  <div class="navbar">
    <img src="../../assets/image/logo.png" alt="logo" />
    <div>
      <LangSelect :toggleLang="true"></LangSelect>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import LangSelect from "components/LangSelect/index";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { LangSelect },
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
.navbar {
  height: 50px;
  width: 100%;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>