import request from "@/utils/request";
import requestJSON from "@/utils/requestJSON";

// ftlLine
export function ftlLine(data, data2) {
  return request({
    url: "/api/demand/order/search/ftlLine",
    method: "post",
    data,
    params: data2,
  });
}

// ltlLine
export function ltlLine(data, data2) {
  return requestJSON({
    url: "/api/ltl/line/lineSearch",
    method: "post",
    data,
    params: data2,
  });
}

// 获取所有路线s
export function ftlLines(data) {
  return request({
    url: "/api/demand/order/search/ftlLines",
    method: "get",
    params: data,
  });
}

// ftlLine
export function ftlCharge(data) {
  return request({
    url: "/api/demand/order/ftl/charge",
    method: "post",
    data,
  });
}

// 下单
export function placeOrder(data) {
  return requestJSON({
    url: "/api/demand/order/list",
    method: "post",
    data,
  });
}

// LTL下单
export function placeOrderLTL(data) {
  return requestJSON({
    url: "/api/ltl/line/placeOrder",
    method: "post",
    data,
  });
}

// LTL下单 前计算运费
export function calculationOrder(data) {
  return requestJSON({
    url: "/api/ltl/line/calculationOrder",
    method: "post",
    data,
  });
}

// 发布需求
export function releaseOrder(data) {
  return requestJSON({
    url: "/api/demand/order/demand",
    method: "post",
    data,
  });
}
