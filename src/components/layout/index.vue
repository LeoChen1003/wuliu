<template>
  <div class="navbar">
    <div class="right">
      <img src="../../assets/image/logo.png" alt="logo" style="margin-right:20px;" />
      <el-menu :default-active="$route.path" router mode="horizontal">
        <menuItem v-for="(item,index) in routes" :item="item" :key="index"></menuItem>
      </el-menu>
    </div>
    <div class="left">
      <div style="margin-right:40px;">
        <span>Welcome,Demand_A</span>
      </div>
      <el-button
        @click="logout"
        type="text"
        style="color:#333;margin-right:15px;"
      >{{$t('layout.logout')}}</el-button>
      <LangSelect :toggleLang="true"></LangSelect>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import LangSelect from "components/LangSelect/index";
import menuItem from "./menuItem";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { LangSelect, menuItem },
  data() {
    return {
      routes: []
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    async logout() {
      // await this.$store.dispatch("user/logout");
      this.$router.replace("/login");
    }
  },
  created() {
    let self = this;
    self.routes = this.$router.options.routes;
    console.log(self.routes);
  },
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
  .right,
  .left {
    display: flex;
    align-items: center;
  }
}
.el-menu {
  display: flex;
}
</style>
<style >
.el-submenu {
  width: 120px;
}
</style>