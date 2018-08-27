var app = getApp();
Page({
  data: {
    doingactivity: [],
    hadactivity: [],
    toactivity: [],
    loadingMoreHidden: 0,
    page: 1,
  },
  onLoad: function () {
  
    let params = {
      url: 'sundry/getActivityList',
      header: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      data: {
      },
      needLoadingIndicator: true,
      success: (rel) => {
        if (rel.data.code == "1") {
          this.setData({
            doingactivity: rel.data.data.doingactivity,
            hadactivity: rel.data.data.hadactivity,
            toactivity: rel.data.data.toactivity
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
  doLoadData(params) {
    let params3 = {
      url: 'Sundry/getActivityListByPage',
      header: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      data: params,
      needLoadingIndicator: true,
      success: (rel) => {
        if (rel.data.code == "1") {
          if (rel.data.data.hadactivity.length > 0) {
            let page = this.data.page +　1;
            this.setData({
              page: page,
              loadingMoreHidden: 0,
              hadactivity: [...rel.data.data.hadactivity, ...this.data.hadactivity]
            })
          }else {
            this.setData({
              loadingMoreHidden: 2
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '系统异常，请稍候再试'
          })
        }
      },
      complete: () => {
        wx.stopPullDownRefresh()
      }
    }
    app.jamasTool.request(params3);
  },
  onReachBottom: function () {
    this.setData({
      loadingMoreHidden: 1,
    })
    this.doLoadData({
      page: this.data.page
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      hadactivity: [
      ],
    })
    this.doLoadData({
      page: this.data.page
    });
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
