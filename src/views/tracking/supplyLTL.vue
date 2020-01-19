<template>
  <div class="manage cardFix tracking">
    <div style="display:flex;box-sizing:border-box;padding-left:20px;height:100%;">
      <!-- 导航 -->
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="tabChange" style="height:100%;">
          <el-tab-pane name="WAIT_SEND_TO_HUB">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeSentCargoToHub") }}<sub class="badge">{{ orderStatus.WAIT_SEND_TO_HUB }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_HUB_TO_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedReceiptByHub") }}<sub class="badge">{{ orderStatus.WAIT_HUB_TO_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="HUB_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.confirmedReceiptByHub") }}<sub class="badge">{{ orderStatus.HUB_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_PICK">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeHandedOverToSupply") }}<sub class="badge">{{ orderStatus.WILL_PICK }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SENDING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.intransit") }}<sub class="badge">{{ orderStatus.SENDING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_RETURN">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.documentTobereturned") }}<sub class="badge">{{ orderStatus.WILL_RETURN }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="COMPLETE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.completed") }}<sub class="badge">{{ orderStatus.COMPLETE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container">
        <!-- 搜索 -->
        <div class="statusHeader">
          <el-form ref="searchForm" inline :show-message="false">
            <el-form-item :label="$t('tracking.destinaiton')">
              <div class="search_item">
                <el-button size="mini" @click="proDialog = true" style="margin-right:5px;" icon="el-icon-more"></el-button>
                <el-select
                  v-model="provinces"
                  style="width:210px;"
                  class="formSelect"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  placeholder="province"
                >
                  <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item :label="$t('tracking.pickupDate')">
              <bc-picker @changeBCtime="changeBCtime" style="width:160px;"></bc-picker>
            </el-form-item>
            <el-form-item :label="$t('tracking.tracking')">
              <el-input v-model="orderNo" :placeholder="$t('placeholder.pleaseInput')" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchIt">{{ $t("tracking.search") }}</el-button>
              <el-button
                type="primary"
                v-if="
                  tabActive == 'WAIT_SEND_TO_HUB' ||
                    tabActive == 'WAIT_HUB_TO_PUT' ||
                    tabActive == 'HUB_PUT' ||
                    tabActive == 'WILL_PICK'
                "
                @click="assignMultiple"
                >{{ $t("tracking.assignTruckAndDriver") }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="containerContent">
          <div style="width:49%;">
            <el-table
              :data="data.content"
              v-loading="loading"
              border
              @selection-change="handleSelectionChange"
              :max-height="tableHeight"
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
                v-if="
                  tabActive == 'WAIT_SEND_TO_HUB' ||
                    tabActive == 'WAIT_HUB_TO_PUT' ||
                    tabActive == 'HUB_PUT' ||
                    tabActive == 'WILL_PICK'
                "
              >
              </el-table-column>
              <el-table-column :label="$t('tracking.TrackingNoAndDemand')">
                <template slot-scope="scope">
                  <!-- <el-button style="width:100%;text-align:left;" @click="orderLog(scope.row.order.id)"> -->
                  <div>{{ scope.row.order.orderNo }}</div>
                  <div>{{ scope.row.order.outNumber }}</div>
                  <div>{{ scope.row.order.createdAt }}</div>
                  <div>{{ scope.row.ownerName }}</div>
                  <!-- </el-button> -->
                </template>
              </el-table-column>
              <el-table-column :label="$t('tracking.VAS')">
                <template slot-scope="scope">
                  <!-- <el-card shadow="never"> -->
                  <!-- <span v-for="(item, index) in scope.row.order.receiverAddressList[0].propertyList" :key="index">
                    {{
                      `${parseInt(index) + 1}.${propertyObj[item.propertyType]} ${item.name} ${sizeObj[item.sizeType]} ${
                        item.number
                      }${unitObj[item.unit]} `
                    }}
                  </span> -->
                  <!-- </el-card> -->
                  <!-- <el-card shadow="never" style="margin-top:5px;" v-if="scope.row.order.chargeList.length > 0"> -->
                  <div
                    style="display:flex;margin-top:5px;"
                    v-for="(item, index) in scope.row.order.chargeList"
                    :key="index + '1'"
                  >
                    <div>{{ serveObj[item.chargeType] }}</div>
                  </div>
                  <!-- </el-card> -->
                  <!-- <div style="margin-top:5px;">Total Amt：{{ scope.row.order.settlementAmount }}</div> -->
                  <!-- </el-card> -->
                </template>
              </el-table-column>
              <!-- <el-table-column :label="$t('tracking.deliveryPoint')">
                <template slot-scope="scope">
                  <div v-if="scope.row.order.receiverAddressList">
                    <el-card
                      shadow="never"
                      style="margin-bottom:5px;"
                      v-for="(receiverAddress, index) in scope.row.order.receiverAddressList"
                      :key="index"
                    >
                      <div>
                        {{ receiverAddress.name }}
                        {{
                          tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                            ? ""
                            : receiverAddress.mobile
                        }}
                      </div>
                      <div>{{ receiverAddress.addressDetail }}</div>
                      <div>
                        {{ receiverAddress.district }}
                        {{ receiverAddress.city }}
                        {{ receiverAddress.province }}
                      </div>
                    </el-card>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tracking.pickupPoint')">
                <template slot-scope="scope">
                  <div v-if="scope.row.order.senderAddress">
                    <div>
                      {{ scope.row.order.senderAddress.name }}
                      {{
                        tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                          ? ""
                          : scope.row.order.senderAddress.mobile
                      }}
                    </div>
                    <div>{{ scope.row.order.senderAddress.addressDetail }}</div>
                    <div>
                      {{ scope.row.order.senderAddress.province }}
                      {{ scope.row.order.senderAddress.city }}
                      {{ scope.row.order.senderAddress.district }}
                    </div>
                  </div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column :label="$t('tracking.VechicleDriver')">
                <template slot-scope="scope">
                  <div>{{ scope.row.plate }}</div>
                  <div>{{ scope.row.driverName }}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column :label="$t('tracking.ETD')"></el-table-column> -->
              <!-- <el-table-column :label="$t('tracking.Operation')">
                <template slot-scope="scope">
                  <div style="text-align:center;">
                    <el-button
                      v-if="
                        scope.row.order.status == 'WAIT_SEND_TO_HUB' ||
                          scope.row.order.status == 'WAIT_HUB_TO_PUT' ||
                          scope.row.order.status == 'HUB_PUT' ||
                          scope.row.order.status == 'WILL_PICK'
                      "
                      @click="assignItem(scope.row)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      style="margin-bottom:10px;"
                      >{{ $t("tracking.assignTruckAndDriver") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="confirmB(scope.row.order)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.confirm") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="reject(scope.row.order)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.reject") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.order.status == 'WILL_RETURN'"
                      :disabled="
                        scope.row.order.returnType == 1 || scope.row.order.returnType == 2 || !permissions.SupplyOrderManage
                      "
                      @click="rdShow(scope.row.order)"
                      type="primary"
                      >{{ $t("tracking.returnDocument") }}</el-button
                    >
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('tracking.route')">
                <template slot-scope="scope">
                  <div v-if="scope.row.order.senderAddress">
                    From:{{ scope.row.order.senderAddress.district }} {{ scope.row.order.senderAddress.city }}
                    {{ scope.row.order.senderAddress.province }}
                  </div>
                  <div v-if="scope.row.order.receiverAddressList.length > 0">
                    To:{{ scope.row.order.receiverAddressList[0].district }} {{ scope.row.order.receiverAddressList[0].city }}
                    {{ scope.row.order.receiverAddressList[0].province }}
                  </div>
                  <div>共{{ scope.row.order.receiverAddressList.length }}个派送点</div>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
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
          <div style="width:49%;">
            <el-tabs v-model="curTab" @tab-click="handleClick">
              <el-tab-pane :label="$t('tracking.OrderDetails')" name="detail" class="trackingDetail">
                <div v-if="thisRow">
                  <div class="rightDetail" :style="`max-height:${detailHeight}px;`">
                    <el-form label-position="left" label-width="200px">
                      <el-form-item :label="$t('booking.logisiticsType')">{{ thisRow.order.lineType }}</el-form-item>
                      <el-form-item :label="$t('tracking.remarks')">{{ thisRow.order.remark }}</el-form-item>
                      <!-- <el-form-item :label="$t('booking.truckType')">
                        <div v-if="thisRow.order.transport">
                          {{ truckObj[thisRow.order.transport.carType] }} {{ subtruckObj[thisRow.order.transport.carriage] }}
                        </div>
                      </el-form-item> -->
                      <el-form-item :label="$t('resources.plateLicense')">
                        <div v-if="thisRow">
                          {{ thisRow.plate }}
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('resources.driver')">
                        <div v-if="thisRow">
                          {{ thisRow.driverName }}
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('booking.valueAddedService')">
                        <span v-for="(item, index) in thisRow.order.chargeList" :key="index">
                          {{ serveObj[item.chargeType] + " " }}</span
                        >
                      </el-form-item>
                      <el-form-item :label="$t('tracking.price')">
                        <div v-if="thisRow.order.settlementAmount">
                          {{ $t("booking.totalamt") }}：{{ thisRow.order.settlementAmount }}
                        </div>
                        <div v-if="thisRow.order.settlementAmount" style="line-height:20px;">
                          <div>
                            {{ $t("billing.freight") }}：{{ thisRow.order.settlementAmount - thisRow.order.serviceAmount }}
                          </div>
                          <div v-for="(item, index) in thisRow.order.chargeList" :key="index">
                            {{ serveObj[item.chargeType] }}：{{ item.money }}
                          </div>
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('booking.expectedDeliveryTime')">
                        {{ thisRow.order.receiverAddressList[0].receiveAt }}
                      </el-form-item>
                      <el-form-item :label="$t('booking.pickupTime')"
                        ><div v-if="thisRow.order.senderAddress">{{ thisRow.order.senderAddress.pickAt }}</div></el-form-item
                      >
                      <el-form-item :label="$t('booking.sender')"
                        ><div v-if="thisRow.order.senderAddress">{{ thisRow.order.senderAddress.name }}</div></el-form-item
                      >
                      <el-form-item :label="$t('booking.pickupPoint')">
                        <div v-if="thisRow.order.senderAddress">
                          <div>{{ thisRow.order.senderAddress.name }} {{ thisRow.order.senderAddress.mobile }}</div>
                          <div style="line-height:20px;">
                            {{ thisRow.order.senderAddress.addressDetail }} {{ thisRow.order.senderAddress.district }}
                            {{ thisRow.order.senderAddress.city }}
                            {{ thisRow.order.senderAddress.province }}
                          </div>
                        </div>
                      </el-form-item>
                    </el-form>
                    <el-table
                      :data="thisRow.order.receiverAddressList ? thisRow.order.receiverAddressList : []"
                      style="width:100%;border-top:1px solid #ebeef5;margin-top:5px;"
                    >
                      <el-table-column :label="$t('booking.deliveryPoint')">
                        <template slot-scope="scope">
                          <div>
                            {{ scope.row.name }}
                            {{ scope.row.mobile }}
                          </div>
                          <div>
                            {{ scope.row.addressDetail }}
                          </div>
                          <div>
                            {{ scope.row.district }}
                            {{ scope.row.city }}
                            {{ scope.row.province }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('booking.cargoList')">
                        <template slot-scope="scope">
                          <div v-for="(item, index) in scope.row.propertyList" :key="index">
                            <div v-if="item.name">
                              {{ propertyObj[item.propertyType] }} {{ item.name }} {{ item.number }} {{ sizeObj[item.sizeType] }}
                              {{ item.weightOfEach }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div style="text-align:center;margin-top:10px;">
                    <el-button
                      v-if="
                        thisRow.order.status == 'WAIT_SEND_TO_HUB' ||
                          thisRow.order.status == 'WAIT_HUB_TO_PUT' ||
                          thisRow.order.status == 'HUB_PUT' ||
                          thisRow.order.status == 'WILL_PICK'
                      "
                      @click="assignItem(thisRow)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      style="margin-bottom:10px;"
                      >{{ $t("tracking.assignTruckAndDriver") }}</el-button
                    >
                    <el-button
                      v-if="thisRow.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="confirmB(thisRow.order)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.confirm") }}</el-button
                    >
                    <el-button
                      v-if="thisRow.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="reject(thisRow.order)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.reject") }}</el-button
                    >
                    <!-- <el-button
                  v-if="scope.row.order.status == 'WILL_PICK' && scope.row.ordertransport && scope.row.order.transport.driverName == null"
                  @click="confirmB(scope.row.order)"
                  :disabled="!permissions.SupplyOrderManage"
                  type="primary"
                  >{{ $t("tracking.operation") }}</el-button
                > -->
                    <el-button
                      v-if="thisRow.order.status == 'WILL_RETURN'"
                      :disabled="thisRow.order.returnType == 1 || thisRow.order.returnType == 2 || !permissions.SupplyOrderManage"
                      @click="rdShow(thisRow.order)"
                      type="primary"
                      >{{ $t("tracking.returnDocument") }}</el-button
                    >
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('tracking.orderLog')" name="log">
                <div class="rightDetail" :style="`max-height:${detailHeight + 40}px;`">
                  <el-timeline :reverse="true" style="margin-top:15px;">
                    <el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.createdAt">
                      {{ item.introduce }}
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('tracking.Receipt')" name="r">
                <div class="rightDetail fixcollapse" :style="`max-height:${detailHeight + 40}px;`" v-if="thisRow">
                  <el-collapse v-model="activeModel" @change="activeModelChange">
                    <el-collapse-item name="1">
                      <template slot="title"> 揽件信息 </template>
                      <div>
                        <el-row :gutter="7" style="max-height:110px;">
                          <el-col :span="8">
                            <div v-if="thisRow.order.senderAddress">
                              <div>{{ thisRow.order.senderAddress.name }} {{ thisRow.order.senderAddress.mobile }}</div>
                              <div>{{ thisRow.order.senderAddress.addressDetail }}</div>
                              <div style="line-height:20px;">
                                {{ thisRow.order.senderAddress.district }}
                                {{ thisRow.order.senderAddress.city }}
                                {{ thisRow.order.senderAddress.province }}
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div style="margin-top:23px;">{{ thisRow.order.handoverTime }}</div>
                          </el-col>
                          <el-col :span="5">
                            <el-image
                              :src="thisRow.order.pickupSignature"
                              v-if="thisRow.order.pickupSignature"
                              :preview-src-list="[thisRow.order.pickupSignature]"
                            ></el-image>
                          </el-col>
                          <el-col :span="5">
                            <el-image
                              :src="thisRow.order.pickupPicture"
                              v-if="thisRow.order.pickupPicture"
                              :preview-src-list="[thisRow.order.pickupPicture]"
                            ></el-image>
                          </el-col>
                        </el-row>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                      <template slot="title"> 派件列表 </template>
                      <div v-for="(item, index) in thisRow.order.receiverAddressList" :key="index" style="margin-bottom:10px;">
                        <el-row :gutter="7" style="max-height:110px;">
                          <el-col :span="8">
                            <div>
                              {{ item.name }}
                              {{ item.mobile }}
                            </div>
                            <div>
                              {{ item.addressDetail }}
                            </div>
                            <div>
                              {{ item.district }}
                              {{ item.city }}
                              {{ item.province }}
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div style="margin-top:23px;">{{ item.deliveryAt }}</div>
                          </el-col>
                          <el-col :span="5">
                            <el-image
                              :src="item.deliverySignature"
                              v-if="item.deliverySignature"
                              :preview-src-list="[item.deliverySignature]"
                            ></el-image>
                          </el-col>
                          <el-col :span="5">
                            <el-image
                              :src="item.deliveryPicture"
                              v-if="item.deliveryPicture"
                              :preview-src-list="[item.deliveryPicture]"
                            ></el-image>
                          </el-col>
                        </el-row>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('tracking.print')" :visible.sync="printeDialog" width="65%" class="comfirmDialog">
      打印
      <span slot="footer">
        <div class="footerBtn">
          <el-button size="small" plain style="width:300px;" @click="printeDialog = false">{{
            $t("tracking.confirm")
          }}</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog :title="$t('tracking.confirmOrder')" width="600px" v-if="orderInfo" :visible.sync="confirmDialog">
      <el-form label-width="130px">
        <el-form-item :label="$t('tracking.trackingNo')">
          <div>{{ orderInfo.orderNo }}</div>
        </el-form-item>
        <el-form-item :label="$t('tracking.logisticType')">
          <div>{{ orderInfo.lineType }}</div>
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')">
          <div>
            {{ orderInfo.receiverAddress.city }}
            {{ orderInfo.receiverAddress.district }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('tracking.qty')">
          <div>0</div>
        </el-form-item>
        <el-form-item :label="$t('tracking.driver')">
          <el-select v-model="confirmForm.driverId" filterable>
            <el-option v-for="item in td.drivers" :key="item.value" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.plateLicense')">
          <el-select v-model="confirmForm.truckId" filterable>
            <el-option v-for="item in td.trucks" :key="item.value" :label="item.plate" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="confirmLoading"
            :disabled="confirmForm.truckId == '' || confirmForm.driverId == ''"
            @click="confirmIt"
            >{{ $t("tracking.confirm") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('tracking.orderLog')" :visible.sync="logDialog">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.createdAt">
          {{ item.introduce }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <el-dialog :title="$t('tracking.returnDocument')" width="600px" @close="dialogClose" :visible.sync="rdDialog">
      <el-form :model="rdForm" size="mini" label-width="150px">
        <el-form-item :label="$t('tracking.trackingNo')">
          {{ rdRow.orderNo }}
        </el-form-item>
        <el-form-item :label="$t('tracking.deliveryChannel')" required>
          <el-select v-model="rdForm.returnType" class="rdFormWidth">
            <el-option :label="$t('tracking.expressDelivery')" :value="1"> </el-option>
            <el-option :label="$t('tracking.faceToFace')" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.expressWaybillNo')" v-if="rdForm.returnType == 1" required>
          <el-input class="rdFormWidth" v-model="rdForm.courierNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.photo')" v-if="rdForm.returnType == 1">
          <div class="upload-box">
            <el-upload
              class="upload-box"
              ref="photoIds"
              :action="env + '/api/file/upload'"
              :on-preview="handlePreview"
              multiple
              :file-list="fileList"
              :headers="headers"
              :limit="5"
              :on-exceed="outLimit"
              accept="image/*"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="rdFormWidth" @click="rdIt" type="primary">{{ $t("tracking.confirm") }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="proDialog" :close-on-click-modal="false" width="600px">
      <el-tabs tabPosition="left" v-model="proActive">
        <el-tab-pane v-for="(item, index) in proArea" :key="index" :label="item.sortingNoTrans" :name="item.sortingNo">
          <el-button
            :type="provinces.indexOf(pro.code) > -1 ? 'info' : 'primary'"
            class="proItem"
            @click="tapPro(pro)"
            :key="proInd"
            v-for="(pro, proInd) in proArea[index].provinceList"
            >{{ pro.name }}</el-button
          >
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proDialog = false">取 消</el-button>
        <el-button type="primary" @click="proDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog">
      <img width="100%" :src="previewImg" alt="image" />
    </el-dialog>
    <el-dialog :visible.sync="assignDialog" width="950px" :title="$t('tracking.assignTruckAndDriver')" center>
      <el-form
        ref="assignForm"
        :model="assignForm"
        :rules="assignRules"
        hide-required-asterisk
        label-position="right"
        label-width="90px"
        style="width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;"
      >
        <el-form-item prop="driverId" :label="$t('tracking.driver')">
          <el-select v-model="assignForm.driverId" filterable style="width:250px;margin-left:10px;">
            <el-option v-for="item in td.drivers" :key="item.value" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="truckId" :label="$t('tracking.truck')">
          <el-select v-model="assignForm.truckId" filterable style="width:250px;margin-left:10px;">
            <el-option v-for="item in td.trucks" :key="item.value" :label="item.plate" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.orderQty')">
          <div style="width:250px;margin-left:10px;">{{ assignOrderList.length }}</div>
        </el-form-item>
      </el-form>
      <el-table :data="assignOrderList" border>
        <el-table-column :label="$t('tracking.trackingNo')">
          <template slot-scope="scope">
            {{ scope.row.order.orderNo }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.deliveryPoint')">
          <template slot-scope="scope">
            <div v-if="scope.row.order.receiverAddressList">
              <el-card
                shadow="never"
                style="margin-bottom:5px;"
                v-for="(receiverAddress, index) in scope.row.order.receiverAddressList"
                :key="index"
              >
                <div>
                  {{ receiverAddress.name }}
                  {{
                    tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                      ? ""
                      : receiverAddress.mobile
                  }}
                </div>
                <div>{{ receiverAddress.addressDetail }}</div>
                <div>
                  {{ receiverAddress.district }}
                  {{ receiverAddress.city }}
                  {{ receiverAddress.province }}
                </div>
              </el-card>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.cargo')">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.order.receiverAddressList[0].propertyList" :key="index">
              {{
                `${parseInt(index) + 1}.${propertyObj[item.propertyType]} ${item.name} ${sizeObj[item.sizeType]} ${item.number}${
                  unitObj[item.unit]
                } `
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.VAS')">
          <template slot-scope="scope">
            <div style="display:flex;margin-top:5px;" v-for="(item, index) in scope.row.order.chargeList" :key="index + '1'">
              <div>{{ serveObj[item.chargeType] }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end;margin-top:20px;">
        <el-button @click="assignDialog = false" type="info">取 消</el-button>
        <el-button type="primary" style="width:150px;" @click="assignConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  getTruckType,
  getProvinceList,
  getCityList,
  getExtraServer,
  getGoodsProperty,
  getSupplyTD,
  getBcYear,
  getBcDay,
  getProvinceArea,
} from "../../api/data";
import {
  confirmOrder,
  updateOrderInfo,
  rejectOrder,
  getOrderLog,
  getOrderStatus,
  returnTruck,
  returnDocument,
  getSupplyLTLOrder,
  supplyStatusCount,
  chooseDriverAndTruck,
} from "../../api/tracking.js";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

let self;
export default {
  data() {
    return {
      env: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: getToken(),
      },
      orderList: [],
      data: {},
      tabActive: "WAIT_SEND_TO_HUB",
      printeDialog: false,
      confirmDialog: false,
      logDialog: false,
      form: {
        category: "",
        subCategory: "",
        charge: "",
        finishedAt: "",
        fromProvinceCode: "",
        toCityCode: "",
        miles: "",
        supportLoading: "",
        humanWorkDay: "",
        moneyPerDay: "",
        status: "",
      },
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: [],
      },
      timeOptions: {
        start: "00:00",
        step: "00:15",
        end: "23:45",
      },
      serveObj: {},
      propertyObj: {},
      sizeObj: {},
      unitObj: {},
      orderStatus: {
        COMPLETE: 0,
        WAIT_DEMAND_TO_ACCEPT: 0,
        SENDING: 0,
        WAIT_SUPPLY_TO_ACCEPT: 0,
        WAITTING: 0,
        WILL_PICK: 0,
        WILL_RETURN: 0,
      },
      orderInfo: null,
      td: {},
      confirmForm: {
        dirverId: "",
        truckId: "",
      },
      loading: false,
      confirmLoading: false,
      orderDialog: false,
      returnLoading: false,
      searchForm: {
        province: "",
      },
      logs: [],
      returnForm_show: {},
      returnCharge: "",
      returnDate: "",
      returnTime: "",
      options: [],
      truckObj: {},
      rdDialog: false,
      rdForm: {
        returnType: 1,
      },
      fileList: [],
      previewDialog: false,
      previewImg: "",
      rdRow: {},
      orderNo: "",
      pickAt: "",
      provinces: [],
      proDialog: false,
      proActive: "B",
      proArea: [],
      assignDialog: false,
      assignOrderList: [],
      assignOrderListSelect: [],
      assignForm: {
        driverId: null,
        truckId: null,
      },
      assignRules: {
        driverId: [{ required: true, message: " ", trigger: "change" }],
        truckId: [{ required: true, message: " ", trigger: "change" }],
      },
      curTab: "detail",
      thisRow: null,
      tableHeight: 0,
      detailHeight: 0,
      activeModel: ["1", "2"],
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
    phoFileList: function() {
      return self.$refs.photoIds.uploadFiles;
    },
  },
  // 监控data中的数据变化
  watch: {},
  created() {
    self = this;
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 58 - 32 - 20;
      this.detailHeight = window.innerHeight - 91 - 40 - 58 - 55 - 56;
    });
    getProvinceList().then(res => {
      self.provinceList = res.data;
    });
    getCityList().then(res => {
      self.cityList = res.data;
    });
    getTruckType().then(res => {
      self.truckTypes = res.data;
      let truckObj = new Object();
      for (let i of res.data.categories) {
        truckObj[i.key] = i.value;
      }
      self.truckObj = truckObj;
    });
    getExtraServer().then(res => {
      let serveObj = new Object();
      for (let i of res.data) {
        serveObj[i.key] = i.trans;
      }
      self.serveObj = serveObj;
    });
    getGoodsProperty().then(res => {
      let propertyObj = new Object();
      let sizeObj = new Object();
      let unitObj = new Object();
      for (let i of res.data.propertyType) {
        propertyObj[i.key] = i.trans;
      }
      for (let i of res.data.sizeType) {
        sizeObj[i.key] = i.trans;
      }
      for (let i of res.data.unit) {
        unitObj[i.key] = i.trans;
      }
      self.propertyObj = propertyObj;
      self.sizeObj = sizeObj;
      self.unitObj = unitObj;
    });
    getSupplyTD().then(res => {
      self.td = res.data;
    });
    getProvinceArea().then(res => {
      self.proArea = res.data;
    });
    self.loadData();
  },
  methods: {
    activeModelChange() {
      self.activeModel = ["1", "2"];
    },
    loadData(cb) {
      self.loading = true;
      let page = self.data.number ? self.data.number : 0;
      let provincesCon = self.provinces.join(",");
      getSupplyLTLOrder({
        orderStatus: self.tabActive,
        orderNo: self.orderNo,
        pickAt: self.pickAt ? self.pickAt + " 00:00:00" : "",
        provinces: provincesCon,
        page: page,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
      supplyStatusCount({
        orderNo: self.orderNo,
        pickAt: self.pickAt ? self.pickAt + " 00:00:00" : "",
        provinces: provincesCon,
      }).then(res => {
        self.orderStatus = res.data;
      });
    },
    handleClick() {
      if (self.curTab == "log" && self.thisRow) {
        self.orderLog(self.thisRow.order.id);
      }
    },
    handleCurrentChange(val) {
      self.thisRow = val;
      if (self.curTab == "log" && self.thisRow) {
        self.orderLog(self.thisRow.order.id);
      } else {
        self.logs = [];
      }
    },
    // 搜索
    searchIt() {
      self.loadData();
    },
    // 目的地选择
    tapPro(pro) {
      if (self.provinces.indexOf(pro.code) < 0) {
        self.provinces.push(pro.code);
      } else {
        self.provinces.splice(self.provinces.indexOf(pro.code), 1);
      }
    },
    // 揽件日期选择
    changeBCtime(time) {
      self.pickAt = time;
    },
    // 选择订单
    handleSelectionChange(val) {
      self.assignOrderListSelect = val;
    },
    // 批量操作指定车辆和司机
    assignMultiple() {
      self.assignOrderList = self.assignOrderListSelect;
      if (self.assignOrderList.length <= 0) {
        self.$message.warning("请选择一个订单");
        return;
      }
      self.assignDialog = true;
    },
    // 单个操作指定车辆和司机
    assignItem(item) {
      self.assignDialog = true;
      self.assignOrderList = [];
      self.assignOrderList.push(item);
    },
    // 确认指定车辆和司机
    assignConfirm() {
      this.$refs.assignForm.validate(valid => {
        if (valid) {
          let orderIds = [];
          for (let item of self.assignOrderList) {
            orderIds.push(item.order.id);
          }
          self.assignForm.orderIds = orderIds;
          chooseDriverAndTruck(self.assignForm).then(res => {
            self.assignDialog = false;
            self.loadData();
            self.assignForm.truckId = null;
            self.assignForm.driverId = null;
          });
        }
      });
    },
    pageChange(e) {
      self.loading = true;
      let provincesCon = self.provinces.join(",");
      getSupplyLTLOrder({
        orderStatus: self.tabActive,
        orderNo: self.orderNo,
        pickAt: self.pickAt ? self.pickAt + " 00:00:00" : "",
        provinces: provincesCon,
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      });
    },
    tabChange() {
      self.data.number = 0;
      self.loadData();
    },
    confirmB(item) {
      self.orderInfo = item;
      self.confirmDialog = true;
    },
    reject(item) {
      self
        .$prompt(self.$t("tracking.pleaseEnterTheRejectionReason"), "", {
          confirmButtonText: self.$t("tracking.confirm"),
          cancelButtonText: self.$t("tracking.cancel"),
          inputPattern: /\S/,
          inputErrorMessage: self.$t("tracking.pleaseEnterTheRejectionReason"),
        })
        .then(({ value }) => {
          rejectOrder(item.id, value).then(() => {
            self.loadData();
          });
        })
        .catch(() => {});
    },
    confirmIt() {
      self.confirmLoading = true;
      if (self.orderInfo.status == "WAIT_SUPPLY_TO_ACCEPT") {
        confirmOrder(self.orderInfo.id, self.confirmForm.truckId, self.confirmForm.driverId).then(() => {
          self.loadData(() => {
            self.confirmDialog = false;
            self.confirmForm = {
              dirverId: "",
              truckId: "",
            };
            self.$message.success(self.$t("tracking.successful"));
            self.confirmLoading = false;
          });
        });
      } else if (self.orderInfo.status == "WILL_PICK") {
        updateOrderInfo(self.orderInfo.id, self.confirmForm.truckId, self.confirmForm.driverId).then(() => {
          self.loadData(() => {
            self.confirmDialog = false;
            self.confirmForm = {
              dirverId: "",
              truckId: "",
            };
            self.$message.success(self.$t("tracking.successful"));
            self.confirmLoading = false;
          });
        });
      }
    },
    orderLog(id) {
      getOrderLog(id).then(res => {
        self.logs = res.data;
      });
    },
    rdShow(row) {
      self.rdRow = row;
      self.rdDialog = true;
    },
    handlePreview(file) {
      this.previewImg = file.url;
      this.previewDialog = true;
    },
    dialogClose() {
      self.fileList = [];
      self.rdForm = {
        returnType: 1,
      };
    },
    outLimit() {
      self.$message.warning(self.$t("resources.outLimit"));
    },
    rdIt() {
      let rdForm = JSON.parse(JSON.stringify(self.rdForm));
      if (rdForm.returnType == 1 && rdForm.courierNumber == "") {
        return self.$message.warning(self.$t("tracking.courierNumberRequired"));
      }
      if (rdForm.returnType != 2) {
        // 整理photoIds
        let phoArr = [];
        for (let i of self.phoFileList) {
          if (i.response) {
            phoArr.push(i.response.data.id);
          } else {
            phoArr.push(i.id);
          }
        }
        rdForm.photoIds = phoArr.toString();
      }
      returnDocument(self.rdRow.id, rdForm).then(() => {
        self.loadData(() => {
          self.$message.success(self.$t("tracking.successful"));
          self.rdDialog = false;
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
  box-sizing: border-box;
}
.statusHeader {
  box-sizing: border-box;
  display: flex;

  .search_item {
    display: flex;
  }
}

.comfirmDialog {
  .footerBtn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.container {
  width: 100%;
  height: calc(100vh - 91px);
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;

  .containerContent {
    width: 100%;
    display: flex;
    justify-content: space-between;
    overflow: scroll;
  }
}

div::-webkit-scrollbar {
  display: none;
}

.container-header {
  height: 50px;
  display: flex;
  align-items: center;
  div {
    margin-right: 20px;
  }
}

.tabLabel {
  display: flex;
  justify-content: flex-end;

  .text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    white-space: normal;
    word-break: break-all;
    line-height: 16px;
  }

  .badge {
    font-size: 12px;
    margin-left: 5px;
    color: #aaa;
    width: 25px;
    text-align: right;
  }

  .red {
    color: red;
  }
}

.formSelect {
  width: 100%;
}

.rdFormWidth {
  width: 300px;
}

.upload-box {
  width: 350px;
  height: 70px;
  overflow: hidden;
}

.proItem {
  margin: 0 10px 10px 0;

  .proItemActive {
    background: red;
    color: #fff;
  }
}

.rightDetail {
  overflow: scroll;
}
</style>
<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
.cardFix .el-card__body {
  padding: 5px 10px;
}

.el-upload {
  width: 60px !important;
  height: 60px !important;
}

.el-upload-list {
  .is-success,
  .is-uploading,
  .is-ready {
    width: 60px !important;
    height: 60px !important;
  }
}

.upload-box {
  .el-icon-plus {
    transform: translateY(-38px) !important;
  }
}

.tracking .nav {
  .el-tabs--left .el-tabs__item.is-left {
    text-align: left;
    height: 50px;
  }

  .el-tabs__content {
    background-color: #fff;
  }

  .el-tabs__active-bar {
    width: 0;
    height: 0;
    background-color: #fff;
  }

  .el-tabs--left .el-tabs__active-bar.is-left {
    width: 0;
    height: 0;
  }

  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  .el-tabs--left .el-tabs__nav-wrap.is-left {
    width: 185px;
    padding-top: 20px;
  }

  .el-tabs--left .el-tabs__header.is-left {
    margin-left: -10px;
    background-color: #fff;
  }

  .el-table__header-wrapper {
    background-color: #ccc !important;
  }

  .el-table__header {
    background-color: #ccc !important;
  }
}

.trackingDetail {
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
  }
  .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
  }
}

.fixcollapse {
  .el-collapse-item__arrow.is-active {
    color: #fff;
  }
}
</style>
