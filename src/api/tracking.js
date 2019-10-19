import request from '@/utils/request'

// 待运输公司抢单订单
export function orderShop() {
  return request({
    url: '/api/supply/order/shop/list',
    method: 'get'
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
