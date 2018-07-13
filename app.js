//app.js
var restHostUrl = {  
  local: "",
  develop:"",
  publish:""
}
var restHost = restHostUrl.develop;
var appConfig = {
  APP_ID: "",
  APP_SECRET: "",
}
//日期格式化；mydate.Format('yyyy-MM-dd hh:mm:ss'));
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  /////////////////////////////////////////////////
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
App({
  onLaunch: function (info) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getOpenId(res);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("has scope userinfo")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.isAuther = true;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          this.globalData.isAuther = false;
        }
        if (!res.authSetting['scope.record']) {
          var that = this;
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用位置信息
              that.getCurrentLocaltion();
            }
          })  
        }else{
          this.getCurrentLocaltion();
        }
      }
    })
  },
  getCurrentLocaltion:function(){
    var that = this;
    wx.getLocation({
      success: function (d) {
        that.globalData.latitude = d.latitude;
        that.globalData.longitude = d.longitude;
      }
    });
  },
  getOpenId:function(res){
    var that = this;
    wx.request({
      //url: "https://api.weixin.qq.com/sns/jscode2session",
      url: that.restUrl.getOpenId ,
      data: {
        appid: appConfig.APP_ID,
        secret: appConfig.APP_SECRET,
        code: res.code
        //grant_type: 'authorization_code'
      },
      method: "get",
      success: function (d) {
        if (d.data && d.data.openid) {
          console.log("获取openid成功");
          that.globalData.openid = d.data.openid;
        } else {
          wx.showToast({
            title: 'response无openid',
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '无法获取openid',
        })
      }
    })
  },
  onShow:function(options){
    //小程序启动时、从后台进入前台时触发。可以做一些数据收集
  },
  onHide: function () {
    //小程序从前台进入后台时触发，
  },
  onErro: function (msg) {
    //小程序出错时触发
  },
  onPageNotFound:function(info){
    //页面找不到时触发
  },
  globalData: {
    userInfo: null,
    openid:null,
    isAuther:false
  },
  commonRequest:function(param,success,fail){
    wx.request({
      url: param.url,
      data: param.data,
      header: {
        'cookie': wx.getStorageSync("token")//读取cookie
      },
      method: param.method,
      success: function (d) {
        //if(d && d.meta && d.meta.success == true){
        if (d) {
          param.success(d);
        }else{
          console.log(`request error`);
        }
      },
      fail: function () {
        if(fail){
          fail();
        }
      }
    });
  },
  judgeTokenIsTimeout:function(){
    var token = wx.getStorageSync("token");
    if(!token && token !=="undefine"){
      this.commonRequest({
        url: this.restUrl.login,
        data: {},
        method: "post",
        success: function (d) {
          wx.setStorageSync("token", d.data.token);
        }
      })
      return true;
    }else{
      return false;
    }
  },
  restHostUrl:{
    local:"",
    develop:"http://193.112.196.109:8080",
    publish:""
  },
  restHost:restHostUrl.develop,
  restUrl:{
    login: restHost+ "/RestSpringMVCDemo/tokens",
    getPublishList: restHost + "/RestSpringMVCDemo/jobManage/getAllJob",
    sigin: restHost + "/RestSpringMVCDemo/users/user",
    publish: restHost + "/RestSpringMVCDemo/jobManage/addJob",
    addComment:restHost + "/RestSpringMVCDemo/comment/addComment",
    getCommentByJobId: restHost + "/RestSpringMVCDemo/comment/getCommentByJobId",
    getJobByType: restHost + "/RestSpringMVCDemo/jobManage/getJobByJobType",
    getJobById: restHost + "/RestSpringMVCDemo/jobManage/getJobById",
    getJobByTypeAndMessageType: restHost + "/RestSpringMVCDemo/jobManage/getJobByJobTypeAndMessageType",//jobType,messageType
    zan: restHost + "/RestSpringMVCDemo/jobManage/updatePraiseNumber/",
    updateViewNumber: restHost + "/RestSpringMVCDemo/jobManage/updateViewNumber/",
    getTotalData: restHost + "/RestSpringMVCDemo/jobManage/getTotalData",
    getOpenId: restHost + "/RestSpringMVCDemo/tokens/getOpenid",
    getInfoNew: restHost + "/RestSpringMVCDemo/jobManage/getAllJobOrderByLastComment", 
    getInfoByPosition: restHost + "/RestSpringMVCDemo/jobManage/getAllJobOrderByDistance/", 
    getPersonalInfo: restHost + "/RestSpringMVCDemo/jobManage/getJobByUserId/",
    getPersonalTotalInfo: restHost + "/RestSpringMVCDemo/jobManage/getTotalDataByUserId/",
    addWorkFlow: restHost + "/RestSpringMVCDemo/signUp/addSignUp",
    deleteInfo: restHost + "/RestSpringMVCDemo/jobManage/deleteJob/",
  },
  // menus: [
  //   {
  //     name: "销售",
  //     icon: "close",
  //     menuId: "1",
  //     detailType: { list:[{ title: "全部", id: "0" }, { title: "招销售人员", id: "1" }, { title: "找销售工作", id: "2" }],selectedId:"0"}
  //   },
  //   {
  //     name: "兼职",
  //     icon: "location",
  //     menuId: "2",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "招兼职人员", id: "1" }, { title: "找兼职工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "实习",
  //     icon: "clock",
  //     menuId: "3",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "招实习人员", id: "1" }, { title: "找实习工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "客服",
  //     icon: "chat",
  //     menuId: "4",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "招客服人员", id: "1" }, { title: "找客服工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "行政",
  //     icon: "exchange",
  //     menuId: "5",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "招行政人员", id: "1" }, { title: "找行政工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "市场",
  //     icon: "edit",
  //     menuId: "6",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "招市场人员", id: "1" }, { title: "找市场工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "运营",
  //     icon: "contact",
  //     menuId: "7",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "找运营人员", id: "1" }, { title: "找运营工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "产品",
  //     icon: "gold-coin",
  //     menuId: "8",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "找产品人员", id: "1" }, { title: "找产品工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "设计",
  //     icon: "completed",
  //     menuId: "9",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "找设计人员", id: "1" }, { title: "找设计工作", id: "2" }], selectedId: "0" }
  //   },
  //   {
  //     name: "技术",
  //     icon: "hot",
  //     menuId: "10",
  //     detailType: { list: [{ title: "全部", id: "0" }, { title: "找技术人员", id: "1" }, { title: "找技术工作", id: "2" }], selectedId: "0" }
  //   }
  // ],
  menus: [
    {
      name: "操作工",
      icon: "xiuliweihu",
      menuId: "1",
      detailType: { list: [{ title: "全部", id: "0" }, { title: "招操作工人员", id: "1" }, { title: "找操作工工作", id: "2" }], selectedId: "0" }
    },
    {
      name: "叉车工",
      icon: "chache",
      menuId: "2",
      detailType: { list: [{ title: "全部", id: "0" }, { title: "找叉车工人员", id: "1" }, { title: "找叉车工工作", id: "2" }], selectedId: "0" }
    },
    {
      name: "临时工",
      icon: "shigongrenyuan",
      menuId: "3",
      detailType: { list: [{ title: "全部", id: "0" }, { title: "找临时工人员", id: "1" }, { title: "找临时工工作", id: "2" }], selectedId: "0" }
    },
    {
      name: "技术工",
      icon: "jishuzhichizhichizhinengkefuzhinengfuwuzhinengzhichi",
      menuId: "4",
      detailType: { list: [{ title: "全部", id: "0" }, { title: "找技术工人员", id: "1" }, { title: "找技术工工作", id: "2" }], selectedId: "0" }
    },
    {
      name: "其他",
      icon: "qita1",
      menuId: "5",
      detailType: { list: [{ title: "全部", id: "0" }, { title: "找其他人员", id: "1" }, { title: "找其他工作", id: "2" }], selectedId: "0" }
    }
  ],
  // menuPciker:[
  //   "销售","兼职","实习","客服","行政","市场","运营","产品","设计","技术"
  // ],
  menuPciker: [
    "操作工", "叉车工", "临时工", "技术工", "其他"
  ],
  typePicker:[
    ["招操作工人员", "找操作工工作"],
    ["招叉车工人员", "找叉车工工作"],
    ["招临时工人员", "找临时工工作"],
    ["招技术工人员", "找技术工工作"],
    ["招其他人员", "找其他工作"]
  ],
  // typePicker: [
  //   ["招销售人员", "找销售工作"],
  //   ["招兼职人员", "找兼职工作"],
  //   ["招实习人员", "找实习工作"],
  //   ["招客服人员", "找客服工作"],
  //   ["招行政人员", "找行政工作"],
  //   ["招市场人员", "找市场工作"],
  //   ["招运营人员", "找运营工作"],
  //   ["招产品人员", "找产品工作"],
  //   ["招设计人员", "找设计工作"],
  //   ["招技术人员", "找技术工作"]
  // ],
  infos:[
    // {
    //   logoPath: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epsptpqrCA8cSicSsVN5gWnibibU0VicDQzlic9AhUWg96kXDbEfECMpbWZmT1xpv3VcaV1vkBZP05GvCg/0",
    //   nikeName: "tongwanyan",
    //   province: "shanxi",
    //   address: "西安市天谷八路",
    //   commentNumber: "8989",
    //   viewNumber: "7777",
    //   praiseNumber: "90",
    //   commentList:[],
    //   messageContent:"sssfsd",
    //   phoneNumber:"18392019700",
    //   createTime:"2018-05-06  12:12:12"
    // },
    // {
    //   logoPath: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epsptpqrCA8cSicSsVN5gWnibibU0VicDQzlic9AhUWg96kXDbEfECMpbWZmT1xpv3VcaV1vkBZP05GvCg/0",
    //   nikeName: "tongwanyansdfsd",
    //   province: "shanxiff",
    //   address: "西安市天谷八路",
    //   commentNumber: "8989",
    //   viewNumber: "7777",
    //   praiseNumber: "90",
    //   commentList: [],
    //   messageContent: "sssfsd",
    //   phoneNumber: "18392019700",
    //   createTime: "2018-05-06  12:12:12"
    // }
  ],
  // imgUrls: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
  //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
  //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
  // ],
  imgUrls: ['/RestSpringMVCDemo/img/1.jpg',
    '/RestSpringMVCDemo/img/2.jpg',
    '/RestSpringMVCDemo/img/3.jpg'
  ],
})