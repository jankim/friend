var app = getApp();
Page({
  data: {
    loadingMoreHidden: 0,
    foucsCnt: 0,
    fansCnt: 0,
    vistorCnt: 0,
    sysCnt: 0
  },
  // 页面加载
  onLoad: function () {

    this.setData({
      token: app.jamasTool.getUserToken()
    })
    

  },
  getData(){
    
    let params = {
      url: 'operate/getMessageCount',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {},
      needLoadingIndicator: true,
      success: (rel) => {

        if (rel.data.code == "1") {
          this.setData({
            foucsCnt: parseInt(rel.data.data.foucsCnt), 
            fansCnt: parseInt(rel.data.data.fansCnt),
            vistorCnt: parseInt(rel.data.data.vistorCnt),
            sysCnt: parseInt(rel.data.data.sysCnt),
          })

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
          app.jamasTool.showToast('服务器繁忙，请稍候再试');
        }
      },
      complete: () => {
        wx.stopPullDownRefresh()
      }
    }
    app.jamasTool.request(params);
  },
  onShow: function () {
    this.getData()
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      userFocusList: [
      ],
    })

    this.getData()
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
})