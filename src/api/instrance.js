/**
 * 2017/10/16
 * author: zhangwenlong
 * email: zhangwenlong@ccw163.com
 * 功能模块: axios底层的封装
 */
import axios from 'axios'
import qs from 'qs'
import iview from 'iview'
import Vue from 'vue'

Vue.prototype.$http = axios

const ax = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {}
})

export const itr = (type, url, params) => {
  if (typeof params !== 'object') {
    params = {}
  }
  let arg = qs.stringify(params)
  if (Object.keys(params).length > 0) {
    url = type === 'get' || type === 'delete' ? url + '?' + arg : url
  }
  return ax[type](url, arg)
}

export const g = (url, params) => {
  return base('get', url, params)
}

export const p = (url, params) => {
  return base('post', url, params)
}

export const d = (url, params) => {
  return base('delete', url, params)
}

export const u = (url, params) => {
  return base('put', url, params)
}
export const pa = (url, params) => {
  return base('patch', url, params)
}

export const op = (url, params) => {
  return base('options', url, params)
}

export function base(type, url, params) {
  return new Promise((resolve, reject) => {
    itr(type, url, params)
      .then(response => {
        if (response.data.status === 200) {
          resolve(response.data.data)
        } else {
          iview.Notice.error({
            title: '操作失败',
            desc: `<p>${response.data.message}<span style="color:#ff3300">${
              response.data.status
              }</span></p>`
          })
          reject(response.data.message)
        }
      })
      .catch(msg => {
        if (msg) {
          iview.Notice.error({
            title: '网络访问错误',
            desc: msg
          })
        }
        // reject(msg)
      })
  })
}
