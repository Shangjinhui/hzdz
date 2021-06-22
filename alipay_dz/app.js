let hostType = 2; //1 正式，2 测试
let BOCVER = '1.0.0';
let host = '',
  api = '',
  imgUrl = '', //页面图片地址
  imgUrls= "", // 导航图片地址
  qrCode="";
switch (hostType) {
  case 1: //正式
    host = 'https://www.hzdzzhfym.com/index.php/';
    api = host + 'api/';
    imgUrl = '../../assets/images/';
    break;
  case 2: //测试
    host = 'https://demo2.yunmofo.cn/east_station/index.php/';
    api = host + 'api/';
    // imgUrl = 'https://demo2.yunmofo.cn/surun_shop/' + 'wapp/';
    // imgUrl = 'https://demo2.yunmofo.cn/china_Railway/images/';
    imgUrl = '../../assets/images/';
    break;
}


App({
  imgUrl: imgUrl,
  imgUrls: imgUrls,
  host: host,
  api: api,
  qrCode:qrCode,
  header: {},
  onLaunch(options) {
    // console.log(options)
    // my.alert({
    //   title: 'app onLaunch',
    //   content:  JSON.stringify(options),
    //   success: (res) => {
    //       //成功处理代码段
    //   },
    // });
  
  //获取关联普通二维码的码值，放到全局变量qrCode中
    if (options && options.query && options.query.appkey) {
      this.qrCode = options.query.appkey;
      my.alert({
        title: 'app onLaunch',
        content: this.appkey,
        success: (res) => {
            //成功处理代码段
        },
      });
    }  

    // 第一次打开
    // options.query == {number:1}
    my.setStorageSync({
      key: 'reloadNumber',
      data: 0,
    });
    // console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  //loading动画
  load: {
    show: (title = '加载中', mask = true) => {
      my.showLoading({
        content: '加载中...',
        delay: 1000,
      });
    },
    hide: () => {
      my.hideLoading();
    }
  },
  //检测登录
  checkLogin(fun) {
    let _this = this;
    //检测版本号
    // if (_this.SystemInfo.SDKVersion >= _this.SDKVersion && _this.canIUse) {
      // _this.loginFun = fun;
      // wx.checkSession({
      //   success: () => {
      //     //我方服务器是否登录成功
      //     if (wx.getStorageSync('Token')) {
      //       // _this.header['Authorization'] = wx.getStorageSync('Token');
      //       _this.getUserInfo();
      //     } else {
      //       _this.load.show('登录中');
      //       _this.login();
      //     }
      //   },
      //   fail: () => {
      //     _this.load.show('登录中');
      //     _this.login();
      //   }
      // })
    // } else {
      // _this.load.hide();
      // wx.showModal({
      //   title: '提示',
      //   content: '当前微信版本过低，请升级后再使用。',
      //   showCancel: false,
      //   success: () => {
      //     _this.load.show('请升级微信版本', true);
      //   }
      // });

    // }
  },
  //登录
  login() {
    // let _this = this;
    // wx.login({
    //   success: (res) => {
    //     console.log(res.code)
    //     // return false
    //     _this.getUserInfo(res.code);
    //   },
    //   fail: (res) => {
    //     console.log('获取用户登录态失败！' + res.errMsg)
    //   }
    // });
  },
  ajax(obj) {
    let _this = this;
    let {
      url = '',
      type = 'POST',
      data = '',
      success = () => {
      },
      fail = () => {
      },
      complete = () => {
      }
    } = obj;
    if (!_this.header['Accept']) _this.header['Accept'] = 'application/json; charset=utf-8';
    if (!_this.header['Content-Type']) _this.header['Content-Type'] = 'application/json';
    if (!_this.header['PLATFORM']) _this.header['Platform'] = '0';
    let res_info = my.getStorageSync({ key: 'info' }).data;
    _this.header['authorization'] = res_info?res_info.token:'';
    my.request({
      url: url,
      method: type,
      data: data,
      headers: _this.header,
      success: (res) => {
        // _this.load.hide();
        let resData = res.data;
        if (resData) {
          switch (resData.returnCode) {
            case '0000': //正常
              success(resData.data);
              break;
            case '0011': //默认错误
              my.showToast({content:resData.msg});
              break;
            case '0014': //用户登陆状态失效
              my.showToast({
                content: resData.msg,
                duration: 3000,
                success: () => {
                  let res = my.getStorageSync({ key: 'info' }).data;
                  let type = res&&JSON.stringify(res.nowType);//0游客，1员工，2管理员
                  my.removeStorage({
                    key: 'info',
                  });
                  if(type==1 || type==2){
                    my.reLaunch({
                      url: '/pages/staff_login/staff_login?type='+type,
                    })
                  }else{
                    my.reLaunch({
                      url: '/pages/index/index',
                    })
                  }
                },
              });
              break;
            default:
              // wx.showToast({
              //   title: resData.msg,
              //   icon: 'none',
              //   duration: 3000
              // });
              break;
          }
        }
      },
      fail: (res) => {
        // _this.load.hide();
        // wx.showToast({
        //   title: '网络错误',
        //   icon: 'none',
        //   duration: 3000
        // });
        fail(res);
      },
      complete: (res) => {
        console.log(res,'------')
        complete(res);
      }
    })
  },  
});
