<template>
  <div class="manage">
    <el-row style="height:calc(100vh - 104px);">
      <el-col :span="6"
              style="height:100%;overflow:scroll;"
              class="searchBox">
        <div>
          <el-form ref="searchform"
                   :model="searchForm"
                   :rules="searchRules"
                   label-position="top"
                   :show-message="false"
                   size="small"
                   label-width="80px">
            <el-form-item prop="logisticType"
                          :label="$t('booking.logisiticsType')">
              <el-select v-model="logisticType"
                         class="inputWidth">
                <el-option v-for="item in logisticTypeOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpRegion"
                          :label="$t('booking.pickupPoint')">
              <el-select v-model="searchForm.pickUpRegion"
                         filterable
                         remote
                         reserve-keyword
                         class="inputWidth"
                         v-el-select-loadmore="loadmore"
                         :placeholder="$t('placeholder.pleaseEnterLeywords')"
                         :remote-method="pickUpMethod"
                         @focus="clearSelect('pk')"
                         :loading="loading">
                <el-option v-for="item in pickUpRegionList"
                           :key="item.fullname"
                           :label="item.fullname"
                           :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpDate"
                          :label="$t('booking.pickupTime')">
              <div style="display:flex;"
                   class="inputWidth">
                <el-cascader v-model="dateCascader"
                             class="innerInp"
                             :options="options"
                             :props="props"
                             separator="-"
                             style="margin-right:5px;"
                             :placeholder="$t('booking.pickupTime')"
                             @change="dateChange"></el-cascader>
                <el-time-picker v-model="time"
                                format="HH:mm:ss"
                                class="innerInp"
                                value-format="HH:mm:ss"
                                :placeholder="$t('placeholder.chooseTime')">
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item prop="deliveryRegion"
                          :label="$t('booking.deliveryPoint')">
              <el-select v-model="searchForm.deliveryRegion"
                         filterable
                         remote
                         reserve-keyword
                         @focus="clearSelect('del')"
                         class="inputWidth"
                         v-el-select-loadmore="loadmore"
                         :placeholder="$t('placeholder.pleaseEnterLeywords')"
                         :remote-method="pickUpMethod"
                         :loading="loading">
                <el-option v-for="item in delRegionList"
                           :key="item.fullname"
                           :label="item.fullname"
                           :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('booking.truckType')">
              <div class="inputWidth">
                <el-select v-model="searchForm.truckCategory"
                           class="innerInp"
                           :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option v-for="item in categoryList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key" />
                </el-select>
                <el-select v-model="searchForm.truckSubCategory"
                           class="innerInp"
                           :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option v-for="item in subCategoryList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="searchSupply"
                         style="width:100%;"
                         :loading="searchloading">{{ $t("booking.searchSupply") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18"
              style="height:100%;overflow:scroll;">
        <el-table :data="tableList"
                  border
                  style="width: 97%;">
          <el-table-column :label="$t('booking.supply')"
                           align="center">
            <template slot-scope="scope">
              <div>
                <div>{{ scope.row.supply ? scope.row.supply.name : "" }}</div>
                <div>
                  <div>
                    <el-rate v-model="scope.row.supply.avgRating / 2"
                             disabled
                             text-color="#ff9900"
                             score-template="{value}">
                    </el-rate>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           :label="$t('booking.route')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.fromProvince }} --> {{ scope.row.toProvinceName }}
              </div>
              <div>
                <!-- {{$t('booking.transitTime')}} :  -->
                {{ scope.row.transitTime }} days
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center"
                           :label="$t('booking.truckType')">
            <template slot-scope="scope">
              <div class="cantouch"
                   @click="previewImg(scope.row)">
                <div>{{ truckObj[scope.row.category] }}</div>
                <div>{{ subObj[scope.row.subCategory] }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center"
                           align="center"
                           :label="$t('booking.valueAddedService')">
            <template slot-scope="scope">
              <div>
                <div>
                  {{ $t("booking.loading") }}/{{ $t("booking.unloading") }} :
                  <i :class="
                      scope.row.supportLoading == 1
                        ? 'el-icon-check'
                        : 'el-icon-close'
                    "></i>
                </div>
                <div>
                  {{ $t("booking.documentReturn") }} :
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           :label="$t('booking.price')">
            <template slot-scope="scope">
              {{ scope.row.charge }}
              <!-- <div>{{$t('booking.feight')}} : {{scope.row.charge}}</div>
              <div v-if="scope.row.supportLoading == 1">{{$t('booking.loading')}}/{{$t('booking.unloading')}} : {{scope.row.loadingOrUnloadingHumanWorkDay * scope.row.moneyPerDay}}</div>
              <div>{{$t('booking.documentReturn')}} :{{documentReturn}}</div>
              <div>{{$t('booking.totalamt')}} : {{10 + scope.row.charge + (scope.row.supportLoading == 1 ? scope.row.loadingOrUnloadingHumanWorkDay * scope.row.moneyPerDay : 0)}}</div> -->
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div style="text-align:center;">
                <el-button type="primary"
                           :disabled="!roles.Demand"
                           @click="toBooking(scope.row)">{{ $t("booking.placeOrder") }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top:10px;text-align: center;margin-bottom:50px;"
                       background
                       :page-sizes="[1, 5, 10, 20, 50]"
                       :page-size="pagesize"
                       @size-change="pageSizeChange"
                       :current-page.sync="page.currentPage"
                       @current-change="pageChange"
                       layout="prev, pager, next, jumper"
                       :total="page.total"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="previewDialog">
      <div>
        <el-carousel arrow="always" height="600px" :autoplay="false">
          <el-carousel-item v-for="item in previewImgList"
                            style="text-align:center;"
                            :key="item">
            <el-image :src="item"
                      style="height:600px;"
                      fit="contain"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex";
import { ftlLine, ftlLines } from "../../api/booking";
import {
  getTruckType,
  findDistrictFullList,
  getBcYear,
  getBcDay
} from "../../api/data";
import Search from "@/components/HeaderSearch";

let self;

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  directives: {
    "el-select-loadmore": {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
  data () {
    const self = this;
    const validatorTruck = (rule, value, callback) => {
      if (!value || !self.searchForm.truckSubCategory) {
        callback(new Error(""));
      } else {
        callback();
      }
    };
    return {
      searchForm: {
        truckCategory: "",
        truckSubCategory: "",
        pickUpDate: "",
        deliveryRegion: "",
        pickUpRegion: ""
      },
      searchRules: {
        deliveryRegion: [{ required: true }],
        pickUpRegion: [{ required: true }],
        pickUpDate: [{ required: true }],
        truckCategory: [{ required: true, validator: validatorTruck }]
      },
      time: "",
      options: [],
      logisticType: "FTL",
      logisticTypeOption: [
        {
          value: "FTL",
          label: "FTL"
        }
        // {
        //   value: 'LTL',
        //   label: 'LTL'
        // }
      ],
      tableList: [],
      loading: false,
      searchloading: false,
      categoryList: [],
      subCategoryList: [],
      pickUpQuery: "",
      pickUpRegionList: [],
      delRegionList: [],
      delQuery: "",
      isLast: false,
      regionPage: 0,
      curSelect: "",
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      documentReturn: 10,
      bcYear: "",
      dateCascader: "",
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          let year = self.bcYear;
          let date = new Date();
          let month = node.label == year ? date.getMonth() + 1 : 1;
          let day = date.getDate();
          let options = [];
          if (node.level == 0) {
            getBcYear().then(res => {
              self.bcYear = res.data;
              let years = [
                {
                  label: self.bcYear,
                  value: self.bcYear
                },
                {
                  label: self.bcYear + 1,
                  value: self.bcYear + 1
                }
              ];
              resolve(years);
            });
          } else if (node.level == 1) {
            let months = [];
            for (let y = month; y <= 12; y++) {
              months.push({
                label: y,
                value: y
              });
            }
            resolve(months);
          } else if (node.level == 2) {
            getBcDay(node.parent.value, node.value).then(res => {
              let days = res.data;
              let dateList = [];
              let d =
                node.parent.value == self.bcYear &&
                  node.value == date.getMonth() + 1
                  ? day
                  : 1;
              for (let x = d; x <= days; x++) {
                dateList.push({
                  label: x,
                  value: x,
                  leaf: true
                });
              }
              resolve(dateList);
            });
          }
        }
      },
      truckObj: {},
      subObj: {},
      previewImgList: [],
      previewDialog: false
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["roles"])
  },
  // 监控data中的数据变化
  watch: {
    "$store.getters.language" () {
      self.init();
    }
  },
  created () {
    self = this;
  },
  mounted () {
    self.init();
    // ftlLines({
    //   page: self.page.currentPage - 1,
    //   pagesize: self.pagesize
    // }).then(res => {
    //   self.tableList = res.data.content;
    //   self.page = {
    //     total: res.data.totalElements,
    //     currentPage: res.data.number + 1
    //   };
    // })
  },
  methods: {
    init () {
      getTruckType().then(res => {
        self.categoryList = res.data.categories;
        self.subCategoryList = res.data.subCategories;
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
      if (self.$route.query.return == 1) {
        let consultInfo = JSON.parse(localStorage.getItem("consultInfo"));
        self.searchForm = consultInfo.searchForm;
        self.logisticType = consultInfo.logisticType;
        self.dateCascader = consultInfo.searchForm.pickUpDate
          .split("-")
          .map(Number);
        self.time = consultInfo.time;
        self.pickUpRegionList = consultInfo.pickUpRegionList;
        self.delRegionList = consultInfo.delRegionList;
        self.searchSupply();
      }
    },
    toBooking (row) {
      let consultInfo = {};
      consultInfo.data = row;
      consultInfo.pickUpRegionList = self.pickUpRegionList;
      consultInfo.delRegionList = self.delRegionList;
      consultInfo.searchForm = self.searchForm;
      consultInfo.logisticType = self.logisticType;
      consultInfo.time = self.time ? self.time : "00:00:00";
      consultInfo.searchForm.truckSubCategory = row.subCategory;
      consultInfo.searchForm.truckCategory = row.category;
      localStorage.setItem("consultInfo", JSON.stringify(consultInfo));
      this.$router.replace("/booking/placeOrder");
    },
    pickUpMethod (query) {
      if (query !== "") {
        if (self.curSelect == "pk") {
          self.pickUpQuery = query;
        } else {
          self.delQuery = query;
        }
        self.loading = true;
        setTimeout(() => {
          self.loading = false;
          self.getdistrictFullList(query, self.regionPage);
        }, 200);
      } else {
        self.regionList = [];
      }
    },
    loadmore () {
      if (!self.isLast) {
        self.regionPage += 1;
        if (self.curSelect == "pk") {
          self.getdistrictFullList(self.pickUpQuery, self.regionPage);
        } else {
          self.getdistrictFullList(self.delQuery, self.regionPage);
        }
      }
    },
    getdistrictFullList (query, page) {
      findDistrictFullList({
        name: query,
        page: page
      }).then(res => {
        self.isLast = res.data.last;
        if (!res.data.first) {
          if (self.curSelect == "pk") {
            self.pickUpRegionList = self.pickUpRegionList.concat(
              res.data.content
            );
          } else {
            self.delRegionList = self.delRegionList.concat(res.data.content);
          }
        } else {
          if (self.curSelect == "pk") {
            self.pickUpRegionList = res.data.content;
          } else {
            self.delRegionList = res.data.content;
          }
        }
      });
    },
    // 聚焦初始化
    clearSelect (type) {
      if (type == "pk") {
        self.pickUpQuery = "";
        self.curSelect = "pk";
      } else {
        self.delQuery = "";
        self.curSelect = "del";
      }
      self.regionPage = 0;
      self.isLast = false;
    },
    // 搜索
    searchSupply () {
      this.$refs.searchform.validate(valid => {
        let searchForm = JSON.parse(JSON.stringify(self.searchForm));
        if (valid) {
          self.searchloading = true;
          let time = self.time ? self.time : "00:00:00";
          searchForm.pickUpDate =
            searchForm.pickUpDate.split(" ")[0] + ` ${time}`;
          if (self.logisticType == "FTL") {
            ftlLine(searchForm, {
              page: self.page.currentPage - 1,
              pagesize: self.pagesize
            }).then(res => {
              self.searchloading = false;
              let tableList = res.data.content;
              // for (let i of tableList) {
              //   i.truckImgList = [];
              //   for (let t of i.registrationResource) {
              //     i.truckImgList.push(t.path)
              //   }
              // }
              self.tableList = tableList;
              self.page = {
                total: res.data.totalElements,
                currentPage: res.data.number + 1
              };
            }).catch(el => {
              self.searchloading = false;
            });
          }
        }
      });
    },
    pageChange (val) {
      self.page.currentPage = val;
      // if (self.searchForm.pickUpRegion == '') {
      //   ftlLines({
      //     page: self.page.currentPage - 1,
      //     pagesize: self.pagesize
      //   }).then(res => {
      //     self.tableList = res.data.content;
      //     self.page = {
      //       total: res.data.totalElements,
      //       currentPage: res.data.number + 1
      //     };
      //   })
      // } else {
      // }
      self.searchSupply();
    },
    pageSizeChange (val) {
      self.pagesize = val;
      self.searchSupply();
    },
    dateChange (e) {
      self.searchForm.pickUpDate = `${e[0]}-${e[1]}-${e[2]}`;
    },
    previewImg (row) {
      let arr = [];
      for (let i of row.truckResource) {
        arr.push(i.path)
      }
      self.previewImgList = arr;
      self.previewDialog = true;
    }
  }
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  padding-top: 20px;
  box-sizing: border-box;
  padding-left: 20px;
  .searchBox {
    padding-right: 24px;
    box-sizing: border-box;
  }
  .table_supply {
    display: flex;
    align-items: center;
    .item {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.inputWidth {
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: center;
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}

.innerInp {
  width: 48%;
}

.cantouch {
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid rgb(50, 126, 226);
  color: rgb(50, 126, 226);
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #ccc;
  margin: 5px;
  transition: all 0.4s;
}

.cantouch:hover {
  box-shadow: 0 0 5px 0 #000;
}
</style>
