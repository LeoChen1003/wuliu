import request from '@/utils/request'

export function topUpList(applyType, applyStatus, data) {
  return request({
    url: '/api/member/finance/apply/my/' + applyType + '/' + applyStatus,
    method: 'get',
    data
  })
}

export function topUp(data) {
  return request({
    url: '/api/member/finance/apply/new_top_up',
    method: 'post',
    data
  })
}
