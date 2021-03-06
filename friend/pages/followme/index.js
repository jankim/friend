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
  focusCancle(e){
    console.log('Cancle')

    wx.showModal({
      title: '',
      content: '确定不在关注此人？',
      showCancel: true,
      success: (res)=>{
        if (res.confirm) {
          let id =  e.currentTarget.dataset.id
          let params = {
            url: 'operate/focusCancle',
            header: {
              'Content-Type': 'application/json',
              'token': this.data.token
            },
            method: 'post',
            data: {
              userid: id
            },
            needLoadingIndicator: true,
            success: (rel) => {
              console.log(rel)
              if (rel.data.code == "1") {
                if (rel.data.data.result){
                  let index = e.currentTarget.dataset.index
                  let userFocusList = this.data.userFocusList
                  userFocusList[index]['focus'] = false
                  this.setData({
                    userFocusList: userFocusList
                  })
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '你已经取消关注了',
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
                wx.showModal({
                  title: rel.data.msg,
                  showCancel: false,
                  content: rel.data.data.err
                })
              }
            }
          }
          app.jamasTool.request(params);

        }
      }
    })
  },
  focus(e){
    console.log('focus')
    let id = e.currentTarget.dataset.id
    let params = {
      url: 'operate/focus',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {
        userid: id
      },
      needLoadingIndicator: true,
      success: (rel) => {
        console.log(rel)
        if (rel.data.code == "1") {
          if (rel.data.data.result) {
            let index = e.currentTarget.dataset.index
            let userFocusList = this.data.userFocusList
            userFocusList[index]['focus'] = true
            this.setData({
              userFocusList: userFocusList
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '你已经关注了',
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
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }
      }
    }
    app.jamasTool.request(params);
  },
  doLoadData(params) {
    let params2 = {
      url: 'operate/getFollow',
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
                id: rel.data.data.list[i]["user_id"],
                avatar: rel.data.data.list[i]["user"]["avatar"],
                nickName: rel.data.data.list[i]["user"]["nickname"],
                gender: rel.data.data.list[i]["user"]["gender"],
                age: rel.data.data.list[i]["user"]["birthday_age"],
                focus: true
              })
            }

            this.setData({
              page: page,
              loadingMoreHidden: 0,
              userFocusList: [...this.data.userFocusList, ...userFocusList],
            })

          } else {
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
      complete: () => {
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
    console.log(1)
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