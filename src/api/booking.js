import request from '@/utils/request'
import requestJSON from '@/utils/requestJSON'

// ftlLine
export function ftlLine(data, data2) {
  return request({
    url: '/api/demand/order/search/ftlLine',
    method: 'post',
    data,
    params: data2
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
  return requestJSON({
    url: '/api/demand/order/list',
    method: 'post',
    data
  })
}
