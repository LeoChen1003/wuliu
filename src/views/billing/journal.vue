<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.account') }}</div>
      <div class="timePicker">
        <el-date-picker v-model="value1"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format='yyyy-MM-dd'
                        size="small" />
      </div>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
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
          <el-table :data="[{},{},{}]"
                    border>
            <el-table-column :label="$t('billing.date')" />
            <el-table-column :label="$t('billing.transactionType')" />
            <el-table-column :label="$t('billing.documentNo')" />
            <el-table-column :label="$t('billing.increase')" />
            <el-table-column :label="$t('billing.decrease')" />
            <el-table-column :label="$t('billing.balance')" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { journalList } from '../../api/billing'
import { getTime, parseTime } from '../../utils/index'
console.log(getTime('end'))
var date = new Date().getTime();
console.log([parseTime((new Date().getTime() - 3600 * 1000 * 24 * 30), '{y}-{m}-{d}'), parseTime(new Date().getTime(), '{y}-{m}-{d}')])

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      tabActive: 'GUARANTEE',
      applyType: localStorage.getItem('curRole'),
      value1: [parseTime((new Date().getTime() - 3600 * 1000 * 24 * 30), '{y}-{m}-{d}'), parseTime(new Date().getTime(), '{y}-{m}-{d}')]
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () { },
  mounted () {
    this.getJournalList()
  },
  methods: {
    getJournalList () {
      const self = this
      journalList({
        accountType: self.tabActive,
        applyType: self.applyType,
        fromDate: self.value1[0],
        toDate: self.value1[1]
      }).then(res => {
        console.log(res)

      })
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


