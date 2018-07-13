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
    menus: app.menus,
    typesArray:[
      "招销售人员",
      "找销售工作"
    ],
    index:0,
    showPicker:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    
  },
  menuclick: function (e) {
    var id = "";
    e.target.id ? id = e.target.id : id = e.currentTarget.id;
    var list = app.menus[parseInt(id) - 1].detailType.list,arr = [];
    for(var i = 1;i<list.length;i++){
      arr.push(list[i].title);
    }
    this.setData({
      typesArray:arr
    });
    this.setData({
      showPicker:true
    })
    // wx.navigateTo({
    //   url: '../../pages/typedetail/typedetail?id=' + id
    // })
  },
  bindPickerChange:function(e){
    var value = parseInt(e.detail.value) + 1;
    wx.navigateTo({
      url: '../../pages/publish/publish?jobType=' + "1" + "&messageType=" + value
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
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`tabs.selectedId`]: selectedId
    });
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
