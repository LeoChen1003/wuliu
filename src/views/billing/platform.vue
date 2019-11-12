<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.billingStatus') }}</div>
      <!-- <div class="timePicker">
        <el-date-picker v-model="value1"
                        type="daterange"
                        :range-separator="$t('placeholder.to')"
                        :start-placeholder="$t('placeholder.startDate')"
                        :end-placeholder="$t('placeholder.endDate')"
                        size="small" />
      </div> -->
      <el-input type="number"
                v-model="amount"
                style="margin-left:20px;width:200px;"
                size="small"
                :placeholder="$t('placeholder.amount')"></el-input>
      <el-button size="small"
                 style='margin-left:10px;'
                 icon="el-icon-search"
                 @click="searchIt"
                 type="primary">{{ $t('billing.search') }}</el-button>
      <el-button size="small"
                 @click="cancelIt"
                 style='margin-left:10px;'>{{ $t('billing.cancel') }}</el-button>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 @tab-click="handleClick"
                 style="height:100%;">
          <el-tab-pane name="DEFAULT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.toBeConfirmed')}}<sub class="badge red">{{statusCount.DEFAULT}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.confirmed')}}<sub class="badge">{{statusCount.ACCEPT}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="REJECTED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.rejected')}}<sub class="badge">{{statusCount.REJECTED}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="center">
          <el-table :data="dataList"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    border>
            <el-table-column prop="operateAt"
                             width="100"
                             :label="$t('billing.date')">
              <template slot-scope="scope">
                {{scope.row.operateAt.slice(0,10) + ' ' +scope.row.operateAt.slice(11,19)}}
              </template>
            </el-table-column>
            <el-table-column prop="financeAccountType"
                             :label="$t('billing.type')"></el-table-column>
            <el-table-column prop="amount"
                             :label="$t('billing.amount')">
              <template slot-scope="scope">
                {{scope.row.amount}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.operation')"
                             v-if="tabActive == 'DEFAULT'">
              <template slot-scope="scope">
                <div style="display: flex;align-items: center;justify-content: center;">
                  <el-button type="primary"
                             @click="toConfirm(scope.row.id)">{{$t('billing.confirm')}}</el-button>
                  <el-button type="info"
                             @click="refuseVisible = true;curId = scope.row.id;reason='';">{{$t('billing.reject')}}</el-button>
                </div>
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
        <el-card class="right"
                 shadow="never">
          <el-image :src='showUrl'
                    v-if="showUrl">
            <!-- <div slot="error"
                 class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div> -->
          </el-image>
        </el-card>
      </div>
    </div>
    <el-dialog :title="$t('member.reasonsForRefusal')"
               :visible.sync="refuseVisible"
               width="40%">
      <div style="display:flex;justify-content:center;align-items:center;">
        {{$t('member.reason')}}：
        <el-input v-model="reason"
                  class="inp"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="refuseVisible = false">{{ $t('member.cancel') }}</el-button>
        <el-button type="info"
                   :loading="refuseLoading"
                   @click="rejectIt">{{ $t('member.reject') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { billingList, billingAccept, billingReject, billplatformCount } from "../../api/billing"
import { getToken } from '@/utils/auth'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    const self = this;
    return {
      tabActive: 'DEFAULT',
      loading: false,
      refuseVisible: false,
      refuseLoading: false,
      curId: null,
      reason: '',
      value1: '',
      dataList: [],
      showUrl: '',
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      amount: null,
      statusCount: {}
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () { },
  mounted () {
    this.getList()
    this.getCount()
  },
  methods: {
    getList () {
      let self = this
      billingList({ audit_status: self.tabActive, amount: self.amount ? self.amount : 0 }, {
        page: self.page.currentPage - 1,
        pagesize: self.pagesize,
      }).then(res => {
        self.dataList = res.data.content
        self.page = {
          total: res.data.totalElements,
          currentPage: res.data.number + 1
        }
      })
    },
    getCount () {
      const self = this
      billplatformCount(self.apply_type).then(res => {
        self.statusCount = res.data
      })
    },
    searchIt () {
      const self = this
      self.getList()
    },
    cancelIt () {
      const self = this
      self.amount = null
      self.getList()
    },
    pageChange (val) {
      const self = this
      self.page.currentPage = val
      self.getList()
    },
    pageSizeChange (val) {
      const self = this;
      self.pagesize = val
      self.getList()
    },
    handleClick () {
      this.getList()
    },
    handleCurrentChange (val) {
      const self = this
      self.showUrl = val.resource.path
    },
    // 确认
    toConfirm (id) {
      const self = this
      self
        .$confirm(this.$t('confirm.aysConfirm'), this.$t('confirm.tips'), {
          confirmButtonText: this.$t('billing.confirm'),
          cancelButtonText: this.$t('member.cancel')
        })
        .then(() => {
          billingAccept({
            id: id,
          }).then(res => {
            self.$message.success(res.message)
            self.dialogVisible = false
            self.getList()
          })
        })
        .catch(() => { });
    },
    // 拒绝
    rejectIt () {
      const self = this
      self.refuseLoading = true
      billingReject({
        id: self.curId,
        note: self.reason
      }).then(res => {
        self.$message.success(res.message)
        self.refuseVisible = false
        self.refuseLoading = false
        self.dialogVisible = false
        self.getList()
      }).catch(el => {
        self.refuseLoading = false
      })
    },
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
  }
  .content {
    padding-left: 25px;
    display: flex;
    height: calc(100% - 50px);
    .container {
      display: flex;
      padding-left: 20px;
      padding-top: 20px;
      width: 100%;
      overflow: scroll;
      .center {
        width: 49%;
        margin-right: 1%;
      }
      .right {
        width: 49%;
        padding: 0 10px;
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
.inp {
  width: 400px;
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
