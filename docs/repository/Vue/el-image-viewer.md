# el-image-viewer

> element-ui之el-image-viewer的图片查看器
>

查看源码，它的props接受5个分别是<font style="color:#9876aa;">urlList(图片url数组)、zIndex(视图层级)、onSwitch(切换图片)、onClose(关闭图片预览)、initialIndex(初始化下标)</font>

#### 使用方法：
```vue
<template>
	<div>
    <el-button @click="onPreview">预览</el-button>
     <el-image-viewer
      v-if="showViewer"
      :initial-index="initialIndex"
      :on-close="closeViewer"
      :url-list="fileUrlList" />
  </div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
	components:{ElImageViewer},
  data() {
    return {
    	showViewer:false, //显示图片
      initialIndex:0, //显示图片列表的下标
      fileUrlList:[], // 图片列表url存放
    }
  }
  methods:{
  	onPreview(){
      this.showViewer = true
  	},
		closeViewer(){
    	this.showViewer = false
    }
	}
}
</script>

```



