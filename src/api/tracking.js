import request from '@/utils/request'

// 订单列表
export function getOrder(params) {
  return request({
    url: '/api/supply/order/my/list',
    method: 'get',
    params
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
