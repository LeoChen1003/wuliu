import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function getCaptcha() {
  return request({
    url: '/misc/verify/verify',
    method: 'get'
  })
}

export function getMessageCode(data) {
  return request({
    url: 'misc/verify/sendSms',
    method: 'post',
    data
  })
}
