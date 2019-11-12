<template>
  <div class='wrapper'>
    <div style="margin-bottom:20px;">
      <el-button @click="add"
                 :disabled="!roles.Supply"
                 type="primary">{{$t('resources.add')}}</el-button>
    </div>
    <div class="container">
      <div class="table-box">
        <el-table border
                  v-loading="loading"
                  highlight-current-row
                  @current-change="tapRow"
                  :data="data.content">
          <el-table-column header-align="center"
                           align="center"
                           :label="$t('resources.route')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.fromProvince }} --> {{ scope.row.toProvinceName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center"
                           align="center"
                           :label="$t('resources.truckType')">
            <template slot-scope="scope">
              <div>{{ truckObj[scope.row.category] }}</div>
              <div>{{ scope.row.truck.plate }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center"
                           align="center"
                           :label="$t('resources.cutOffTime')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.finishedAt }}
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center"
                           align="center"
                           :label="$t('resources.status')">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == 'ACTIVE' ? 'status' : 'info'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin:20px 0;">
          <el-pagination background
                         :page-size.sync="data.size"
                         :page-count="data.totalPages"
                         :total="data.totalElements"
                         :current-page.sync="data.number + 1"
                         @current-change="pageChange"
                         layout="total, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
      <div class="table-box">
        <el-button size="mini"
                   icon="el-icon-edit"
                   plain
                   @click="edit"
                   v-if="thisRow.id"
                   class="editBtn">{{$t('resources.edit')}}</el-button>
        <el-tabs v-model="detailTab">
          <el-tab-pane name="1"
                       :label="$t('resources.price_2')">
            <div>
              <el-table border
                        :data="priceList">
                <el-table-column header-align="center"
                                 align="center"
                                 :label="$t('resources.dst')">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.toCity }}-{{ scope.row.toProvince }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column header-align="center"
                                 align="center"
                                 prop="miles"
                                 :label="$t('resources.distance_KM')">
                </el-table-column>
                <el-table-column header-align="center"
                                 align="center"
                                 prop="transitTime"
                                 :label="$t('resources.transitTime')">
                </el-table-column>
                <el-table-column header-align="center"
                                 align="center"
                                 prop="charge"
                                 :label="$t('resources.price')">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.availableDate')"
                       name="2">
            <div>
              <div class="date-header">
                <el-select v-model="showDate.year"
                           @change="showDateChange"
                           placeholder="">
                  <el-option v-for="item in showDateInfo"
                             :key="item.year"
                             :label="item.year"
                             :value="item.year">
                  </el-option>
                </el-select>
                <el-select v-model="showDate.month"
                           @change="showDateChange"
                           placeholder="">
                  <el-option v-for="item in showDateInfo[showDate.year].months"
                             :key="item"
                             :label="item"
                             :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="date-list">
                <div class="day-item"
                     v-for="(item,index) in week"
                     :key="item">
                  <el-tag class="day nop week"
                          type="info">{{item}}</el-tag>
                </div>
                <div class="day-item"
                     v-for="(item,index) in showWeekPH"
                     :key="index + item">
                  <el-tag class="day nop day_ph"></el-tag>
                </div>
                <div class="day-item"
                     v-for="(item,index) in dateList_show"
                     :key="index">
                  <el-tag class="day nop"
                          :effect="showDateList['show_' + showDate.year + '_' + showDate.month + '_' + item] ? 'dark' : 'plain'">{{item}}</el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 编辑框 -->
    <el-dialog :visible.sync="editDialog"
               :title="$t('resources.edit')"
               :close-on-click-modal="false"
               width="1000px">
      <div class="edit-box">
        <div class="edit-top">
          <div class="edit-left">
            <el-form :label-width="$store.getters.language == 'zh_CN' ? '150px' : '220px'"
                     :show-message="false"
                     :model="form"
                     ref='form'>
              <el-form-item :label="$t('resources.plateLicense')"
                            prop="truckId"
                            required>
                <el-select v-model="form.truckId"
                           class="formSelect"
                           @change="choosePlate"
                           filterable
                           placeholder="province">
                  <el-option v-for="(item,index) in tdList"
                             :key='index'
                             :label="item.plate"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('resources.truckType')"
                            prop="category"
                            required>
                <el-select v-model="form.category"
                           disabled
                           filterable
                           class="formSelect"
                           placeholder="Truck type">
                  <el-option v-for="(item,index) in truckTypes.categories"
                             :key='index'
                             :label="item.value"
                             :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="subCategory"
                            required>
                <el-select v-model="form.subCategory"
                           disabled
                           filterable
                           class="formSelect"
                           placeholder="Truck sub type">
                  <el-option v-for="(item,index) in truckTypes.subCategories"
                             :key='index'
                             :label="item.value"
                             :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('resources.origin')"
                            prop="fromProvinceCode"
                            required>
                <el-select v-model="form.fromProvinceCode"
                           class="formSelect"
                           filterable>
                  <el-option v-for="(item,index) in provinceList"
                             :key='index'
                             :label="item.name"
                             :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('resources.destination')"
                            prop="toProvinceCodes"
                            required>
                <el-select v-model="form.toProvinceCodes"
                           filterable
                           multiple
                           @change="toProvinceCodeChange"
                           class="formSelect">
                  <el-option v-for="(item,index) in provinceList"
                             :key='index'
                             :label="item.name"
                             :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('resources.cutOffTime')"
                            prop="finishedAt">
                <el-time-select v-model="form.finishedAt"
                                style="width:100%;"
                                :picker-options="timeOptions"
                                default-value="18:00">
                </el-time-select>
              </el-form-item>
              <el-form-item :label="$t('resources.supportLoading')"
                            prop="supportLoading"
                            required>
                <el-select class="formSelect"
                           v-model="form.supportLoading">
                  <el-option :label="$t('resources.require')"
                             :value="1">
                  </el-option>
                  <el-option :label="$t('resources.notRequired')"
                             :value="0">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('resources.humanWorkDay')"
                            required
                            prop="humanWorkDay"
                            v-if="form.supportLoading">
                <el-input v-model="form.humanWorkDay"
                          @mousewheel.native.prevent
                          type="number"></el-input>
              </el-form-item>
              <el-form-item :label="$t('resources.moneyPerDay')"
                            required
                            prop="supportLoading"
                            v-if="form.supportLoading">
                <el-input v-model="form.moneyPerDay"
                          type="number"
                          @mousewheel.native.prevent>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('resources.status')"
                            prop="status"
                            required>
                <el-select class="formSelect"
                           v-model="form.status">
                  <el-option :label="$t('resources.activated')"
                             value="ACTIVE">
                  </el-option>
                  <el-option :label="$t('resources.closed')"
                             value="CLOSED">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="edit-right">
            <div>
              <div class="date-header">
                <div>{{$t('resources.availableDate')}}</div>
                <el-select v-model="date.year"
                           @change="dateChange"
                           style="width:150px;"
                           placeholder="">
                  <el-option v-for="item in dateInfo"
                             :key="item.year"
                             :label="item.year"
                             :value="item.year">
                  </el-option>
                </el-select>
                <el-select v-model="date.month"
                           @change="dateChange"
                           style="width:150px;"
                           placeholder="">
                  <el-option v-for="item in dateInfo[date.year].months"
                             :key="item"
                             :label="item"
                             :value="item">
                  </el-option>
                </el-select>
                <el-button @click="checkAll"
                           type="primary">{{ allChecked ? $t('resources.deselectAll') : $t('resources.checkAll') }}</el-button>
              </div>
              <div class="date-list"
                   v-loading="dateLoading">
                <div class="day-item"
                     v-for="(item,index) in week"
                     :key="item">
                  <el-tag class="day nop week"
                          type="info">{{item}}</el-tag>
                </div>
                <div class="day-item"
                     v-for="(item,index) in weekPH"
                     :key="index + item">
                  <el-tag class="day nop day_ph"></el-tag>
                </div>
                <div class="day-item"
                     v-for="(item,index) in dateList"
                     :key="index">
                  <el-tag class="day"
                          :effect="sendDateList['show_' + date.year + '_' + date.month + '_' + item] ? 'dark' : 'plain'"
                          @click="tapDay(item)">{{item}}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="edit-bottom">
          <el-table :data="form.cityList"
                    border
                    v-loading="cityLoading"
                    style="width: 100%">
            <el-table-column :label="$t('resources.destination_Dsitrict')">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.name }}-{{scope.row.provinceName}}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('resources.distance_KM')">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.miles"
                            @mousewheel.native.prevent
                            type="number"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('resources.transitTime')">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.transitTime"
                            @mousewheel.native.prevent
                            type="number"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('resources.price')">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.charge"
                            @mousewheel.native.prevent
                            type="number"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="confirmIt">{{$t('resources.confirm')}}</el-button>
        <el-button type="primary"
                   @click="cancel">{{$t('resources.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getProvinceList, getCityList, getTruckType, getSupplyTD, getBcYear, getBcDay } from '@/api/data'
import { getRoute, addRoute, updateRoute } from '@/api/resources'

let self;
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      data: {},
      editDialog: false,
      form: {
        category: '',
        subCategory: '',
        finishedAt: '',
        fromProvinceCode: '',
        toProvinceCodes: [],
        supportLoading: '',
        humanWorkDay: '',
        moneyPerDay: '',
        cityList: [],
        dateList: [],
        truckId: '',
        status: ''
      },
      provinceList: [],
      cityList: [],
      priceList: [],
      truckTypes: {
        categories: [],
        subCategories: []
      },
      tdList: [],
      truckObj: {},
      editType: 'add',
      timeOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:45'
      },
      detailTab: '1',
      date: {
        year: '2019',
        month: ''
      },
      showDate: {
        year: '2019',
        month: ''
      },
      dateInfo: { 2019: { year: 2019, months: [] } },
      showDateInfo: { 2019: { year: 2019, months: [] } },
      dateList: [],
      dateList_show: [],
      sendDateList: {},
      showDateList: {},
      thisRow: {},
      dateLoading: false,
      cityLoading: false,
      loading: false,
      allChecked: false,
      proObj: {},
      weekPH: [],
      showWeekPH: [],
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["roles"])
  },
  //监控data中的数据变化
  watch: {},
  methods: {
    loadData (cb) {
      self.loading = true;
      getRoute().then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
      getProvinceList().then(res => {
        self.provinceList = res.data;
        let proObj = new Object();
        for (let i of res.data) {
          proObj[i.code] = i.name;
        }
        self.proObj = proObj;
      });
      // getCityList().then(res => {
      //   self.cityList = res.data;
      // });
      getTruckType().then(res => {
        self.truckTypes = res.data;
        let truckObj = new Object();
        for (let i of res.data.categories) {
          truckObj[i.key] = i.value;
        }
        self.truckObj = truckObj;
      });
      getSupplyTD().then(res => {
        self.tdList = res.data.trucks;
      })
      // 生成可选日期
      getBcYear().then(res => {
        let year = res.data;
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let years = [year, year + 1]
        let showYears = [year - 1, year, year + 1]
        let dateInfo = {};
        let showDateInfo = {};
        // 生成编辑可选日期
        for (let x in years) {
          let months = [];
          let m = 1;
          if (x == 0) {
            m = month
          }
          for (let y = m; y <= 12; y++) {
            months.push(y)
          }
          dateInfo[years[x]] = {
            year: years[x],
            months: months,
            start: x == 0 ? day : 1
          }
        }
        // 生成展示可选日期
        for (let x in showYears) {
          let months = [];
          let m = 1;
          for (let y = m; y <= 12; y++) {
            months.push(y)
          }
          showDateInfo[showYears[x]] = {
            year: showYears[x],
            months: months,
            start: x == 0 ? day : 1
          }
        }
        self.dateInfo = dateInfo;
        self.showDateInfo = showDateInfo;
        self.date = {
          year: year,
          month: month
        }
        self.showDate = {
          year: year,
          month: month
        }
        self.getDay('edit');
        self.getDay('show');
      })
    },
    pageChange (e) {
      self.loading = true;
      getRoute({
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      })
    },
    // 添加按钮
    add () {
      self.editType = 'add';
      if (self.$refs.form) {
        self.resetForm();
      }
      self.editDialog = true;
    },
    // 编辑按钮
    edit () {
      let item = self.thisRow;
      self.editType = 'update';
      let cityList = [];
      for (let i of item.cityList) {
        cityList.push({
          "charge": i.charge,
          "toCityCode": i.toCityCode,
          "name": i.toCity,
          "miles": i.miles,
          "transitTime": i.transitTime,
          "provinceName": i.toProvince
        })
      }
      for (let i of item.dateList) {
        self.$set(self.sendDateList, ['show_' + i.bcYear + '_' + i.month + '_' + i.day], {
          "bcYear": i.bcYear,
          "month": i.month,
          "day": i.day
        })
      }
      self.form = {
        category: item.category,
        subCategory: item.subCategory,
        finishedAt: item.finishedAt,
        fromProvinceCode: item.fromProvinceCode,
        toProvinceCodes: item.toProvinceCodes,
        supportLoading: item.supportLoading,
        humanWorkDay: item.loadingOrUnloadingHumanWorkDay,
        moneyPerDay: item.moneyPerDay,
        cityList: cityList,
        dateList: [],
        truckId: item.truckId,
        status: item.status
      };
      this.$forceUpdate();
      self.editDialog = true;
      self.thisId = item.id;
    },
    // 提交修改
    confirmIt () {
      let form = JSON.parse(JSON.stringify(self.form));
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (form.supportLoading == 0) {
            form.humanWorkDay = 0;
            form.moneyPerDay = 0;
          }
          for (let x in self.sendDateList) {
            form.dateList.push(self.sendDateList[x])
          }
          let toProvinceCode = '';
          for (let i of form.toProvinceCodes) {
            toProvinceCode += i + ',';
          }
          toProvinceCode = toProvinceCode.substring(0, toProvinceCode.lastIndexOf(','));
          form['toProvinceCode'] = toProvinceCode;
          if (self.editType == 'add') {
            addRoute(form).then(res => {
              self.loadData(() => {
                self.resetForm();
              });
            })
          } else if (self.editType == 'update') {
            updateRoute(self.thisId, form).then(res => {
              self.loadData(() => {
                self.resetForm();
              });
            })
          }
        } else {
          return false;
        }
      });
    },
    cancel () {
      self.resetForm();
    },
    resetForm () {
      self.editDialog = false;
      self.form = {
        category: '',
        subCategory: '',
        finishedAt: '',
        fromProvinceCode: '',
        toProvinceCode: [],
        supportLoading: '',
        humanWorkDay: '',
        moneyPerDay: '',
        cityList: [],
        dateList: [],
        truckId: '',
        status: ''
      }
      self.sendDateList = [];
      this.$refs.form.resetFields();
    },
    tapDay (day) {
      if (self.sendDateList['show_' + self.date.year + '_' + self.date.month + '_' + day]) {
        delete self.sendDateList['show_' + self.date.year + '_' + self.date.month + '_' + day]
      } else {
        self.$set(self.sendDateList, ['show_' + self.date.year + '_' + self.date.month + '_' + day], {
          "bcYear": self.date.year,
          "month": self.date.month,
          "day": day
        })
      }
      this.$forceUpdate();
      self.checkAllCheck();
    },
    // 全选/取消全选
    checkAll () {
      if (self.allChecked) {
        for (let x in self.dateList) {
          delete self.sendDateList['show_' + self.date.year + '_' + self.date.month + '_' + self.dateList[x]]
        }
        self.allChecked = false;
      } else {
        for (let x in self.dateList) {
          self.$set(self.sendDateList, ['show_' + self.date.year + '_' + self.date.month + '_' + self.dateList[x]], {
            "bcYear": self.date.year,
            "month": self.date.month,
            "day": self.dateList[x]
          })
        }
        self.allChecked = true;
      }
      this.$forceUpdate();
    },
    dateChange (e) {
      self.getDay('edit');
    },
    showDateChange (e) {
      self.getDay('show');
    },
    // 检测是否全选
    checkAllCheck () {
      let allChecked = true;
      for (let x in self.dateList) {
        if (!self.sendDateList[x]) {
          allChecked = false;
          break;
        }
      }
      self.allChecked = allChecked;
    },
    // 获取有效天
    getDay (type) {
      if (type == 'edit') {
        self.dateLoading = true;
        getBcDay(self.date.year, self.date.month).then(res => {
          let days = res.data;
          let start = self.dateInfo[self.date.year].start;
          let dateList = {};
          let yearInd = Object.keys(self.dateInfo).indexOf(self.date.year.toString());
          let year = yearInd == 0 ? new Date().getFullYear() : new Date().getFullYear() + 1;
          let week = new Date(`${year}/${self.date.month}/1`).getDay();
          let weekPD = week == 7 ? 0 : week;
          let weekPH = [];
          for (let x = 1; x <= days; x++) {
            dateList['show_' + self.date.year + '_' + self.date.month + '_' + x] = x
          }
          self.dateList = dateList;
          self.checkAllCheck();
          for (let x = 0; x < weekPD; x++) {
            weekPH.push('');
          }
          self.weekPH = weekPH;
          self.dateLoading = false;
        })
      } else {
        getBcDay(self.showDate.year, self.showDate.month).then(res => {
          let days = res.data;
          let start = self.showDateInfo[self.showDate.year].start;
          let showDateList = {};
          let yearInd = Object.keys(self.showDateInfo).indexOf(self.showDate.year.toString());
          let year = yearInd == 0 ? new Date().getFullYear() - 1 : yearInd == 1 ? new Date().getFullYear() : new Date().getFullYear() + 1;
          let week = new Date(`${year}/${self.showDate.month}/1`).getDay();
          let weekPD = week == 7 ? 0 : week;
          let weekPH = [];
          for (let x = 1; x <= days; x++) {
            showDateList['show_' + self.showDate.year + '_' + self.showDate.month + '_' + x] = x
          }
          for (let x = 0; x < weekPD; x++) {
            weekPH.push('');
          }
          self.showWeekPH = weekPH;
          self.dateList_show = showDateList;
        })
      }
    },
    // 目的地省改变
    toProvinceCodeChange (e) {
      let params = '';
      if (e.length == 0) {
        params = 'provinceCodes=emptyCode'
      } else {
        for (let x in e) {
          params += `${x == 0 ? '' : '&'}provinceCodes=${e[x]}`
        }
      }
      self.cityLoading = true;
      getCityList(params).then(res => {
        let cityList = [];
        for (let i of res.data) {
          cityList.push({
            "charge": '',
            "toCityCode": i.code,
            "name": i.name,
            "miles": '',
            "transitTime": '',
            "provinceName": self.proObj[i.provinceCode]
          })
        }
        self.form.cityList = cityList;
        self.cityLoading = false;
      })
    },
    choosePlate (e) {
      for (let i of self.tdList) {
        if (i.id == e) {
          self.form.category = i.category;
          self.form.subCategory = i.subCategory;
        }
      }
    },
    tapRow (row) {
      if (row == null) {
        self.priceList = [];
        self.showDateList = {};
        self.thisRow = {};
        return
      }
      let dateList = {};
      self.priceList = row.cityList;
      for (let i of row.dateList) {
        dateList['show_' + i.bcYear + '_' + i.month + '_' + i.day] = {
          "bcYear": i.bcYear,
          "month": i.month,
          "day": i.day
        }
      }
      self.showDateList = dateList;
      self.thisRow = row;
      this.$forceUpdate();
    }
  },
  created () {
    self = this;
  },
  mounted () {
    self.loadData();
  }
};
</script>
<style lang='scss' scoped>
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
</style>