const app = getApp();
Page({
  data:{
    list:[],
    pageNo:1,
    limit:20,
    search:'',
    endTime:'',
  },
  onLoad(query) {
    // 页面加载
    my.setNavigationBar({
        backgroundColor:'#4C8EF8'
    });
   this.getData();
   this.getEndTime();
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  getData(){
    let data = {
      pageNo:this.data.pageNo,
      limit:this.data.limit,
      search:this.data.search
    }
    app.ajax({
      url:app.api+'code/my_log',
      type:'get',
      data,
      success:res => {
        console.log(res);
        let list = this.data.list;
        if(list.length<res.count){
          list.push(...res.list);
          this.setData({list})
        }
      },
      complete:com => {
      }
    })
  },
  getEndTime(){
    let date = new Date();
    let str = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    this.setData({endTime:str});
  },
  datePicker(){
     my.datePicker({
      currentDate: this.data.search,
      startDate: '',
      endDate: this.data.endTime,
      success: (res) => {
        console.log(res);
        this.setData({search:res.date,pageNo:1,list:[]});
        this.getData();
      },
    });
  },
  getAll(){
    this.setData({search:'',pageNo:1,list:[]});
    this.getData();
  },
  toDetail(e){
    //console.log(e.target.dataset);
    my.navigateTo({
      url: '/pages/staff_recond_detail/staff_recond_detail?id='+e.target.dataset.id
    });
  },
  lower(){
    console.log('jiazai');
    let pageNo = this.data.pageNo;
    pageNo++;
    this.setData({pageNo});
    this.getData();
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
