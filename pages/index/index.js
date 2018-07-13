//index.js
const { extend, Tab, Dialog } = require('../../zanui/dist/index.js');

const tabs = {
  list: [{
    id: '1',
    title: '最新发布'
  }, {
    id: '2',
    title: '最新回复'
  }, {
    id: '3',
    title: '距离最近'
  }],
  selectedId: '1',
  height: 45
}

//获取应用实例
const app = getApp()

Page(extend({}, Tab, Dialog, {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //
    // imgUrls: [ 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    // ],
    imgUrls: ['/RestSpringMVCDemo/img/1.jpg',
      '/RestSpringMVCDemo/img/2.jpg',
      '/RestSpringMVCDemo/img/3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tabs: tabs,
    menus: app.menus,
    menuMul: [app.menuPciker, app.typePicker[0]],
    multiIndex:[0,0],
    menuPciker: app.menuPciker,
    typePicker: app.typePicker,
    infos: app.infos,
    browerCount:1000,
    publishCount:999,
    forwardCount:888,
    commentCount:999
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.login(); 
    } else if (this.data.canIUse) {
      console.log("auth1")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      var page = this;
      setTimeout(function(){
        if (!app.globalData.isAuther) {//如果没有验证过，去验证
          console.log("auth2")
          page.showAutherDialog();
        }else{//直接去登录
          page.login(); 
        }
      },500)
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.login();
        }
      })
    }
    this.getTotalData();
  },
  _triggerUserInfo(info) {
    console.log("okinfo")
    console.log(info);
    //this.triggerEvent('myevent', {}, info);
    app.globalData.userInfo = info.detail.userInfo;
    this.setData({
      zanDialog: { show: false }
    });
    this.login();
  },
  getCurrentLocaltion: function () {
    var page = this;
    wx.getLocation({
      success: function (d) {
        app.globalData.latitude = d.latitude;
        app.globalData.longitude = d.longitude;
        page.getInfoByPosition();
      }
    });
  },
  gotoGetUserInofs:function(a){
    console.log('授权点击');
  },
  showAutherDialog:function(){
    this.showZanDialog({
      content: '附近招聘小程序将获得你的信息（昵称，头像等）',
      showConfirm:false,
      isAuther:true
    }).then(() => {
      console.log('=== dialog without title ===', 'type: confirm');
    });
  },
  login:function(){
    var openidFlag = false;
    var page = this;
    if(app.globalData.openid){
      console.log('开始验证登录');
      openidFlag = true;
      wx.request({
        //url: app.restUrl.login + "uname=" + app.globalData.openid + "&passwd=" + app.globalData.openid,
        url: app.restUrl.login,
        data: {
          uname: app.globalData.openid,
          passwd: app.globalData.openid
        },
        method: "get", 
        success: function (d) {
          var d = d.data;
          console.log('login srccess')
          console.log(d.data);
          if (d && d.meta && d.meta.success == false){//去註冊
            if (d.meta.message != "Internal Server Error" && d.meta.message != "request_method_not_supported"){
              page.sigin(app.globalData.openid);
              return;
            }else{
              console.log('login fail')
              wx.showToast({
                title: '登录失败',
              })
            }
          }
          if (d && d.data &&  d.data.token){
            console.log('存储token')
            app.globalData.userId = d.data.userId;
            wx.setStorageSync("token", d.data.token);
          }
        },
        fail:function(){
          wx.showToast({
            title: 'get internet faild',
          })
        }
      })
    }else{
      wx.showToast({
        title: '没有openid',
      })
      console.log('等待openid');
      openidFlag = false;
      setTimeout(function(){
        console.log('等待500ms');
        page.login();
      }.bind(this),500);
    }
  },
  sigin:function(openid){
    var page = this;
    wx.request({
      url: app.restUrl.sigin,// + "uname=" + openid + "&passwd=" + openid,
      data: {
        uname:openid,
        passwd:openid,
        nikeName:app.globalData.userInfo.nickName,
        logoPath: app.globalData.userInfo.avatarUrl
        // id:"",
        // gentle:"",
        // email:"",
        // city:""
      },
      method: "put",
      success: function (d) {
        if (d && d.data && d.data.nikeName){
          console.log("用户注册成功");
          wx.showToast({
            title: "用户注册成功"
          })
          page.login();
        }else{
          wx.showToast({
            title: "用户注册失败"
          })
        }
      }
    })
  },
  publishInfo:function(e){
    //点击发布按钮
    // wx.navigateTo({
    //   url: '../../pages/publish/publish?id=' + "1"
    // })

    wx.navigateTo({
      url: '../../pages/types/types'
    })
  },
  getPublishedList: function () {
    var page = this;
    wx.request({
      url: app.restUrl.getPublishList,
      data: {},
      method: "get",
      success: function (d) {
        if(d&&d.data){
          console.log(d.data);
          app.infos = d.data;
          page.setData({
            infos:d.data
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: "请求失败"
        })
      }
    })
  },
  getInfoNew: function () {
    var page = this;
    wx.request({
      url: app.restUrl.getInfoNew,
      data: {},
      method: "get",
      success: function (d) {
        if (d && d.data) {
          console.log(d.data);
          app.infos = d.data;
          page.setData({
            infos: d.data
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
  getInfoByPosition: function () {
    console.log(app.globalData.latitude);
    console.log(app.globalData.longitude);
    var page = this;
    wx.request({
      url: app.restUrl.getInfoByPosition + app.globalData.latitude + ":" + app.globalData.longitude,
      data: {
      },
      method: "get",
      success: function (d) {
        if (d && d.data) {
          console.log("经纬度数据")
          console.log(d.data);
          app.infos = d.data;
          page.setData({
            infos: d.data
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
  stopEvent:function(){
    console.log("stop event");
  },
  menuclick:function(e){
    console.log(e);
    var id = "";
    e.target.id ? id = e.target.id :id = e.currentTarget.id;
    wx.navigateTo({
      url: '../../pages/typedetail/typedetail?jobType=' + id
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
    if(e.selectedId =="2"){
      this.getInfoNew();
    } else if (e.selectedId == "1"){
      this.getPublishedList();
    }else{
      //this.getInfoByPosition(); 
      this.getCurrentLocaltion();
    }

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
    this.getTotalData();
    if (this.data.tabs.selectedId == "2") {
      this.getInfoNew();
    } else if (this.data.tabs.selectedId == "1") {
      this.getPublishedList();
    } else {
      //this.getInfoByPosition();
      this.getCurrentLocaltion();
    }
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
  onShareAppMessage: function (e) {
    //页面转发时触发
    return {
      title: '附近的招聘信息',
      path: '/pages/infodetail/infodetail?infoId=' + e.target.dataset.jobid
    }
  },
  onPageScroll: function (scrollTop) {
    //
  },
  onTabItemTap: function () {
    //
  },
  getTotalData: function () {
    var page = this;
    wx.request({
      url: app.restUrl.getTotalData,
      data: {
      },
      method: "get",
      success: function (d) {
        console.log('获取total成功');
        page.setData({
          browerCount: d.data.viewNumber,
          publishCount: d.data.createrNumber,
          commentCount: d.data.commentNumber,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: "获取total失败"
        })
      }
    });

  },
  columnchange:function(e){
    var column = parseInt(e.detail.column);
    var value = parseInt(e.detail.value);
    if(column === 0){//第一列值改变
      this.setData({
        menuMul: [app.menuPciker, app.typePicker[value]],
        multiIndex:[value,0]
      })
    } else {//第二列值改变
      var firstValue = this.data.multiIndex[0];
      this.setData({
        multiIndex: [firstValue,value]
      })
    }
  },
  bindPickerChange: function (e) {
    //分别映射实际类型id；
    var jobType = parseInt(e.detail.value[0]) + 1;
    var messageType = parseInt(e.detail.value[1]) + 1;
    wx.navigateTo({
      url: '../../pages/publish/publish?jobType=' + jobType + "&messageType=" + messageType
    })
  },
  gotoUserInfo:function(){
    wx.navigateTo({
      url: '../../pages/userinfo/userinfo'
    })
  },
  gotoInfoDetail:function(e){
    console.log(e);
    wx.navigateTo({
      url: '../../pages/infodetail/infodetail?infoId=' + e.currentTarget.dataset.infoId || e.target.dataset.infoId
    })
  },
  zan:function(e){
    var eObj = {};
    var zanId;
    if(e.target.id){
      eObj = e.target
    }else{
      eObj = e.currentTarget;
    }
    zanId = eObj.dataset.zanId;
    wx.request({
      url: app.restUrl.zan + zanId,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
      },
      method: "get",
      success: function (d) {
        wx.showToast({
          title: '点赞成功'
        })
      },
      fail: function () {

      }
    });
  }
}))
