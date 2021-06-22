const app = getApp();
Page({
  data:{
    avatar:['../../assets/images/avatar.png','../../assets/images/avatar2.png'],
    title:['员工通道','管理员通道'],
    index:1,    //1员工2管理员
    username:'',
    phone:'',
    id:'',
  },
  onLoad(query) {
    //缓存中拿id
    let id = my.getStorageSync({ key: 'type_id' }).data||'';

    this.setData({
      index:query.type?query.type:'',
      id,
    })
    let info = my.getStorageSync({ key: 'info' }).data;
    if(!this.data.index && !info && !info.nowType){
      my.reLaunch({
        url: '/pages/index/index',
      })
    }

    // console.log(this.data.index)
    // 页面加载
  },
  putName(e){
    this.setData({
        username:e.detail.value
    })
  },
  putPhone(e){
    this.setData({
        phone:e.detail.value
    })
  },
  toLogin(){
    if(!this.data.username){
      my.showToast({content: '请输入姓名'});
      return;
    }
    if(!(/^1[34578]\d{9}$/.test(this.data.phone))){
			my.showToast({content: '请输入正确的手机号'});
      return;
		}
    let data = JSON.stringify({
      nowType:this.data.index,
      name:this.data.username,
      jobNumber:this.data.phone
    });
    //console.log(data);
    app.ajax({
      url: app.api + 'member/login',
      type: 'post',
      data:data,
      success:res => {
        console.log(res);
        my.setStorage({
          key: 'info',
          data: res,
          success: () => {
            my.reLaunch({
              url: this.data.index==1?'/pages/staff_index/staff_index':'/pages/yk_code/yk_code'
            })
          }
        });
      },
      complete:com => {
      }
    });

    // app.request({
    //   url:'member/login',
    //   method:'post',
    //   data  
    // }).then(res=>{
    //   console.log(res);
    //   if(res.returnCode == '0000'){
    //     my.setStorage({
    //       key: 'info',
    //       data: res.data,
    //       success: function() {
    //         my.reLaunch({
    //           url: '/pages/staff_index/staff_index'
    //         })
    //       }
    //     });
    //   }else{
    //     my.showToast({type: 'fail',content: res.msg});
    //   }
    // })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});

