import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/show',
    method: 'get'
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
