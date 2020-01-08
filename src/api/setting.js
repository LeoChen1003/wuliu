import request from "@/utils/request";
import requestJSON from "@/utils/requestJSON";

// 保存路线模板
export function saveLineTemplate(data) {
  return requestJSON({
    url: "/api/ltl/lineTemplate/save",
    method: "post",
    data: {
      lineTemplate: data,
    },
  });
}

// 模板列表查询
export function getLineTemplate(params) {
  return request({
    url: "/api/ltl/lineTemplate/show",
    method: "get",
    params: params,
  });
}

// 模板详情查询
export function getLineTemplateDetail(id) {
  return request({
    url: "/api/ltl/lineTemplate/show/id",
    method: "get",
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
