<template>
  <div class="app">
    <Layout></Layout>
    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Layout from "components/layout/index";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: { Layout }
};
</script>

<style>
body,
html {
  margin: 0px;
}
.app {
  /* 50= navbar  50  */
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.app-content {
  min-height: calc(100vh - 50px);
  width: 100%;
}
</style>