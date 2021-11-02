import axios from 'axios'
import { get } from 'lodash'
import notification from 'ant-design-vue/es/notification'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// request interceptor
request.interceptors.response.use(
  response => response,
  err => {
      const status = get(err, 'response.status')
      if (status === 401) {
        notification.error({
          message: 'Unauthorized',
          description: '认证失败，正在跳转到登录页面'
        })
        window.location.href = '/user/login'
      }
      if (status === 400 || status === 500) {
        notification.error({
          message: err.response.data.data,
          description: err.response.data.msg + 'code：' + err.response.data.rescode
        })
      }
      return err.response
  }
)

export default request
