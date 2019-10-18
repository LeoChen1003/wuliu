import request from '@/utils/request'

// 待运输公司抢单订单
export function orderShop() {
  return request({
    url: '/api/supply/order/shop/list',
    method: 'get'
  })
}
