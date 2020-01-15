<!-- member index -->
<template>
  <div class="wrapper member">
    <el-tabs v-model="tabActive" tab-position="left" style="height:100%">
      <!-- 基础设置 -->
      <el-tab-pane name="setting" :label="'体积重量换算'">
        <div class="container">
          <el-form
            hide-required-asterisk
            label-width="200px"
            ref="setForm"
            :model="setForm"
            :rules="setRules"
            label-position="left"
          >
            <el-form-item prop="exchange" :label="$t('member.VolumeWeightDivisor')">
              <el-select v-model="setForm.exchange" :placeholder="$t('placeholder.pleaseChoose')" class="inp">
                <el-option :label="2500" :value="2500"> </el-option>
                <el-option :label="3000" :value="3000"> </el-option>
                <el-option :label="3500" :value="3500"> </el-option>
              </el-select>
              <div style="color:#ccc;">
                <div>{{ $t("member.volumeWeightConversion") }}</div>
                <div class="inp">
                  {{ $t("member.example") }},<br />
                  {{ $t("member.example1") }}
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSet" class="submitBtn">{{ $t("member.save") }} </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane name="d" :label="'偏远地区'"><div class="container"></div></el-tab-pane>
      <el-tab-pane name="s" :label="'用户管理'"><div class="container"></div></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getInfo, setExchange } from "@/api/member";

let self;
export default {
  data() {
    return {
      tabActive: "setting",
      setForm: {
        exchange: null,
      },
      setRules: {
        exchange: [{ required: true, message: " ", trigger: "change" }],
      },
    };
  },
  watch: {},
  mounted() {
    self = this;
    self.loadData();
  },
  methods: {
    loadData() {
      self.loadData_info();
    },
    // 载入基础资料`
    loadData_info() {
      getInfo().then(res => {
        self.infoForm = res.data.site;
        self.setForm.exchange = res.data.site.exchange;
        if (res.data.site.contactMobile == "" || res.data.site.contactMobile == null) {
          self.infoForm.contactMobile = res.data.user.phone;
        }
        self.typeList = self.$store.getters.userInfo.chosenRoles.split(",");
      });
    },
    // 保存基础设置
    saveSet() {
      self.$refs.setForm.validate(valid => {
        if (valid) {
          setExchange(self.setForm).then(res => {
            self.$message.success(self.$t("member.saveSuccess"));
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  box-sizing: border-box;
  height: calc(100vh - 91px);
}

.container {
  height: calc(100vh - 91px);
  padding: 20px;
  padding-left: 40px;
  overflow: scroll;
}
</style>
<style>
.member .el-form-item {
  margin-bottom: 15px;
}

.member .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
  line-height: 16px;
  height: 50px;
}

.member .el-tabs__content {
  background-color: #fff;
}

.member .el-tabs__active-bar {
  width: 0;
  height: 0;
  background-color: #fff;
}

.member .el-tabs--left .el-tabs__active-bar.is-left {
  width: 0;
  height: 0;
}

.member .el-tabs__nav-wrap::after {
  background-color: #fff;
}

.member .el-tabs--left .el-tabs__nav-wrap.is-left {
  width: 185px;
  padding-top: 20px;
}

.member .el-tabs--left .el-tabs__header.is-left {
  margin-left: 10px;
  background-color: #fff;
}
</style>
