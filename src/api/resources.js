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

// driver edit
export function driverEdit(id, data) {
  return request({
    url: '/api/supply/driver/' + id,
    method: 'patch',
    data
  })
}

// Truck List
export function truckList() {
  return request({
    url: '/api/supply/trucks/my',
    method: 'get'
  })
}

// Truck add
export function truckAdd(data) {
  return request({
    url: '/api/supply/trucks/add',
    method: 'post',
    data
  })
}

// Truck edit
export function truckEdit(data) {
  return request({
    url: '/api/supply/trucks/modify',
    method: 'post',
    data
  })
}
