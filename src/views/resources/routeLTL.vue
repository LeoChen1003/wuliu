<template>
  <div class="wrapper">
    <div style="margin-bottom:20px;">
      <el-button @click="add" type="primary">{{ $t("resources.add") }}</el-button>
    </div>
    <div class="container">
      <div class="table-box">
        <el-table border v-loading="loading" highlight-current-row @current-change="tapRow" :data="data.content">
          <el-table-column header-align="center" align="center" :label="$t('resources.route')">
            <template slot-scope="scope">
              <div>{{ scope.row.fromProvince }} --> {{ scope.row.toProvinceName }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="$t('resources.origin')">
            <template slot-scope="scope">
              <div>{{ truckObj[scope.row.category] }}</div>
              <div>{{ scope.row.truck.plate }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="$t('resources.status')">
            <template slot-scope="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="primary" style="margin-bottom:5px;width:100%;" @click="edit(scope.row)">
                  {{ $t("resources.edit") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin:20px 0;">
          <el-pagination
            background
            :page-size.sync="data.size"
            :page-count="data.totalElements"
            :total="data.totalElements"
            :current-page.sync="data.number + 1"
            @current-change="pageChange"
            layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
      <div class="table-box">
        <el-tabs v-model="detailTab"> </el-tabs>
      </div>
    </div>
    <el-dialog :title="$t('route.routeLTL')" :visible.sync="editDialog" center width="1000px">
      <div class="form-box">
        <el-form label-width="120px">
          <el-form-item required :label="$t('resources.origin')">
            <el-select v-model="model" placeholder="placeholder">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('resources.cutOffTime')">
            <el-select v-model="model" placeholder="placeholder">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form label-width="120px">
          <el-form-item required :label="$t('resources.route')">
            <el-select v-model="model" placeholder="placeholder">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('resources.status')">
            <el-select v-model="model" placeholder="placeholder">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-tab-box">
        <el-tabs v-model="editTab">
          <el-tab-pane :label="$t('resources.map')" name="map">
            地图
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.deliverableDistrict')" name="deli">
            配置管理
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.quotation')" name="quot">
            报价
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.priceCoefficient')" name="pic">
            价格系数
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.availableDate')" name="ava">
            有效日期
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getRoute } from "@api/resources";

let self;

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      loading: false,
      data: [],
      detailTab: 0,
      editDialog: false,
      optionsList: [1, 2, 3],
      model: 1,
      editTab: "map",
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    add() {
      self.editDialog = true;
    },
    tapRow(row) {
      if (row === null) {
        self.priceList = [];
        self.showDateList = {};
        self.thisRow = {};
        return;
      }
      let dateList = {};
      self.priceList = row.citys;
      for (let i of row.dateList) {
        dateList["show_" + i.bcYear + "_" + i.month + "_" + i.day] = {
          bcYear: i.bcYear,
          month: i.month,
          day: i.day,
        };
      }
      self.showDateList = dateList;
      self.thisRow = row;
      this.$forceUpdate();
    },
    pageChange(e) {
      self.loading = true;
      getRoute({
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      });
    },
  },
  created() {
    self = this;
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类

//@import url(); 引入公共css类
.wrapper {
  box-sizing: border-box;
  padding: 20px;
}

.container {
  display: flex;
  justify-content: space-between;
}

.table-box {
  width: 49%;
  position: relative;

  .editBtn {
    position: absolute;
    left: 150px;
    z-index: 50;
    top: 6px;
  }
}

.formSelect {
  width: 100%;
}

.date-header {
  display: flex;
  align-items: center;

  div {
    margin-right: 10px;
  }
}

.date-list {
  display: flex;
  flex-wrap: wrap;
}

.day-item {
  width: 12%;
  margin: 2% 2% 0 0;
  user-select: none;

  .day {
    width: 100%;
    height: 50px;
    font-size: 24px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    transition: all 0.1s;
    border-width: 2px;
  }

  .nop {
    cursor: auto;
  }

  .day_ph {
    opacity: 0;
  }

  .week {
    font-size: 20px;
  }
}

.edit-box {
  .edit-top {
    display: flex;
    justify-content: space-between;
  }

  .edit-right {
    width: 550px;
  }
}

.form-box {
  display: flex;
  justify-content: space-around;
}

.add-citylist {
  width: 100%;
  height: 50px;
  border: 1px solid rgb(235, 238, 245);
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.tab-wrapper::-webkit-scrollbar {
  display: none;
}

.tab-wrapper {
  height: 550px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 25px;
}
</style>
