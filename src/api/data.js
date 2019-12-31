import request from "@/utils/request";
import requestJSON from "@/utils/requestJSON";

// 卡车类型
export function getTruckType() {
  return request({
    url: "/misc/types/truck",
    method: "get",
  });
}

// 货物属性
export function getGoodsProperty() {
  return request({
    url: "/misc/property/list",
    method: "get",
  });
}

// 寄件人列表
export function getSenderList() {
  return request({
    url: "/api/demand/order/search/sender/list",
    method: "get",
  });
}

// ftlLine
export function myAccount(applyType) {
  return request({
    url: "api/member/finance/account/my/" + applyType,
    method: "get",
  });
}

// 运输公司列表
export function getTransportList() {
  return request({
    url: "/api/demand/order/search/transport/list",
    method: "get",
  });
}

// 所有省份
export function getProvinceList() {
  return request({
    url: "/misc/geo/province/list",
    method: "get",
  });
}

// 所有市
export function getCityList(params) {
  return request({
    url: "/misc/geo/city/list?" + params,
    method: "get",
  });
}

// 分组获取所有市
export function getCityListGroup(data) {
  return requestJSON({
    url: "/misc/geo/city/grouplist",
    method: "post",
    data: data,
  });
}

// 省份分区
export function getProvinceArea() {
  return request({
    url: "/misc/geo/area/province",
    method: "get",
  });
}

// 所有包含区
export function findDistrictList(data) {
  return request({
    url: "/misc/geo/district/search",
    method: "post",
    data,
  });
}

// 所有包含区（全名搜索）
export function findDistrictFullList(data) {
  return request({
    url: "/misc/geo/district/search/fullname",
    method: "get",
    params: data,
  });
}

// 所有包含HUB的区（全名搜索）
export function findDistrictOfHubFullList(data) {
  return request({
    url: "/misc/geo/district/searchOfHub/fullname",
    method: "get",
    params: data,
  });
}

// 收费服务翻译
export function getExtraServer() {
  return request({
    url: "/misc/types/extra/service",
    method: "get",
  });
}

// 获取supply的卡车和司机列表
export function getSupplyTD() {
  return request({
    url: "/api/supply/list/my/td",
    method: "get",
  });
}

// 获取佛历年
export function getBcYear() {
  return request({
    url: "/misc/date/bc/year",
    method: "get",
  });
}

// 获取当月天数
export function getBcDay(year, month) {
  return request({
    url: `/misc/date/bc/days?bcYear=${year}&month=${month}`,
    method: "get",
  });
}

// 文件上传
export function upload(file) {
  return request({
    url: "/api/file/upload",
    method: "post",
    data: file,
  });
}

// 获取hub列表
export function getHub() {
  return request({
    url: "/api/ltl/hub/search/allStartHub",
    method: "post",
  });
}
