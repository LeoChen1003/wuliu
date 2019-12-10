<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" />
    <el-scrollbar wrap-class="scrollbar-wrapper" style="margin:0 auto;">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        mode="horizontal"
        class="fixmenu"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      const parentPath = route.matched[0].path;
      const routes = this.$store.state.permission.addRoutes;
      // 如果只有1个子节点
      for (let i of routes) {
        if (i.path == parentPath && i.children.length == 1) {
          return `${i.path}`;
        }
      }
      // console.log(route)
      // if set path, the sidebar will highlight the path you set
      // if (meta.activeMenu) {
      //   return meta.activeMenu;
      // }

      // 获取matched里的第一个下标为父级
      return route.matched[0].path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>

<style>
.fixmenu {
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
