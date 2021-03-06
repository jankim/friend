//index.js
//获取应用实例
import { $wuxFilterBar } from '../../utils/wux-components/wux'
var app = getApp()
Page({
  data: {
    items: [
      {
        type: 'filter',
        label: '筛选',
        value: 'filter',
        children: [{
          type: 'checkbox',
          label: '年龄/岁',
          value: 'old',
          children: [{
            label: '25以下',
            value: '1',
          },
          {
            label: '25~29',
            value: '2',
          },
          {
            label: '30~34',
            value: '3',
          },
          {
            label: '34~39',
            value: '4',
          }, 
          {
            label: '40~44',
            value: '5',
          },
          {
            label: '45~49',
            value: '6',
          },
          {
            label: '50以上',
            value: '7',
          }
          ],
        },
        {
          type: 'checkbox',
          label: '身高/cm',
          value: 'height',
          children: [{
            label: '155以下',
            value: '1',
          },
          {
            label: '155~159',
            value: '2',
          },
          {
            label: '160~164',
            value: '3',
          },
          {
            label: '165~169',
            value: '4',
          },
          {
            label: '170~174',
            value: '5',
          },
          {
            label: '175~179',
            value: '6',
          },
          {
            label: '180以上',
            value: '7',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '体重/kg',
          value: 'weight',
          children: [{
            label: '40以下',
            value: '1',
          },
          {
            label: '40~44',
            value: '2',
          },
          {
            label: '45~49',
            value: '3',
          },
          {
            label: '50~54',
            value: '4',
          },
          {
            label: '55~59',
            value: '5',
          },
          {
            label: '60~64',
            value: '6',
          },
          {
            label: '65~69',
            value: '7',
          },
          {
            label: '70~74',
            value: '8',
          }, {
            label: '75以上',
            value: '9',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '学历',
          value: 'education',
          children: [{
            label: '高中及以下',
            value: '1',
          },
          {
            label: '中专',
            value: '2',
          },
          {
            label: '大专',
            value: '3',
          },
          {
            label: '本科',
            value: '4',
          },
          {
            label: '硕士',
            value: '5',
          },
          {
            label: '博士',
            value: '6',
          }, 
          {
            label: '海归',
            value: '7',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '月收入/元',
          value: 'income',
          children: [{
            label: '3000以下',
            value: '1',
          },
          {
            label: '3000-4000',
            value: '2',
          },
          {
            label: '4000-5000',
            value: '3',
          },
          {
            label: '5000-7000',
            value: '4',
          },
          {
            label: '7000-10000',
            value: '5',
          },
          {
            label: '10000-15000',
            value: '6',
          },
          {
            label: '15000-20000',
            value: '7',
          },
          {
            label: '20000以上',
            value: '8',
          },
          ],
        },
        ],
        // groups: ['001', '002', '003'],
      },
    ],
    swiperCurrent: 0,
    goods: [],
    goodsList: [],
    loadingMoreHidden: 0,
    currentSize: 0,
    token: '',
    page: 0,
    query:{
        page: 0,
    },
    goodmindList: [
    ],
    curIndex: 0,  //当前显示的view下标
    swiperList: [
      ], //轮播数据列表
    winWidth: 0,  //设备宽度；
    winHeight: 0,   //设备高度；
    itemWidth: 0, //单个轮播图swiper-item的宽度；
    itemHeight: 0,//单个轮播图swiper-item的高度；
    allWidth: 0,  //轮播展示 swiper的总宽度；
    scale: 0.9,   //  缩放大小倍数；

    startClinetX: '', //触摸开始位置；
    startTimestamp: '', //触摸开始时间；

    translateDistance: 0,//动画移动的 距离；
    animationToLarge: {}, //从小变大的动画；
    animationToSmall: {},
    canCheck: false,
    dir: true,
  },
  //触摸开始的事件
  swiperTouchstart: function (e) {
    // console.log('touchstart',e);
    let startClinetX = e.changedTouches[0].clientX;
    this.setData({
      startClinetX: startClinetX, //触摸开始位置；
      startTimestamp: e.timeStamp, //触摸开始时间；
    })
  },

  //触摸移动中的事件
  swiperTouchmove: function (e) {
    // console.log('touchmove',e);
  },
  //触摸结束事件
  swiperTouchend: function (e) {
    // console.log("触摸结束",e);

    let times = e.timeStamp - this.data.startTimestamp, //时间间隔；
      distance = e.changedTouches[0].clientX - this.data.startClinetX; //距离间隔；
    //判断
    if (times < 800 && Math.abs(distance) > 5) {
      let curIndex = this.data.curIndex;

      let x0 = this.data.itemWidth, x1 = this.data.translateDistance, x = 0;
      if (distance > 0) {

        curIndex = curIndex - 1
        if (curIndex < 0) {
          curIndex = 0;
          x0 = 0;
        }
        x = x1 + x0;
      } else {

        // console.log('+1',x);
        curIndex = curIndex + 1
        if (curIndex >= this.data.swiperList.length) {
          curIndex = this.data.swiperList.length - 1;
          x0 = 0;
        }
        x = x1 - x0;
      }
      this.animationToLarge(curIndex, x);
      this.animationToSmall(curIndex, x);
      this.setData({
        curIndex: curIndex,
        translateDistance: x
      })

    } else {

    }
  },
  autoSwap: function(){
    let curIndex = this.data.curIndex;
    let x0 = this.data.itemWidth, x1 = this.data.translateDistance, x = 0;
    if (curIndex==0) {
      this.setData({
        dir: true
      })
    } else if (curIndex >= this.data.swiperList.length-1){
      this.setData({
        dir: false
      })
    }
    if (this.data.dir) {
      curIndex = curIndex + 1
      if (curIndex >= this.data.swiperList.length) {
        curIndex = this.data.swiperList.length - 1;
        x0 = 0;
      }
      x = x1 - x0;
    } else {
      curIndex = curIndex - 1
      if (curIndex < 0) {
        curIndex = 0;
        x0 = 0;
      }
      x = x1 + x0;
    }
    this.setData({
      curIndex: curIndex
    })

    this.animationToLarge(curIndex, x);
    this.animationToSmall(curIndex, x);
    this.setData({
      curIndex: curIndex,
      translateDistance: x
    })
  },
  // 动画
  animationToLarge: function (curIndex, x) {

    this.animation.translateX(x).scale(1).step()
    this.setData({
      animationToLarge: this.animation.export()
    })
  },
  animationToSmall: function (curIndex, x) {

    this.animation.translateX(x).scale(0.9).step()
    this.setData({
      animationToSmall: this.animation.export()
    })
  },
  tabClick: function (e) {
  },
  toDetailsTap: function (e) {

    if (this.data.canCheck){
      wx.navigateTo({
        url: "/pages/user/index?userid=" + e.currentTarget.dataset.id
      })
    }else{
      wx.showModal({
        title: '',
        showCancel:false,
        content: '为了公平原则，你需要填写基本个人资料才能查看用户资料,现在就去填写？',
        success: (rel) => {
          if(rel.confirm){
            this.redirectToMy()
          }
        }
      })
    }
  },
  onShow: function(){
    let params2 = {
      url: 'Sundry/getAds',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {
        position: 1
      },
      needLoadingIndicator: true,
      success: (rel) => {
        console.log(rel)
        if (rel.data.code == "1") {

          this.setData({
            goodmidlist: rel.data.data.groupads,
            canCheck: rel.data.data.canCheck
          });
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }
      }
    }
    app.jamasTool.request(params2); 
  },
  doLoadData(params) {
    let params3 = {
      url: 'Sundry/getIndexUserList',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: params,
      needLoadingIndicator: true,
      success: (rel) => {
        if (rel.data.code == "1") {
          if (rel.data.data.list.length>0){
            this.data.query.page+=1;
            this.setData({
              query: this.data.query,
              loadingMoreHidden: 0,
              goods: [...rel.data.data.list, ...this.data.goods]
            })
          }
          else{
            this.setData({
              loadingMoreHidden: 2
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }
      },
      complete: ()=>{
        wx.stopPullDownRefresh()
      }
    }
    app.jamasTool.request(params3);
  },
  onPullDownRefresh: function () {
    this.setData({
      query: {
        page: 0
      },
      goods: [
      ],
    })
    this.doLoadData(this.data.query);
  },
  onReachBottom:function(){
    this.setData({
      loadingMoreHidden: 1,
    })
    this.doLoadData(this.data.query);
  },
  onLoad: function () {
    this.setData({
      token: app.jamasTool.getUserToken()
    })

    //数据初始化
    var searchQuery = wx.getStorageSync("search-query")
    var searchItem = wx.getStorageSync("search-item")
    if (searchQuery) {
      this.setData({
        query: searchQuery,
        items: searchItem
      })
    }

    if (searchItem) {
      this.setData({
        items: searchItem
      })
    }

    this.$wuxFilterBar = $wuxFilterBar.init({
      items: this.data.items,
      onChange: (checkedItems, items) => {
        wx.setStorageSync("search-item", items)
        const params = {}
        items.forEach((n) => {
          if (1 || n.checked) {
            if (n.value === 'filter') {
              n.children.filter((n) => n.selected).forEach((n) => {
                if (n.value === 'income') {
                  const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                  params.income = selected
                } else if (n.value === 'education') {
                  const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                  params.education = selected
                } else if (n.value === 'height') {
                  const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                  params.height = selected
                } else if (n.value === 'weight') {
                  const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                  params.weight = selected
                } else if (n.value === 'old') {
                  const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                  params.old = selected
                }
              })
            }
          }
        })

        this.getRepos(params)
        this.doLoadData(this.data.query);
      },
      onScroll(e) {

      },
    })

    let params = {
      url: 'Sundry/getAds',
      header: {
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      method: 'post',
      data: {
        position: 0
      },
      needLoadingIndicator: true,
      success: (rel) => {
        console.log(rel)
        if (rel.data.code == "1") {

          this.setData({
            swiperList: [...rel.data.data.groupads]
          });
          wx.getSystemInfo({
            success: (res) => {
              let w = res.windowWidth, h = res.windowHeight;
              let allWidth = this.data.swiperList.length * (w * 0.85);

              this.setData({
                winWidth: w,
                winHeight: "100%",
                itemWidth: w * 0.85,
                allWidth: allWidth
              })
            },
          })
          this.animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease-out",
            delay: 0
          })
          setInterval(this.autoSwap,5000);

        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }
      }
    }
    app.jamasTool.request(params);




    this.doLoadData(this.data.query);
  },
  getRepos(params = {}) {
    const data = Object.assign({
      page: 0
    }, params)
    this.setData({
      query: data,
      goods: []
    })
    wx.setStorageSync("search-query", data)
    this.$wuxFilterBar.onCloseSelect()

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
  redirectToMy: function () {
    wx.switchTab({
      url: '../my/index',
    })
  },
})
