import request from "@/utils/request";
import requestJSON from "@/utils/requestJSON";

// 订单列表
export function getOrder(params) {
  return request({
    url: "/api/supply/order/my/list",
    method: "get",
    params,
  });
}

// 订单进度
export function getOrderLog(id) {
  return request({
    url: `/api/supply/order/${id}/log`,
    method: "get",
  });
}

// 获取订单数量
export function getOrderStatus() {
  return request({
    url: "/api/supply/order/my/order/status/count",
    method: "get",
  });
}

// 平台订单列表
export function getOrderPF(params) {
  return request({
    url: "/api/platform/order/list",
    method: "get",
    params,
  });
}

// 平台订单列表
export function getOrderLTLPF(params) {
  return request({
    url: "/api/ltl/platform/statusOrder",
    method: "get",
    params,
  });
}

// 平台订单进度
export function getOrderLogPF(id) {
  return request({
    url: `/api/platform/order/${id}/log`,
    method: "get",
  });
}

// 平台获取订单数量
export function getOrderStatusPF() {
  return request({
    url: "/api/platform/order/status/count",
    method: "get",
  });
}

// 平台获取订单数量
export function getOrderLTLStatusPF(params) {
  return request({
    url: "/api/ltl/platform/show",
    method: "get",
    params,
  });
}

// 提交订单
export function confirmOrder(id, truck_id, driver_id) {
  return request({
    url: "/api/supply/order/confirm/" + id,
    method: "post",
    data: {
      truck_id: truck_id,
      driver_id: driver_id,
    },
  });
}

// 拒绝订单
export function rejectOrder(id, reason) {
  return request({
    url: "/api/supply/order/refuse/" + id,
    method: "post",
    data: {
      reason: reason,
    },
  });
}

// 需求方订单列表
export function demandOrderList(data) {
  return request({
    url: "/api/demand/order/list",
    method: "get",
    params: data,
  });
}

// (需求方）查看订单各个状态对应的订单数量
export function demandStatusCount() {
  return request({
    url: "/api/demand/order/status/count",
    method: "get",
  });
}

// (需求方）查看竞价列表
export function demandquoteList(order_id) {
  return request({
    url: "/api/demand/order/quote/list/" + order_id,
    method: "get",
  });
}

// (需求方）确认竞价
export function demandquoteConfirm(id, quoteId) {
  return request({
    url: "/api/demand/order/quote/confirm/" + id,
    method: "post",
    data: {
      quote_id: quoteId,
    },
  });
}

// 评分
export function orderRating(id, rating, remark) {
  return request({
    url: `/api/demand/order/score/${id}`,
    method: "post",
    data: {
      rating: rating,
      remark: remark,
    },
  });
}

// 待取件状态设置
export function updateOrderInfo(id, truck_id, driver_id) {
  return request({
    url: `/api/supply/order/update/ftl/info/${id}`,
    method: "post",
    data: {
      truck_id: truck_id,
      driver_id: driver_id,
    },
  });
}

// 返程卡车
export function returnTruck(id, charge, backTime) {
  return request({
    url: `/api/supply/order/publish/ftl/back/${id}`,
    method: "post",
    data: {
      charge: charge,
      backTime: backTime,
    },
  });
}

// SUPPLY返回文件
export function returnDocument(id, data) {
  return request({
    url: `/api/supply/order/confirm/returnfile/${id}`,
    method: "post",
    data: data,
  });
}

// DEMAND确认返回文件
export function confirmRD(id) {
  return request({
    url: `/api/demand/order/complete/${id}`,
    method: "post",
  });
}

// DEMAND确认返回文件图片获取
export function getImg(ids) {
  return request({
    url: `/api/resource/part`,
    method: "get",
    params: {
      ids: ids,
    },
  });
}

//ltl获取跟单列表
export function getLtlOrders(orderStatus, data) {
  return request({
    url: `/api/ltl/order/demand/${orderStatus}`,
    method: "get",
    params: data,
  })
}

// supplyLTL 订单列表
export function getSupplyLTLOrder(data) {
  return request({
    url: `/api/ltl/supply/statusOrder`,
    method: "get",
    params: data,
  });
}

//ltl路线各个订单状态数量
export function getLtlOrdersCount() {
  return request({
    url: "/api/ltl/order/demand/count",
    method: "get",
  });
}

//DEMAND发货到HUB
export function postsendtohub(data) {
  return requestJSON({
    url: `/api/ltl/sendtohub/send`,
    method: "get",
    params: data,
  });
}

// (supply）查看订单各个状态对应的订单数量
export function supplyStatusCount(data) {
  return request({
    url: "/api/ltl/supply/show",
    method: "get",
    params: data,
  });
}

// (supply）查看订单各个状态对应的订单数量
export function chooseDriverAndTruck(data) {
  return requestJSON({
    url: "/api/ltl/supply/chooseDriverAndTruck",
    method: "post",
    data,
  });
}
