/**
 * 2017/10/18
 * author: zhangwenlong
 * email: zhangwenlong@ccw163.com
 * 功能模块: 时间转换
 */

// 将分秒时间格式化
export function timeFormat (now) {
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  let hour = now.getHours()
  let minute = now.getMinutes()
  let second = now.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

// 时间戳格式化 yyyy-MM-dd hh:mm:ss
export function formatDateTime (inputTime) {
  if (inputTime) {
    var date = new Date(inputTime)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    var h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    var minute = date.getMinutes()
    var second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  }
}

export function formatDate(date, format) {
  var fmt = format || 'yyyy-MM-dd HH:mm';
  var day = new Date(date * 1000);

  let o = {
    'M+': day.getMonth() + 1, // 月份
    'd+': day.getDate(), // 日
    'H+': day.getHours(), // 小时
    'm+': day.getMinutes(), // 分
    's+': day.getSeconds(), // 秒
    'q+': Math.floor((day.getMonth() + 3) / 3), // 季度
    'S': day.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (day.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt;
}
