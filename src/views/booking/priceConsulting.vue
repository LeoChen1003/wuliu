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
            <!-- 物流类型 -->
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
                  @click="changeLogisticType('FTL')"
                >
                  {{ $t("booking.FTL") }}
                </div>
                <div
                  class="logistic_type_item"
                  :class="logisticType == 'LTL' ? 'logistic_type_active' : ''"
                  @click="changeLogisticType('LTL')"
                >
                  {{ $t("booking.LTL") }}
                </div>
              </div>
            </el-form-item>
            <!-- FTL 车型选择 -->
            <el-form-item prop="truckgroup" v-show="logisticType == 'FTL'">
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
                style="font-size:35px;transform: rotateY(180deg);"
                slot="label"
              ></svg-icon>
              <div class="truck_type">
                <div
                  v-for="(item, i) in categoryList"
                  :key="i"
                  @click="searchForm.truckgroup = item.key"
                  class="truck_type_item"
                  :class="searchForm.truckgroup == item.key ? 'truck_type_item_active' : ''"
                >
                  <span>{{ $t(`${item.value}`) }}</span>
                  <el-popover placement="right-start" width="404" trigger="click" popper-class="truck_type_popover">
                    <div>
                      <div style="" class="truck_type_detail_title">
                        {{ $t(`${item.value}`) }}
                      </div>
                      <div class="truck_type_detail">
                        <div
                          class="truck_type_dec"
                          v-if="!searchForm.truckSubCategory || searchForm.truckSubCategory == 'Corral'"
                        >
                          <div class="truck_type_img">
                            <img
                              :src="item.image_Corral ? require(`../../assets/image/${item.image_Corral}`) : ''"
                              alt="image_Corral"
                            />
                          </div>
                          <div v-for="(truckItem, x) in item.typeList" :key="x">
                            <div v-if="truckItem.type == 'type_Corral'" class="truck_type_dec_item">
                              <div class="truck_type_dec_item_right">
                                <div class="name">
                                  {{ $t(`booking.${truckItem.truck}`) }}
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckWidth") }}</span>
                                  <span class="number">{{ truckItem.width }} m</span>
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckLength") }}</span>
                                  <span class="number">{{ truckItem.length }} m</span>
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckHeight") }}</span>
                                  <span class="number">{{ truckItem.height }} m</span>
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckVolume") }}</span>
                                  <span class="number">{{ truckItem.volume }} m³</span>
                                </div>
                              </div>
                              <div class="truck_type_dec_item_left">
                                <div class="number">
                                  <span v-if="truckItem.isOver">{{ $t("booking.noMoreThan") }}</span>
                                  {{ truckItem.weight }} kg
                                </div>
                                <div>{{ $t("booking.truckMax") }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="truck_type_dec"
                          v-if="!searchForm.truckSubCategory || searchForm.truckSubCategory == 'SolidCabinet'"
                        >
                          <div class="truck_type_img">
                            <img
                              :src="item.image_Solid ? require(`../../assets/image/${item.image_Solid}`) : ''"
                              alt="image_Solid"
                            />
                          </div>
                          <div v-for="(truckItem, x) in item.typeList" :key="x">
                            <div v-if="truckItem.type == 'type_Solid'" class="truck_type_dec_item">
                              <div class="truck_type_dec_item_right">
                                <div class="name">
                                  {{ $t(`booking.${truckItem.truck}`) }}
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckWidth") }}</span>
                                  <span class="number">{{ truckItem.width }} m</span>
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckLength") }}</span>
                                  <span class="number">{{ truckItem.length }} m</span>
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckHeight") }}</span>
                                  <span class="number">{{ truckItem.height }} m</span>
                                </div>
                                <div>
                                  <span class="unit">{{ $t("booking.truckVolume") }}</span>
                                  <span class="number">{{ truckItem.volume }} m³</span>
                                </div>
                              </div>
                              <div class="truck_type_dec_item_left">
                                <div class="number">
                                  <span v-if="truckItem.isOver">{{ $t("booking.noMoreThan") }}</span>
                                  {{ truckItem.weight }} kg
                                </div>
                                <div>{{ $t("booking.truckMax") }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <svg-icon
                      icon-class="booking_eye"
                      class-name="truck_type_item_svg"
                      style="font-size:18px;"
                      slot="reference"
                    ></svg-icon>
                  </el-popover>
                </div>
              </div>
            </el-form-item>
            <!-- FTL 车厢选择 -->
            <el-form-item v-show="logisticType == 'FTL'">
              <el-select v-model="searchForm.truckSubCategory" class="inputWidth" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option v-for="item in subCategoryList" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <!-- 始发地 -->
            <el-form-item prop="pickUpRegion" style="position:relative;">
              <svg-icon icon-class="booking_pickup" class-name="pick_up_label" style="font-size:22px;" slot="label"></svg-icon>
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
                  <el-option v-for="item in pickUpRegionList" :key="item.code" :label="item.fullname" :value="item.code">
                  </el-option>
                </el-select>
                <div
                  class="el_item_icon"
                  @click="getCurLocation"
                  v-loading="locationLoading"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0)"
                >
                  <svg-icon
                    v-if="!locationLoading"
                    icon-class="booking_location"
                    class-name="pick_up_location_svg"
                    style="font-size:20px;"
                    slot="suffix"
                  ></svg-icon>
                </div>
              </div>
              <div class="down_icon">
                <div class="jt"></div>
              </div>
            </el-form-item>
            <!-- 目的地 -->
            <el-form-item prop="deliveryRegion">
              <svg-icon icon-class="booking_delivery" class-name="pick_up_label" style="font-size:22px;" slot="label"></svg-icon>
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
                <el-option v-for="item in delRegionList" :key="item.code" :label="item.fullname" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpDate">
              <i class="el-icon-time" slot="label" style="font-size:22px;color:#8a8a8a;"></i>
              <div style="display:flex;" class="inputWidth">
                <bc-picker @changeBCtime="dateChange" style="margin-right:5px;width:50%;" :timeType="''" :dateString="today" />
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
            <el-form-item v-show="logisticType == 'LTL'" prop="propertyList">
              <svg-icon icon-class="booking_cargo" class-name="cargo_label" style="font-size:27px;" slot="label"></svg-icon>
              <div class="el_item edit_input">
                <el-input
                  type="text"
                  :value="searchForm.propertyListContent"
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
                <el-button type="primary" style="width:160px;" @click="searchSupply" :loading="searchloading">{{
                  $t("booking.searchSupply")
                }}</el-button>
              </div>
              <div v-if="logisticType == 'FTL'">
                <div class="btn_item" v-if="showDisInfo">
                  <div class="search_res">
                    <div class="search_res_item">
                      <span class="item_name">{{ $t("resources.distance") }}</span>
                      <span class="item_con">{{ disInfo.distance + $t("booking.distance") }}</span>
                    </div>
                    <div class="search_res_item">
                      <span class="item_name">{{ $t("resources.transitTime") }}</span>
                      <span class="item_con">{{ disInfo.days + $t("booking.days") }}</span>
                    </div>
                    <div class="search_res_item">
                      <span class="item_name">{{ $t("booking.supply") }}</span>
                      <span class="item_con">{{ tableList.length }}</span>
                    </div>
                  </div>
                </div>
                <div class="btn_item" v-if="showDisInfo">
                  <el-button type="primary" style="width:160px;" @click="hideMap">{{ $t("booking.bookingNow") }}</el-button>
                </div>
                <div class="btn_item">
                  <el-button type="primary" style="width:160px;" @click="toMarket">{{ $t("booking.releaseToMarket") }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18" style="height:100%;overflow:scroll;">
        <div style="height:100%;" :class="!mapMode ? 'hideMap' : ''">
          <div id="map"></div>
          <div id="content">
            <img src="../../assets/image/truckIcon.png" alt="image" class="truck-icon" />
            <div>
              <div>{{ disInfo.days + $t("booking.days") }}</div>
              <div>{{ disInfo.distance + $t("booking.distance") }}</div>
            </div>
          </div>
        </div>
        <div v-if="!mapMode">
          <el-table :data="tableList" border style="width: 97%;">
            <el-table-column :label="$t('booking.supply')" align="center">
              <template slot-scope="scope" v-if="scope.row.supply">
                <div>
                  <div>{{ scope.row.supply ? scope.row.supply.name : "" }}</div>
                  <div>
                    <el-rate v-model="scope.row.supply.avgRating / 2" disabled text-color="#ff9900" score-template="{value}">
                    </el-rate>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('booking.route')">
              <template slot-scope="scope">
                <div v-if="logisticType == 'FTL'">
                  <div>
                    {{ scope.row.fromProvince }} -->
                    {{ scope.row.toProvinceName }}
                  </div>
                  <div>
                    <!-- {{$t('booking.transitTime')}} :  -->
                    {{ scope.row.transitTime }} days
                  </div>
                </div>
                <div v-else>
                  <div>LTL</div>
                  <div>
                    <span>{{ scope.row.ltlLine.hubName }} --></span>
                    <span v-for="(lineItem, z) in scope.row.ltlLine.ltlLineProvinceList" :key="z">
                      {{ lineItem.provinceName }} -->
                    </span>
                    <span>{{ scope.row.ltlLine.hubName }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="logisticType == 'FTL' ? $t('booking.truckType') : $t('booking.cutOffTime')">
              <template slot-scope="scope">
                <div v-if="logisticType == 'FTL'">
                  <div class="cantouch" @click="previewImg(scope.row)">
                    <div>{{ truckObj[scope.row.category] }}</div>
                    <div>{{ subObj[scope.row.subCategory] }}</div>
                  </div>
                </div>
                <div v-else style="color:#169BD5;">{{ scope.row.ltlLine.cutOffTime }}</div>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :label="$t('booking.valueAddedService')">
              <template slot-scope="scope">
                <div v-if="logisticType == 'FTL'">
                  <div>
                    {{ $t("booking.loading") }}/{{ $t("booking.unloading") }} :
                    <i :class="scope.row.supportLoading == 1 ? 'el-icon-check' : 'el-icon-close'"></i>
                  </div>
                  <div>
                    {{ $t("booking.documentReturn") }} :
                    <i class="el-icon-check"></i>
                  </div>
                </div>
                <div v-else>
                  <div>
                    {{ $t("booking.documentReturn") }} :
                    <i class="el-icon-check"></i>
                  </div>
                  <div>
                    {{ $t("booking.printSticker") }} :
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('booking.price')">
              <template slot-scope="scope">
                {{ logisticType == "FTL" ? scope.row.charge : scope.row.money }}
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
                    :disabled="!permissions.DemandNewOrderOrRelease || (scope.row.check && scope.row.check == 'false')"
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
          <el-carousel-item v-for="item in previewImgList" style="text-align:center;" :key="item">
            <el-image :src="item" style="height:600px;" fit="contain"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <!-- 货物清单 -->
    <el-dialog :visible.sync="cargoListDialog" :title="$t('booking.cargoList')" width="1250px" center>
      <!-- size 说明 -->
      <el-table :data="cargoTip" border style="width:730px;margin-bottom:20px;">
        <el-table-column width="130">
          <template slot-scope="scope">{{ $t(`booking.${scope.row.unit}`) }}</template>
        </el-table-column>
        <el-table-column prop="ss" label="Size-SS" width="100"></el-table-column>
        <el-table-column prop="s" label="Size-S" width="100"></el-table-column>
        <el-table-column prop="m" label="Size-M" width="100"></el-table-column>
        <el-table-column prop="l" label="Size-L" width="100"></el-table-column>
        <el-table-column prop="xl" label="Size-XL" width="100"></el-table-column>
        <el-table-column prop="eSize" label="Extra size" width="100"></el-table-column>
      </el-table>
      <!-- 清单列表 -->
      <div style="display:flex;align-items: flex-end;">
        <el-form ref="cargoform" :model="searchForm" :rules="cargoRules" :show-message="false" style="width:95%;">
          <el-form-item prop="propertyList">
            <el-table border :data="searchForm.propertyList">
              <el-table-column prop="propertyType" :label="$t('booking.cargoType')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.propertyType" :placeholder="$t('placeholder.pleaseChoose')">
                    <el-option v-for="item in propertyTypeList" :key="item.key" :label="item.trans" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('booking.commodity')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="number" :label="$t('booking.qty')">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unit" :label="$t('booking.unit')">
                <template slot-scope="scope">
                  <el-select :placeholder="$t('placeholder.pleaseChoose')" v-model="scope.row.unit">
                    <el-option v-for="item in unitList" :key="item.key" :label="item.trans" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="sizeType" :label="$t('booking.size')">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sizeType"
                    :placeholder="$t('placeholder.pleaseChoose')"
                    @change="val => sizeSelect(val, scope.$index)"
                  >
                    <el-option v-for="item in sizeTypeList" :key="item.key" :label="item.trans" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="wide" :label="$t('booking.width')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.wide"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.wide, scope.$index, 'wide')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="length" :label="$t('booking.Length')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.length"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.length, scope.$index, 'length')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="high" :label="$t('booking.height')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.high"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.high, scope.$index, 'high')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="weightOfEach" :label="$t('booking.weight')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.weightOfEach"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumfloat(scope.row.weightOfEach, scope.$index, 'weightOfEach')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column width="50" align="center">
                <template slot-scope="scope">
                  <div class="table-op">
                    <div @click="delIt(scope.row, scope.$index)">
                      <i
                        class="el-icon-delete"
                        :style="searchForm.propertyList.length > 1 ? 'color:#F25C5C;' : 'color: #ccc;cursor: no-drop;'"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 30px;margin-left: 10px;">
          <el-button type="primary" icon="el-icon-plus" circle @click="pushIt" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" style="width:250px;" @click="propertyListConfirm">{{ $t("booking.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex";
