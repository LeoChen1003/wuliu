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

export function supplyFinance(status, data) {
  return request({
    url: '/api/supply/finance/list/' + status,
    method: 'get',
    params: data
  })
}

export function demandFinance(status, data) {
  return request({
    url: '/api/demand/finance/list/' + status,
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

// 充值各状态数量
export function billTopUpCount(applyType) {
  return request({
    url: 'api/member/finance/status/count/' + applyType,
    method: 'get'
  })
}

// 平台充值各状态数量
export function billplatformCount(applyType) {
  return request({
    url: 'api/platform/finance/apply/status/count',
    method: 'get'
  })
}

// demand账单
export function billdemandCount(data) {
  return request({
    url: 'api/demand/finance/status/count',
    method: 'get',
    params: data
  })
}

// supply账单
export function billsupplyCount(data) {
  return request({
    url: 'api/supply/finance/status/count',
    method: 'get',
    params: data
  })
}
