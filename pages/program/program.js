//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: app.imgUrls
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
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
      //wx.setNavigationBarTitle("测试");
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
  }
})
