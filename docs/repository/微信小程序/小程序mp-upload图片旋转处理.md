# 小程序mp-upload图片旋转处理
由于小程序官方组件 `mp-upload` 并没有在图片上传的时候，不管横着竖着拍，微信算法都会将图片进行反转处理，但有的时候拍好的照片是横着的，但处理成竖着了，以至于上传的时候达不到预期。所以需要添加一步将图片进行旋转处理，于是采用了canvas绘画的方法。

::: code-group
```html [index.html]
<view class="page">
  <mp-cell>
    <mp-uploader bindfail="uploadError" bindsuccess="uploadSuccess" select="{{selectFile}}" upload="{{uplaodFile}}"
                 files="{{files}}" max-count="5" title="图片上传" tips="图片上传提示" delete="{{false}}"></mp-uploader>
  </mp-cell>
  <view class="imageWrapper" wx:if="{{imageVisible}}">
    <image class="{{[orient]}}" mode="aspectFit" src="{{path}}"/>
    <view class="buttonGroup">
      <view class="button" bindtap="imageRotate">旋转</view>
      <view class="button" bindtap="confirm">确定</view>
    </view>
  </view>
</view>
<canvas wx:if="{{canVisible}}" canvas-id="{{canvasId}}" style="position: fixed;top: -10000px;width:{{canWidth}}px;height:{{canHeight}}px"/>

```

```js [index.js]
import {getImageData, getFloatLocationByExif} from './izExif.js';
import config from '../../env';

Page({
  data: {
    path: '',
    visible: false, // 是否显示
    files: [],
    width: 400,
    height: 300,
    canWidth: 400,
    canHeight: 300,
    rotary: 1, //旋转方向
    saveRotary: 4, //存旋转的方向
    timeStamp:'',
    orient:'', //image的旋转方向class
    imageVisible:false,
    canVisible:false
  },
  onLoad() {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    });
  },
  show: function () {
    this.setData({
      show: true
    });
  },
  selectFile(files) {
    wx.showLoading({
      title:'图片加载中'
    })
    console.log('files', files);
  },
  uplaodFile(files) {
    // 文件上传的函数，返回一个promise
    let timeStamp = Date.parse(new Date())
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: files.tempFilePaths[0],
        success: (res) => {
          const {path, width, height} = res;
          wx.showLoading({
            title: '图片加载中',
          });
          this.setData({
            width: width,
            height: height,
            canWidth: width,
            canHeight: height,
            path: path,
            canvasId: 'myCanvas'+timeStamp
          });
          this.showImage()
          wx.hideLoading();
        }
      });
    });
  },
  showImage(){
    let {imageVisible} = this.data
    this.setData({
      imageVisible: !imageVisible
    })
    wx.hideLoading()
  },
  imageRotate(){
    let {rotary} = this.data;
    let that = this;
    // 画布内旋转
    // 旋转90度
    switch (rotary) {
    case 1 : {
      that.setData({
        rotary: 2,
        saveRotary: 1,
        orient:'one'
      });
      console.log('旋转90度');
      break;
    }
    case 2: {
      that.setData({
        rotary: 3,
        saveRotary: 2,
        orient:'two'
      });
      console.log('旋转180度');
      break;
    }
    case 3: {
      //顺时针旋转270度
      that.setData({
        rotary: 4,
        saveRotary: 3,
        orient:'three'
      });
      console.log('旋转270度');
      break;
    }
    case 4: {
      that.setData({
        rotary: 1,
        saveRotary: 4,
        orient:'four'
      });
      console.log('旋转360度');
      break;
    }
    }
  },
  // 图片旋转后确认
  confirm() {
    let { path, width, height, saveRotary,canvasId,imageVisible} = this.data;
    let newWidth,newHeight
    let systemModel = wx.getStorageSync('systemModel')
    let writePhotoStatus = wx.getStorageSync('writePhotoStatus')
    // 保存到手机相册
    if(writePhotoStatus){
      if(systemModel){
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success:(res)=>{
            wx.showToast({
              title:'保存成功',
              icon:'success',
            })
          },
          fail:(res)=> {
            wx.showToast({
              title:'保存失败',
              icon:'fail',
            })
          }
        })
      }
    }
    let ctx = wx.createCanvasContext(canvasId, this);
    this.setData({canVisible: true})
    wx.showLoading({title:'图片处理中'})
    let that = this;
    return new Promise((resolve,reject)=>{
      switch (saveRotary) {
      case 1 : {
        that.setData({
          canWidth: height,
          canHeight: width,
        });
        newWidth = height
        newHeight = width
        ctx.translate(height / 2, width / 2);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(path, -width / 2, -height / 2, width, height);
        console.log('旋转90度');
        break;
      }
      case 2: {
        that.setData({
          canWidth: width,
          canHeight: height
        });
        newWidth = width
        newHeight = height
        ctx.translate(width / 2, height / 2);
        ctx.rotate(180 * Math.PI / 180);
        ctx.drawImage(path, -width / 2, -height / 2, width, height);
        console.log('旋转180度');
        break;
      }
      case 3: {
        //顺时针旋转270度
        that.setData({
          canWidth: height,
          canHeight: width
        });
        newWidth = height
        newHeight = width
        ctx.translate(height / 2, width / 2);
        ctx.rotate(270 * Math.PI / 180);
        ctx.drawImage(path, -width / 2, -height / 2, width, height);
        console.log('旋转270度');
        break;
      }
      case 4: {
        wx.uploadFile({
          url: config.host + 'api/web/upload/uploadImage',
          filePath: path,
          name: 'file',
          header: {
            'token': wx.getStorageSync('access_token')
          },
          success: (res) => {
            that.setData({
              canVisible: false,
              files:[JSON.parse(res.data).data],
              imageVisible:!imageVisible,
              rotary: 1,
              saveRotary: 4,
              orient:''
            })
            resolve({urls: [JSON.parse(res.data).data]});
            wx.hideLoading()
          }
        });
        console.log('旋转360度');
        return;
      }
      }
      ctx.draw(false, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: canvasId,
            x: 0,
            y: 0,
            width: newWidth,
            height: newHeight,
            destWidth: newWidth,
            destHeight: newHeight,
            fileType: 'jpg',
            success: (res) => {
              wx.uploadFile({
                url: config.host + 'api/web/upload/uploadImage',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  'token': wx.getStorageSync('access_token')
                },
                success: (res) => {
                  that.setData({
                    canVisible: false,
                    files:[JSON.parse(res.data).data],
                    imageVisible:!imageVisible,
                    rotary: 1,
                    saveRotary: 4,
                    orient:''
                  })
                  wx.hideLoading()
                  resolve({urls: [JSON.parse(res.data).data]});
                }
              });
  
            }
          },this);
        });
      });
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail.urls);
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail.urls[0]);
    let {files} = this.data;
    files.push(e.detail.urls[0]);
    this.setData({
      files: files
    });
  }
});
```


```css [index.less]
.one{
  transform: rotate(90deg);
}
.two{
  transform: rotate(180deg);
}
.three{
  transform: rotate(270deg);
}
.four{
  transform: rotate(360deg);
}
.imageWrapper{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  image{
    flex:1
  }
  .buttonGroup{
    padding: 100rpx;
    color:#fff;
    display: flex;
    .button{
      padding:0 80rpx;
    }
  } 
}
```

```json [index.json]
{
  "component": true,
  "usingComponents": {
    "mp-uploader": "weui-miniprogram/uploader/uploader"
  }
}
```



