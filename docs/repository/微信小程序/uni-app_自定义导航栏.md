# uni-app 自定义导航栏

由于很多项目中需要用到自定义的导航栏，参考资料`getMenuButtonBoundingClientRect()`<font style="color:rgb(34, 34, 34);">获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。</font><font style="color:rgb(34, 34, 34);">来设置绘制自定义的导航栏。</font>

+ <font style="color:rgb(34, 34, 34);">小程序——</font>`[wx.getMenuButtonBoundingClientRect()](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)`
+ <font style="color:rgb(34, 34, 34);">uni-app——</font>`[uni.getMenuButtonBoundingClientRect()](https://uniapp.dcloud.io/api/ui/menuButton.html#getmenubuttonboundingclientrect)`

首先在自定义的页面关闭默认的导航栏设置。

```javascript
"navigationStyle": "custom"
```

<font style="color:rgb(34, 34, 34);">代码示例：</font>

```javascript
<template>
  <view class="prohibition">
    <view class="topNav" :style="'height:' +  topNav.height + 'rpx;' + 'padding-top:' + topNav.top + 'rpx;padding-bottom:10rpx'">
      自定义导航栏组件
    </view>
  </view>
</template>

<script>
export default {
  name:'topNav',
  data () {
    return {
      topNav: {
        top: 0,
        height: 0
      }
    }
  },
  created () {
    const topNav = uni.getMenuButtonBoundingClientRect()
    const {top,height} = topNav
    this.topNav.top = top * 2
    this.topNav.height = height * 2
    const topHeight = height + top + 10 + 50
  }
}
</script>

<style lang="scss">
.prohibition {
  width: 100%;
  position: fixed;
  z-index: 999;
  .topNav{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    font-size: 34rpx;
    color: #333333
}
</style>
```

<font style="color:rgb(34, 34, 34);">如下为带有地区搜索下拉的自定义导航栏：</font>

```javascript
<template>
  <view class="prohibition">
    <view class="topNav" :style="'height:' +  topNav.height + 'rpx;' + 'padding-top:' + topNav.top + 'rpx;padding-bottom:10rpx'">
      <view class="left" :style="'top:' + topNav.top + 'rpx'">
        <picker mode="multiSelector" class="area"  range-key="name" :range="regionList"  :value="regionIndex"  @change="regionChange" @columnchange="columnChange">
          <view v-if="regionList[2][0]">{{regionList[2].filter((item) => item.id === areaInfo.area)[0].name || currentArea}}</view>
        </picker>
      </view>
      自定义导航栏组件
    </view>
    <Search @search="searchParams"/>
  </view>
</template>

<script>
import Search from "../search";
import {getRegionList} from "@/apis/commonRegionController";
import {getUserView} from "@/apis/user";
export default {
  name:'topNav',
  components: {Search},
  data () {
    return {
      topNav: {
        top: 0,
        height: 0
      },
      regionList: [[], [], []],
      regionIndex: [0, 0, 0],
      currentArea:'全国',
      areaInfo:{
        province: "",
        city: "",
        area: ""
      }
    }
  },
  created () {
    const topNav = uni.getMenuButtonBoundingClientRect()
    const {top,height} = topNav
    this.topNav.top = top * 2
    this.topNav.height = height * 2
    const topHeight = height + top + 10 + 50
    this.$emit('topNavHeight',topHeight)
    this.getUserArea()
    this.getRegionList(1, "");
  },
  methods:{
    async getUserArea(){
      const {data:{province,city,area,areaName}} = await getUserView()
      this.areaInfo = {province,city,area}
      this.currentArea = areaName ? areaName : '全国'
    },
    searchParams(val){
      this.$emit('params', {...val})
    },
    async getRegionList(level, parentId) {
      const { data } = await getRegionList({
        level,
        parentId,
      });
      this.$set(this.regionList, [level - 1], data);
      if (level <= 2) {
        await this.getRegionList(level + 1, data[0].id);
      }
    },
    columnChange(e) {
      const { column, value } = e.detail;
      if (column <= 1) {
        this.getRegionList(column + 2, this.regionList[column][value].id);
      }
    },
    regionChange(e) {
      const [x, y, z] = e.detail.value;
      this.areaInfo.province = this.regionList[0][x].id;
      this.areaInfo.city = this.regionList[1][y].id;
      this.areaInfo.area = this.regionList[2][z].id;
      this.$emit('areaChange',this.areaInfo.area)
    },
  }
}
</script>

<style lang="scss">
.prohibition {
  width: 100%;
  position: fixed;
  z-index: 999;
  .topNav{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    font-size: 34rpx;
    color: #333333;
    .left{
      float: left;
      position: absolute;
      width: max-content;
      height: max-content;
      top: 0;
      left: 26rpx;
      margin: auto;
      .area {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        position: relative;
        &:after{
          position:absolute;
          content:'';
          width:0;
          height:0;
          top: 16rpx;
          right: -20rpx;
          border-width:12rpx 6rpx 0;
          border-style:solid;
          border-color:#333 transparent transparent;/*灰 透明 透明 */

        }
      }
    }
  }
}
</style>
```

[参考链接](https://www.jianshu.com/p/a290372ce49c)

