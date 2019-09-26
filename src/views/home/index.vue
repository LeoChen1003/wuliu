<template>
  <div class>
    <LangSelect :toggleLang="true"></LangSelect>
    <span>{{$t('home.button')}}</span>
    <el-date-picker v-model="value" type="date" placeholder="选择日期"></el-date-picker>
  </div>
</template>

<script>
import LangSelect from "components/LangSelect/index";

export default {
  components: { LangSelect },
  data() {
    return {
      value: ""
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
</style>
