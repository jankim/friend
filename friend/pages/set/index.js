var app = getApp();
Page({
  data:{
    token: "",
  },
// 页面加载
  onLoad:function(){

    this.setData({
      token: app.jamasTool.getUserToken()
    })

  },
  onShow: function(){
    console.log("onShow");
  },
  logout(){
    console.log('logout')
    let params3 = {
      url: 'user/logout',
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
          wx.removeStorageSync('token')
          wx.clearStorage()  
          this.redirectToIndex()
        } else if (rel.data.code == "401") {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg,
            success: (res) => {
              app.jamasTool.goToLogin()
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }
      }
    }
    app.jamasTool.request(params3);
  },
  redirectToIndex: function () {
    wx.switchTab({
      url: '../ListView/ListView',
    })
  },
})