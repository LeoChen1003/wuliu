<template>
  <div class="navbar">
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />-->
    <div class="right">
      <img src="../../assets/image/logo.png" alt="logo" class="logo" />
      <div class="role">
        <el-popover
          placement="top"
          width="160"
          trigger="hover"
          v-model="visible"
        >
          <div class="btnWrapper">
            <el-button
              type="primary"
              class="versionBtn"
              :key="index"
              @click="changeVer(item)"
              size="mini"
              v-for="(item, index) in roles"
            >
              {{ item }}
            </el-button>
          </div>
          <div slot="reference" style="width:100px;text-align:center;">
            {{ nowRole }}
          </div>
        </el-popover>
      </div>
      <sidebar class="slidebar" />
    </div>
    <div class="left">
      <div style="margin-right:40px;">
        <div>{{ $t("route.welcome") }},{{ userInfo.name }}</div>
      </div>
      <el-popover placement="bottom-start" width="160">
        <div>
          <LangSelect :toggleLang="true"></LangSelect>
        </div>
        <i slot="reference" class="el-icon-setting"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import Search from "@/components/HeaderSearch";
import Sidebar from "@/components/Sidebar";

export default {
  components: {
    LangSelect,
    Sidebar
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "userInfo"]),
    roles() {
      return this.$store.getters.userInfo.chosenRoles
        ? this.$store.getters.userInfo.chosenRoles.split(",")
        : [];
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    changeVer(ver) {
      let self = this;
      self.$store.dispatch("user/chooseRole", ver);
      localStorage.curRole = ver;
      self.$router.push("/home");
    }
  },
  data() {
    return {
      visible: false,
      nowRole: localStorage.getItem("curRole")
    };
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.nowRole = localStorage.getItem("curRole");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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

  .left {
    width: 300px;
    justify-content: flex-end;
  }

  .right {
    width: 90%;

    .slidebar {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.el-submenu,
.el-menu-item {
  width: 160px;
  margin: 0 10px;
  background-color: red;
}

.nest-menu .el-menu-item {
  width: 210px;
}

.el-menu-item {
  border-bottom: 0px solid rgba($color: #000000, $alpha: 0) !important;
  transition: all 0.4s !important;

  &:hover {
    background: #fff !important;
    color: red !important;
  }
}

.noPermission {
  .el-menu-item:hover {
    background: #fff !important;
    border-bottom: 10px solid black !important;
    color: black !important;
  }
}

.logo {
  width: 100px;
  margin-right: 20px;
}

.btnWrapper {
  box-sizing: border-box;
  padding-top: 10px;
}

.versionBtn {
  width: 100%;
  margin: 0 0 5px 0 !important;
}
</style>
