<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.account') }}</div>
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
                 style="height:100%;">
          <el-tab-pane name="GUARANTEE"
                       :label="$t('billing.gaurantee')">

          </el-tab-pane>
          <el-tab-pane name="FEE"
                       :label="$t('billing.freight')">
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="container">
        <div class="center">
          <el-table :data="dataList"
                    border>
            <el-table-column prop="createdAt"
                             :label="$t('billing.date')" />
            <el-table-column prop="eventType"
                             :label="$t('billing.transactionType')" />
            <el-table-column :label="$t('billing.documentNo')" />
            <el-table-column :label="$t('billing.increase')">
              <template slot-scope="scope">
                {{(scope.row.amountAfter-scope.row.amountBefore)>0?(scope.row.amountAfter-scope.row.amountBefore):null}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.decrease')">
              <template slot-scope="scope">
                {{(scope.row.amountAfter-scope.row.amountBefore)>0?null:(scope.row.amountBefore-scope.row.amountAfter)}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.balance')">
              <template slot-scope="scope">
                {{scope.row.amount}}
              </template>
            </el-table-column>
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
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { journalList } from '../../api/billing'
import { getTime, parseTime, getLastMonthTime } from '../../utils/index'
import bcTime from "@/components/bcTime";
let self
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    bcTime
  },
  data () {
    return {
      tabActive: 'GUARANTEE',
      applyType: localStorage.getItem('curRole'),
      // value1: [parseTime((new Date().getTime() - 3600 * 1000 * 24 * 30), '{y}-{m}-{d}'), parseTime(new Date().getTime(), '{y}-{m}-{d}')],
      fromDate: getLastMonthTime(new Date()),
      toDate: parseTime(new Date().getTime(), '{y}-{m}-{d}'),
      dataList: [],
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
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
  mounted () {
    this.getJournalList()
  },
  methods: {
    getJournalList () {
      const self = this
      journalList({
        accountType: self.tabActive,
        applyType: self.applyType,
        fromDate: self.fromDate,
        toDate: self.toDate,
        page: self.page.currentPage - 1,
        pagesize: self.pagesize
      }).then(res => {
        self.dataList = res.data.content
        self.page = {
          total: res.data.totalPages,
          currentPage: res.data.number + 1
        }
      })
    },
    handleClick () {
      this.getJournalList()
    },
    searchIt () {
      this.getJournalList()
    },
    pageChange (val) {
      let self = this
      self.page.currentPage = val
      self.getJournalList()
    },
    pageSizeChange (val) {
      let self = this;
      self.pagesize = val
      self.getJournalList()
    },
    changeBCtimeFrom (time) {
      const self = this
      self.fromDate = time
      console.log(time)
    },
    changeBCtimeTo (time) {
      const self = this
      self.toDate = time
      console.log(time)
    }
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  box-sizing: border-box;
  height: 100%;
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
      overflow: scroll;
      .center {
        width: 90%;
        margin-right: 1%;
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


