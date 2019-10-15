import request from '@/utils/request'

// ftlLine
export function ftlLine(data) {
  return request({
    url: '/api/demand/order/search/ftlLine',
    method: 'post',
    data
  })
}

// ftlLine
export function ftlCharge(data) {
  return request({
    url: '/api/demand/order/ftl/charge',
    method: 'post',
    data
  })
}

// ftlLine
export function placeOrder(data) {
  return request({
    url: '/api/demand/order/list',
    method: 'post',
    data
  })
}
