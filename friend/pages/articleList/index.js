var app = getApp();
Page({
  data: {
    articlesList: [], 
    loadingMoreHidden: 0,
    page: 1,
  },
  onLoad: function () {
  
    let params = {
      url: 'sundry/getArticlesList',
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
            articlesList: rel.data.data.articlesList
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
      url: 'Sundry/getArticlesListByPage',
      header: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      data: params,
      needLoadingIndicator: true,
      success: (rel) => {
        if (rel.data.code == "1") {
          if (rel.data.data.articlesList.length > 0) {
            let page = this.data.page + 　1;
            this.setData({
              page: page,
              loadingMoreHidden: 0,
              articlesList: [...rel.data.data.articlesList, ...this.data.articlesList]
            })
          } else {
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
      articlesList: [
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
