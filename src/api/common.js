import * as ax from './instrance'

// 登录
export const login = params => {
  return ax.p('/site/web-anchor-login', params)
}
// 登出
export const logout = params => {
  return ax.g('/site/logout', params)
}
// 个人信息
export const getUserInfo = params => {
  return ax.g('/user/anchor/info', params)
}
// 课程列表
export const getCourseList = params => {
  return ax.g('/user/anchor/course-manages-list', params)
}
// 删除课程
export const deleteCourse = params => {
  return ax.p('/user/anchor/delete-course', params)
}
// 删除系列课时
export const deletePeriod = params => {
  return ax.p('/user/anchor/delete-period', params)
}
// 单次课详情
export const getSingleDetails = params => {
  return ax.p('/user/anchor/single', params)
}
// 获取系列课详情
export const getSeriesDetails = params => {
  return ax.p('/user/anchor/set', params)
}
// 系列课时详情
export const getSeriesPeriodDetails = params => {
  return ax.p('/user/anchor/period', params)
}
// 课程分类
export const getResourceGuide = params => {
  return ax.g('/resource/guide', params)
}
// 系列课时管理列表
export const getSeriesPeriodList = params => {
  return ax.g('/user/anchor/period-manages-list', params)
}

// 上传图片
export const uploadImg = params => {
  return ax.p('/upload/image', params)
}
// 上传base64图片
export const uploadImage64 = params => {
  return ax.p('/upload/image-base64', params)
}
// 上传音频获取的key
export const getUploadAudioKey = params => {
  return ax.p('/upload/audio-key', params)
}

// 创建课程
export const createCourse = params => {
  return ax.p('/user/course/generate-course', params)
}
//创建课时
export const createPeriod = params => {
  return ax.p('/user/course/generate-period', params)
}
// 修改课程
export const updateCourse = params => {
  return ax.p('/user/course/edit-course', params)
}
// 修改课时
export const updataPeriod = params => {
  return ax.p('/user/course/edit-period', params)
}
