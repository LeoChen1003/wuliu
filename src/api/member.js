import request from '@/utils/request'

export function fillInfo(data) {
  return request({
    url: '/api/member/fill/info',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/api/member/info',
    method: 'get'
  })
}

export function getApplying(data) {
  return request({
    url: '/api/member/info/applying',
    method: 'get'
  })
}

export function getCredentials(apply_type) {
  return request({
    url: '/api/member/credentials/list',
    method: 'get',
    params: {
      apply_type: apply_type
    }
  })
}

// 查看所有申请列表
export function platformList() {
  return request({
    url: '/api/platform/audit/list',
    method: 'get'
  })
}

// 成为super
export function besuper() {
  return request({
    url: '/api/platform/super',
    method: 'get'
  })
}

// 提交申请
export function submitApply(apply_type, data) {
  return request({
    url: '/api/member/apply',
    method: 'post',
    data: {
      ...data,
      apply_type: apply_type
    }
  })
}

// 获取dc
export function getDc(data) {
  return request({
    url: '/api/member/info/dc',
    method: 'get'
  })
}

// 获取合同列表
export function getContract() {
  return request({
    url: '/api/member/contract/list',
    method: 'get'
  })
}
