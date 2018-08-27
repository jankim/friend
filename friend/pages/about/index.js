var WxParse = require('../../utils/wxParse/wxParse.js');

var app = getApp();

Page({
  data: {
  },
  onLoad: function () {
    let params = {
      url: 'sundry/getAbout',
      header: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      data: {
      },
      needLoadingIndicator: true,
      success: (rel) => {

        if (rel.data.code == "1") {
          var article = rel.data.data.about
          WxParse.wxParse('article', 'html', article, this, 5);
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '系统异常，请稍候再试'
          })
        }

      }
    }
    app.jamasTool.request(params);
 
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
