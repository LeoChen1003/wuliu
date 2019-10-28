<template>
  <div class="navbar">
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />-->
    <div class="right">
      <img src="../../assets/image/logo.png"
           alt="logo"
           class="logo" />
      <sidebar class />
    </div>
    <div class="left">
      <div style="margin-right:40px;">
        <span>Welcome,{{userInfo.name}}</span>
      </div>
      <el-button @click="logout"
                 type="text"
                 style="color:#333;margin-right:15px;">{{$t('layout.logout')}}</el-button>
      <el-popover placement="bottom-start"
                  width="160">
        <div>
          <LangSelect :toggleLang="true"></LangSelect>

        </div>
        <i slot="reference"
           class="el-icon-setting"></i>
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
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search,
    Sidebar
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "userInfo"])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout () {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  width: 100%;
  overflow: hidden;
  background: #ffea33;
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
</style>
<style>
.el-menu {
  /* display: flex; */
}
.el-submenu,
.el-menu-item {
  width: 160px;
}
.nest-menu .el-menu-item {
  width: 210px;
}

.logo {
  width: 100px;
  margin-right: 20px;
}
</style>
