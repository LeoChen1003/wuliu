<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.billingStatus') }}</div>
      <div class="timePicker">
        <bcTime @changeBCtime="changeBCtimeFrom"
                :timeType="'all'"
                :dateDefault='fromDateDeFault'></bcTime>
        <span style="margin:0 5px;">至</span>
        <bcTime @changeBCtime="changeBCtimeTo"
                :dateDefault='toDateDeFault'
                style="margin-left:5px;"
                :timeType="'all'"></bcTime>
        <el-button size="small"
                   @click="searchIt"
                   style='width:100px;margin-left:20px;'>{{ $t('billing.search') }}</el-button>
      </div>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 @tab-click="handleClick"
                 style="height:calc(100% - 50px);">
          <el-tab-pane name="WAIT_SETTLE"
                       :label="$t('billing.unpaid')">
          </el-tab-pane>
          <el-tab-pane name="SETTLED"
                       :label="$t('billing.paid')">
          </el-tab-pane>
          <el-tab-pane name="CANCELED"
                       :label="$t('billing.cancelled')">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="center">
          <el-table :data="tableData"
                    highlight-current-row
                    v-loading="loading"
                    @current-change="handleCurrentChange"
                    border>
            <el-table-column prop="createdAt"
                             :label="$t('billing.bookingTime')" />
            <el-table-column prop="orderNo"
                             :label="$t('billing.trackingNo')" />
            <el-table-column prop="settlementAmount"
                             :label="$t('billing.totalAmount')" />
          </el-table>
          <el-pagination style="margin-top:10px;text-align: center;margin-bottom:50px;"
                         background
                         :page-sizes="[1,5,10,20,50]"
                         :page-size="pagesize"
                         @size-change="pageSizeChange"
                         :current-page.sync="page.currentPage"
                         @current-change="pageChange"
                         layout="prev, pager, next, jumper"
                         :total="page.total"></el-pagination>
        </div>
        <div class="right">
          <el-table :data="detailData"
                    border>
            <el-table-column :label="$t('billing.supply')">
              <template slot-scope="scope">
                {{scope.row.transport.supply?scope.row.transport.supply.companyName:''}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.amount')">
              <template slot-scope="scope">
                {{$t('billing.freight')}}: {{scope.row.settlementAmount}}
              </template>
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
import { supplyFinance } from '../../api/billing'
import { getTime, parseTime, getLastMonthTime } from '../../utils/index'
import bcTime from "@/components/bcTime";

let self
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { bcTime },
  data () {
    return {
      tabActive: 'WAIT_SETTLE',
      fromDate: getLastMonthTime(new Date()),
      toDate: parseTime(new Date().getTime(), '{y}-{m}-{d}'),
      tableData: [],
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      loading: false,
      detailData: []
    };
  },
  // 监听属性 类似于data概念
  computed: {
    fromDateDeFault () {
      console.log(self.fromDate.split('-'))
      return self.fromDate.split('-')
    },
    toDateDeFault () {
      console.log(self.toDate.split('-'))
      return self.toDate.split('-')
    },
  },
  // 监控data中的数据变化
  watch: {},
  created () {
    self = this
  },
  mounted () { self.loadData() },
  methods: {
    changeBCtimeFrom (time) {
      self.fromDate = time
      console.log(time)
    },
    changeBCtimeTo (time) {
      self.toDate = time
      console.log(time)
    },
    pageChange (val) {
      let self = this
      self.page.currentPage = val
      self.loadData()
    },
    pageSizeChange (val) {
      let self = this;
      self.pagesize = val
      self.loadData()
    },
    loadData () {
      self.loading = true
      supplyFinance(self.tabActive, {
        start: self.fromDate + ' 00:00:00',
        end: self.toDate + ' 23:59:59',
        page: self.page.currentPage - 1,
        pagesize: self.pagesize
      }).then(res => {
        self.tableData = res.data.content
        self.page = {
          total: res.data.totalPages,
          currentPage: res.data.number + 1
        }
        self.loading = false
      }).catch(() => {
        self.loading = false
      })
    },
    searchIt () {
      self.loadData()
    },
    handleClick () {
      self.loadData()
    },
    handleCurrentChange (val) {
      const self = this
      console.log(val)
      self.detailData = []
      self.detailData.push(val)
    }
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
  box-sizing: border-box;
  .statusHeader {
    display: flex;
    padding: 0px 20px;
    box-sizing: border-box;
    height: 50px;
    border-bottom: 2px solid #dfe4ed;
    align-items: center;
    .status-txt {
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      font-size: 20px;
      width: 216px;
      box-sizing: border-box;
      border-right: 2px solid #dfe4ed;
    }
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


