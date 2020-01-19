<template>
  <div class="manage billing">
    <div class="content">
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="handleClick" style="height:100%;">
          <el-tab-pane name="WAIT_SETTLE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("billing.demandPaid") }}<sub class="badge red">{{ statusCount.WAIT_SETTLE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SETTLED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("billing.supplyDelivered") }}<sub class="badge">{{ statusCount.SETTLED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="REJECTED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("billing.orderCanceled") }}<sub class="badge">{{ statusCount.REJECTED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="timePicker">
          <bc-picker :dateType="'daterange'" :dateArray="dateArrDeFault" @changeBCtime="changeBCtime"></bc-picker>
          <el-button @click="searchIt" style="width:100px;margin-left:20px;">{{ $t("billing.search") }}</el-button>
        </div>
        <div class="container_center">
          <div class="center">
            <el-table
              :data="tableData"
              highlight-current-row
              v-loading="loading"
              @current-change="handleCurrentChange"
              border
              :max-height="tableHeight"
            >
              <el-table-column prop="createdAt" :label="$t('billing.bookingTime')" />
              <el-table-column prop="orderNo" :label="$t('billing.trackingNo')" />
              <el-table-column prop="settlementAmount" :label="$t('billing.totalAmount')" />
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
              <el-tab-pane :label="$t('tracking.FeeDetails')" name="detail" class="trackingDetail">
                <div class="rightDetail" :style="`max-height:${detailHeight}px;`">
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
                </div>
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
import { demandFinance, billdemandCount } from "../../api/billing";
import { getExtraServer } from "../../api/data";
import { getTime, parseTime, getLastMonthTime, getNormalTime, getBcTime } from "../../utils/index";
import { mapGetters } from "vuex";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
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
      thisRow: null,
      curTab: "detail",
      serveObj: {},
      tableHeight: 0,
      detailHeight: 0,
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
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 42 - 20 - 32 - 20;
      this.detailHeight = window.innerHeight - 91 - 40 - 42 - 20 - 40 - 15 - 32 - 20;
    });
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
      self.page.currentPage = val;
      self.loadData();
    },
    pageSizeChange(val) {
      self.pagesize = val;
      self.loadData();
    },
    loadData() {
      self.loading = true;
      demandFinance(self.tabActive, {
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
      billdemandCount({
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
      self.thisRow = val;
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
  box-sizing: border-box;
  .timePicker {
    height: 42px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }
  .content {
    padding-left: 20px;
    display: flex;
    height: calc(100vh - 91px);
    .container {
      padding: 20px;
      width: 100%;
      height: 100%;
      overflow: scroll;
      background-color: #fff;
      .container_center {
        padding-top: 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        overflow: scroll;
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

.trackingDetail {
  .el-form-item {
    margin-bottom: 10px !important;
  }
}
</style>
