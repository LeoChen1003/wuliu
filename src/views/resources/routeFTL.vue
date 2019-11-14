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
          <!-- <el-table-column header-align="center"
                           align="center"
                           :label="$t('resources.cutOffTime')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.finishedAt }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column header-align="center"
                           align="center"
                           :label="$t('resources.status')">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == 'ACTIVE' ? 'status' : 'info'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column header-align="center"
                           align="center">
            <template slot-scope="scope">
              <div>
                <el-button size="small"
                           icon="el-icon-edit"
                           type="primary"
                           @click="edit(scope.row)">
                  {{$t('resources.edit')}}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin:20px 0;">
          <el-pagination background
                         :page-size.sync="data.size"
                         :page-count="data.totalElements"
                         :total="data.totalElements"
                         :current-page.sync="data.number + 1"
                         @current-change="pageChange"
                         layout="total, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
      <div class="table-box">
        <el-tabs v-model="detailTab">
          <el-tab-pane name="0"
                       :label="$t('resources.detailInformation')">
            <div style="background:#fff;box-sizing:border-box;padding:20px;">
              <el-form :label-width="$store.getters.language == 'zh_CN' ? '150px' : '220px'"
                       :show-message="false"
                       v-if="thisRow.citys">
                <el-form-item :label="$t('resources.plateLicense')">
                  {{ thisRow.truck.plate }}
                </el-form-item>
                <el-form-item :label="$t('resources.truckType')">
                  {{ truckObj[thisRow.truck.category] }} - {{ subObj[thisRow.truck.subCategory]}}
                </el-form-item>
                <el-form-item :label="$t('resources.origin')">
                  {{ thisRow.fromProvince }}
                </el-form-item>
                <el-form-item :label="$t('resources.destination')">
                  {{ thisRow.toProvinceName }}
                </el-form-item>
                <el-form-item :label="$t('resources.quoteMode')">
                  {{ thisRow.ftlType == 0 ? $t('resources.ftlType1') : $t('resources.ftlType2') }}
                </el-form-item>
                <el-form-item :label="$t('resources.cutOffTime')">
                  {{ thisRow.finishedAt }}
                </el-form-item>
                <el-form-item :label="$t('resources.supportLoading')">
                  {{ thisRow.supportLoading == 0 ? $t('resources.notRequired') : $t('resources.require') }}
                </el-form-item>
                <el-form-item :label="$t('resources.humanWorkDay')"
                              v-if="thisRow.supportLoading">
                  {{ thisRow.loadingOrUnloadingHumanWorkDay }}
                </el-form-item>
                <el-form-item :label="$t('resources.moneyPerDay')"
                              v-if="thisRow.supportLoading">
                  {{ thisRow.moneyPerDay }}
                </el-form-item>
                <el-form-item :label="$t('resources.status')">
                  <el-tag v-if="thisRow.status == 'ACTIVE'"
                          type="primary">{{$t('resources.activated')}}</el-tag>
                  <el-tag v-if="thisRow.status == 'CLOSED'"
                          type="info">{{$t('resources.closed')}}</el-tag>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          </el-tab-pane>
          <el-tab-pane name="1"
                       :label="$t('resources.price_2')">
            <div>
              <el-table border
                        :data="priceList">
                <el-table-column header-align="center"
                                 align="center"
                                 :label="$t('resources.origin')">
                  <template slot-scope="scope">
                    <div>
                      {{ cityObj[scope.row.fromCityCode] }}-{{ thisRow.fromProvince }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column header-align="center"
                                 align="center"
                                 :label="$t('resources.dst')">
                  <template slot-scope="scope">
                    <div>
                      <div v-for="(item,index) in scope.row.toCitys">
                        {{ cityObj[item.cityCode] }}-{{ proObj[item.provinceCode] }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column header-align="center"
                                 align="center"
                                 :label="$t('resources.distance_KM')">
                  <template slot-scope="scope">
                    <div>
                      {{scope.row.minMiles == scope.row.maxMiles ? scope.row.minMiles : scope.row.minMiles + '~' + scope.row.maxMiles}}
                    </div>
                  </template>
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
               width="1200px">
      <el-tabs v-model="editActive"
               v-loading="editLoading">
        <el-tab-pane :label="$t('resources.basicData')"
                     name="form">
          <div class="tab-wrapper">
            <div class="form-box">
              <el-form :label-width="$store.getters.language == 'zh_CN' ? '150px' : '220px'"
                       :show-message="false"
                       size="small"
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
                             @change="fromProvinceCodeChange"
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
                <el-form-item :label="$t('resources.quoteMode')"
                              prop="ftlType"
                              required>
                  <el-select v-model="form.ftlType"
                             class="formSelect">
                    <el-option :label="$t('resources.ftlType1')"
                               :value="0"></el-option>
                    <el-option :label="$t('resources.ftlType2')"
                               disabled
                               :value="1"></el-option>
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
                              prop="moneyPerDay"
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
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('resrouces.quotation')"
                     name="quotation">
          <div class="tab-wrapper">
            <el-table :data="form.cityList"
                      border
                      v-loading="cityLoading"
                      style="width: 100%">
              <el-table-column width="200"
                               :label="$t('resources.origin')">
                <template slot-scope="scope">
                  <div>
                    <el-select v-model="scope.row.fromCityCode"
                               :disabled="form.category == '' || form.fromProvinceCode == ''"
                               @change="formCityChange(scope.row)">
                      <el-option v-for="item in waitFrom_cityList"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="400"
                               :label="$t('resources.destination_Dsitrict')">
                <template slot-scope="scope">
                  <div>
                    <el-select v-model="scope.row.toCityCodes"
                               :disabled="form.category == '' || form.toProvinceCodes.length == 0"
                               class="formSelect"
                               filterable
                               remote
                               :remote-method="search"
                               @change="formCityChange(scope.row)"
                               @visible-change="(status)=>{canChoose(status,scope.$index)}"
                               multiple>
                      <el-option-group v-for="(group,index) in waitTo_cityList"
                                       :key="group.provinceCode + index"
                                       :label="proObj[group.provinceCode]">
                        <el-option v-for="(item,index) in group.children"
                                   :disabled="item.disable"
                                   :key="item.code"
                                   :label="item.name + '-' + proObj[item.provinceCode]"
                                   :value="item.code">
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('resources.distance_KM')">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.minMiles == scope.row.maxMiles ? scope.row.minMiles : scope.row.minMiles + '~' + scope.row.maxMiles}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('resources.transitTime')">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.transitTime}}
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
              <el-table-column width="80">
                <template slot-scope="scope">
                  <div style="text-align:center;">
                    <el-button type="danger"
                               @click="delRow(scope.$index)"
                               v-if="form.cityList.length > 1"
                               icon="el-icon-delete"
                               circle></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-citylist">
              <el-button type="primary"
                         @click="addRow"
                         icon="el-icon-plus"
                         circle></el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('resources.availableDate')"
                     name="available">
          <div class="tab-wrapper">
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
        </el-tab-pane>
      </el-tabs>
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
import { getProvinceList, getCityList, getCityListGroup, getTruckType, getSupplyTD, getBcYear, getBcDay } from '@/api/data'
import { getRoute, addRoute, updateRoute, getCityDT } from '@/api/resources'

