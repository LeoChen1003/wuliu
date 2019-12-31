import request from "@/utils/request";

// 待运输公司抢单订单
export function orderShop(data) {
  return request({
    url: "/api/supply/order/shop/list",
    method: "get",
    params: data,
  });
}

// 报价抢单
export function quoteOrder(order_id, data) {
  return request({
    url: "/api/supply/order/quote/" + order_id,
    method: "post",
    data,
  });
}

// 订单进度
export function getOrderLog(id) {
  return request({
    url: `/api/supply/order/${id}/log`,
    method: "get",
  });
}
