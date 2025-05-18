# 使用js-file-download下载文件流文件
```javascript
//下载插件
npm install js-file-download --save
//引入插件
import fileDownload from 'js-file-download'
//使用
fileDownload(res,'文件名.后缀')//后缀需要与后端确定  res为后端返回的文件流
```

