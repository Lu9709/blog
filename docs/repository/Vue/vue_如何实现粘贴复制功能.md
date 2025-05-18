# Vue 如何实现粘贴复制功能
### 安装第三方插件（不推荐）
```bash
npm install clipboard --save
```

```vue
<template>
  <span class="copy" @click="onCopy">
    <i class="iconfont iconcopy"></i>
    <span>点击复制</span>
  </span>
</template>

<script>
import Clipboard from 'clipboard';
export defalut {
  methods: {
    onCopy(){
      let clipboard = new Clipboard('.copy')
      clipboard.on('success', e => {
        console.log('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    }
  }
} 
</script>
```

### 使用浏览器自带Document.execCommand()复制方法（不推荐）
`Document.execCommand()`此特性已经弃用了，随时可能会无法正常工作，具体详情见下面卡片。

```vue
onCopy() {
    const copyTextarea = document.createElement('textarea')
    document.body.appendChild(copyTextarea)
    copyTextarea.innerText = value
    copyTextarea.select()
    document.execCommand('Copy')
    copyTextarea.parentNode.removeChild(copyTextarea)
}
```

[document.execCommand - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)

### <font style="color:rgb(37, 41, 51);">Clipboard.writeText方法（强烈推荐）</font>
局限性：由于安全策略原因只允许在`localhost`和`https`下进行复制，`http`下会报错。

```vue
onCopy() {
  navigator.clipboard.writeText(this.detailData.clientSecret).then(() => {
    this.$message.success('复制成功')
  })
}
```

### 推荐方法
```javascript
import { Message } from 'element-ui'

/**
  * @Description: 复制文本
  */
export function copyValue(value) {
  try {
    navigator.clipboard.writeText(value).then(() => Message.success('复制成功'))
  } catch (e) {
    try {
      const copyTextarea = document.createElement('textarea')
      console.log(copyTextarea.nodeType)
      document.body.appendChild(copyTextarea)
      copyTextarea.innerText = value
      copyTextarea.select()
      document.execCommand('Copy')
      copyTextarea.parentNode.removeChild(copyTextarea)
      Message.success('复制成功')
    } catch (e) {
      Message.error('复制失败，请手动复制')
    }
  }
}
```

