<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- <sidebar class="sidebar-container" /> -->
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <div class="subNav" v-if="subRoutes.length > 1">
          <div
            class="subNav-item"
            :class="item.active ? 'subNav-item-active' : ''"
            v-for="item in subRoutes"
            @click="$router.push({ path: item.path })"
            v-if="permissions[item.meta.permission]"
            v-show="!item.hidden"
          >
            {{ generateTitle(item.meta.title) }}
          </div>
          <div v-else class="subNav-item noPermission">
            {{ generateTitle(item.meta.title) }}
          </div>
        </div>
        <!-- <breadcrumb id="breadcrumb-container"
                    class="breadcrumb-container" /> -->
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import Breadcrumb from "@/components/Breadcrumb";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";
import { generateTitle } from "@/utils/i18n";

let self;

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
  },
  created() {
    self = this;
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    ...mapGetters(["permissions"]),
  },
  data() {
    return {
      subRoutes: [],
    };
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        self.cRouter();
      },
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    // 计算子路由
    cRouter() {
      let nowPath = self.$router.history.current.path;
      let nowSub = self.cNowSub(nowPath);
      let subRoutes = nowSub.children;
      self.subRoutes = subRoutes;
    },
    // 寻找当前子路由集
    cNowSub(nowPath) {
      // 依附当前权限的路由集
      let routers = JSON.parse(JSON.stringify(self.$store.state.permission.addRoutes));
      for (let i of routers) {
        /*
         * 不包含二级路由情况
         * 暂不存在
         * 目前的实现方式是写一个index子路由
         * 后期如果出现需要此处适配
         */
        if (i.path == nowPath) {
          return [];
        } else {
          // 其他情况
          for (let t of i.children) {
            if (`${i.path}/${t.path}` == nowPath) {
              t.active = true;
              return i;
            }
          }
        }
      }
    },
    generateTitle,
  },
  mounted() {
    self.cRouter();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100%);
  transition: width 0.28s;
}

// .hideSidebar .fixed-header {
//   width: calc(100% - 54px);
// }

.mobile .fixed-header {
  width: 100%;
}

.subNav {
  display: flex;
  justify-content: center;
  background: rgb(249, 249, 249);
  border-bottom: 1px solid #ddd;

  .subNav-item {
    width: 150px;
    height: 40px;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
    margin: 0 10px;
    cursor: pointer;
    transition: all 0.4s;

    &:hover {
      color: red;
    }
  }

  .noPermission {
    cursor: not-allowed;
    color: #ccc;

    &:hover {
      color: #ccc;
    }
  }

  .subNav-item-active {
    font-weight: bold;
    color: red;
    // border-bottom: 2px solid red;
  }
}
</style>
