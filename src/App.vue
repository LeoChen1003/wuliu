<template>
  <div>
    <Layout></Layout>
    <router-view />
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
</style>