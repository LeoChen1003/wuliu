<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="timePicker">
        <bc-picker :dateType="'daterange'" :dateArray="dateArrDeFault" @changeBCtime="changeBCtime"></bc-picker>
        <el-button size="small" @click="searchIt" style="width:100px;margin-left:20px;">{{ $t("billing.search") }}</el-button>
      </div>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="handleClick" style="height:calc(100% - 50px);">
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
          <el-table :data="detailData" border>
            <el-table-column :label="$t('billing.supply')">
              <template slot-scope="scope">
                {{
                  scope.row.supply
                    ? scope.row.supply.type == "COMPANY"
                      ? scope.row.supply.companyName
                      : scope.row.supply.humanName
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.amount')">
              <template slot-scope="scope"> {{ $t("billing.freight") }}: {{ scope.row.settlementAmount }} </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { demandFinance, billdemandCount } from "../../api/billing";
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
      self.detailData = [];
      self.detailData.push(val);
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
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
    display: flex;
    align-items: center;
  }
  .content {
    padding-left: 25px;
    display: flex;
    height: calc(100% - 50px);
    .container {
      padding-left: 20px;
      padding-top: 20px;
      width: 100%;
      display: flex;
      overflow: scroll;
      .center {
        width: 49%;
        margin-right: 1%;
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

  .badge {
    font-size: 12px;
    margin-left: 5px;
    color: #aaa;
  }

  .red {
    color: red;
  }
}
</style>
<style>
.billing .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0px;
  width: 211px;
}
.billing .el-tabs--left .el-tabs__active-bar.is-left {
  width: 3px;
}
.billing .el-tabs--left .el-tabs__nav-wrap.is-left::after,
.el-tabs--left .el-tabs__nav-wrap.is-right::after,
.el-tabs--right .el-tabs__nav-wrap.is-left::after,
.el-tabs--right .el-tabs__nav-wrap.is-right::after {
  width: 3px;
}
</style>
