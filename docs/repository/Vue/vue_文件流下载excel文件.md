# Vue文件流下载excel文件
后端返回文件流，前端进行下载处理

需要在请求拦截器里对文件下载的接口进行处理将响应类型改为`responseType = 'blob'`,这样就能拿到后台数据了，但响应拦截器里可能也需要进行处理将那些文件下载的接口放入白名单进行处理。

```javascript
import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 50000 // 超时时间设置
})

// 请求拦截器
service.interceptors.request.use(config => {
    let URL = config.url
    if (URL.slice(-17)=== 'admin/cert/export'){ //下载文件流接口
      config.responseType = 'blob';
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
	response => {
    const {data,status,config} = response
    let whiteUrl = config.url.slice(config.baseURL.length)
    if(whiteUrl === '/admin/cert/export') //白名单进行处理
      return Promise.resolve(data)
    }
  	if(status === 200){
  		const {res,code,msg} = response
      gobalLoading.close();
      if (res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(message)
      }
		}
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
```

文件流转`blob`对象下载

```javascript
// 文件流转blob对象下载
export function downloadFile(data,fileName) {
  let blob = new Blob([data], {type: "application/vnd.ms-excel"});
  // 获取heads中的filename文件名
  let downloadElement = document.createElement('a');
  // 创建下载的链接
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
}
```



