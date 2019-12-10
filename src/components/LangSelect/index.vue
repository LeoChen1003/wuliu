<template>
  <div>
    <el-select v-model="language" @change="handleSetLanguage">
      <el-option label="English" value="en_US"></el-option>
      <el-option label="中文" value="zh_CN"></el-option>
      <el-option label="ไทย" value="th_TH"></el-option>
    </el-select>
    <!-- <div class="btnWrapper">
      <el-button type="primary"
                 class="versionBtn"
                 :key='index'
                 @click="changeVer(item)"
                 size="mini"
                 v-for="(item,index) in roles">
        {{item}}
      </el-button>
    </div> -->
    <el-button @click="logout" type="text" style="color:#333;margin-right:15px;">{{ $t("layout.logout") }}</el-button>
  </div>
</template>

<script>
export default {
  computed: {
    language: {
      get() {
        return this.$store.getters.language;
      },
      set() {},
    },
    roles() {
      return this.$store.getters.userInfo.chosenRoles ? this.$store.getters.userInfo.chosenRoles.split(",") : [];
    },
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
      // this.$message({
      //   message: 'Switch Language Success',
      //   type: 'success'
      // })
    },
    changeVer(ver) {
      let self = this;
      self.$store.dispatch("user/chooseRole", ver);
      localStorage.curRole = ver;
      self.$router.push("/home");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>
<style scope lang="scss">
.btnWrapper {
  box-sizing: border-box;
  padding-top: 10px;
}

.versionBtn {
  width: 100%;
  margin: 0 0 5px 0 !important;
}
</style>
