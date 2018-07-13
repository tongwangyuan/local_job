//index.js
const { extend, Switch, Field } = require('../../zanui/dist/index.js');
//获取应用实例
const app = getApp()

Page(extend({}, Switch, Field,{
  data: {
    motto: 'Hello World',
    hasUserInfo: false,
    checked:true,
    textInfo:"",
    files:[""],
    src:"../../img/1.jpg",
    publishInfo:{
      address:"",
      latitue:"",
      longitude:"",
      messageType:"1",
      phoneNumber:"",
      personNumber:"",
      post:""
    },
    field: {
      focus: false,
      title: '电话',
      placeholder: '电话号码',
      value:"11"
    },
    menuPciker: app.menuPciker,
    typePicker: app.typePicker,
    typeText:"",
    payArray:["面议","3-5k","5-7k","7-12k","13k以上"],
    payIndex:0,
    payText:"面议",
    ageArray: ["不限年限", "1年以下", "1-2年", "3-5年","5年以上"],
    ageIndex:0,
    ageText:"不限年限",
    educationArray: ["不限学历", "高中", "技校", "中专", "大专","本科","硕士","博士"],
    educationIndex: 0,
    educationText:"不限学历",
    welfareArray: ["五险一金", "包吃", "包住", "年底双薪", "周末双休", "交通补助", "其它"],
    welfareIndex: 0,
    welfareText:"",
    notLookWork:true
  },
  onLoad: function (obj) {//可以携带跳转过来的路由参数
    this.setData({
      ["publishInfo.jobType"]:obj.jobType,
      ["publishInfo.messageType"]: obj.messageType,
      ["typeText"]: '#' + app.menuPciker[obj.jobType - 1] + "•" + app.typePicker[obj.jobType - 1][obj.messageType - 1] + '#'
    })
    if (obj.messageType === "2"){
      this.setData({
        ["notLookWork"]:false
      })
    }
    wx.setNavigationBarTitle({title:app.typePicker[obj.jobType - 1][obj.messageType - 1] + " - 发布"});
  },
  getLocation:function(){
    var page = this;
    wx.chooseLocation({
      success:function(position){
        page.setData({
          ["publishInfo.address"]:position.address,
          ["publishInfo.latitue"]: position.latitude,
          ["publishInfo.longitude"]: position.longitude
        })
      }
    })
  },
  uploadFile:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var files = that.data.files;
        console.log(files);
        console.log(tempFilePaths);
        files.push(tempFilePaths);
        that.setData({
          src: tempFilePaths
        })
      }
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
  },
  handleZanSwitchChange(e) {
    console.log(e.checked)
    this.setData({
      checked: e.checked
    });
  },
  publishInfo:function(){
    var phoneNumber = this.data.publishInfo.phoneNumber;
    var address = this.data.publishInfo.address;
    var postName = this.data.publishInfo.post;
    var personNumber = this.data.publishInfo.personNumber;
    var welfare = this.data.welfareText;
    //var phoneReg = /^[1-9]{1}/d{10}$/g;
    if (!this.data.textInfo){
      wx.showToast({
        title: '請輸入发布信息',
      })
      return false
    }
    if(!phoneNumber && phoneNumber.length !== 11){
      wx.showToast({
        title: '請輸入正確的電話號碼',
      })
      return false
    }
    if (!postName) {
      wx.showToast({
        title: '请填入职位名称',
      })
      return false
    }
    if (!personNumber && this.data.notLookWork) {
      wx.showToast({
        title: '请填入求职人数',
      })
      return false
    }

    if (!welfare) {
      wx.showToast({
        title: '请填入福利待遇'
      })
      return false
    }

    if (!address) {
      wx.showToast({
        title: '請選擇地址',
      })
      return false
    }
    wx.request({
      url: app.restUrl.publish,
      header:{
        token: wx.getStorageSync("token")
      },
      data: {
        address:this.data.publishInfo.address,
        postion: this.data.publishInfo.latitue + ";" + this.data.publishInfo.longitude,
        messageType: this.data.publishInfo.messageType,
        jobType: this.data.publishInfo.jobType,
        commentNumber:0,
        viewNumber:0,
        praiseNumber:0,
        phoneNumber: this.data.publishInfo.phoneNumber,
        messageContent:this.data.textInfo,
        reMark:"",
        displayLabel: this.data.typeText,
        jobName:  this.data.publishInfo.post,
        employeeNum:  this.data.publishInfo.personNumber + "人",
        salary:  this.data.payText ,
        welfare:  this.data.welfareText ,
        jobNeeds:  this.data.educationText ,
        workYears:this.data.ageText
        // jobName:"#" + this.data.publishInfo.post +"#",
        // employeeNum:"#" + this.data.publishInfo.personNumber + "人#",
        // salary: "#" + this.data.payText + "#",
        // welfare: "#" + this.data.welfareText + "#",
        // jobNeeds: "#" + this.data.educationText + "#",
      },
      method: "put",
      success: function (d) {
        console.log('发布接口回来');
        console.log(d.data);
          wx.showToast({
            title: '信息发布成功',
          })
          wx.switchTab({
            url: '../../pages/index/index'
          })
      },
      fail: function () {
        wx.showToast({
          title: '信息发布失败',
        })
      }
    });
  },
  textInput: function (e) {
    
    this.data.textInfo = e.detail.value
  },
  phoneInput: function (e) {
    this.setData({
      ["publishInfo.phoneNumber"]: e.detail.value
    })
  },
  welfareInput: function (e) {
    this.setData({
      ["welfareText"]: e.detail.value
    })
  },
  personNumInput: function (e) {
    this.setData({
      ["publishInfo.personNumber"]: e.detail.value
    })
  },
  postInput: function (e) {
    this.setData({
      ["publishInfo.post"]: e.detail.value
    })
  },
  payPickerChange:function(e){
    this.setData({
      payIndex: e.detail.value,
      payText: this.data.payArray[e.detail.value]
    })
  },
  agePickerChange: function (e) {
    this.setData({
      ageIndex: e.detail.value,
      ageText: this.data.ageArray[e.detail.value]
    })
  },
  educationPickerChange: function (e) {
    this.setData({
      educationIndex: e.detail.value,
      educationText: this.data.educationArray[e.detail.value]
    })
  },
  welfarePickerChange: function (e) {
    this.setData({
      welfareIndex: e.detail.value,
      welfareText: this.data.welfateArray[e.detail.value]
    })
  },
  methods: {
    handleFieldChange(event) {
      console.log(event);
    },

    handleFieldFocus(event) {
      console.log(event);
    },

    handleFieldBlur(event) {
      console.log(event);
    }
  }
}))
