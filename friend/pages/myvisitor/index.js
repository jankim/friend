var app = getApp();
var util = require("../../utils/util.js");
Page({
  data:{
    loadingMoreHidden: 0,
    userFocusList:[
    ],
    page: 0,
  },
// 页面加载
  onLoad:function(){

    this.setData({
      token: app.jamasTool.getUserToken()
    })

    this.doLoadData({
      page: this.data.page
    });
  },
  onShow: function(){
    console.log("onShow");
  },
  doLoadData(params) {
    let params2 = {
      url: 'operate/getVister',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {
        page: params.page
      },
      needLoadingIndicator: true,
      success: (rel) => {

        if (rel.data.code == "1") {
          console.log(rel.data.data.list.length)
          if (rel.data.data.list.length>0) {
            let page = this.data.page + 1
            let userFocusList = []
            for (let i = 0; i < rel.data.data.list.length; i++) {
              userFocusList.push({
                id: rel.data.data.list[i]["see_user_id"],
                avatar: rel.data.data.list[i]["user2"]["avatar"],
                nickName: rel.data.data.list[i]["user2"]["nickname"],
                gender: rel.data.data.list[i]["user2"]["gender"],
                age: rel.data.data.list[i]["user2"]["birthday_age"],
                time: rel.data.data.list[i]["createtimedate"]
              })
            }

            this.setData({
              page: page,
              loadingMoreHidden: 0,
              userFocusList: [...this.data.userFocusList, ...userFocusList],
            })

          }else {
            this.setData({
              loadingMoreHidden: 2
            })
          }

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
      complete: ()=>{
        wx.stopPullDownRefresh()
      }
    }
    app.jamasTool.request(params2);
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      userFocusList: [
      ],
    })

    this.doLoadData({
      page: this.data.page
    });
  },
  onReachBottom: function () {
    this.setData({
      loadingMoreHidden: 1,
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