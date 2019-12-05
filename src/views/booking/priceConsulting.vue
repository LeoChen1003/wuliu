<template>
  <div class="manage Consulte">
    <el-row style="height:calc(100vh - 104px);">
      <el-col :span="6" class="searchBox">
        <div>
          <el-form
            ref="searchform"
            :model="searchForm"
            :rules="searchRules"
            label-position="left"
            size="small"
            hide-required-asterisk
            label-width="50px"
          >
            <el-form-item prop="logisticType">
              <!-- <el-select v-model="logisticType" class="inputWidth">
                <el-option
                  v-for="item in logisticTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              <div class="logistic_type">
                <div
                  class="logistic_type_item"
                  :class="logisticType == 'FTL' ? 'logistic_type_active' : ''"
                  @click="logisticType = 'FTL'"
                >
                  {{ $t("booking.FTL") }}
                </div>
                <div
                  class="logistic_type_item"
                  :class="logisticType == 'LTL' ? 'logistic_type_active' : ''"
                >
                  {{ $t("booking.LTL") }}
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="truckgroup" v-if="logisticType == 'FTL'">
              <!-- <el-select
                v-model="searchForm.truckCategory"
                class="innerInp"
                :placeholder="$t('placeholder.pleaseChoose')"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select> -->
              <svg-icon
                icon-class="booking_car"
                class-name="truck_type_label"
                slot="label"
              ></svg-icon>
              <div class="truck_type">
                <div
                  v-for="(item, i) in categoryList"
                  :key="i"
                  @click="searchForm.truckgroup = item.key"
                  class="truck_type_item"
                  :class="
                    searchForm.truckgroup == item.key
                      ? 'truck_type_item_active'
                      : ''
                  "
                >
                  <span>{{ $t(`${item.value}`) }}</span>
                  <el-popover
                    placement="right-start"
                    title="标题"
                    width="200"
                    trigger="click"
                    content=""
                  >
                    <svg-icon
                      icon-class="booking_eye"
                      class-name="truck_type_item_svg"
                      slot="reference"
                    ></svg-icon>
                  </el-popover>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="logisticType == 'FTL'">
              <el-select
                v-model="searchForm.truckSubCategory"
                class="inputWidth"
                :placeholder="$t('placeholder.pleaseChoose')"
              >
                <el-option
                  v-for="item in subCategoryList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpRegion" style="position:relative;">
              <svg-icon
                icon-class="booking_pickup"
                class-name="pick_up_label"
                slot="label"
              ></svg-icon>
              <div class="el_item">
                <el-select
                  v-model="searchForm.pickUpRegion"
                  filterable
                  remote
                  reserve-keyword
                  class="inputWidth"
                  @change="pickUpChange"
                  v-el-select-loadmore="loadmore"
                  :placeholder="$t('booking.pickupPoint')"
                  :remote-method="pickUpMethod"
                  @focus="clearSelect('pk')"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in pickUpRegionList"
                    :key="item.code"
                    :label="item.fullname"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
                <div class="el_item_icon" @click="getCurLocation">
                  <svg-icon
                    icon-class="booking_location"
                    class-name="pick_up_location_svg"
                    slot="suffix"
                  ></svg-icon>
                </div>
              </div>
              <div class="down_icon">
                <div class="jt"></div>
              </div>
            </el-form-item>
            <el-form-item prop="deliveryRegion">
              <svg-icon
                icon-class="booking_delivery"
                class-name="pick_up_label"
                slot="label"
              ></svg-icon>
              <el-select
                v-model="searchForm.deliveryRegion"
                filterable
                remote
                reserve-keyword
                @change="deliveryChange"
                @focus="clearSelect('del')"
                class="inputWidth"
                v-el-select-loadmore="loadmore"
                :placeholder="$t('booking.deliveryPoint')"
                :remote-method="pickUpMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in delRegionList"
                  :key="item.code"
                  :label="item.fullname"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpDate">
              <i
                class="el-icon-time"
                slot="label"
                style="font-size:22px;color:#8a8a8a;"
              ></i>
              <div style="display:flex;" class="inputWidth">
                <el-cascader
                  v-model="dateCascader"
                  class="innerInp"
                  :options="options"
                  :props="props"
                  separator="-"
                  style="margin-right:5px;"
                  :placeholder="$t('booking.pickupTime')"
                  @change="dateChange"
                ></el-cascader>
                <el-time-picker
                  v-model="time"
                  format="HH:mm:ss"
                  class="innerInp"
                  value-format="HH:mm:ss"
                  :placeholder="$t('placeholder.chooseTime')"
                >
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item v-if="logisticType == 'LTL'">
              <svg-icon
                icon-class="booking_cargo"
                class-name="cargo_label"
                slot="label"
              ></svg-icon>
              <div class="el_item">
                <el-input
                  type="text"
                  :placeholder="$t('booking.cargoList')"
                  class="inputWidth"
                />
                <div class="el_item_icon" @click="cargoListDialog = true">
                  <i class="el-icon-edit cargo_edit"></i>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="btn_item">
                <el-button
                  type="primary"
                  style="width:160px;"
                  @click="searchSupply"
                  :loading="searchloading"
                  >{{ $t("booking.searchSupply") }}</el-button
                >
              </div>
              <div v-if="logisticType == 'FTL'">
                <div class="btn_item" v-if="showDisInfo">
                  <div class="search_res">
                    <div class="search_res_item">
                      <span class="item_name">{{
                        $t("resources.distance")
                      }}</span>
                      <span class="item_con">{{
                        disInfo.distance + $t("booking.distance")
                      }}</span>
                    </div>
                    <div class="search_res_item">
                      <span class="item_name">{{
                        $t("resources.transitTime")
                      }}</span>
                      <span class="item_con">{{
                        disInfo.days + $t("booking.days")
                      }}</span>
                    </div>
                    <div class="search_res_item">
                      <span class="item_name">{{ $t("booking.supply") }}</span>
                      <span class="item_con">{{ tableList.length }}</span>
                    </div>
                  </div>
                </div>
                <div class="btn_item" v-if="showDisInfo">
                  <el-button
                    type="primary"
                    style="width:160px;"
                    @click="hideMap"
                    >{{ $t("booking.bookingNow") }}</el-button
                  >
                </div>
                <div class="btn_item">
                  <el-button
                    type="primary"
                    style="width:160px;"
                    @click="$router.push('/booking/releaseToMarket')"
                    >{{ $t("booking.releaseToMarket") }}</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18" style="height:100%;overflow:scroll;">
        <div style="height:100%;" :class="!mapMode ? 'hideMap' : ''">
          <div id="map"></div>
          <div id="content" v-if="mapMode">
            <div>
              <img src="../../assets/image/truckIcon.png" class="truck-icon" />
            </div>
            <div>
              <div>{{ disInfo.days + $t("booking.days") }}</div>
              <div>{{ disInfo.distance + $t("booking.distance") }}</div>
            </div>
          </div>
        </div>
        <div v-if="!mapMode">
          <el-table :data="tableList" border style="width: 97%;">
            <el-table-column :label="$t('booking.supply')" align="center">
              <template slot-scope="scope">
                <div>
                  <div>{{ scope.row.supply ? scope.row.supply.name : "" }}</div>
                  <div>
                    <el-rate
                      v-model="scope.row.supply.avgRating / 2"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}"
                    >
                    </el-rate>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('booking.route')">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.fromProvince }} -->
                  {{ scope.row.toProvinceName }}
                </div>
                <div>
                  <!-- {{$t('booking.transitTime')}} :  -->
                  {{ scope.row.transitTime }} days
                </div>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              :label="$t('booking.truckType')"
            >
              <template slot-scope="scope">
                <div class="cantouch" @click="previewImg(scope.row)">
                  <div>{{ truckObj[scope.row.category] }}</div>
                  <div>{{ subObj[scope.row.subCategory] }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              :label="$t('booking.valueAddedService')"
            >
              <template slot-scope="scope">
                <div>
                  <div>
                    {{ $t("booking.loading") }}/{{ $t("booking.unloading") }} :
                    <i
                      :class="
                        scope.row.supportLoading == 1
                          ? 'el-icon-check'
                          : 'el-icon-close'
                      "
                    ></i>
                  </div>
                  <div>
                    {{ $t("booking.documentReturn") }} :
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('booking.price')">
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
                  <el-button
                    type="primary"
                    :disabled="!permissions.DemandNewOrderOrRelease"
                    @click="toBooking(scope.row)"
                    >{{ $t("booking.placeOrder") }}</el-button
                  >
                </div>
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
      </el-col>
    </el-row>
    <el-dialog :visible.sync="previewDialog">
      <div>
        <el-carousel arrow="always" height="600px" :autoplay="false">
          <el-carousel-item
            v-for="item in previewImgList"
            style="text-align:center;"
            :key="item"
          >
            <el-image
              :src="item"
              style="height:600px;"
              fit="contain"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="cargoListDialog"
      :title="$t('booking.cargoList')"
      width="70%"
      center
    >
      <el-table :data="cargoTip" border>
        <el-table-column prop="unit" width="130"></el-table-column>
        <el-table-column prop="ss" label="Size-SS"></el-table-column>
        <el-table-column prop="s" label="Size-S"></el-table-column>
        <el-table-column prop="m" label="Size-M"></el-table-column>
        <el-table-column prop="l" label="Size-L"></el-table-column>
        <el-table-column prop="xl" label="Size-XL"></el-table-column>
        <el-table-column prop="eSize" label="Extra size"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" style="width:250px;">{{
          $t("booking.confirm")
        }}</el-button>
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
let map, infoWindow;

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
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
  data() {
    const self = this;
    const validatorTruck = (rule, value, callback) => {
      if (!self.searchForm.truckgroup) {
        callback(new Error(self.$t("booking.truckTypechoose")));
      } else {
        callback();
      }
    };
    const validatorDel = (rule, value, callback) => {
      if (!self.searchForm.deliveryRegion) {
        callback(new Error(" "));
      } else {
        callback();
      }
    };
    const validatorPick = (rule, value, callback) => {
      if (!self.searchForm.pickUpRegion) {
        callback(new Error(" "));
      } else {
        callback();
      }
    };
    const validatorDate = (rule, value, callback) => {
      if (!self.searchForm.pickUpDate) {
        callback(new Error(" "));
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
        pickUpRegion: "",
        truckgroup: ""
      },
      searchRules: {
        deliveryRegion: [{ required: true, message: " " }],
        pickUpRegion: [{ required: true, message: " " }],
        pickUpDate: [{ required: true, message: " " }],
        // truckCategory: [{ required: true, validator: validatorTruck }]
        truckgroup: [{ required: true, validator: validatorTruck }]
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
      categoryList: [
        {
          key: "4",
          value: "booking.4_wheel"
        },
        {
          key: "6",
          value: "booking.6_wheel"
        },
        {
          key: "10",
          value: "booking.10_wheel"
        },
        {
          key: "12",
          value: "booking.12_wheel"
        },
        {
          key: "18",
          value: "booking.18_wheel"
        },
        {
          key: "22",
          value: "booking.22_wheel"
        }
      ],
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
        lazyLoad(node, resolve) {
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
      previewDialog: false,
      disInfo: {
        distance: "0",
        days: "0"
      },
      mapMode: false,
      showDisInfo: false,
      mapStart: "", //地图起始点
      mapEnd: "", //地图终点
      cargoListDialog: false,
      cargoTip: [
        {
          unit: "Dimension(cm)",
          ss: "0.01-90",
          s: "90.01-110",
          m: "110.01-130",
          l: "130.01-150",
          xl: "150.01-170",
          eSize: ">170.00"
        },
        {
          unit: "Weight(kg)",
          ss: "0.01-10",
          s: "10.01-20",
          m: "20.01-30",
          l: "30.01-40",
          xl: "40.01-50",
          eSize: ">50"
        }
      ]
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"])
  },
  // 监控data中的数据变化
  watch: {
    "$store.getters.language"() {
      self.init();
    }
  },
  created() {
    self = this;
  },
  mounted() {
    self.init();
    self.initMaps();
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
    initMaps(cb) {
      try {
        google;
      } catch (e) {
        return this.$notify({
          title: "Warning",
          message:
            "Google map load failed,Please check your network and try to refresh the page.",
          type: "warning",
          duration: 7000
        });
      }
      let chicago = new google.maps.LatLng(41.850033, -87.6500523);

      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        //设置地图中心点
        center: chicago,
        //为了关闭默认控件集,设置地图的disableDefaultUI的属性为true
        disableDefaultUI: true,
        // 启用缩放和平移
        gestureHandling: "greedy"
      });
      infoWindow = new google.maps.InfoWindow();

      if (cb) {
        cb();
      }
    },
    getDis(start, end, truckType) {
      self.mapMode = true;
      if (!map) {
        return self.initMaps(self.getDis(start, end, truckType));
      }

      let directionsService = new google.maps.DirectionsService();
      let directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      let request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING",
        unitSystem: google.maps.DirectionsUnitSystem.METRIC
      };
      directionsService.route(request, function(result, status) {
        if (status == "OK") {
          let distance = parseInt(
            result.routes[0].legs[0].distance.value / 1000
          );
          let middleStep =
            result.routes[0].overview_path[
              parseInt(result.routes[0].overview_path.length / 2)
            ];

          directionsRenderer.setDirections(result);

          // 卡车速度
          let speed;
          if (truckType == 4) {
            speed = 70;
          } else if (truckType == 6 || truckType == 10 || truckType == 12) {
            speed = 60;
          } else if (truckType == 18 || truckType == 22) {
            speed = 50;
          } else {
            return self.$message.error("Truck type ERROR!");
          }

          // 休息次数
          let count = parseInt(distance / 400);
          if (count != 0 && count % 400 == 0) {
            count--;
          }
          // 运输天数
          let day = parseInt((distance / speed + count * 0.5) / 12);
          if (day < 1) {
            day = 1;
          }

          self.disInfo = {
            distance: distance,
            days: day
          };

          // infoWindow样式悬浮框
          // let contentString = '<div class="info-box">' +
          //   '<div>123' +
          //   '</div>' +
          //   '</div>'
          // let infoWindow = new google.maps.InfoWindow({
          //   content: contentString,
          //   position: middleStep
          // })
          // infoWindow.open(map)

          let Popup = self.createPopupClass();
          let popup = new Popup(middleStep, document.getElementById("content"));
          popup.setMap(map);
        }
      });
    },
    hideMap() {
      self.mapMode = false;
    },
    // 获取当前位置
    getLocation() {
      return new Promise(resolve => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              resolve(self.geocodeLatLng(pos));
            },
            function() {
              self.$notify({
                title: "Warning",
                message:
                  "Can't get Browser Location,Please check your browser setting.",
                type: "warning",
                duration: 5000
              });
              // self.handleLocationError(true, infoWindow, map.getCenter())
              resolve();
            }
          );
        } else {
          self.$notify({
            title: "Warning",
            message:
              "Can't get Browser Location,Please check your browser setting.",
            type: "warning",
            duration: 5000
          });
          // self.handleLocationError(true, infoWindow, map.getCenter())
          resolve();
        }
      });
    },
    geocodeLatLng(pos) {
      return new Promise(resolve => {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, function(results, status) {
          if (status === "OK") {
            if (results[0]) {
              let arr = [];
              let addressInfo = {};
              for (let i of results) {
                arr.push(...i.address_components);
              }
              for (let i of arr) {
                if (i.types.indexOf("country") > -1) {
                  addressInfo["country"] = i.long_name;
                } else if (
                  i.types.indexOf("administrative_area_level_1") > -1
                ) {
                  addressInfo["administrative_area_level_1"] = i.long_name;
                } else if (
                  i.types.indexOf("administrative_area_level_2") > -1
                ) {
                  addressInfo["administrative_area_level_2"] = i.long_name;
                } else if (i.types.indexOf("sublocality_level_1") > -1) {
                  addressInfo["sublocality_level_1"] = i.long_name;
                } else if (i.types.indexOf("sublocality_level_2") > -1) {
                  addressInfo["sublocality_level_2"] = i.long_name;
                } else if (i.types.indexOf("postal_code") > -1) {
                  addressInfo["postalCode"] = i.long_name;
                }
              }
              resolve(addressInfo);
            } else {
              this.$notify({
                title: "Warning",
                message:
                  "Failed to locate. Check to see if browser permissions are granted.",
                type: "warning",
                duration: 5000
              });
              resolve();
            }
          } else {
            this.$notify({
              title: "Warning",
              message: "Geocoder failed due to: " + status,
              type: "warning",
              duration: 5000
            });
            resolve();
          }
        });
      });
    },
    // 取当前位置发生错误报错
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(self.map);
    },
    // 创建popup
    createPopupClass() {
      /**
       * A customized popup on the map.
       * @param {!google.maps.LatLng} position
       * @param {!Element} content The bubble div.
       * @constructor
       * @extends {google.maps.OverlayView}
       */
      function Popup(position, content) {
        this.position = position;

        content.classList.add("popup-bubble");

        // This zero-height div is positioned at the bottom of the bubble.
        var bubbleAnchor = document.createElement("div");
        bubbleAnchor.classList.add("popup-bubble-anchor");
        bubbleAnchor.appendChild(content);

        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement("div");
        this.containerDiv.classList.add("popup-container");
        this.containerDiv.appendChild(bubbleAnchor);

        // Optionally stop clicks, etc., from bubbling up to the map.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(
          this.containerDiv
        );
      }
      // ES5 magic to extend google.maps.OverlayView.
      Popup.prototype = Object.create(google.maps.OverlayView.prototype);

      /** Called when the popup is added to the map. */
      Popup.prototype.onAdd = function() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
      };

      /** Called when the popup is removed from the map. */
      Popup.prototype.onRemove = function() {
        if (this.containerDiv.parentElement) {
          this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
      };

      /** Called each frame when the popup needs to draw itself. */
      Popup.prototype.draw = function() {
        var divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        );

        // Hide the popup when it is far out of view.
        var display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";

        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px";
          this.containerDiv.style.top = divPosition.y + "px";
        }
        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
      };

      return Popup;
    },
    init() {
      getTruckType().then(res => {
        // self.categoryList = res.data.categories;
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
        let obj = {};
        obj = self.pickUpRegionList.find(item => {
          return item.code === self.searchForm.pickUpRegion;
        });
        let arr = obj.fullname.split("-");
        self.mapStart = arr[1] + arr[0];
        let obj2 = {};
        obj2 = self.delRegionList.find(item => {
          return item.code === self.searchForm.deliveryRegion;
        });
        let arr2 = obj2.fullname.split("-");
        self.mapEnd = arr2[1] + arr2[0];
        self.searchSupply();
      }
    },
    toBooking(row) {
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
    pickUpMethod(query) {
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
    loadmore() {
      if (!self.isLast) {
        self.regionPage += 1;
        if (self.curSelect == "pk") {
          self.getdistrictFullList(self.pickUpQuery, self.regionPage);
        } else {
          self.getdistrictFullList(self.delQuery, self.regionPage);
        }
      }
    },
    getdistrictFullList(query, page) {
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
    clearSelect(type) {
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
    searchSupply() {
      console.log("2222");
      console.log(self.searchForm);
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
            })
              .then(res => {
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
              })
              .catch(el => {
                self.searchloading = false;
              });
          }

          self.getDis(self.mapStart, self.mapEnd, self.searchForm.truckgroup);
          self.showDisInfo = true;
        }
      });
    },
    pageChange(val) {
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
    pageSizeChange(val) {
      self.pagesize = val;
      self.searchSupply();
    },
    dateChange(e) {
      self.searchForm.pickUpDate = `${e[0]}-${e[1]}-${e[2]}`;
    },
    previewImg(row) {
      let arr = [];
      for (let i of row.truckResource) {
        arr.push(i.path);
      }
      self.previewImgList = arr;
      self.previewDialog = true;
    },
    pickUpChange(val) {
      console.log(val);
      let obj = {};
      obj = self.pickUpRegionList.find(item => {
        return item.code === val;
      });
      let arr = obj.fullname.split("-");
      self.mapStart = arr[1] + arr[0];
      console.log(self.mapStart);
    },
    deliveryChange(val) {
      console.log(val);
      let obj = {};
      obj = self.delRegionList.find(item => {
        return item.code === val;
      });
      let arr = obj.fullname.split("-");
      self.mapEnd = arr[1] + arr[0];
      console.log(self.mapEnd);
    },
    getCurLocation() {
      self.getLocation().then(res => {
        console.log(res);
        let query = res.postalCode;
        self.curSelect = "pk";
        self.regionPage = 0;
        self.isLast = false;
        findDistrictFullList({
          name: query,
          page: self.regionPage
        }).then(res => {
          if (res.data.content.length > 0) {
            self.pickUpRegionList = res.data.content;
            self.searchForm.pickUpRegion = self.pickUpRegionList[0].code;
          } else {
            self.$message.error("No result");
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  margin-top: -20px;
  box-sizing: border-box;
  padding-left: 20px;

  .logistic_type {
    width: 100%;
    display: flex;

    .logistic_type_item {
      cursor: pointer;
      width: 49%;
      height: 35px;
      text-align: center;
      border: 1px solid #ccc;
      color: #1e1e1e;
      font-size: 12px;

      &:first-child {
        margin-right: 2%;
      }
    }

    .logistic_type_active {
      background: red;
      color: #fff;
      font-weight: 600;
    }
  }

  .truck_type_label {
    width: 35px;
    height: 35px;
    transform: rotateY(180deg);
  }

  .pick_up_label {
    width: 22px;
    height: 22px;
  }

  .cargo_label {
    width: 27px;
    height: 27px;
  }

  .truck_type {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .truck_type_item {
      width: 49%;
      height: 40px;
      line-height: 40px;
      color: #1e1e1e;
      border-radius: 5px;
      border: 1px solid #ccc;
      background: #fff;
      margin-bottom: 2%;
      font-size: 12px;
      cursor: pointer;
      padding: 0 10px 0 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:nth-child(2n) {
        margin-left: 2%;
      }
    }

    .truck_type_item_svg {
      width: 18px;
      height: 18px;
    }

    .truck_type_item_active {
      border-color: red;
      color: red;
      font-weight: 600;
    }
  }

  .el_item {
    position: relative;

    .el_item_icon {
      position: absolute;
      right: 0;
      z-index: 1;
      width: 35px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;

      .pick_up_location_svg {
        width: 20px;
        height: 20px;
      }

      .cargo_edit {
        font-size: 20px;
        color: #45a3df;
      }
    }
  }

  .btn_item {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    .search_res {
      width: 100%;
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fff;
      padding: 10px 0;
      box-sizing: border-box;

      .search_res_item {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        font-size: 14px;

        .item_name {
          width: 45%;
          text-align: right;
          color: #999;
          margin-right: 10%;
        }

        .item_con {
          color: #333;
        }
      }
    }
  }

  .searchBox {
    height: 100%;
    overflow: visible;
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

  .down_icon {
    height: 15px;
    width: 1px;
    border-right: 1px dotted #8a8a8a;
    position: absolute;
    left: -24px;
    top: 32px;

    .jt {
      position: absolute;
      bottom: 0;
      left: -2.5px;
      height: 5px;
      width: 5px;
      border-top: 1px solid #8a8a8a;
      border-right: 1px solid #8a8a8a;
      transform: rotate(135deg);
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

#map {
  height: 100%;
}

#content {
  display: flex;
  font-size: 16px;

  .truck-icon {
    height: 40px;
    margin-right: 10px;
  }
}

.hideMap {
  height: 0 !important;
  width: 0;
  overflow: hidden;
}
</style>
<style>
/* The popup bubble styling. */
.popup-bubble {
  /* Position the bubble centred-above its parent. */
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
  /* Style the bubble. */
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  font-family: sans-serif;
  overflow-y: auto;
  max-height: 60px;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.5);
}
/* The parent of the bubble. A zero-height div at the top of the tip. */
.popup-bubble-anchor {
  /* Position the div a fixed distance above the tip. */
  position: absolute;
  width: 100%;
  bottom: /* TIP_HEIGHT= */ 8px;
  left: 0;
}
/* This element draws the tip. */
.popup-bubble-anchor::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  /* Center the tip horizontally. */
  transform: translate(-50%, 0);
  /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
  width: 0;
  height: 0;
  /* The tip is 8px high, and 12px wide. */
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: /* TIP_HEIGHT= */ 8px solid white;
}
/* JavaScript will position this div at the bottom of the popup tip. */
.popup-container {
  cursor: auto;
  height: 0;
  position: absolute;
  /* The max width of the info window. */
  width: 200px;
}

.Consulte .el-form-item__label {
  text-align: right;
  display: flex;
  align-items: center;
  height: 32px;
  justify-content: flex-end;
}
</style>
