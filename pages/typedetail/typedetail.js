//index.js
const { extend, Tab } = require('../../zanui/dist/index.js');

const tabs = {
  list: [{
    id: '1',
    title: '最新发布'
  }, {
    id: '2',
    title: '最新回复'
  }, {
    id: '3',
    title: '红包福利'
  }, {
    id: '4',
    title: '距离最近'
  }],
  selectedId: '1',
  scroll: true,
  height: 45
}

//获取应用实例
const app = getApp()

Page(extend({}, Tab, {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  
    tabs: tabs,
    infos: app.infos,
    jobType:"1"
  },
  onLoad: function (param) {//可以携带跳转过来的路由参数
     var tabs = app.menus[parseInt(param.jobType)-1];
     this.setData({
         tabs: tabs.detailType,
         jobType: param.jobType,
         //messageType: param.messageType
         messageType: ""
    })
    wx.setNavigationBarTitle({ title:tabs.name + " - 信息列表"});
    this.getJobListByType();
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '18392019700' //仅为示例，并非真实的电话号码
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getJobListByType: function () {
    var page = this;
    app.commonRequest({
      url: app.restUrl.getJobByType + "/" + page.data.jobType,// + "uname=" + openid + "&passwd=" + openid,
      data: {
      },
      method: "get",
      success: function (d) {
        if (d && d.data) {
          page.setData({
            infos: d.data
          })
        }
      }
    })
  },
  getJobListByTypeAndMessageType: function () {
    var page = this;
    app.commonRequest({
      url: app.restUrl.getJobByTypeAndMessageType + "/" + page.data.jobType + "/" + page.data.messageType,// + "uname=" + openid + "&passwd=" + openid,
      data: {
      },
      method: "get",
      success: function (d) {
        if (d && d.data) {
          page.setData({
            infos: d.data
          })
        }
      }
    })
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`tabs.selectedId`]: selectedId,
      messageType:selectedId
    });
    if(selectedId === "0"){//请求全部
      this.getJobListByType();
    }else{//请求小分类
      this.getJobListByTypeAndMessageType();
    }
  },
  swiperChange: function (e) {

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
  onShareAppMessage: function () {
    //页面转发时触发
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },
  onPageScroll: function (scrollTop) {
    //
  },
  onTabItemTap: function () {
    //
  }
}))
