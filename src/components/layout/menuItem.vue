<template>
  <div class>
    <!--这个表示有子菜单的情况下，才会显示-->
    <el-submenu :index="item.path" v-if="item.children && item.children.length>0">
      <template slot="title">
        <span slot="title">{{item.meta.title?$t(`routes.${item.meta.title}`):''}}</span>
      </template>
      <template v-for="(routePath,index) in item.children">
        <menuItem
          :item="routePath"
          :key="index"
          v-if="routePath.children && routePath.children.length>0"
        ></menuItem>
        <el-menu-item v-else :index="item.path+'/'+routePath.path" :key="index">
          <span slot="title">{{routePath.meta.title?$t(`routes.${routePath.meta.title}`):''}}</span>
        </el-menu-item>
      </template>
    </el-submenu>

    <!--表示一级菜单-->
    <el-menu-item v-else-if="!item.hidden" :index="item.path">
      <span slot="title">{{item.meta.title?$t(`routes.${item.meta.title}`):''}}</span>
    </el-menu-item>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  props: {
    item: {
      type: Object,
      default: []
    }
  },
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
</style>