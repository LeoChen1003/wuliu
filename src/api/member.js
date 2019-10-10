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

export function getCredentials(apply_type) {
  return request({
    url: '/api/member/info',
    method: 'get',
    params: {
      apply_type: apply_type
    }
  })
}
