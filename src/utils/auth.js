import Cookies from 'js-cookie'

const TokenKey = 'token'
const Rid = 'rid'


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRid() {
  return Cookies.get(Rid)
}

export function setRid(rid) {
  return Cookies.set(Rid, rid)
}

export function removeRid() {
  return Cookies.remove(Rid)
}
