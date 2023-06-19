import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'

//创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
//请求拦截器
request.interceptors.request.use((config) => {
  const store = useAppStore()
  const token = store.getToken()
  if (token) {
    config.headers.AccountToken = token
  }
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.data?.code === 0) {
      return response.data
    }
    ElMessage({
      type: 'warning',
      message: response.data?.message,
    })
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
