//index.js
const { extend, Tab } = require('../../zanui/dist/index.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    name:"",
    idNo:"",
    phone:"",
    jobId:""
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    this.setData({
      jobId:obj.infoId
    })
  },
  onReady: function () {
    //一个页面只会调用一次，代表页面准备妥当
    setTimeout(function () {
      //wx.setNavigationBarTitle("测试");
    }, 200)
  },
  onShow: function (options) {
    //页面显示时
    console.log(options);
  },
  onHide: function () {
    //页面隐藏时
  },
  onPullDownRefresh: function () {
    //页面下拉刷新时触发
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    //页面上拉底部时触发
  },
  onPageScroll: function (scrollTop) {
    //
  },
  onTabItemTap: function () {
    //
  },
  nameInput: function (e) {
    this.setData({
      ["name"]: e.detail.value
    })
  },
  idNoInput: function (e) {
    this.setData({
      ["idNo"]: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      ["phone"]: e.detail.value
    })
  },
  addWorkFlow:function(){
    var page = this;
    wx.request({
      url: app.restUrl.addWorkFlow,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
        name: page.data.name,
        idNo: page.data.idNo,
        phoneNo: page.data.phone,
        jobId: page.data.jobId
      },
      method: "put",
      success: function (d) {
        wx.showToast({
          title: '报名成功',
        })
        wx.switchTab({
          url: '../../pages/index/index'
        })
      },
      fail: function () {
        wx.showToast({
          title: '报名失败',
        })
      }
    });
  }
})
