# 小程序获取用户信息-uni-app

### getUserInfo

不推荐使用 `getUserInfo` 获取用户信息，预计自2021年4月13日起，`getUserInfo` 将不再弹出弹窗，直接返回匿名的用户个人信息。

```vue
<template>
  <view>
      <!-- 如果只是展示用户头像昵称，可以使用 <open-data /> 组件 -->
      <open-data type="userAvatarUrl"/>
      <open-data type="userNickName"/>
			<!-- 需要使用 button 来授权登录-->
      <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
      <view v-else>请升级微信版本</view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
    }
  },
  onLoad() {
    uni.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  methods:{
    bindGetUserInfo (e) {
      console.log(e.detail.userInfo)
    }
  }
}
</script>
<style lang='scss'></style>

```

### getUserProfile

推荐使用 `wx.getUserProfile` 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认。

开发者妥善保管用户快速填写的头像昵称，避免重复弹窗。

```vue
<template>
  <view>
    <view v-if="!hasUserInfo">
        <button @tap="getUserProfile"> 获取头像昵称 </button>
    </view>
  </view>
</template>

<script>
  
export default {
  data() {
    return {
      code:'',
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
    }
  },
  onLoad() {
    if (uni.getUserProfile) {
      this. canIUseGetUserProfile = true
    }
  },
  methods:{
    getUserProfile() {
      uni.login({
        success:(res) =>{
          this.code = res.code
          uni.setStorageSync('code',res.code)
        }
      })
      uni.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          const {userInfo} = res
          this.userInfo = userInfo
          // 可以调取后端接口取得openId和token
          this.hasUserInfo = true
        }
      })
    }
  }
}
</script>
<style lang="scss"></style>
```

### getPhoneNumber
```vue
<template>
    <view class="userinfo">
      <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
    </view>
</template>
<script>

export default {
  data() {
    return {}
  },
  methods:{
    async getPhoneNumber(e){
      console.log(e.detail)
    }
  }
}
</script>

<style lang="scss"></style>

```



