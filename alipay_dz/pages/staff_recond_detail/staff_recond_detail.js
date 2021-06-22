const app = getApp();
Page({
  data:{
    id:'',
    detail:{}
  },
  onLoad(query) {
    // 页面加载
    my.setNavigationBar({
        backgroundColor:'#4C8EF8'
    })
    console.log(query)
    this.setData({id:query.id});
    this.getData();
  },
  getData(){
    let data = {
      id:this.data.id
    }
    app.ajax({
      url:app.api+'code/kill_info',
      type:'get',
      data,
      success:res => {
        //console.log(res);
        this.setData({detail:res.info});
      },
      complete:com => {
      }
    })
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
