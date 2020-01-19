<template>
  <div class="manage billing">
    <div class="content">
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="handleClick" style="height:100%;">
          <el-tab-pane name="DEFAULT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.toBeConfirmed") }}</span>
                  <sub class="badge red">{{ statusCount.DEFAULT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.confirmed") }}</span>
                  <sub class="badge">{{ statusCount.ACCEPT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="REJECTED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.rejected") }}</span>
                  <sub class="badge">{{ statusCount.REJECTED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <el-button size="small" type="primary" style="width:150px;margin-top:20px;" @click="toTopup">{{
          $t("billing.topUp")
        }}</el-button>
        <div class="container_center">
          <div class="center">
            <el-table
              :data="dataList"
              highlight-current-row
              @current-change="handleCurrentChange"
              border
              :max-height="tableHeight"
            >
              <el-table-column prop="operateAt" :label="$t('billing.date')">
                <template slot-scope="scope">
                  {{ scope.row.operateAt.slice(0, 10) + " " + scope.row.operateAt.slice(11, 19) }}
                </template>
              </el-table-column>
              <el-table-column prop="financeAccountType" :label="$t('billing.type')"></el-table-column>
              <el-table-column :label="$t('billing.amount')">
                <template slot-scope="scope">
                  {{ scope.row.amount }}
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                :label="$t('billing.reasonsForRefusal')"
                v-if="tabActive == 'REJECTED'"
              ></el-table-column>
            </el-table>
            <el-pagination
              style="margin-top:10px;text-align: center;margin-bottom:10px;"
              background
              :page-sizes="[1, 5, 10, 20, 50]"
              :page-size="pagesize"
              @size-change="pageSizeChange"
              :current-page.sync="page.currentPage"
              @current-change="pageChange"
              layout="prev, pager, next, jumper"
              :total="page.total"
            ></el-pagination>
          </div>
          <div class="right">
            <el-tabs v-model="curTab" @tab-click="handleClick">
              <el-tab-pane :label="$t('tracking.TopUPPicture')" name="image" class="trackingDetail">
                <div class="rightDetail" :style="`max-height:${detailHeight}px;`">
                  <el-image :src="showUrl" v-if="showUrl"></el-image>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('tracking.Log')" name="log" class="trackingDetail"> </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('billing.topUp')" :visible.sync="dialogVisible" width="60%" top="10vh" center>
      <div>
        <el-form
          ref="topUpform"
          :model="topUpform"
          :rules="topUpRules"
          :show-message="false"
          class="form"
          label-position="left"
          label-width="160px"
        >
          <el-form-item prop="fee_ype" :label="$t('billing.topUptype')">
            <el-select v-model="topUpform.fee_ype" :placeholder="$t('placeholder.pleaseChoose')" class="inputWidth">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="operate_at" :label="$t('billing.date')">
            <div style="display:flex;align-items:center;justify-content:space-between;" class="inputWidth">
              <bc-picker @changeBCtime="changeBCtime" style="width:50%;"></bc-picker>
              <el-time-picker
                v-model="time"
                format="HH:mm:ss"
                class="innerInp"
                style="width:45%;"
                value-format="HH:mm:ss"
                :placeholder="$t('placeholder.chooseTime')"
              >
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item prop="amount" :label="$t('billing.amount')">
            <el-input v-model="amount" type="number" @change="changeAmount" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item prop="resource_id" :label="$t('billing.attachment')">
            <div class="inputWidth">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=top_up_copy&apply_type=' + apply_type"
                :headers="headers"
                :limit="1"
                ref="upload"
                accept="image/*"
                :on-success="uploadSuccess"
                :on-remove="handleRemove"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item prop="remarks" :label="$t('billing.remarks')">
            <el-input class="inputWidth" v-model="topUpform.remarks" type="textarea" resize="none" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" style="margin-top:20px;" :loading="loading" class="inputWidth" @click="toConfirm">{{
              $t("resources.confirm")
            }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" style="margin-bottom:20px;" class="inputWidth" @click="dialogVisible = false">{{
              $t("resources.cancel")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { topUpList, topUp, billTopUpCount } from "../../api/billing";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

let self;
export default {
  data() {
    const self = this;
    const validateTimeAt = (rule, value, callback) => {
      if (!value) {
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      tabActive: "DEFAULT",
      dialogVisible: false,
      loading: false,
      value1: "",
      topUpform: {
        fee_ype: "FEE",
        operate_at: "",
        amount: null,
        resource_id: null,
        apply_type: localStorage.getItem("curRole"),
      },
      amount: null,
      dataList: [],
      apply_type: localStorage.getItem("curRole"),
      options: [
        {
          value: "GUARANTEE",
          label: "GUARANTEE",
        },
        {
          value: "FEE",
          label: "FEE",
        },
      ],
      topUpRules: {
        fee_ype: [{ required: true }],
        operate_at: [{ required: true, trigger: "blur", validator: validateTimeAt }],
        amount: [{ required: true, trigger: "blur" }],
        resource_id: [{ required: true }],
      },
      baseUrl: process.env.VUE_APP_BASE_API + "/api/member/upload",
      headers: {
        authorization: getToken(),
        locale: self.$store.getters.language,
      },
      showUrl: "",
      page: {
        total: 0,
        currentPage: 1,
      },
      pagesize: 20,
      time_at: "",
      time: "",
      statusCount: {},
      curTab: "image",
      tableHeight: 0,
      detailHeight: 0,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
  },
  // 监控data中的数据变化
  watch: {
    time_at(val) {
      let t = self.time ? self.time : "00:00:00";
      self.topUpform.operate_at = val + ` ${t}`;
    },
    time(val) {
      let t = val ? val : "00:00:00";
      self.topUpform.operate_at = self.time_at + ` ${val}`;
    },
  },
  created() {
    self = this;
  },
  mounted() {
    this.getTopUpList();
    self.getCount();
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 32 - 20 - 32 - 20;
      this.detailHeight = window.innerHeight - 91 - 40 - 32 - 20 - 40 - 15 - 32 - 20;
    });
  },
  methods: {
    cell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return "text-align:center;color:#168BD5;font-size:23px;";
      }
    },
    getTopUpList() {
      let self = this;
      let applyType = localStorage.getItem("curRole");
      topUpList(applyType, self.tabActive, {
        page: self.page.currentPage - 1,
        pagesize: self.pagesize,
      }).then(res => {
        self.dataList = res.data.content;
        self.page = {
          total: res.data.totalElements,
          currentPage: res.data.number + 1,
        };
      });
    },
    getCount() {
      const self = this;
      billTopUpCount(self.apply_type).then(res => {
        self.statusCount = res.data;
      });
    },
    pageChange(val) {
      let self = this;
      self.page.currentPage = val;
      self.getTopUpList();
    },
    pageSizeChange(val) {
      let self = this;
      self.pagesize = val;
      self.getTopUpList();
    },
    handleClick() {
      this.showUrl = "";
      this.getTopUpList();
    },
    changeBCtime(time) {
      const self = this;
      self.time_at = time;
    },
    toTopup() {
      const self = this;
      self.dialogVisible = true;
      if (self.topUpform.resource_id) {
        this.$refs.upload.clearFiles();
      }
      self.topUpform = {
        fee_ype: "FEE",
        operate_at: "",
        amount: null,
        resource_id: null,
        apply_type: localStorage.getItem("curRole"),
      };
      self.amount = null;
    },
    changeAmount() {
      let self = this;
      self.topUpform.amount = self.amount;
    },
    toConfirm() {
      let self = this;
      this.$refs.topUpform.validate(valid => {
        if (valid) {
          self.loading = true;
          topUp(self.topUpform)
            .then(res => {
              self.$message.success(res.message);
              self.dialogVisible = false;
              self.loading = false;
              self.getTopUpList();
              self.getCount();
            })
            .catch(el => {
              self.loading = false;
            });
        }
      });
    },
    // 文件上传成功的处理
    uploadSuccess(res, file) {
      const self = this;
      if (res.status === 200) {
        self.topUpform.resource_id = res.data.resource.id;
      }
    },
    handleRemove(file, fileList) {},
    handleCurrentChange(val) {
      const self = this;
      if (val) {
        self.showUrl = val.resource.path;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  box-sizing: border-box;
  .statusHeader {
    display: flex;
    padding: 0px 20px;
    box-sizing: border-box;
    height: 50px;
    align-items: center;
  }
  .timePicker {
    height: 42px;
    line-height: 40px;
    padding-left: 30px;
  }
  .content {
    padding-left: 20px;
    display: flex;
    height: calc(100vh - 91px);
    // margin-top: 5px;
    .container {
      width: 100%;
      height: 100%;
      overflow: scroll;
      background-color: #fff;
      padding-left: 20px;

      .container_center {
        display: flex;
        padding-top: 20px;
        width: 100%;
        overflow: scroll;
        background-color: #fff;
      }
      .center {
        width: 49%;
        margin-right: 1%;
      }
      .right {
        width: 49%;
        padding: 0 10px;
        overflow: scroll;
        // min-height: calc(100% - 50px);
        // border: 2px solid #dfe6ec;
        // display: flex;
        // justify-content: center;
        // align-items: center;
      }
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: -100px;
  }
}
.inputWidth {
  width: 350px;
}
.tabLabel {
  display: flex;
  justify-content: flex-end;
  .text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    white-space: normal;
    word-break: break-all;
    line-height: 16px;
  }

  .badge {
    font-size: 12px;
    margin-left: 5px;
    color: #aaa;
    width: 25px;
    text-align: right;
  }

  .red {
    color: red;
  }
}

.rightDetail {
  overflow: scroll;
}
</style>

<style lang="scss">
.billing .nav {
  .el-tabs--left .el-tabs__item.is-left {
    text-align: left;
    height: 50px;
  }

  .el-tabs__content {
    background-color: #fff;
  }

  .el-tabs__active-bar {
    width: 0;
    height: 0;
    background-color: #fff;
  }

  .el-tabs--left .el-tabs__active-bar.is-left {
    width: 0;
    height: 0;
  }

  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  .el-tabs--left .el-tabs__nav-wrap.is-left {
    width: 185px;
    padding-top: 20px;
  }

  .el-tabs--left .el-tabs__header.is-left {
    margin-left: -10px;
    background-color: #fff;
  }

  .el-table__header-wrapper {
    background-color: #ccc !important;
  }

  .el-table__header {
    background-color: #ccc !important;
  }
}
</style>
