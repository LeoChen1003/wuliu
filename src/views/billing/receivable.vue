<template>
  <div class="manage billing">
    <div class="content">
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="handleClick" style="height:100%;">
          <el-tab-pane name="WAIT_SETTLE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.orderPending") }}</span>
                  <sub class="badge red">{{ statusCount.WAIT_SETTLE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SETTLED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.orderCompleted") }}</span>
                  <sub class="badge">{{ statusCount.SETTLED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="PAID">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.paid2") }}</span>
                  <sub class="badge">{{ statusCount.PAID }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="REJECTED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  <span>{{ $t("billing.orderRejected") }}</span>
                  <sub class="badge">{{ statusCount.REJECTED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="timePicker">
          <bc-picker :dateType="'daterange'" :dateArray="dateArrDeFault" @changeBCtime="changeBCtime"></bc-picker>
          <el-button size="small" @click="searchIt" style="width:100px;margin-left:20px;">{{ $t("billing.search") }}</el-button>
        </div>
        <div class="container_center">
          <div class="center">
            <el-table :data="tableData" highlight-current-row v-loading="loading" @current-change="handleCurrentChange" border>
              <el-table-column prop="createdAt" :label="$t('billing.bookingTime')" />
              <el-table-column prop="orderNo" :label="$t('billing.trackingNo')" />
              <el-table-column prop="settlementAmount" :label="$t('billing.totalAmount')" />
            </el-table>
            <el-pagination
              style="margin-top:10px;text-align: center;margin-bottom:50px;"
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
              <el-tab-pane :label="'收费详情'" name="detail" class="trackingDetail">
                <el-form v-if="thisRow" label-width="130px" label-position="left">
                  <el-form-item :label="$t('booking.supply')">
                    {{ thisRow.supply.type == "COMPANY" ? thisRow.supply.companyName : thisRow.supply.humanName }}
                  </el-form-item>
                  <el-form-item :label="$t('billing.freight')">
                    {{ thisRow.settlementAmount - thisRow.serviceAmount }}
                  </el-form-item>
                  <div v-for="(item, index) in thisRow.chargeList" :key="index">
                    <el-form-item :label="serveObj[item.chargeType]">{{ item.money }}</el-form-item>
                  </div>
                  <el-form-item :label="$t('booking.totalamt')">
                    {{ thisRow.settlementAmount }}
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { supplyFinance, billsupplyCount } from "../../api/billing";
import { getExtraServer } from "../../api/data";
import { getTime, parseTime, getLastMonthTime, getNormalTime, getBcTime } from "../../utils/index";
import { mapGetters } from "vuex";

let self;
export default {
  data() {
    return {
      tabActive: "WAIT_SETTLE",
      fromDate: getBcTime(getLastMonthTime(new Date())),
      toDate: getBcTime(parseTime(new Date().getTime(), "{y}-{m}-{d}")),
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
      },
      pagesize: 20,
      loading: false,
      detailData: [],
      statusCount: {},
      dateArrDeFault: [],
      curTab: "detail",
      thisRow: null,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
  },
  // 监控data中的数据变化
  watch: {},
  created() {
    self = this;
    let arr = [];
    arr.push(getNormalTime(self.fromDate));
    arr.push(getNormalTime(self.toDate));
    self.dateArrDeFault = arr;
  },
  mounted() {
    self.loadData();
    getExtraServer().then(res => {
      let serveObj = new Object();
      for (let i of res.data) {
        serveObj[i.key] = i.trans;
      }
      self.serveObj = serveObj;
    });
  },
  methods: {
    changeBCtime(time) {
      self.fromDate = time[0];
      self.toDate = time[1];
    },
    pageChange(val) {
      let self = this;
      self.page.currentPage = val;
      self.loadData();
    },
    pageSizeChange(val) {
      let self = this;
      self.pagesize = val;
      self.loadData();
    },
    loadData() {
      self.loading = true;
      supplyFinance(self.tabActive, {
        start: self.fromDate + " 00:00:00",
        end: self.toDate + " 23:59:59",
        page: self.page.currentPage - 1,
        pagesize: self.pagesize,
      })
        .then(res => {
          self.tableData = res.data.content;
          self.page = {
            total: res.data.totalElements,
            currentPage: res.data.number + 1,
          };
          self.loading = false;
        })
        .catch(() => {
          self.loading = false;
        });
      billsupplyCount({
        start: self.fromDate + " 00:00:00",
        end: self.toDate + " 23:59:59",
      }).then(res => {
        self.statusCount = res.data;
      });
    },
    searchIt() {
      self.loadData();
    },
    handleClick() {
      self.loadData();
    },
    handleCurrentChange(val) {
      const self = this;
      self.thisRow = val;
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  box-sizing: border-box;
  .timePicker {
    height: 42px;
    line-height: 40px;
    display: flex;
    margin-top: 20px;
    align-items: center;
  }
  .content {
    padding-left: 20px;
    display: flex;
    // margin-top: 5px;
    height: calc(100vh - 91px);
    .container {
      width: 100%;
      padding: 20px;
      background-color: #fff;
      overflow: scroll;
      height: 100%;
      .container_center {
        padding-top: 20px;
        width: 100%;
        display: flex;
        overflow: scroll;
        background-color: #fff;
        justify-content: space-between;
      }
      .center {
        width: 49%;
      }
      .right {
        width: 49%;
      }
    }
  }
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
