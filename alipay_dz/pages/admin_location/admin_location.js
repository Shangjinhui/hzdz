const app = getApp();
Page({
  data:{
    list:[
      
    ],
    pageNo:1,
    limit:20,
    imgs:['../../assets/images/blue.png','../../assets/images/yellow.png','../../assets/images/red.png']
  },
  onLoad(query) {
    // 页面加载
    my.setNavigationBar({
        backgroundColor:'#4C8EF8'
    })
    this.getData();
  },
  getData(){
    let data = {
      pageNo:this.data.pageNo,
      limit:this.data.limit,
    }
    app.ajax({
      url:app.api+'code/area_list',
      type:'get',
      data,
      success:res => {
        console.log(res);
        let list = this.data.list,now = res.list.filter(item=>item.type!=-1);
        if(list.length<res.count){
          list.push(...now);
          this.setData({list})
        }
      },
      complete:com => {
      }
    })
  },
  lower(){
    console.log('jiazai');
    let pageNo = this.data.pageNo;
    pageNo++;
    this.setData({pageNo});
    this.getData();
  },
  toList(e){
    my.navigateTo({
      url: '/pages/admin_recond/admin_recond?id='+e.target.dataset.id+'&type=2'
    });
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
