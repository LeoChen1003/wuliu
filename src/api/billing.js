import request from '@/utils/request'

export function topUpList(applyType, applyStatus, data) {
  return request({
    url: '/api/member/finance/apply/my/' + applyType + '/' + applyStatus,
    method: 'get',
    params: data
  })
}

export function topUp(data) {
  return request({
    url: '/api/member/finance/apply/new_top_up',
    method: 'post',
    data
  })
}

export function journalList(data) {
  return request({
    url: '/api/member/finance/records/mine',
    method: 'get',
    params: data
  })
}

// platform  list
export function billingList(data, data2) {
  return request({
    url: '/api/platform/finance/apply/list',
    method: 'post',
    data,
    params: data2
  })
}

// platform  accept
export function billingAccept(data) {
  return request({
    url: '/api/platform/finance/apply/accept',
    method: 'post',
    data
  })
}

// platform  reject
export function billingReject(data) {
  return request({
    url: '/api/platform/finance/apply/reject',
    method: 'post',
    data
  })
}
