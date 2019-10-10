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

export function uploadF(data, params) {
  return request({
    url: '/api/member/upload',
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    params: params,
    data
  })
}
