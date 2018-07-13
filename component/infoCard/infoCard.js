// component/infoCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {   
    info: {
      type: Object,
      value: {},
      observer:function(newVal,oldVal){
        //属性发生变化的时候执行
      }
    },
    canremove:{
      type:Boolean,
      value:false,
      observer: function (newVal, oldVal) {

      }
    }
  },

  externalClasses: ['zan-btn', 'zan-small', 'zan-danger', 'zan-icon', 'zan-icon-location', 'zan-icon-browsing-history', 'zan-icon-pending-evaluate', 'zan-icon-like-o', 'zan-icon-share'],

  /**
   * 组件的初始数据
   */
  data: {
    // address: "陕西省西安市雁塔区小寨东路126号",
    // city:null,
    // commentList: [],
    // commentNumber: 8,
    // createTime:"2018-05-09 21:54:50.0",
    // createUser:"237",
    // email:null,
    // gentle:null,
    // id:8,
    // jobType:"2",
    // logoPath:null,
    // messageContent:"想要找兼职的工作",
    // messageType:"1",
    // nikeName:null,
    // passwd: null,
    // phoneNumber:"18392019700",
    // postion:"34.222635;108.950405",
    // praiseNumber:3,
    // reMark:"",
    // uname:null,
    // viewNumber:27
  },

  ready:function(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _stopEvent: function () {
      //use for stop event
      var id = this.data.info.jobId
    },
    _gotoUserInfo: function () {
      wx.navigateTo({
        url: '../../pages/userinfo/userinfo?userId=' +this.data.info.createUser
      })
    },
    _deleteInfo:function(e){
      var that = this;
      //获取应用实例
      const app = getApp()
      wx.request({
        url: app.restUrl.deleteInfo + that.data.info.id,
        header: {
          token: wx.getStorageSync("token")
        },
        data: {
        },
        method: "delete",
        success: function (d) {
          wx.showToast({
            title: '删除成功'
          })
          that.triggerEvent("refreshData",{},true);
        },
        fail: function () {

        }
      });
    },
    _gotoInfoDetail: function (e) {
      var that = this;
      console.log(e);
      wx.navigateTo({
        url: '../../pages/infodetail/infodetail?infoId=' + e.currentTarget.dataset.infoId || e.target.dataset.infoId
      })
    },
    _callPhone: function (e) {
      var that = this;
      wx.makePhoneCall({
        phoneNumber: that.data.info.phoneNumber //仅为示例，并非真实的电话号码
      })
    },
    _gotoWorkflow:function(e){
      wx.navigateTo({
        url: '../../pages/workflow/workflow?infoId=' + e.currentTarget.dataset.infoId || e.target.dataset.infoId
      })
    },
    _zan:function(e){
      var that = this;
      //获取应用实例
      const app = getApp()
      var eObj = {};
      var zanId;
      if (e.target.id) {
        eObj = e.target
      } else {
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
          that.setData({
            ["info.praiseNumber"]: that.data.info.praiseNumber +1
          })
        },
        fail: function () {

        }
      });
    }
  }
})
