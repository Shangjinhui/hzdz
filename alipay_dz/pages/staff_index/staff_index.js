const app = getApp();
Page({
  data:{
    imgUrl: app.imgUrl,
    id:'',
    detail:{},
    date:'',
    text:0,
  },
  onLoad(query) {
    //缓存中拿id
    let id = my.getStorageSync({ key: 'type_id' }).data||'';
    //获取缓存个人信息
    //根据传过来的是否有查杀id，有：直接调查杀接口显示查杀成功,无：显示扫码
    let info = my.getStorageSync({ key: 'info' }).data;
    console.log(id,info)
    this.setData({
      date:info,
      id,
    })
    // 页面加载
    my.setNavigationBar({
        backgroundColor:'#4C8EF8'
    })
    if(this.data.id){
      this.getData();
      this.Chasha();
    }
  },
  getData(){
    let data = {
      id:this.data.id
    }
    app.ajax({
      url:app.api+'code/code_info',
      type:'get',
      data,
      success:res => {
        //console.log(res)
        this.setData({detail:res.info})
      },
      complete:com => {
        
      }
    })
  },
  Chasha(){
    let data = {
      id:this.data.id
    }
    app.ajax({
      url:app.api+'code/kill',
      type:'get',
      data,
      success:res => {
        this.setData({detail:res.info})
      },
      complete:com => {
        
      }
    })
  },
  //扫码
  openScan() {
    my.scan({
      scanType: ['qrCode','barCode'],
      success: (res) => {
        if(res.code){
          my.navigateTo({ url: '/pages/scan_code/scan_code?url='+res.code })
        }
        console.log(res)
        // console.log(res);
        // this.setData({
        //   text:res
        // })
        // if(res.id){
        //   this.setData({id:res.id});
        //   //重置缓存id
        //   my.setStorageSync({ key: 'type_id',data:res.id });
        //   if(this.date.nowType=='1'){
        //     this.Chasha();
        //   }else{
        //     my.navigateTo({ url: '/pages/yk_code/yk_code' })
        //   }
        // }else{
          // my.alert({
          //   title: '温馨提示',
          //   content: '当前码是无效码',
          // });
        // }
      },
    });
  },
  //跳转个人中心
  center_link:function(){
    my.navigateTo({ url: '/pages/center/center' })
  },
  //跳转当前页面
  toHome(){
    this.setData({id:''})
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
