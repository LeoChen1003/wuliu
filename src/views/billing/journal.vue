<template>
  <div class="manage billing">
    <div class="content">
      <div>
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="handleClick" style="height:100%;">
          <el-tab-pane name="FEE" :label="$t('billing.freight')"> </el-tab-pane>
          <el-tab-pane name="GUARANTEE" :label="$t('billing.gaurantee')"> </el-tab-pane>
        </el-tabs>
      </div>

      <div class="container">
        <div class="timePicker">
          <bc-picker :dateType="'daterange'" :dateArray="dateArrDeFault" @changeBCtime="changeBCtime"></bc-picker>
          <el-button @click="searchIt" style="width:100px;margin-left:20px;">{{ $t("billing.search") }}</el-button>
        </div>
        <div class="center">
          <el-table :data="dataList" border>
            <el-table-column prop="createdAt" :label="$t('billing.date')" />
            <el-table-column prop="eventType" :label="$t('billing.transactionType')" />
            <el-table-column :label="$t('billing.documentNo')">
              <template slot-scope="scope">
                <div v-if="scope.row.eventType == 'TOP_UP' || scope.row.eventType == 'REFUND'">
                  {{ scope.row.tradeNo }}
                </div>
                <div v-if="scope.row.eventType == 'ORDER'">
                  {{ scope.row.orderNo }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.increase')">
              <template slot-scope="scope">
                {{ scope.row.amountAfter - scope.row.amountBefore > 0 ? scope.row.amount : 0 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.decrease')">
              <template slot-scope="scope">
                {{ scope.row.amountAfter - scope.row.amountBefore > 0 ? 0 : scope.row.amount }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.balance')">
              <template slot-scope="scope">
                {{ scope.row.amountAfter }}
              </template>
            </el-table-column>
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
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { journalList } from "../../api/billing";
import { getTime, parseTime, getLastMonthTime, getBcTime, getNormalTime } from "../../utils/index";

let self;
export default {
  data() {
    return {
      tabActive: "FEE",
      applyType: localStorage.getItem("curRole"),
      fromDate: getBcTime(getLastMonthTime(new Date())),
      toDate: getBcTime(parseTime(new Date().getTime(), "{y}-{m}-{d}")),
      dataList: [],
      page: {
        total: 0,
        currentPage: 1,
      },
      pagesize: 20,
      dateArrDeFault: [],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
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
    self.getJournalList();
  },
  methods: {
    getJournalList() {
      journalList({
        accountType: self.tabActive,
        applyType: self.applyType,
        fromDate: self.fromDate,
        toDate: self.toDate,
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
    handleClick() {
      self.getJournalList();
    },
    searchIt() {
      self.getJournalList();
    },
    pageChange(val) {
      self.page.currentPage = val;
      self.getJournalList();
    },
    pageSizeChange(val) {
      self.pagesize = val;
      self.getJournalList();
    },
    changeBCtime(time) {
      self.fromDate = time[0];
      self.toDate = time[1];
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
    align-items: center;
  }
  .content {
    padding-left: 20px;
    display: flex;
    height: calc(100vh - 91px);
    // margin-top: 5px;
    overflow: scroll;
    .container {
      padding-left: 20px;
      padding-top: 20px;
      width: 100%;
      height: 100%;
      overflow: scroll;
      background-color: #fff;
      .center {
        width: 90%;
        margin-right: 1%;
        margin-top: 20px;
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
</style>

<style lang="scss">
.billing {
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
