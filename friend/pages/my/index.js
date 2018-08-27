var app = getApp();
Page({
  data:{
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "",
      identification_status: "",
      followMeCount: 0,
      myFolloweCount: 0,
      seeMeCount: 0,
      myAlbums: 0
    },
    token: "",
  },
// 页面加载
  onLoad:function(){
    this.setData({
      token: app.jamasTool.getUserToken()
    })
  },
  onShow: function(){
    let params3 = {
      url: 'Operate/getMyFansCount',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {},
      needLoadingIndicator: true,
      success: (rel) => {
        console.log(rel)
        if (rel.data.code == "1") {
          wx.setStorageSync("userinfo", rel.data.data.userinfo)

          if (rel.data.data.userinfo.mobile === "") {
            this.redirectToActivation()
            return
          }

          if (rel.data.data.userinfo.avatar === "") {
            this.redirectFill()
            return
          }
          this.setData({
            userInfo: {
              avatarUrl: rel.data.data.userinfo.avatar,
              nickName: rel.data.data.userinfo.nickname,
              identification_status: rel.data.data.userinfo.identification_status,
              followMeCount: rel.data.data.followMeCount == '0' ? '' : rel.data.data.followMeCount,
              myFolloweCount: rel.data.data.myFolloweCount == '0' ? '' : rel.data.data.myFolloweCount,
              seeMeCount: rel.data.data.seeMeCount == '0' ? '' : rel.data.data.seeMeCount,
              myAlbums: rel.data.data.myAlbums == '0' ? '' : rel.data.data.myAlbums
            }
          })
          console.log(this.data);
        } else if (rel.data.code == "401") {
          app.jamasTool.goToLogin()
        } else {
          app.jamasTool.showToast('服务器繁忙，请稍候再试');
        }
      }
    }
    app.jamasTool.request(params3);

  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      console.log(ops.target)
    }
    return {
      title: app.globalData.shareProfile,
      path: app.globalData.sharePath,
      imageUrl: app.globalData.shareimageUrl,
      success: function (res) {
        // wx.showToast({
        //   icon: 'none',
        //   title: '转发成功',
        // })
      },
      fail: function (res) {
        // wx.showToast({
        //   icon: 'none',
        //   title: '转发失败',
        // })
      }
    }
  },
  redirectFill: function () {
    wx.redirectTo({
      url: '../fillinfo/index'
    })
  },
  redirectToActivation: function () {
    wx.redirectTo({
      url: '../activation/index'
    })
  },
})