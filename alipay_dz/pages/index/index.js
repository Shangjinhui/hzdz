const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,
    list:[],
    state:false,
    id:'',
  },
  onLoad(query) {
    // this.setData({
    //   id:query.id?query.id:'1',
    // })
    
    // 页面加载
  },
  auth_Page:function(){
    var _this=this;
    // my.removeStorageSync({
    //   key: 'info',
    // });
    var info=my.getStorageSync({ key: 'info' }).data;
    var token=info && info.token?JSON.stringify(info.token):'';

    if(!info || info.nowType != 0 || !token){ //我原来是员工-切换到游客的状态-要删除原来的token-从新去授权
      my.navigateTo({ url: '/pages/login/login' })
    }else {
      my.reLaunch({
        url: '/pages/yk_code/yk_code'
      })
    }
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
