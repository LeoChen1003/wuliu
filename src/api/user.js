import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
}

export function getInfo() {
  return request({
    url: "/api/user/show",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/auth/logout",
    method: "post",
  });
}

// 注册
export function register(data) {
  return request({
    url: "/auth/register",
    method: "post",
    data,
  });
}

// 获取图片验证码
export function getCaptcha() {
  return request({
    url: "/misc/verify/verify",
    method: "get",
  });
}

// 图片验证码换取手机验证码
export function getMessageCode(data) {
  return request({
    url: "/misc/verify/sendSms",
    method: "post",
    data,
  });
}

export function forgot(data) {
  return request({
    url: "/auth/forgot/password",
    method: "post",
    data,
  });
}
