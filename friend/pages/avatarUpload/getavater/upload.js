import WeCropper from '../../../utils/we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
// const WATERMARK_FONT = '@Jamas'

var app = getApp();
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 168) / 2,
        y: (height - 168) / 2,
        width: 168,
        height: 168
      }
    }, 
    token: "",
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        //  获取到裁剪后的图片

        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({//直接给上移页面赋值
          avatar: avatar
        });
        wx.navigateBack({//返回
          delta: 1
        })

      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    const { cropperOpt } = this.data

    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        console.log(this.data.token);
      },
      fail: (res) => {
        // 页面初始化 options为页面跳转所带来的参数
        this.redirectToLogin()
      }
    })

    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx) => {
          // console.log(`before canvas draw,i can do something`)
          // console.log(`current canvas context:`, ctx)
          //  那就尝试在图片上加个水印吧
          // ctx.drawImage(path, 50, 50, 50, 30)
          // ctx.setFontSize(14)
          // ctx.setFillStyle('#ffffff')
          // ctx.fillText(WATERMARK_FONT, 200, 350)
        })
        .updateCanvas()
    }
  }
})