import { ftlLine, ftlLines, ltlLine } from "../../api/booking";
import { getTruckType, findDistrictFullList, findDistrictOfHubFullList, getGoodsProperty } from "../../api/data";
import { getBcTime, getTime, parseTime } from "../../utils/index";
import Search from "@/components/HeaderSearch";

let self;
let map, infoWindow, directionsService, directionsRenderer;

export default {
  // import引入的组件需要注入到对象中才能使用
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  data() {
    const self = this;
    const validatorTruck = (rule, value, callback) => {
      if (!self.searchForm.truckgroup && self.logisticType == "FTL") {
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
    const validatorPropertyList = (rule, value, callback) => {
      for (let x in value) {
        if (
          !value[x].propertyType ||
          !value[x].name ||
          !value[x].number ||
          !value[x].unit ||
          !value[x].sizeType ||
          (value[x].sizeType &&
            value[x].sizeType == "EXTRA_SIZE" &&
            (!value[x].weightOfEach || !value[x].high || !value[x].length || !value[x].wide))
        ) {
          callback(new Error(" "));
        } else if (x == value.length - 1) {
          callback();
        }
      }
    };
    const validatorPropertySearch = (rule, value, callback) => {
      if (self.searchForm.propertyListContent.length > 0 || self.logisticType == "FTL") {
        callback();
      } else {
        callback(new Error(" "));
      }
    };

    return {
      searchForm: {
        truckCategory: "",
        truckSubCategory: "",
        pickUpDate: getBcTime(parseTime(new Date().getTime(), "{y}-{m}-{d}")),
        deliveryRegion: "",
        pickUpRegion: "",
        truckgroup: "",
        propertyList: [{}],
        propertyListContent: "",
      },
      today: parseTime(new Date().getTime(), "{y}-{m}-{d}"),
      searchRules: {
        deliveryRegion: [{ required: true, message: " ", trigger: "change" }],
        pickUpRegion: [{ required: true, message: " ", trigger: "change" }],
        pickUpDate: [{ required: true, message: " ", trigger: "change" }],
        // truckCategory: [{ required: true, validator: validatorTruck }]
        truckgroup: [{ required: true, validator: validatorTruck }],
        propertyList: [{ required: true, trigger: "change", validator: validatorPropertySearch }],
      },
      cargoRules: {
        propertyList: [
          {
            required: true,
            trigger: "change",
            validator: validatorPropertyList,
          },
        ],
      },
      time: "",
      logisticType: "FTL",
      logisticTypeOption: [
        {
          value: "FTL",
          label: "FTL",
        },
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
          value: "booking.4_wheel",
          image_Corral: "4wheel-Corral.png",
          image_Solid: "4wheel-Solid cabinet.png",
          typeList: [
            {
              truck: "Normal_4",
              type: "type_Corral",
              width: "1.5",
              length: "2.2",
              height: "1.8",
              volume: "5.00-6.00",
              weight: "2,000",
              isOver: true,
            },
            {
              truck: "Normal_4",
              type: "type_Solid",
              width: "1.4",
              length: "2.2",
              height: "1.8",
              volume: "5.00-6.00",
              weight: "2,000",
              isOver: true,
            },
            {
              truck: "Big_4",
              type: "type_Corral",
              width: "1.7",
              length: "3",
              height: "2.2",
              volume: "10.00-12.00",
              weight: "2,500",
              isOver: true,
            },
            {
              truck: "Big_4",
              type: "type_Solid",
              width: "1.7",
              length: "3",
              height: "2.2",
              volume: "10.00-12.00",
              weight: "2,500",
              isOver: true,
            },
          ],
        },
        {
          key: "6",
          value: "booking.6_wheel",
          image_Corral: "6wheel-Corral.png",
          image_Solid: "6wheel-Solid cabinet.png",
          typeList: [
            {
              truck: "Short_6",
              type: "type_Corral",
              width: "2.1",
              length: "5",
              height: "2",
              volume: "20.00-25.00",
              weight: "8,000-9,500",
              isOver: false,
            },
            {
              truck: "Short_6",
              type: "type_Solid",
              width: "2.1",
              length: "5",
              height: "2.3",
              volume: "20.00-25.00",
              weight: "8,000-9,500",
              isOver: false,
            },
            {
              truck: "Normal_6",
              type: "type_Corral",
              width: "2.3",
              length: "6",
              height: "2",
              volume: "25.00-30.00",
              weight: "8,000-9,000",
              isOver: false,
            },
            {
              truck: "Normal_6",
              type: "type_Solid",
              width: "2.3",
              length: "6",
              height: "2.3",
              volume: "25.00-30.00",
              weight: "8,000-9,000",
              isOver: false,
            },
            {
              truck: "Long_6",
              type: "type_Corral",
              width: "2.3",
              length: "7",
              height: "2",
              volume: "30.00-35.00",
              weight: "8,000-9,000",
              isOver: false,
            },
            {
              truck: "Long_6",
              type: "type_Solid",
              width: "2.3",
              length: "7",
              height: "2.4",
              volume: "30.00-35.00",
              weight: "8,000-9,000",
              isOver: false,
            },
          ],
        },
        {
          key: "10",
          value: "booking.10_wheel",
          image_Corral: "10wheel-Corral.png",
          image_Solid: "10wheel-Solid cabinet.png",
          typeList: [
            {
              truck: "Normal_10",
              type: "type_Corral",
              width: "2.3",
              length: "6.5",
              height: "2",
              volume: "30.00-35.00",
              weight: "15,000-16,000",
              isOver: false,
            },
            {
              truck: "Normal_10",
              type: "type_Solid",
              width: "2.3",
              length: "6.5",
              height: "2.4",
              volume: "30.00-35.00",
              weight: "15,000-16,000",
              isOver: false,
            },
            {
              truck: "Long_10",
              type: "type_Corral",
              width: "2.3",
              length: "7.5",
              height: "2",
              volume: "30.00-40.00",
              weight: "13,000-14,000",
              isOver: false,
            },
            {
              truck: "Long_10",
              type: "type_Solid",
              width: "2.3",
              length: "7.5",
              height: "2.4",
              volume: "30.00-40.00",
              weight: "13,000-14,000",
              isOver: false,
            },
            {
              truck: "Ultra_long_10",
              type: "type_Corral",
              width: "2.3",
              length: "9",
              height: "2",
              volume: "45.00 - 50.00",
              weight: "12,000-13,000",
              isOver: false,
            },
            {
              truck: "Ultra_long_10",
              type: "type_Solid",
              width: "2.3",
              length: "9",
              height: "2.4",
              volume: "45.00 - 50.00",
              weight: "12,000-13,000",
              isOver: false,
            },
          ],
        },
        {
          key: "12",
          value: "booking.12_wheel",
          image_Corral: "12wheel-Corral.png",
          image_Solid: "12wheel-Solid cabinet.png",
          typeList: [
            {
              truck: "Short_12",
              type: "type_Corral",
              width: "2.3",
              length: "6.5",
              height: "2",
              volume: "30.00-40.00",
              weight: "19,000-20,000",
              isOver: false,
            },
            {
              truck: "Short_12",
              type: "type_Solid",
              width: "2.3",
              length: "6.5",
              height: "2.5",
              volume: "30.00-40.00",
              weight: "19,000-20,000",
              isOver: false,
            },
            {
              truck: "Long_12",
              type: "type_Corral",
              width: "2.3",
              length: "7.5",
              height: "2",
              volume: "35.00-40.00",
              weight: "18,000-19,000",
              isOver: false,
            },
            {
              truck: "Long_12",
              type: "type_Solid",
              width: "2.3",
              length: "7.5",
              height: "2.4",
              volume: "35.00-40.00",
              weight: "18,000-19,000",
              isOver: false,
            },
            {
              truck: "Extra_long_12",
              type: "type_Corral",
              width: "2.3",
              length: "9",
              height: "2",
              volume: "40.00-45.00",
              weight: "17,000-18,000",
              isOver: false,
            },
            {
              truck: "Extra_long_12",
              type: "type_Solid",
              width: "2.3",
              length: "9",
              height: "2.4",
              volume: "40.00-45.00",
              weight: "17,000-18,000",
              isOver: false,
            },
          ],
        },
        {
          key: "18",
          value: "booking.18_wheel",
          image_Corral: "18wheel-Corral.png",
          image_Solid: "18wheel-Solid cabinet.png",
          typeList: [
            {
              truck: "Short_18",
              type: "type_Corral",
              width: "2.3",
              length: "6.5",
              height: "2",
              volume: "60.00-70.00",
              weight: "31,000-32,000",
              isOver: false,
            },
            {
              truck: "Short_18",
              type: "type_Solid",
              width: "2.3",
              length: "6.5",
              height: "2.4",
              volume: "60.00-70.00",
              weight: "31,000-32,000",
              isOver: false,
            },
            {
              truck: "Long_18",
              type: "type_Corral",
              width: "2.3",
              length: "7.5",
              height: "2",
              volume: "70.00-80.00",
              weight: "30,000-31,000",
              isOver: false,
            },
            {
              truck: "Long_18",
              type: "type_Solid",
              width: "2.3",
              length: "7.5",
              height: "2.4",
              volume: "70.00-80.00",
              weight: "30,000-31,000",
              isOver: false,
            },
            {
              truck: "Normal_18",
              type: "type_Corral",
              width: "2.3",
              length: "12",
              height: "2",
              volume: "50.00-60.00",
              weight: "25,000-27,000",
              isOver: false,
            },
            {
              truck: "Normal_18",
              type: "type_Solid",
              width: "2.3",
              length: "12",
              height: "2.4",
              volume: "50.00-60.00",
              weight: "25,000-27,000",
              isOver: false,
            },
          ],
        },
        {
          key: "22",
          value: "booking.22_wheel",
          image_Corral: "22wheel-Corral.png",
          image_Solid: "22wheel-Solid cabinet.png",
          typeList: [
            {
              truck: "Short_22",
              type: "type_Corral",
              width: "2.3",
              length: "6.5",
              height: "2",
              volume: "60.00-70.00",
              weight: "31,000-32,000",
              isOver: false,
            },
            {
              truck: "Short_22",
              type: "type_Solid",
              width: "2.3",
              length: "6.5",
              height: "2.4",
              volume: "60.00-70.00",
              weight: "30,000-31,000",
              isOver: false,
            },
            {
              truck: "Long_22",
              type: "type_Corral",
              width: "2.3",
              length: "7.5",
              height: "2",
              volume: "70.00-80.00",
              weight: "31,000-32,000",
              isOver: false,
            },
            {
              truck: "Long_22",
              type: "type_Solid",
              width: "2.3",
              length: "7.5",
              height: "2.4",
              volume: "70.00-80.00",
              weight: "30,000-31,000",
              isOver: false,
            },
            {
              truck: "Normal_22",
              type: "type_Corral",
              width: "2.3",
              length: "12",
              height: "2",
              volume: "60.00-65.00",
              weight: "31,000-32,000",
              isOver: false,
            },
            {
              truck: "Normal_22",
              type: "type_Solid",
              width: "2.3",
              length: "12",
              height: "2.4",
              volume: "60.00-65.00",
              weight: "30,000-31,000",
              isOver: false,
            },
          ],
        },
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
        currentPage: 1,
      },
      pagesize: 20,
      documentReturn: 10,
      truckObj: {},
      subObj: {},
      previewImgList: [],
      previewDialog: false,
      disInfo: {
        distance: "0",
        days: "0",
      },
      mapMode: true,
      showDisInfo: false,
      mapStart: "", //地图起始点
      mapEnd: "", //地图终点
      locationLoading: false,
      cargoListDialog: false,
      cargoTip: [
        {
          unit: "Dimension",
          ss: "0.01-90",
          s: "90.01-110",
          m: "110.01-130",
          l: "130.01-150",
          xl: "150.01-170",
          eSize: ">170.00",
        },
        {
          unit: "Weight",
          ss: "0.01-10",
          s: "10.01-20",
          m: "20.01-30",
          l: "30.01-40",
          xl: "40.01-50",
          eSize: ">50",
        },
      ],
      propertyTypeList: [],
      sizeTypeList: [],
      unitList: [],
      propertyTypeListObj: {},
      sizeTypeListObj: {},
      unitListObj: {},
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
  },
  // 监控data中的数据变化
  watch: {
    "$store.getters.language"() {
      self.init();
    },
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
    // 货物属性
    getGoodsProperty().then(res => {
      self.propertyTypeList = res.data.propertyType;
      self.sizeTypeList = res.data.sizeType;
      self.unitList = res.data.unit;
      let propertyTypeListObj = new Object();
      for (let i of self.propertyTypeList) {
        propertyTypeListObj[i.key] = i.trans;
      }
      self.propertyTypeListObj = propertyTypeListObj;
      let sizeTypeListObj = new Object();
      for (let i of self.sizeTypeList) {
        sizeTypeListObj[i.key] = i.trans;
      }
      self.sizeTypeListObj = sizeTypeListObj;
      let unitListObj = new Object();
      for (let i of self.unitList) {
        unitListObj[i.key] = i.trans;
      }
      self.unitListObj = unitListObj;
    });
  },
  methods: {
    initMaps(cb) {
      try {
        google;
      } catch (e) {
        return this.$notify({
          title: "Warning",
          message: "Google map load failed,Please check your network and try to refresh the page.",
          type: "warning",
          duration: 7000,
        });
      }
      let Bangkok = new google.maps.LatLng(13.7248936, 100.4930261);

      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        //设置地图中心点
        center: Bangkok,
        //为了关闭默认控件集,设置地图的disableDefaultUI的属性为true
        disableDefaultUI: true,
        // 启用缩放和平移
        gestureHandling: "greedy",
      });
      infoWindow = new google.maps.InfoWindow();
      self.setCenter();

      if (cb) {
        cb();
      }
    },
    getDis(start, end, truckType) {
      self.mapMode = true;
      if (!map) {
        return self.initMaps(self.getDis(start, end, truckType));
      }
      if (!directionsService) {
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
      }

      let request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING",
        unitSystem: google.maps.DirectionsUnitSystem.METRIC,
      };
      directionsService.route(request, function(result, status) {
        if (status == "OK") {
          let distance = parseInt(result.routes[0].legs[0].distance.value / 1000);
          let middleStep = result.routes[0].overview_path[parseInt(result.routes[0].overview_path.length / 2)];

          directionsRenderer.setDirections(result);

          // 卡车速度
          let speed;
          if (truckType !== "") {
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
              days: day,
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
        } else {
          self.$notify({
            title: "Network Error",
            message: "Network Error,Please try again later.",
            type: "warning",
            duration: 5000,
          });
        }
      });
    },
    hideMap() {
      self.mapMode = false;
    },
    // 获取位置
    setCenter(address) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, function(results, status) {
        if (status == "OK") {
          map.setCenter(results[0].geometry.location);
        }
      });
    },
    // 获取当前位置
    getLocation() {
      return new Promise(resolve => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              resolve(self.geocodeLatLng(pos));
            },
            function() {
              self.$notify({
                title: "Warning",
                message: "Can't get Browser Location,Please check your browser setting.",
                type: "warning",
                duration: 5000,
              });
              self.locationLoading = false;
              // self.handleLocationError(true, infoWindow, map.getCenter())
              resolve();
            },
          );
        } else {
          self.$notify({
            title: "Warning",
            message: "Can't get Browser Location,Please check your browser setting.",
            type: "warning",
            duration: 5000,
          });
          self.locationLoading = false;
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
                } else if (i.types.indexOf("administrative_area_level_1") > -1) {
                  addressInfo["administrative_area_level_1"] = i.long_name;
                } else if (i.types.indexOf("administrative_area_level_2") > -1) {
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
                message: "Failed to locate. Check to see if browser permissions are granted.",
                type: "warning",
                duration: 5000,
              });
              resolve();
            }
          } else {
            this.$notify({
              title: "Warning",
              message: "Geocoder failed due to: " + status,
              type: "warning",
              duration: 5000,
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
        browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation.",
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
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
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
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

        // Hide the popup when it is far out of view.
        var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? "block" : "none";

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
        self.today = consultInfo.searchForm.pickUpDate;
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
      self.$router.replace("/booking/placeOrder");
    },
    toMarket() {
      let releaseInfo = {};
      releaseInfo.pickUpRegionList = self.pickUpRegionList;
      releaseInfo.delRegionList = self.delRegionList;
      releaseInfo.searchForm = self.searchForm;
      releaseInfo.logisticType = self.logisticType;
      releaseInfo.time = self.time ? self.time : "00:00:00";
      localStorage.setItem("releaseInfo", JSON.stringify(releaseInfo));
      self.$router.push("/booking/releaseToMarket");
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
      if (self.logisticType == "LTL" && self.curSelect == "pk") {
        findDistrictOfHubFullList({
          name: query,
          page: page,
        }).then(res => {
          self.isLast = res.data.last;
          if (!res.data.first) {
            self.pickUpRegionList = self.pickUpRegionList.concat(res.data.content);
          } else {
            self.pickUpRegionList = res.data.content;
          }
        });
      } else {
        findDistrictFullList({
          name: query,
          page: page,
        }).then(res => {
          self.isLast = res.data.last;
          if (!res.data.first) {
            if (self.curSelect == "pk") {
              self.pickUpRegionList = self.pickUpRegionList.concat(res.data.content);
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
      }
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
      this.$refs.searchform.validate(valid => {
        let searchForm = JSON.parse(JSON.stringify(self.searchForm));
        if (valid) {
          self.searchloading = true;
          let time = self.time ? self.time : "00:00:00";
          searchForm.pickUpDate = searchForm.pickUpDate.split(" ")[0] + ` ${time}`;
          if (self.logisticType == "FTL") {
            ftlLine(searchForm, {
              page: self.page.currentPage - 1,
              pagesize: self.pagesize,
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
                  currentPage: res.data.number + 1,
                };
              })
              .catch(el => {
                self.searchloading = false;
              });
            self.getDis(self.mapStart, self.mapEnd, self.searchForm.truckgroup);
            self.showDisInfo = true;
          } else {
            searchForm.fromCityCode = searchForm.pickUpRegion;
            searchForm.toCityCode = searchForm.deliveryRegion;
            ltlLine(searchForm, {
              page: self.page.currentPage - 1,
              pagesize: self.pagesize,
            })
              .then(res => {
                self.searchloading = false;
                let tableList = res.data.content;
                self.tableList = tableList;
                self.page = {
                  total: res.data.totalElements,
                  currentPage: res.data.number + 1,
                };
              })
              .catch(el => {
                self.searchloading = false;
              });
          }
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
    // 揽件时间改变时
    // dateChange(e) {
    //   self.searchForm.pickUpDate = `${e[0]}-${e[1]}-${e[2]}`;
    // },
    // 揽件时间改变时
    dateChange(time) {
      self.searchForm.pickUpDate = time;
    },
    // 改变物流类型
    changeLogisticType(type) {
      self.logisticType = type;
      if (type == "LTL") {
        self.searchForm.pickUpRegion = "";
        self.searchForm.deliveryRegion = "";
        self.hideMap();
      } else {
        self.mapMode = true;
      }
      self.tableList = [];
      self.$refs.searchform.clearValidate();
    },
    checkNumInt(val, index, type) {
      val = val.split(".")[0];
      self.searchForm.propertyList[index][type] = val;
    },
    checkNumfloat(obj, index, type) {
      obj = Number(obj.toString().match(/^\d+(?:\.\d{0,2})?/));
      self.searchForm.propertyList[index][type] = obj == 0 ? "" : obj;
    },
    // 新增一行货物清单
    pushIt() {
      self.searchForm.propertyList.push({
        propertyType: "",
        name: "",
        number: null,
        unit: "",
        sizeType: "",
        weightOfEach: null,
      });
    },
    // 删除一行货物清单
    delIt(row, index) {
      if (self.searchForm.propertyList.length > 1) {
        self
          .$confirm(this.$t("booking.aysDel"), this.$t("confirm.tips"), {
            confirmButtonText: this.$t("booking.delete"),
            cancelButtonText: this.$t("member.cancel"),
          })
          .then(() => {
            self.searchForm.propertyList.splice(index, 1);
          })
          .catch(() => {});
      }
    },
    // 选择非额外尺寸时 删除长宽高属性
    sizeSelect(val, index) {
      if (val != "EXTRA_SIZE") {
        delete self.searchForm.propertyList[index].high;
        delete self.searchForm.propertyList[index].wide;
        delete self.searchForm.propertyList[index].length;
      }
    },
    // 货物清单确认
    propertyListConfirm() {
      this.$refs.cargoform.validate(valid => {
        if (valid) {
          self.cargoListDialog = false;
          self.searchForm.propertyListContent = "";
          let list = self.searchForm.propertyList;
          let content = "";
          for (let x in list) {
            content += `${parseInt(x) + 1}.${self.propertyTypeListObj[list[x].propertyType]} ${list[x].name} ${
              self.sizeTypeListObj[list[x].sizeType]
            } ${list[x].number}${self.unitListObj[list[x].unit]} `;
          }
          self.searchForm.propertyListContent = content;
        }
      });
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
      let obj = {};
      obj = self.pickUpRegionList.find(item => {
        return item.code === val;
      });
      let arr = obj.fullname.split("-");
      self.mapStart = arr[1] + arr[0];
      if (self.logisticType == "FTL") {
        if (self.mapEnd === "") {
          self.setCenter(self.mapStart);
        } else {
          self.getDis(self.mapStart, self.mapEnd, self.searchForm.truckgroup);
        }
      }
    },
    deliveryChange(val) {
      let obj = {};
      obj = self.delRegionList.find(item => {
        return item.code === val;
      });
      let arr = obj.fullname.split("-");
      self.mapEnd = arr[1] + arr[0];
      if (self.logisticType == "FTL") {
        if (self.mapStart !== "") {
          self.getDis(self.mapStart, self.mapEnd, self.searchForm.truckgroup);
        }
      }
    },
    getCurLocation() {
      if (!self.locationLoading) {
        self.locationLoading = true;
        self.getLocation().then(res => {
          let query = res.postalCode;
          self.curSelect = "pk";
          self.regionPage = 0;
          self.isLast = false;
          findDistrictFullList({
            name: query,
            page: self.regionPage,
          }).then(res => {
            if (res.data.content.length > 0) {
              self.pickUpRegionList = res.data.content;
              self.searchForm.pickUpRegion = self.pickUpRegionList[0].code;
            } else {
              self.$message.error("获取地址失败");
            }
            self.locationLoading = false;
          });
        });
      } else {
        self.locationLoading = false;
      }
    },
  },
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

    .logistic_type_jy {
      color: #ccc;
      cursor: no-drop;
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
  align-items: center;

  .truck-icon {
    height: 20px;
    margin-right: 10px;
  }
}

.hideMap {
  height: 0 !important;
  width: 0;
  overflow: hidden;
}
</style>
<style lang="scss">
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

.Consulte .el_item_icon .el-loading-mask {
  top: 9px;

  .el-loading-spinner i {
    color: #8a8a8a;
  }
}

.truck_type_popover {
  padding: 12px 0;

  .truck_type_detail_title {
    width: 100%;
    color: #333;
    text-align: center;
    font-weight: 600;
  }

  .truck_type_detail {
    height: 600px;
    width: 100%;
    overflow: auto;
  }

  .truck_type_dec {
    .truck_type_img {
      width: 100%;
      display: flex;
      justify-content: center;
      height: 50px;
      margin: 20px 0;

      img {
        height: 100%;
      }
    }

    .truck_type_dec_item {
      background: #f2f2f2;
      margin-bottom: 10px;
      height: 145px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 10px 44px;

      .truck_type_dec_item_right {
        .name {
          font-size: 14px;
          color: #333;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .unit {
          font-size: 13px;
          color: #999;
          width: 75px;
          display: inline-block;
        }

        .number {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
      }

      .truck_type_dec_item_left {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        border: 1px solid #e7e7e7;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #fff;
        font-size: 12px;

        .number {
          font-weight: 600;
          font-size: 13px;
          color: #333;
          margin-top: 20px;
          margin-bottom: 10px;
          text-align: center;
        }
      }
    }
  }
}

.edit_input .el-input__inner {
  padding: 0 30px 0 15px;
}
</style>
