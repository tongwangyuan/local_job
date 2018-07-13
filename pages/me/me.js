//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady:function(){  
    //一个页面只会调用一次，代表页面准备妥当
    setTimeout(function(){
      
    },200)
  },
  onShow: function (options) {
    //页面显示时
    console.log(options);
  },
  onHide: function () {
    //页面隐藏时
  },
  onPullDownRefresh:function(){
    //页面下拉刷新时触发
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(){
    //页面上拉底部时触发
  },
  onShareAppMessage:function(){
    //页面转发时触发
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },
  onPageScroll: function (scrollTop) {
    //
  },
  onTabItemTap:function () {
    //
  },
  nearby:function(){
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  myInfo: function () {
    wx.navigateTo({
      url: '../../pages/userinfo/userinfo?userId=' + app.globalData.userId
    })
  },
  gotoVideo:function(){
    wx.switchTab({
      url: '../../pages/logs/logs'
    })
  },
  setting:function(){

  }
})
