# 微信小程序分享转发-uni-app

小程序分享有两种方式一是通过右上角三个点的胶囊弹出转发，二是通过自定义按钮来触发。

### 胶囊按钮触发转发
需要在转发的页面内写[onShareAppMessage](https://uniapp.dcloud.net.cn/api/plugins/share?id=onshareappmessage)方法

```javascript
onShareAppMessage(res){
  return {
    title: '转发标题',
    desc:'自定义分享描述',
    imageUrl: '', // 图片 URL 显示长宽比为5:4
    query:'', //参数
    path:'', //路径
    success:()=>{},
    fail:()=>{},
    complete:()=>{}
  }
}
```

### 自定义按钮触发

放置在页面中的分享按钮，需要设置一个`<button open-type="share">`

```javascript
<button class="shareButton" open-type="share" hover-class="btn-hover">
    <image src="../static/svg/share.svg"/>
    <text class="text">分享</text>
</button>
```

去除button原样式。

```css
.btn-hover {
  background-color:none;
}
.shareButton {
  background: none;
}
```

也需要在页面添加[onShareAppMessage](https://uniapp.dcloud.net.cn/api/plugins/share?id=onshareappmessage)方法

```javascript
onShareAppMessage(res){
  if(res.from === 'button') {// 来自页面内分享按钮 
   // button（页面内分享按钮）、menu（右上角分享按钮）
      console.log(res.target) 
   // 如果from为button则target触发这次分享事件的button，否则为undefined
  }
  return {
    title: '转发标题',
    desc:'自定义分享描述',
    imageUrl: '', // 图片 URL 显示长宽比为5:4
    query:'', //参数
    path:'', //路径
    success:()=>{},
    fail:()=>{},
    complete:()=>{}
  }
}
```

### 分享朋友圈
监听用户点击右上角菜单按钮[onShareTimeline](https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareTimeline.html)

```javascript
  onShareTimeline() {
    return {
      title: '分享朋友圈',
      query: '',
      imageUrl: '',
    }
  },
 offShareTimeline() //取消分享
```

### 全局添加分享转发方法
由于可能每个页面都需要添加分享转发的功能，可以通过`Minxin`的方式混入，在每个页面都添加`onShareAppMessage`和`onShareTimeline`方法。创建一个`share.js`

```javascript
export default {
  data() {
    return {
      //设置默认的分享参数
      share: {
        title: '分享标题',
        path: '分享路径',
        imageUrl: '分享图片路径',
        content: '',
      },
    }
  },
  onLoad() {
    // 可以通过获取当前页面的路由来自己定义分享参数 或 使用默认参数
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = `/${currentPage.route}`
    console.log(currentPage, url)
  },
  // 使用默认参数
  onShareAppMessage(res) {
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl,
      desc: this.share.desc,
      content: this.share.content,
      success:(res) => {
        console.log(this.share.path)
        uni.showToast({
          title: '分享成功'
        })
      },
      fail:(res) => {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
        })
      },
    }
  },
  onShareTimeline() {
    return {
      title: '分享朋友圈',
      query: '',
      imageUrl: '',
    }
  },
}
```

还需要在`main.js`将这个`share.js`的对象注入进去

```javascript
import Vue from 'vue'
import App from './App'
// 分享
import share from "@/utils/share";
Vue.mixin(share)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
```

