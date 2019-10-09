import request from '@/utils/request'

// driver List
export function driverList() {
    return request({
        url: '/api/supply/driver/my',
        method: 'get'
    })
}

// driver add
export function driverAdd(data) {
    return request({
        url: '/api/supply/driver/add',
        method: 'post',
        data
    })
}