import request from "@/utils/request";
import requestJSON from "@/utils/requestJSON";

// driver List
export function driverList() {
  return request({
    url: "/api/supply/driver/my",
    method: "get",
  });
}

// driver add
export function driverAdd(data) {
  return request({
    url: "/api/supply/driver/add",
    method: "post",
    data,
  });
}

// driver edit
export function driverEdit(id, data) {
  return request({
    url: "/api/supply/driver/" + id,
    method: "patch",
    data,
  });
}

// Truck List
export function truckList() {
  return request({
    url: "/api/supply/trucks/my",
    method: "get",
  });
}

// Truck add
export function truckAdd(data) {
  return request({
    url: "/api/supply/trucks/add",
    method: "post",
    data,
  });
}

// Truck edit
export function truckEdit(data) {
  return request({
    url: "/api/supply/trucks/modify",
    method: "post",
    data,
  });
}

// 列出当前所有线路
export function getRoute(params) {
  return request({
    url: "/api/supply/ftl/my",
    method: "get",
    params,
  });
}

// 提交新线路
export function addRoute(data) {
  return requestJSON({
    url: "/api/supply/ftl/add",
    method: "post",
    data,
  });
}

// 修改线路
export function updateRoute(id, data) {
  return requestJSON({
    url: "/api/supply/ftl/update/" + id,
    method: "post",
    data,
  });
}

// 重置密码
export function resetPassword(id) {
  return request({
    url: `/api/supply/trucks/reset`,
    method: "post",
    data: {
      id: id,
    },
  });
}

// 计算距离天数
export function getCityDT(originCode, destinationCodes, category) {
  return request({
    url: `/api/supply/ftl/get/citydistanceandtime`,
    method: "post",
    data: {
      originCode: originCode,
      destinationCodes: destinationCodes,
      category: category,
    },
  });
}

// ltl可用路线模板
export function getLineTemplateShow(params) {
  return request({
    url: "/api/ltl/lineTemplate/supplyShow",
    method: "get",
    params: params,
  });
}

// ltl线路保存
export function addLTLRoute(data) {
  return requestJSON({
    url: "/api/ltl/line/save",
    method: "post",
    data: {
      ltlLine: data,
    },
  });
}

// ltl线路查询
export function getLTLRoute(params) {
  return requestJSON({
    url: "/api/ltl/line/show",
    method: "get",
    params,
  });
}