let self;
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      data: [],
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
      detailTab: '0',
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
      editLoading: false,
      loading: false,
      allChecked: false,
      proObj: {},
      cityObj: {},
      subObj: {},
      weekPH: [],
      showWeekPH: [],
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      editActive: 'form',
      waitFrom_cityList: [],
      waitTo_cityList: [],
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
      getCityList().then(res => {
        let cityObj = new Object();
        for (let i of res.data) {
          cityObj[i.code] = i.name;
        }
        self.cityObj = cityObj;
      });
      getTruckType().then(res => {
        self.truckTypes = res.data;
        let truckObj = new Object();
        let subObj = new Object();
        for (let i of res.data.categories) {
          truckObj[i.key] = i.value;
        }
        for (let i of res.data.subCategories) {
          subObj[i.key] = i.value;
        }
        self.truckObj = truckObj;
        self.subObj = subObj;
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
      self.editActive = 'form';
      self.form.cityList = [{
        "fromCityCode": '',
        "toCityCodes": [],
        "charge": '',
        "transitTime": '',
      }]
      self.editDialog = true;
    },
    // 编辑按钮
    edit (row) {
      let item = row;
      let cityList = row.citys;
      self.editType = 'update';
      self.editActive = 'form';
      // for (let i of cityList) {
      //   i.toCityCode = JSON.parse(JSON.stringify(i.toCityCodes));
      // }
      for (let i of item.dateList) {
        self.$set(self.sendDateList, ['show_' + i.bcYear + '_' + i.month + '_' + i.day], {
          "bcYear": i.bcYear,
          "month": i.month,
          "day": i.day
        })
      }
      // 赋值
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
        status: item.status,
        ftlType: item.ftlType
      };
      // 读取waitFrom和waitTo
      getCityListGroup(item.toProvinceCodes)
        .then(res => {
          self.waitTo_cityList = res.data;
        })
      getCityList(`provinceCodes=${item.fromProvinceCode}`).then(res => {
        self.waitFrom_cityList = res.data;
      })
      // 强制渲染
      this.$forceUpdate();
      self.editDialog = true;
      self.thisId = item.id;
    },
    // 提交修改
    confirmIt () {
      let form = JSON.parse(JSON.stringify(self.form));
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 验证cityList是否有空值
          for (let i of form.cityList) {
            if (i.fromCityCode == '' || i.toCityCodes.length == 0 || i.charge == '') {
              self.editActive = 'quotation'
              return self.$message.warning(self.$t('resources.quotationIsRequired'))
            }
          }
          self.editLoading = true;
          if (form.supportLoading == 0) {
            form.humanWorkDay = 0;
            form.moneyPerDay = 0;
          }
          for (let x in self.sendDateList) {
            form.dateList.push(self.sendDateList[x])
          }
          // let toProvinceCode = '';
          // for (let i of form.toProvinceCodes) {
          //   toProvinceCode += i + ',';
          // }
          // toProvinceCode = toProvinceCode.substring(0, toProvinceCode.lastIndexOf(','));
          form['toProvinceCode'] = form.toProvinceCodes.toString();
          form['citys'] = [];
          for (let x in form.cityList) {
            form.citys.push({
              fromCity: {
                name: self.cityObj[form.cityList[x].fromCityCode],
                code: form.cityList[x].fromCityCode
              },
              toCitys: [],
              maxMiles: form.cityList[x].maxMiles,
              minMiles: form.cityList[x].minMiles,
              transitTime: form.cityList[x].transitTime,
              price: parseInt(form.cityList[x].charge),
            })
            for (let t of form.cityList[x].toCityCodes) {
              form.citys[x].toCitys.push({
                name: self.cityObj[t],
                code: t
              })
            }
          }
          delete form.cityList;
          if (self.editType == 'add') {
            addRoute(form).then(res => {
              self.loadData(() => {
                self.resetForm();
                self.editLoading = false;
              });
            }).catch(() => {
              self.editLoading = false;
            })
          } else if (self.editType == 'update') {
            updateRoute(self.thisId, form).then(res => {
              self.loadData(() => {
                self.resetForm();
                self.editLoading = false;
              });
            }).catch(() => {
              self.editLoading = false;
            })
          }
        } else {
          self.editActive = 'form';
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
    // 起始地省改变
    fromProvinceCodeChange (e) {
      let params = `provinceCodes=${e}`;
      getCityList(params).then(res => {
        self.waitFrom_cityList = res.data;
        self.form.cityList = [{
          "fromCityCode": '',
          "toCityCodes": [],
          "charge": '',
          "transitTime": '',
        }]
      })
    },
    // 目的地省改变
    toProvinceCodeChange (e) {
      // let params = '';
      // if (e.length == 0) {
      //   params = 'provinceCodes=emptyCode'
      // } else {
      //   for (let x in e) {
      //     params += `${x == 0 ? '' : '&'}provinceCodes=${e[x]}`
      //   }
      // }
      getCityListGroup(e).then(res => {
        self.waitTo_cityList = res.data;
        // self.form.cityList = [{
        //   "fromCityCode": '',
        //   "toCityCodes": [],
        //   "charge": '',
        //   "transitTime": '',
        // }]

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
      console.log(row)
      if (row == null) {
        self.priceList = [];
        self.showDateList = {};
        self.thisRow = {};
        return
      }
      let dateList = {};
      self.priceList = row.citys;
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
    },
    formCityChange (row) {
      if (row.fromCityCode != '' && row.toCityCodes.length != 0 && self.form.category != '') {
        getCityDT(row.fromCityCode, row.toCityCodes.toString(), self.form.category)
          .then(res => {
            row.minMiles = res.data.minMiles;
            row.maxMiles = res.data.maxMiles;
            row.transitTime = res.data.transitTime;
            this.$forceUpdate();
          })
      }
    },
    addRow () {
      self.form.cityList.push({
        "fromCityCode": '',
        "toCityCodes": [],
        "charge": '',
        "transitTime": '',
      })
      let e = document.getElementsByClassName('tab-wrapper')
      e[1].scrollTop = e[1].scrollHeight;
    },
    delRow (index) {
      self.form.cityList.splice(index, 1);
    },
    // 可选项筛选
    canChoose (status, index) {
      let cityList = JSON.parse(JSON.stringify(self.form.cityList));
      let row = cityList[index];
      let waitTo_cityList = JSON.parse(JSON.stringify(self.waitTo_cityList));
      let choosed = [];
      if (status) {
        for (let x in cityList) {
          if (cityList[x].fromCityCode == row.fromCityCode) {
            if (x == index) {
              break;
            }
            choosed = choosed.concat(cityList[x].toCityCodes);
          }
        }
        for (let x in waitTo_cityList) {
          for (let i of waitTo_cityList[x].children) {
            for (let yi of choosed) {
              if (i.code == yi) {
                i.disable = true;
                break;
              }
            }
          }
        }
        self.waitTo_cityList = waitTo_cityList;
        this.$forceUpdate();
      } else {
        for (let x in waitTo_cityList) {
          for (let i of waitTo_cityList[x].children) {
            i.disable = false;
          }
        }
        self.waitTo_cityList = waitTo_cityList;
      }
      this.$forceUpdate();
    },
    search (e) {
      console.log(e)
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

.form-box {
  width: 500px;
  margin: 0 auto;
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