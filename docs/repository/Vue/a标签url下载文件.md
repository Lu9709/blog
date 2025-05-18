# 使用 a 标签 URL 下载文件

利用a标签下载时，如果是浏览器可以解析的会被直接打开，不能解析则进行下载的动作。

## 常见问题与解决方案

### 问题一：浏览器直接打开而不下载文件

**解决方法**：后端在响应头上添加 `content-type=application/octet-stream`;

### 问题二：自定义下载文件名

在使用a标签下载文件时，`download`属性可以更改下载的文件名。

### 问题三：跨域下载文件名无效

但是当a标签的下载链接跨域时，`download` 属性将不会生效，原因是浏览器无法获取到文件，不能对他进行更改。

**解决方法**：可以通过http先将文件下载后再重命名，前提是后端允许跨域，但这种方法有个弊端，就是下载的文件如果特别大会导致长时间没反应，用户体验不好。

## 代码实现

```javascript
/**
 * Url下载文件
 * -
 * 通过HTTP将文件先下载在重新修改文件名
 * @param {string} url
 * @param {string} fileName
 */
export function downloadUrlFile (url, fileName) {
  const xml = new XMLHttpRequest()
  xml.open('GET', url, true)
  xml.responseType = 'blob'
  xml.onload = () => {
    const _url = window.URL.createObjectURL(xml.response)
    const a = document.createElement('a')
    a.href = _url
    a.download = fileName
    // 使用a标签批量下载文件时最好使用_blank，否则只会下载最后一个文件
    a.setAttribute('target', '_blank')
    a.click()
    a.remove()
  }
  xml.send()
}
```

[download-属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)

此属性指示浏览器下载 URL 而不是导航到它，因此将提示用户将其保存为本地文件。如果属性有一个值，那么此值将在下载保存过程中作为预填充的文件名（如果用户需要，仍然可以更改文件名）。此属性对允许的值没有限制，但是 / 和 \ 会被转换为下划线。大多数文件系统限制了文件名中的标点符号，故此，浏览器将相应地调整建议的文件名。

+ 此属性仅适用于[同源 URL](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)。
+ 尽管 HTTP URL 需要位于同一源中，但是可以使用 [blob:URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) 和 [data:URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) ，以方便用户下载使用 JavaScript 生成的内容（例如使用在线绘图 Web 应用程序创建的照片）。
+ 如果 HTTP 头中的 [Content-Disposition](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition) 属性赋予了一个不同于此属性的文件名，HTTP 头属性优先于此属性。
+ 如果 HTTP 头属性`Content-Disposition`被设置为 `inline`（即 `Content-Disposition='inline'`），那么 Firefox 优先考虑 HTTP 头`Content-Disposition download`属性。

[a - HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#attr-download)

