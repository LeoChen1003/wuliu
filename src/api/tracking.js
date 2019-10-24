import request from '@/utils/request'

// 订单列表
export function getOrder(params) {
  return request({
    url: '/api/supply/order/my/list',
    method: 'get',
    params
  })
}

// 订单进度
export function getOrderLog(id) {
  return request({
    url: `/api/supply/order/${id}/log`,
    method: 'get'
  })
}

// 获取订单数量
export function getOrderStatus() {
  return request({
    url: '/api/supply/order/my/order/status/count',
    method: 'get'
  })
}

// 提交订单
export function confirmOrder(id, truck_id, driver_id) {
  return request({
    url: '/api/supply/order/confirm/' + id,
    method: 'post',
    data: {
      truck_id: truck_id,
      driver_id: driver_id
    }
  })
}

// 需求方订单列表
export function demandOrderList(data) {
  return request({
    url: '/api/demand/order/list',
    method: 'get',
    params: data
  })
}

// (需求方）查看订单各个状态对应的订单数量
export function demandStatusCount() {
  return request({
    url: '/api/demand/order/status/count',
    method: 'get'
  })
}

// (需求方）查看竞价列表
export function demandquoteList(order_id) {
  return request({
    url: '/api/demand/order/quote/list/' + order_id,
    method: 'get'
  })
}

// (需求方）确认竞价
export function demandquoteConfirm(id, quoteId) {
  return request({
    url: '/api/demand/order/quote/confirm/' + id,
    method: 'post',
    data: {
      quote_id: quoteId
    }
  })
}
