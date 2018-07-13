
const { extend, Tab } = require('../../zanui/dist/index.js');

//获取应用实例
const app = getApp()

Page(extend({}, Tab, {
  data: {
    userInfo: {},
    hasUserInfo: false,
    info:{
      praiseNumber:0,
      commentList:[]
    },
    showBottomPopup: false,
    placeholder:"请输入",
    commentInfo:"",
    infoId:"",
    replayPerson:null,
    commentList:[],
    currentReplayId:""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (param) {//可以携带跳转过来的路由参数
    if (param.infoId){
      for(var i = 0;i<app.infos.length;i++){
        if (param.infoId == app.infos[i].id){
          this.setData({
            info: app.infos[i],
            infoId:param.infoId
          })
        }
      }
      this.updateViewNumber();
    }
  },
  menuclick:function(x){
    console.log(x);
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  swiperChange: function (e) {

  },
  onReady: function () {
    //一个页面只会调用一次，代表页面准备妥当
    setTimeout(function () {
      //wx.setNavigationBarTitle("测试");
    }, 200)
  },
  refreshData:function(data){

  },
  getInfoById: function () {
    var that = this;
    wx.request({
      url: app.restUrl.getJobById + "/" + this.data.infoId,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
      },
      method: "get",
      success: function (d) {
        that.setData({
          ["info.praiseNumber"]: d.data.praiseNumber
        })
      },
      fail: function () {
        wx.showToast({
          title: '请求info失败'
        })
      }
    });
  },
  getCommentByJobId:function(){
    var that = this;
    wx.request({
      url: app.restUrl.getCommentByJobId + "/" + this.data.infoId,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
      },
      method: "get",
      success: function (d) {
        that.setData({
          ["info.commentList"]: d.data
        })
      },
      fail: function () {
        wx.showToast({
          title: '请求info失败'
        })
      }
    });
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
  onShareAppMessage: function (e) {

    //页面转发时触发
    return {
      title: '附近的招聘信息',
      path: '/pages/infodetail/infodetail?infoId=' + e.target.dataset.jobid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onPageScroll: function (scrollTop) {
    //
  },
  onTabItemTap: function () {
    //
  },
  toggleBottomPopup:function(e) {
    var replayPerson = null;
    var replayId = ""
    var commentList = this.data.commentList;
    if(e && e.target && e.target.id){
      replayId = e.target.id;
      for(var i = 0;i<commentList.length;i++){
        if (e.target.id == commentList[i].id){
          replayPerson = commentList[i].nikeName;
        }
      }
    }
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      replayPerson: replayPerson,
      currentReplayId: replayId,
      commentInfo:""
    });
  },
  sendComment:function(){
    var that = this;
    wx.request({
      url: app.restUrl.addComment,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
        id: this.data.currentReplayId,
        jobId: this.data.infoId,
        commentContent: this.data.commentInfo,
        userId:"0",
        createTime:new Date().Format("yyyy-MM-dd hh:mm:ss"),
        replayPerson: this.data.replayPerson
      },
      method: "put",
      success: function (d) {
        wx.showToast({
          title: '发布评论成功'
        })
        that.toggleBottomPopup();
        that.getCommentByJobId();
      },
      fail: function () {
        wx.showToast({
          title: '发布评论失败'
        })
        that.toggleBottomPopup();
      }
    });
  },
  textareaInput: function (e) {
    this.data.commentInfo = e.detail.value
  },
  goHome:function(){
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  updateViewNumber:function(){
    wx.request({
      url: app.restUrl.updateViewNumber +"/"+ this.data.infoId,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
      },
      method: "get",
      success: function (d) {
        console.log("浏览成功");
      },
      fail: function () {

      }
    });
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.info.phoneNumber //仅为示例，并非真实的电话号码
    })
  },
  zan: function (e) {
    var that = this;
    wx.request({
      url: app.restUrl.zan + this.data.infoId,
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
        that.getInfoById();
      },
      fail: function () {

      }
    });
  }
}))
