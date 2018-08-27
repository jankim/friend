var WxParse = require('../../utils/wxParse/wxParse.js');
var util = require("../../utils/util.js");
var app = getApp();

Page({
  data: {
  },
  onLoad: function (option) {

    this.setData({
      id: option.id
    })
    let params = {
      url: 'sundry/getMatchmaker',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {
        id: this.data.id
      },
      needLoadingIndicator: true,
      success: (rel) => {

        if (rel.data.code == "1") {
          var article = rel.data.data.article.content;
          WxParse.wxParse('article', 'html', article, this, 5);
          wx.setNavigationBarTitle({
            title: rel.data.data.article.name
          })
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
    }
    return {
      title: app.globalData.shareProfile,
      path: util.getCurrentPageUrlWithArgs(),
      imageUrl: app.globalData.shareimageUrl,
      success: function (res) {
        // wx.showToast({
        //   icon: "none",
        //   title: '分享成功',
        // })
      },
      fail: function (res) {
        // wx.showToast({
        //   icon: "none",
        //   title: '分享失败',
        // })
      }
    }
  },
})
