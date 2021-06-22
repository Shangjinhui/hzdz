const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,
    // text:'0',
  },
  onLoad(option) {
  },
  getAuthCode(){
    var _this=this;
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        // _this.setData({
        //   text:1
        // })
        if(res.authCode){
            app.ajax({
              url: app.api + 'member/ali_login',
              type: 'post',
              data:{
                code:res.authCode
              },
              success(res){
                // _this.setData({
                //   text:2
                // })
                var infos=res;
                my.getAuthUserInfo({
                  success: (e) => {
                    // _this.setData({
                    //   text:3
                    // })
                    infos.nickname=e.nickName;
                    infos.avatar=e.avatar;
                    my.setStorage({
                      key: 'info',
                      data: infos,
                      success: function() {
                        my.reLaunch({
                          url: '/pages/yk_code/yk_code'
                        })
                      }
                    });
                  }
                })
              },
              complete(){
              }
            });
        }
      },
      fail:()=>{
        my.reLaunch({
          url: '/pages/index/index'
        })
      }
    });
  },
  returnPage:()=>{
    my.navigateBack()
  }
});


  // my.getAuthUserInfo({
          //   success: (data) => {
          //     console.log(data)
              // my.alert(res.nickName); //获取的用户昵称
              // my.alert(res.avatar); //获取的用户头像图片
            // }
          // })

          // my.httpRequest({
          //   url:  app.api + 'member/ali_login', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
          //   method: 'POST',
          //   headers: {
          //     'Content-type': 'application/json'
          //   },
          //   data:{
          //     code:res.authCode
          //   },
          //   success: (res) => {
          //     console.log(res)
          //      // 授权成功并且服务器端登录成功 
          //     },
          //   fail: () => { 
          //     // 根据自己的业务场景来进行错误处理 
          //   },
          //   })