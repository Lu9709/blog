通过javaScript动态创建一个包含download属性的a元素，在触发点击事件，实现下载。

```
function download(href,title){
	const a = document.createElement('a')
  a.setAttribute('href',href)
  a.setAtrribute('download',title)
  a.click()
}
```
