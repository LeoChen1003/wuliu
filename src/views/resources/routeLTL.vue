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
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="$t('resources.origin')">
            <template slot-scope="scope">
              <div>{{ scope.row.hubName }}</div>
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
      <div class="detail-box">
        <el-tabs v-model="detailTab">
          <el-tab-pane :label="$t('resources.map')" name="map">
            <div style="text-align: center;height: 50%;">
              <el-image fit="cover" v-if="thisRow" :src="thisRow.mapUrl" :preview-src-list="preViewList"></el-image>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.deliverableDistrict')" name="deli">
            <el-table border :data="thisRow.cityList" v-if="thisRow" style="width: 100%">
              <el-table-column prop="date" :label="$t('setting.province')" width="180">
                <template slot-scope="scope">
                  <div>{{ scope.row.provinceName }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('setting.deliverableDistrict')">
                <template slot-scope="scope">
                  <el-tag
                    :type="item.kind === 'CAPITAL' ? 'success' : 'primary'"
                    style="margin-right: 5px;"
                    v-for="item in scope.row.cityCodes"
                    >{{ cityObj[item].name }}</el-tag
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.quotation')" name="quot">
            <div>
              <div style="display: flex;align-items: center;">
                <el-table border :data="sizeInfo" size="mini">
                  <el-table-column prop="date">
                    <template slot-scope="scope">
                      {{ scope.row.type }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-SS">
                    <template slot-scope="scope">
                      {{ scope.row.size_ss }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-S">
                    <template slot-scope="scope">
                      {{ scope.row.size_s }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-M">
                    <template slot-scope="scope">
                      {{ scope.row.size_m }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-L">
                    <template slot-scope="scope">
                      {{ scope.row.size_l }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-XL">
                    <template slot-scope="scope">
                      {{ scope.row.size_xl }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Extra size">
                    <template slot-scope="scope">
                      {{ scope.row.size_ex }}
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 30%;margin-left: 20px;">
                  <div style="display: flex;align-items: center;">
                    <div style="margin-right: 15px;width: 100px;">体积重量换算</div>
                  </div>
                  <div>
                    <p>假设换算比为2500、体积=100*80*20=160000cm³,那么，重量=160000/2500=64kg</p>
                  </div>
                </div>
              </div>
              <el-table v-if="thisRow" border style="margin-top: 15px;" :data="thisRow.lineList">
                <el-table-column label="Line" width="200px">
                  <template slot-scope="scope"> {{ scope.row.provinceName }} - {{ scope.row.kind }} </template>
                </el-table-column>
                <el-table-column label="Size_SS">
                  <template slot-scope="scope">
                    {{ scope.row.sizeSSPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="Size_S">
                  <template slot-scope="scope">
                    {{ scope.row.sizeSPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="Size_M">
                  <template slot-scope="scope">
                    {{ scope.row.sizeMPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="Size_L">
                  <template slot-scope="scope">
                    {{ scope.row.sizeLPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="Size_XL">
                  <template slot-scope="scope">
                    {{ scope.row.sizeXLPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="Size_EX">
                  <template slot-scope="scope">
                    {{ scope.row.unitPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="minPrice">
                  <template slot-scope="scope">
                    {{ scope.row.minPrice }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.priceCoefficient')" name="pic">
            <div style="display: flex;justify-content: space-around;width: 100%;" v-if="thisRow">
              <div style="width: 49%;">
                <el-table border :data="thisRow.propertyDiscountList">
                  <el-table-column label="货物类型" align="center" header-align="center">
                    <template slot-scope="scope">
                      {{ scope.row.propertyType }}
                    </template>
                  </el-table-column>
                  <el-table-column label="价格系数" align="center" header-align="center">
                    <template slot-scope="scope"> {{ scope.row.discount }} % </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="width: 49%;">
                <el-table border :data="thisRow.numberDiscountList">
                  <el-table-column label="总件数" align="center" header-align="center">
                    <template slot-scope="scope">
                      {{ scope.row.minNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="≤" align="center" header-align="center">
                    <template slot-scope="scope">
                      {{ scope.row.maxNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率" align="center" header-align="center">
                    <template slot-scope="scope"> {{ scope.row.discount }} % </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.availableDate')" name="ava">
            <div>
              <div class="date-header">
                <el-select v-model="showDate.year" @change="showDateChange" placeholder="">
                  <el-option v-for="item in showDateInfo" :key="item.year" :label="item.year" :value="item.year"> </el-option>
                </el-select>
                <el-select v-model="showDate.month" @change="showDateChange" placeholder="">
                  <el-option v-for="item in showDateInfo[showDate.year].months" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="date-list">
                <div class="day-item" v-for="item in week" :key="item">
                  <el-tag class="day nop week" type="info">{{ item }}</el-tag>
                </div>
                <div class="day-item" v-for="(item, index) in showWeekPH" :key="index + item">
                  <el-tag class="day nop day_ph"></el-tag>
                </div>
                <div class="day-item" v-for="(item, index) in dateList_show" :key="index">
                  <el-tag
                    class="day nop"
                    :effect="
                      showDateList[
                        'show_' +
                          showDate.year +
                          '_' +
                          (showDate.month > 9 ? showDate.month : `0${showDate.month}`) +
                          '_' +
                          (item > 9 ? item : `0${item}`)
                      ]
                        ? 'dark'
                        : 'plain'
                    "
                  >
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :title="$t('route.routeLTL')" :visible.sync="editDialog" center width="1000px" :close-on-click-modal="false">
      <div class="form-box" v-loading="editLoading">
        <el-form label-width="120px">
          <el-form-item required :label="$t('resources.origin')">
            <el-select v-model="form.hubId" @change="hubChange">
              <el-option v-for="item in hubList" :key="item.id" :label="item.hubName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('resources.cutOffTime')">
            <el-time-select
              disabled
              style="width: 200px;"
              v-model="form.cutOffTime"
              :picker-options="timeOptions"
              default-value="18:00"
            />
          </el-form-item>
        </el-form>
        <el-form label-width="120px">
          <el-form-item required :label="$t('resources.route')">
            <el-select v-model="form.templateId" @change="templateChange">
              <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('resources.status')">
            <el-select v-model="form.status">
              <el-option label="Activated" value="ACTIVE" />
              <el-option label="Closed" value="CLOSED" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-tab-box" v-loading="editLoading">
        <el-tabs v-model="editTab">
          <el-tab-pane :label="$t('resources.map')" name="map">
            <div style="text-align: center;height: 50%;">
              <el-image fit="cover" v-if="form.mapUrl !== ''" :src="form.mapUrl" :preview-src-list="preViewList"></el-image>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.deliverableDistrict')" name="deli">
            <el-table border :data="form.cityList" style="width: 100%">
              <el-table-column prop="date" :label="$t('setting.province')" width="180">
                <template slot-scope="scope">
                  <div>{{ scope.row.provinceName }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('setting.deliverableDistrict')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.cityCodes" style="width: 100%" multiple>
                    <el-option v-for="item in scope.row.cityList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.quotation')" name="quot">
            <div>
              <div style="display: flex;align-items: center;">
                <el-table border :data="sizeInfo" size="mini">
                  <el-table-column prop="date">
                    <template slot-scope="scope">
                      {{ scope.row.type }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-SS">
                    <template slot-scope="scope">
                      {{ scope.row.size_ss }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-S">
                    <template slot-scope="scope">
                      {{ scope.row.size_s }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-M">
                    <template slot-scope="scope">
                      {{ scope.row.size_m }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-L">
                    <template slot-scope="scope">
                      {{ scope.row.size_l }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-XL">
                    <template slot-scope="scope">
                      {{ scope.row.size_xl }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Extra size">
                    <template slot-scope="scope">
                      {{ scope.row.size_ex }}
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 30%;margin-left: 20px;">
                  <div style="display: flex;align-items: center;">
                    <div style="margin-right: 15px;width: 100px;">体积重量换算</div>
                    <el-select v-model="plmodel" placeholder="placeholder">
                      <el-option label="2500" :value="2500"> </el-option>
                      <el-option label="3000" :value="3000"> </el-option>
                      <el-option label="3500" :value="3500"> </el-option>
                    </el-select>
                  </div>
                  <div>
                    <p>假设换算比为2500、体积=100*80*20=160000cm³,那么，重量=160000/2500=64kg</p>
                  </div>
                </div>
              </div>
              <el-table border style="margin-top: 15px;" :data="lineList">
                <el-table-column label="Line" width="200px">
                  <template slot-scope="scope"> {{ scope.row.provinceName }} - {{ scope.row.kind }} </template>
                </el-table-column>
                <el-table-column label="Size_SS">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeSSPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_S">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeSPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_M">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeMPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_L">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeLPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_XL">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeXLPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_EX">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.unitPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="minPrice">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.minPrice"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.priceCoefficient')" name="pic">
            <div style="display: flex;justify-content: space-around;width: 100%;">
              <div style="width: 49%;">
                <el-table border :data="form.propertyDiscountList">
                  <el-table-column label="货物类型">
                    <template slot-scope="scope">
                      {{ scope.row.propertyType }}
                    </template>
                  </el-table-column>
                  <el-table-column label="价格系数">
                    <template slot-scope="scope">
                      <el-input type="number" @mousewheel.native.prevent v-model.number="scope.row.discount">
                        <template slot="append">%</template>
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="width: 49%;">
                <el-table border :data="form.numberDiscountList">
                  <el-table-column label="总件数">
                    <template slot-scope="scope">
                      {{ scope.row.minNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="≤">
                    <template slot-scope="scope">
                      <el-input
                        @change="
                          val => {
                            maxNumberChange(val, scope.$index);
                          }
                        "
                        type="number"
                        @mousewheel.native.prevent
                        v-model.number="scope.row.maxNumber"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率">
                    <template slot-scope="scope">
                      <el-input type="number" @mousewheel.native.prevent v-model.number="scope.row.discount">
                        <template slot="append">%</template>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="DELETE" width="80px">
                    <template slot-scope="scope">
                      <div style="text-align: center;">
                        <el-button
                          v-if="scope.$index !== 0"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click="delRow(scope.row, scope.$index)"
                        />
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.availableDate')" name="ava">
            <div>
              <div class="date-header">
                <div>{{ $t("resources.availableDate") }}</div>
                <el-select v-model="date.year" @change="dateChange" style="width:150px;" placeholder="">
                  <el-option v-for="item in dateInfo" :key="item.year" :label="item.year" :value="item.year"> </el-option>
                </el-select>
                <el-select v-model="date.month" @change="dateChange" style="width:150px;" placeholder="">
                  <el-option v-for="item in dateInfo[date.year].months" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
                <el-button @click="checkAll" type="primary">
                  {{ allChecked ? $t("resources.deselectAll") : $t("resources.checkAll") }}</el-button
                >
              </div>
              <div class="date-list" v-loading="dateLoading">
                <div class="day-item" v-for="item in week" :key="item">
                  <el-tag class="day nop week" type="info">{{ item }}</el-tag>
                </div>
                <div class="day-item" v-for="(item, index) in weekPH" :key="index + item">
                  <el-tag class="day nop day_ph"></el-tag>
                </div>
                <div class="day-item" v-for="(item, index) in dateList" :key="index">
                  <el-tag
                    class="day"
                    :effect="sendDateList['show_' + date.year + '_' + date.month + '_' + item] ? 'dark' : 'plain'"
                    @click="tapDay(item)"
                  >
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmIt">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getBcDay, getBcYear, getCityList, getHub } from "@api/data";
import { addLTLRoute, getLTLRoute, getLineTemplate } from "@api/resources";

let self;

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      loading: false,
      plmodel: 2500,
      data: [],
      editDialog: false,
      editLoading: false,
      thisRow: null,
      editTab: "map",
      detailTab: "map",
      hubList: [],
      templateList: [],
      form: {
        hubId: "",
        templateId: "",
        mapUrl: "",
      },
      timeOptions: {
        start: "00:00",
        step: "00:15",
        end: "23:45",
      },
      preViewList: [],
      sizeInfo: [
        {
          type: "Dimension(cm)",
          size_ss: "0.01-90",
          size_s: "90.01-110",
          size_m: "110.01-130",
          size_l: "130.01-150",
          size_xl: "150.01-170",
          size_ex: ">170.00",
        },
        {
          type: "Weight(kg)",
          size_ss: "0.01-10",
          size_s: "10.01-20",
          size_m: "20.01-30",
          size_l: "30.01-40",
          size_xl: "40.01-50",
          size_ex: ">50",
        },
      ],
      lineList: [],
      cityObj: {},
      date: {
        year: "2019",
        month: "",
      },
      showDate: {
        year: "2019",
        month: "",
      },
      dateInfo: { 2019: { year: 2019, months: [] } },
      showDateInfo: { 2019: { year: 2019, months: [] } },
      dateList: [],
      dateList_show: [],
      sendDateList: {},
      showDateList: {},
      dateLoading: false,
      weekPH: [],
      showWeekPH: [],
      week: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      allChecked: false,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    "form.hubId"(id) {
      let params = {
        hubId: id,
        pagesize: 999,
      };
      getLineTemplate(params).then(res => {
        self.templateList = res.data.content;
      });
    },
  },
  mounted() {
    getHub().then(res => {
      self.hubList = res.data;
      self.form.hubId = res.data[0].id;
    });
    getCityList().then(res => {
      let cityObj = new Object();
      for (let i of res.data) {
        cityObj[i.code] = i;
      }
      self.cityObj = cityObj;
    });
    // 生成可选日期
    getBcYear().then(res => {
      let year = res.data;
      let date = new Date();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let years = [year, year + 1];
      let showYears = [year - 1, year, year + 1];
      let dateInfo = {};
      let showDateInfo = {};
      // 生成编辑可选日期
      for (let x in years) {
        let months = [];
        let m = 1;
        if (x === 0) {
          m = month;
        }
        for (let y = m; y <= 12; y++) {
          months.push(y);
        }
        dateInfo[years[x]] = {
          year: years[x],
          months: months,
          start: x === 0 ? day : 1,
        };
      }
      // 生成展示可选日期
      for (let x in showYears) {
        let months = [];
        let m = 1;
        for (let y = m; y <= 12; y++) {
          months.push(y);
        }
        showDateInfo[showYears[x]] = {
          year: showYears[x],
          months: months,
          start: x === 0 ? day : 1,
        };
      }
      self.dateInfo = dateInfo;
      self.showDateInfo = showDateInfo;
      self.date = {
        year: year,
        month: month,
      };
      self.showDate = {
        year: year,
        month: month,
      };
      self.getDay("edit");
      self.getDay("show");
    });
    self.loadData();
  },
  methods: {
    loadData(cb) {
      self.loading = true;
      let params = {
        page: self.data.number ? self.data.number : 0,
        hubId: self.activeHub,
      };
      if (self.status !== "") {
        params.status = self.status;
      }
      getLTLRoute(params).then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
    },
    pageChange(e) {
      self.loading = true;
      getLTLRoute({
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      });
    },
    add() {
      self.sendDateList = {};
      self.lineList = [];
      self.form = {
        hubId: self.hubList[0].id,
        templateId: "",
        mapUrl: "",
      };
      self.editDialog = true;
    },
    edit(row) {
      self.editDialog = true;
      self.editLoading = true;
      let template = row;
      let index = 0;
      let list = [];
      let dateList = {};
      self.priceList = row.citys;
      for (let i of row.optionalTimeList) {
        let arr = i.optTime.split("-");
        dateList["show_" + arr[0] + "_" + arr[1] + "_" + arr[2]] = {
          bcYear: arr[0],
          month: arr[1],
          day: arr[2],
        };
      }
      // 整理cityList格式
      parse();
      function parse() {
        console.log(template);
        let params = `provinceCodes=${template.ltlLineProvinceList[index].provinceCode}`;
        getCityList(params).then(res => {
          list.push({
            provinceCode: template.ltlLineProvinceList[index].provinceCode,
            provinceName: template.ltlLineProvinceList[index].provinceName,
            cityList: res.data,
            cityCodes: [],
          });
          for (let i of template.ltlLineProvinceList[index].ltlLineCityList) {
            list[index].cityCodes.push(i.cityCode);
          }
          if (index < parseInt(template.ltlLineProvinceList.length) - 1) {
            index++;
            parse();
          } else {
            let lineList = [];
            for (let x in list) {
              let cap;
              let com;
              for (let t of template.ltlLineProvinceList[x].ltlLineCityList) {
                if (t.kind === "CAPITAL") {
                  cap = {
                    provinceName: list[x].provinceName,
                    provinceCode: list[x].provinceCode,
                    kind: "CAPITAL",
                    minPrice: t.minPrice,
                    sizeLPrice: t.sizeLPrice,
                    sizeMPrice: t.sizeMPrice,
                    sizeSPrice: t.sizeSPrice,
                    sizeSSPrice: t.sizeSSPrice,
                    sizeXLPrice: t.sizeXLPrice,
                    unitPrice: t.unitPrice,
                  };
                } else if (t.kind === "COMMON") {
                  com = {
                    provinceName: list[x].provinceName,
                    provinceCode: list[x].provinceCode,
                    kind: "COMMON",
                    minPrice: t.minPrice,
                    sizeLPrice: t.sizeLPrice,
                    sizeMPrice: t.sizeMPrice,
                    sizeSPrice: t.sizeSPrice,
                    sizeSSPrice: t.sizeSSPrice,
                    sizeXLPrice: t.sizeXLPrice,
                    unitPrice: t.unitPrice,
                  };
                }
              }
              if (cap) {
                lineList.push(cap);
              }
              if (com) {
                lineList.push(com);
              }
              // 计算是否禁用
            }
            self.lineList = lineList;
            row.cityList = list;
            row.numberDiscountList[parseInt(row.numberDiscountList.length - 1)].maxNumber = "";
            self.sendDateList = dateList;
            self.form = row;
            self.$forceUpdate();
            self.editLoading = false;
          }
        });
      }
    },
    hubChange(id) {
      self.sendDateList = {};
      self.lineList = [];
      self.form = {
        hubId: id,
        templateId: "",
        mapUrl: "",
      };
    },
    templateChange(id) {
      let form = JSON.parse(JSON.stringify(self.form));
      let template;
      let index = 0;
      let list = [];
      self.editLoading = true;

      for (let i of self.templateList) {
        if (i.id === id) {
          template = i;
        }
      }
      // for (let x in template.lineTemplateProvinces) {
      //   cityList.push({
      //     provinceCode: template.lineTemplateProvinces[x].provinceCode,
      //     provinceName: template.lineTemplateProvinces[x].provinceName,
      //     ltlLineCityList: [],
      //     cityCodes: [],
      //   });
      //   for (let i of template.lineTemplateProvinces[x].lineTemplateCitys) {
      //     cityList[x].cityCodes.push(i.cityCode);
      //   }
      // }

      // 整理cityList格式
      parse();
      function parse() {
        let params = `provinceCodes=${template.lineTemplateProvinces[index].provinceCode}`;
        getCityList(params).then(res => {
          list.push({
            provinceCode: template.lineTemplateProvinces[index].provinceCode,
            provinceName: template.lineTemplateProvinces[index].provinceName,
            cityList: res.data,
            cityCodes: [],
          });
          for (let i of template.lineTemplateProvinces[index].lineTemplateCitys) {
            list[index].cityCodes.push(i.cityCode);
          }
          if (index < parseInt(template.lineTemplateProvinces.length) - 1) {
            index++;
            parse();
          } else {
            self.editLoading = false;
            self.parseLine();
          }
        });
      }
      form = {
        ...form,
        mapUrl: template.mapUrl,
        cutOffTime: template.cutOffTime,
        name: template.name,
        cityList: list,
        numberDiscountList: [
          {
            minNumber: 0,
            maxNumber: "",
            discount: 0,
          },
        ],
        propertyDiscountList: [
          {
            discount: 100,
            propertyType: "CONSUMER_PRODUCT",
          },
          {
            discount: 100,
            propertyType: "RAW_MATERIAL",
          },
          {
            discount: 100,
            propertyType: "SPECIAL_HANDLING",
          },
        ],
      };
      self.preViewList = [form.mapUrl];
      self.form = form;
    },
    // 格式化站点报价数据
    parseLine() {
      let cityList = JSON.parse(JSON.stringify(self.form.cityList));
      let lineList = [];
      for (let i of cityList) {
        let cap = {
          provinceName: i.provinceName,
          provinceCode: i.provinceCode,
          kind: "CAPITAL",
          minPrice: "",
          sizeLPrice: "",
          sizeMPrice: "",
          sizeSPrice: "",
          sizeSSPrice: "",
          sizeXLPrice: "",
          unitPrice: "",
          disable: true,
        };
        let com = {
          provinceName: i.provinceName,
          provinceCode: i.provinceCode,
          kind: "COMMON",
          minPrice: "",
          sizeLPrice: "",
          sizeMPrice: "",
          sizeSPrice: "",
          sizeSSPrice: "",
          sizeXLPrice: "",
          unitPrice: "",
          disable: true,
        };
        for (let t of i.cityCodes) {
          if (self.cityObj[t].kind === "CAPITAL") {
            cap.disable = false;
          } else {
            com.disable = false;
          }
        }
        lineList.push(cap, com);
        // 计算是否禁用
      }
      self.lineList = lineList;
    },
    // 最大值更变
    maxNumberChange(val, index) {
      let list = JSON.parse(JSON.stringify(self.form.numberDiscountList));
      let sameCount = 0;
      val = parseInt(val);
      // 数量过滤
      for (let x in list) {
        if (val == list[x].minNumber || val == list[x].maxNumber) {
          sameCount++;
          if (sameCount > 2) {
            return self.$message.warning("error_1");
          }
        }
      }
      // 如果小于起始值
      if (val < list[index].minNumber) {
        return self.$message.warning("不能小于总件数");
      } else if (val === "") {
        return self.$message.warning("不能为空");
      }
      // 操作队列
      // 有更大值
      if (list[index + 1] && val < list[index + 1].maxNumber) {
        list[index + 1].minNumber = val + 1;
      } else if (list[index + 1] && list[index + 1].maxNumber === "") {
        // 下一位为最大值
        list[index + 1].minNumber = val + 1;
      } else if (!list[index + 1]) {
        // 无更大值
        list.push({
          minNumber: val + 1,
          maxNumber: "",
          discount: 0,
        });
      } else {
        return self.$message.warning("不合法的数值");
      }
      // 重新排序
      // list.sort((a, b) => {
      //   if (a.minNumber < b.minNumber) {
      //     return -1;
      //   } else if (a.minNumber === b.minNumber) {
      //     return 0;
      //   } else {
      //     return 1;
      //   }
      // });
      // 设置最大值
      // for (let x in list) {
      //   if (x != list.length - 1) {
      //     list[x].maxNumber = list[parseInt(x) + 1].minNumber;
      //   }
      // }
      // list[list.length - 1].maxNumber = "";
      self.form.numberDiscountList = list;
    },
    delRow(row, index) {
      let list = JSON.parse(JSON.stringify(self.form.numberDiscountList));
      list.splice(index, 1);
      if (index == list.length) {
        list[list.length - 1].maxNumber = "";
      } else {
        list[index].minNumber = list[index - 1].maxNumber + 1;
      }
      self.form.numberDiscountList = list;
    },
    tapDay(day) {
      if (self.sendDateList["show_" + self.date.year + "_" + self.date.month + "_" + day]) {
        delete self.sendDateList["show_" + self.date.year + "_" + self.date.month + "_" + day];
      } else {
        self.$set(self.sendDateList, ["show_" + self.date.year + "_" + self.date.month + "_" + day], {
          bcYear: self.date.year,
          month: self.date.month,
          day: day,
        });
      }
      this.$forceUpdate();
      self.checkAllCheck();
    },
    // 全选/取消全选
    checkAll() {
      if (self.allChecked) {
        for (let x in self.dateList) {
          delete self.sendDateList["show_" + self.date.year + "_" + self.date.month + "_" + self.dateList[x]];
        }
        self.allChecked = false;
      } else {
        for (let x in self.dateList) {
          self.$set(self.sendDateList, ["show_" + self.date.year + "_" + self.date.month + "_" + self.dateList[x]], {
            bcYear: self.date.year,
            month: self.date.month,
            day: self.dateList[x],
          });
        }
        self.allChecked = true;
      }
      this.$forceUpdate();
    },
    dateChange(e) {
      self.getDay("edit");
    },
    showDateChange(e) {
      self.getDay("show");
    },
    // 检测是否全选
    checkAllCheck() {
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
    getDay(type) {
      if (type === "edit") {
        self.dateLoading = true;
        getBcDay(self.date.year, self.date.month).then(res => {
          let days = res.data;
          let start = self.dateInfo[self.date.year].start;
          let dateList = {};
          let yearInd = Object.keys(self.dateInfo).indexOf(self.date.year.toString());
          let year = yearInd === 0 ? new Date().getFullYear() : new Date().getFullYear() + 1;
          let week = new Date(`${year}/${self.date.month}/1`).getDay();
          let weekPD = week === 7 ? 0 : week;
          let weekPH = [];
          for (let x = 1; x <= days; x++) {
            dateList["show_" + self.date.year + "_" + self.date.month + "_" + x] = x;
          }
          self.dateList = dateList;
          self.checkAllCheck();
          for (let x = 0; x < weekPD; x++) {
            weekPH.push("");
          }
          self.weekPH = weekPH;
          self.dateLoading = false;
        });
      } else {
        getBcDay(self.showDate.year, self.showDate.month).then(res => {
          let days = res.data;
          let start = self.showDateInfo[self.showDate.year].start;
          let showDateList = {};
          let yearInd = Object.keys(self.showDateInfo).indexOf(self.showDate.year.toString());
          let year =
            yearInd === 0
              ? new Date().getFullYear() - 1
              : yearInd === 1
              ? new Date().getFullYear()
              : new Date().getFullYear() + 1;
          let week = new Date(`${year}/${self.showDate.month}/1`).getDay();
          let weekPD = week === 7 ? 0 : week;
          let weekPH = [];
          for (let x = 1; x <= days; x++) {
            showDateList["show_" + self.showDate.year + "_" + self.showDate.month + "_" + (x > 9 ? x : `0${x}`)] = x;
          }
          for (let x = 0; x < weekPD; x++) {
            weekPH.push("");
          }
          self.showWeekPH = weekPH;
          self.dateList_show = showDateList;
        });
      }
    },
    confirmIt() {
      let form = JSON.parse(JSON.stringify(self.form));
      let lineList = JSON.parse(JSON.stringify(self.lineList));
      let sendDateList = JSON.parse(JSON.stringify(self.sendDateList));
      let ltlLineProvinceList = [];
      let optionalTimeList = [];

      // 寻找hubName
      for (let i of self.hubList) {
        if (i.id === form.hubId) {
          form.hubName = i.hubName;
          break;
        }
      }

      // 设置numberDiscountList最大值
      form.numberDiscountList[parseInt(form.numberDiscountList.length) - 1].maxNumber = 9999;

      // 设置ltlLineProvinceList
      for (let x in form.cityList) {
        ltlLineProvinceList.push({
          ltlLineCityList: [],
          provinceCode: form.cityList[x].provinceCode,
          provinceName: form.cityList[x].provinceName,
        });
        for (let t of form.cityList[x].cityCodes) {
          for (let e of lineList) {
            let obj = self.cityObj[t];
            if (obj.provinceCode === e.provinceCode && obj.kind === e.kind) {
              ltlLineProvinceList[x].ltlLineCityList.push({
                cityCode: obj.code,
                cityName: obj.name,
                kind: e.kind,
                minPrice: e.minPrice,
                sizeLPrice: e.sizeLPrice,
                sizeMPrice: e.sizeMPrice,
                sizeSPrice: e.sizeSPrice,
                sizeSSPrice: e.sizeSSPrice,
                sizeXLPrice: e.sizeXLPrice,
                unitPrice: e.unitPrice,
              });
              break;
            }
          }
        }
      }

      // 设置optionalTimeList
      for (let x in sendDateList) {
        optionalTimeList.push({
          optTime: `${sendDateList[x].bcYear}-${sendDateList[x].month}-${sendDateList[x].day}`,
        });
      }

      let data = {
        cutOffTime: form.cutOffTime,
        hubId: form.hubId,
        hubName: form.hubName,
        mapUrl: form.mapUrl,
        name: form.name,
        numberDiscountList: form.numberDiscountList,
        propertyDiscountList: form.propertyDiscountList,
        status: form.status,
        templateId: form.templateId,
        ltlLineProvinceList: ltlLineProvinceList,
        optionalTimeList: optionalTimeList,
      };

      addLTLRoute(data).then(res => {
        self.loadData(() => {
          self.editDialog = false;
        });
      });
    },
    tapRow(row) {
      let template = row;
      let index = 0;
      let list = [];
      if (row === null) {
        self.showDateList = {};
        self.thisRow = {};
        return;
      }
      let dateList = {};
      self.priceList = row.citys;
      for (let i of row.optionalTimeList) {
        let arr = i.optTime.split("-");
        dateList["show_" + arr[0] + "_" + arr[1] + "_" + arr[2]] = {
          bcYear: arr[0],
          month: arr[1],
          day: arr[2],
        };
      }
      // 整理cityList格式
      parse();
      function parse() {
        let params = `provinceCodes=${template.ltlLineProvinceList[index].provinceCode}`;
        getCityList(params).then(res => {
          list.push({
            provinceCode: template.ltlLineProvinceList[index].provinceCode,
            provinceName: template.ltlLineProvinceList[index].provinceName,
            cityList: res.data,
            cityCodes: [],
          });
          for (let i of template.ltlLineProvinceList[index].ltlLineCityList) {
            list[index].cityCodes.push(i.cityCode);
          }
          if (index < parseInt(template.ltlLineProvinceList.length) - 1) {
            index++;
            parse();
          } else {
            let lineList = [];
            for (let x in list) {
              let cap;
              let com;
              for (let t of template.ltlLineProvinceList[x].ltlLineCityList) {
                if (t.kind === "CAPITAL") {
                  cap = {
                    provinceName: list[x].provinceName,
                    provinceCode: list[x].provinceCode,
                    kind: "CAPITAL",
                    minPrice: t.minPrice,
                    sizeLPrice: t.sizeLPrice,
                    sizeMPrice: t.sizeMPrice,
                    sizeSPrice: t.sizeSPrice,
                    sizeSSPrice: t.sizeSSPrice,
                    sizeXLPrice: t.sizeXLPrice,
                    unitPrice: t.unitPrice,
                  };
                } else if (t.kind === "COMMON") {
                  com = {
                    provinceName: list[x].provinceName,
                    provinceCode: list[x].provinceCode,
                    kind: "COMMON",
                    minPrice: t.minPrice,
                    sizeLPrice: t.sizeLPrice,
                    sizeMPrice: t.sizeMPrice,
                    sizeSPrice: t.sizeSPrice,
                    sizeSSPrice: t.sizeSSPrice,
                    sizeXLPrice: t.sizeXLPrice,
                    unitPrice: t.unitPrice,
                  };
                }
              }
              if (cap) {
                lineList.push(cap);
              }
              if (com) {
                lineList.push(com);
              }
              // 计算是否禁用
            }
            row.lineList = lineList;
            row.cityList = list;
            row.numberDiscountList[parseInt(row.numberDiscountList.length - 1)].maxNumber = "";
            self.showDateList = dateList;
            self.thisRow = row;
            self.$forceUpdate();
            self.editLoading = false;
          }
        });
      }
    },
  },
  created() {
    self = this;
  },
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

.detail-box {
  width: 49%;
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
<style lang="scss">
.detail-box {
  .el-input-group__append {
    padding: 0 10px !important;
  }
}
</style>
