import request from '@/utils/request'

// ftlLine
export function ftlLine(data) {
  return request({
    url: '/api/demand/order/search/ftlLine',
    method: 'post',
    data
  })
}
