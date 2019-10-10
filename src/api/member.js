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

export function uploadFile(data) {
  return request({
    url: '/api/member/upload',
    method: 'post',
    data
  })
}

// 查看所有申请列表
export function platformList(data) {
  return request({
    url: '/api/platform/audit/list',
    method: 'get',
    params: data
  })
}

// 资质资料
export function credentialsList() {
  return request({
    url: '/api/member/credentials/list',
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
