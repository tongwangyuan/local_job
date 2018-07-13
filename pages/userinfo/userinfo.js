//index.js
//获取应用实例
const app = getApp()

var pagesss = Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    infos: app.infos,
    total:{
      zan:0,
      publish:0,
      read:0
    },
    userId:null,
    canRemove:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    if(obj.userId == app.globalData.userId){
      this.setData({
        canRemove: true
      })
    }
    
    this.setData({
      userId: obj.userId
    })
    
    this.getPersonalTotalInfo(obj.userId)
    this.getPersonalInfo(obj.userId);
  },
  onReady:function(){  
    //一个页面只会调用一次，代表页面准备妥当
    setTimeout(function(){
      
    },200)
  },
  onShow: function (options) {
    //页面显示时
    var page = this;
    setTimeout(function(){
      page.getPersonalTotalInfo(page.data.userId)
      page.getPersonalInfo(page.data.userId);
    },500)
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
  refreshDatas:function(){
    this.getPersonalInfo(this.data.userId);
  },
  getPersonalInfo: function (userId) {
    var page = this;
    wx.request({
      url: app.restUrl.getPersonalInfo + userId,
      data: {},
      method: "get",
      success: function (d) {
        if (d && d.data && d.data.length) {
          var avatarUrl = d.data[0].logoPath;
          var nickName = d.data[0].nikeName
          page.setData({
            ["infos"]: d.data,
            ["userInfo.avatarUrl"]: avatarUrl,
            ["userInfo.nickName"]: nickName
          })
        }else{
          page.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true,
            ["infos"]: [],
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "请求失败"
        })
      }
    })
  },
  getPersonalTotalInfo: function (userId) {
    var page = this;
    wx.request({
      url: app.restUrl.getPersonalTotalInfo + userId,
      data: {},
      method: "get",
      success: function (d) {
        if (d && d.data) {
          console.log(d.data);
          page.setData({
            ["total.zan"]: d.data.praiseNumber,
            ["total.read"]: d.data.viewNumber,
            ["total.publish"]: d.data.createrNumber
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "请求失败"
        })
      }
    })
  }
})
