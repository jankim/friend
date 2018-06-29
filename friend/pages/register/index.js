var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    registBtnTxt: "注册",
    registBtnBgBgColor: "#ff9900",
    getSmsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#ff9900",
    // getSmsCodeBtnTime:60,
    btnLoading: false,
    registDisabled: false,
    smsCodeDisabled: false,
    inputUserName: '',
    inputPassword: '',
    phoneNum: '',
    openid : "",
  },
  onLoad: function (options) {
    
    wx.getStorage({
      key: 'openid',
      success: (res)=>{
        this.setData({
          openid : res.data
        })
        console.log(this.data.openid);
      },
      fail: (res)=>{
        console.log("login in")
        // 页面初始化 options为页面跳转所带来的参数
        wx.login({

          success: (res) => {
            let code = res.code;
            let params = {
              url: 'wx/getOpenId',
              header: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              data: {
                code: code,
              },
              needLoadingIndicator: true,
              success: (rel) => {
                wx.setStorageSync("openid", rel.data.data.openid);
                console.log(this)
                this.setData({
                  openid: rel.data.data.openid
                })

              }


            }
            app.jamasTool.request(params);

          }

        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

    wx.getStorage({
      key: 'timecount',
      success: (res)=>{
        console.log(res)
        if (res.data > 0){
          var count = res.data;
          if (count > 0) {
            this.setData({
              getSmsCodeBtnTxt: count + ' s',
              getSmsCodeBtnColor: "#999",
              smsCodeDisabled: true
            });
          }
          var si = setInterval(() => {
            if (count > 0) {
              count--;

              wx.setStorageSync("timecount", count);

              this.setData({
                getSmsCodeBtnTxt: count + ' s',
                getSmsCodeBtnColor: "#999",
                smsCodeDisabled: true
              });
            } else {
              this.setData({
                getSmsCodeBtnTxt: "获取验证码",
                getSmsCodeBtnColor: "#ff9900",
                smsCodeDisabled: false
              });
              count = 60;
              clearInterval(si);
            }
          }, 1000);
        }
      },
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  formSubmit: function (e) {
    var param = e.detail.value;
    console.log(param);
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkUserName(param.username)&&this.checkPhone(param.phone) && this.checkPassword(param)
    var that = this;
    if (flag) {
      this.setregistData1();


      let params = {
        url: 'user/register',
        header: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        data: {
          username: param.username,
          password: param.password,
          mobile: param.phone,
          captcha: param.smsCode,
          openid: this.data.openid,
        },
        success: (rel) => {
          console.log(rel)
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }


      }
      app.jamasTool.request(params);




      // setTimeout(function () {
      //   wx.showToast({
      //     title: '成功',
      //     icon: 'success',
      //     duration: 1500
      //   });
      //   that.setregistData2();
      //   that.redirectTo(param);
      // }, 2000);
    }
  },
  getPhoneNum: function (e) {
    var value = e.detail.value;
    this.setData({
      phoneNum: value
    });
  },
  setregistData1: function () {
    this.setData({
      registBtnTxt: "注册中",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setregistData2: function () {
    this.setData({
      registBtnTxt: "注册",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#ff9900",
      btnLoading: !this.data.btnLoading
    });
  },
  checkPhone: function (param) {
    var phone = util.regexConfig().phone;
    var inputPhone = param.trim();
    if (phone.test(inputPhone)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号码'
      });
      return false;
    }
  },
  checkUserName: function (param) {
    var userName = util.regexConfig().userName;
    var inputUserName = param.trim();
    if (userName.test(inputUserName)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户名只能是3-12位中文、数字和英文，不能包含特殊字符'
      });
      return false;
    }
  },
  checkPassword: function (param) {
    var userName = param.username.trim();
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置密码'
      });
      return false;
    } else if (password.length < 6 || password.length > 20) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '密码长度为6-20位字符'
      });
      return false;
    } else {
      return true;
    }
  },
  getSmsCode: function () {
    var phoneNum = this.data.phoneNum;
    var that = this;

    var count = 60;
    if (this.checkPhone(phoneNum)) {

      let params = {
        url: 'sms/send',
        header: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        data: {
          mobile: phoneNum,
          event: "register",
        },
        needLoadingIndicator: true,
        success: (rel) => {
          console.log(rel)
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: rel.data.msg
          })
        }


      }
      app.jamasTool.request(params);


      var si = setInterval(function () {
        if (count > 0) {
          count--;
         
          wx.setStorageSync("timecount", count);

          that.setData({
            getSmsCodeBtnTxt: count + ' s',
            getSmsCodeBtnColor: "#999",
            smsCodeDisabled: true
          });
        } else {
          that.setData({
            getSmsCodeBtnTxt: "获取验证码",
            getSmsCodeBtnColor: "#ff9900",
            smsCodeDisabled: false
          });
          count = 60;
          clearInterval(si);
        }
      }, 1000);
    }

  },
  checkSmsCode: function (param) {
    var smsCode = param.smsCode.trim();
    var tempSmsCode = '000000';//演示效果临时变量，正式开发需要通过wx.request获取
    if (smsCode != tempSmsCode) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的短信验证码'
      });
      return false;
    } else {
      return true;
    }
  },
  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param=' + param//参数只能是字符串形式，不能为json对象
    })
  }

})