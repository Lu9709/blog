# js图片网络地址转为文件流

1. 创建XMLHttpRequest对象
2. 设置调用方式为GET
3. 设置请求头参数：主要设置文件类型
4. 设置响应类型：responseType为“blob”
5. 调用

```javascript
/**
 * 根据图片url转为png文件对象
 * @param url
 * @param imageName
 * @returns {Promise<unknown>}
 */
function getImageFileFromUrl(url, imageName) {
    return new Promise((resolve, reject) => {
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Accept', 'image/png');
        xhr.responseType = "blob";
        // 加载时处理
        xhr.onload = () => {
            // 获取返回结果
            blob = xhr.response;
            let imgFile = new File([blob], imageName, { type: 'image/png' });
            // 返回结果
            resolve(imgFile);
        };
        xhr.onerror = (e) => {
            reject(e)
        };
        // 发送
        xhr.send();
    });
}
```
