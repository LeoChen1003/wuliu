/* eslint-disable import/prefer-default-export */
import request from "@/utils/request";

// 根据筛选条件获取入库的发货列表
export function getInboundList(status, params) {
  return request({
    url: `/api/ltl/sendtohub/warehousing/${status}`,
    method: "get",
    params,
  });
}

// 根据筛选条件获取出库的发货列表
export function getOutboundList(status, params) {
  return request({
    url: `/api/ltl/sendtohub/outwarehouse/${status}`,
    method: "get",
    params,
  });
}

// 入库 获取货物清单
export function getInboundProperty(sendToHubId, status, params) {
  return request({
    url: `/api/ltl/sendtohub/${sendToHubId}/${status}`,
    method: "get",
    params,
  });
}
