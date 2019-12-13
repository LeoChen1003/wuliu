import request from "@/utils/request";
import requestJSON from "@/utils/requestJSON";

// 保存路线模板
export function saveLineTemplate(data) {
  return requestJSON({
    url: "/api/ltl/lineTemplate/save",
    method: "post",
    data: data,
  });
}

// 模板查询
export function getLineTemplate(params) {
  return request({
    url: "/api/ltl/lineTemplate/show",
    method: "get",
    params: params,
  });
}

// 模板数量查询
export function getLineTemplateCount(params) {
  return request({
    url: "/api/ltl/lineTemplate/countLineByStatus",
    method: "get",
    params: params,
  });
}
