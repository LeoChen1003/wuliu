import request from "@/utils/request";

export function fillInfo(data) {
  return request({
    url: "/api/member/fill/info",
    method: "post",
    data
  });
}

export function getInfo(data) {
  return request({
    url: "/api/member/info",
    method: "get"
  });
}

export function getApplying(data) {
  return request({
    url: "/api/member/info/applying",
    method: "get"
  });
}

export function getCredentials(apply_type) {
  return request({
    url: "/api/member/credentials/list",
    method: "get",
    params: {
      apply_type: apply_type
    }
  });
}

// 查看所有申请列表
export function platformList(auditStatus, data) {
  return request({
    url: "/api/platform/audit/list/" + auditStatus,
    method: "get",
    params: data
  });
}

// 同意申请
export function platformAccept(data) {
  return request({
    url: "/api/platform/audit/accept",
    method: "post",
    data
  });
}

// 拒绝申请
export function platformRefuse(data) {
  return request({
    url: "/api/platform/audit/refuse",
    method: "post",
    data
  });
}

// 拒绝申请
export function platformActive(data) {
  return request({
    url: "/api/platform/audit/activate",
    method: "post",
    data
  });
}

// 成为super
export function besuper() {
  return request({
    url: "/api/platform/super",
    method: "get"
  });
}

// 提交申请
export function submitApply(apply_type, data) {
  return request({
    url: "/api/member/apply",
    method: "post",
    data: {
      ...data,
      apply_type: apply_type
    }
  });
}

// 获取dc
export function getDc(data) {
  return request({
    url: "/api/member/info/dc",
    method: "get"
  });
}

// platform 获取dc
export function dcInfo(site_id) {
  return request({
    url: "api/member/info/dc/" + site_id,
    method: "get"
  });
}

// platform 获取dc
export function appliedInfo(site_id) {
  return request({
    url: "api/platform/audit/applied/" + site_id,
    method: "get"
  });
}

// 获取合同列表
export function getContract() {
  return request({
    url: "/api/member/contract/list",
    method: "get"
  });
}

// 下载合同
export function downContract(applyType) {
  return request({
    url: "/misc/pdf/download",
    method: "get",
    params: {
      applyType: applyType
    }
  });
}
