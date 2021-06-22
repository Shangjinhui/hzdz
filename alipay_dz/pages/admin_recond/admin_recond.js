const app =getApp();
Page({
  data:{
    id:'',
    pageNo:1,
    limit:20,
    search:'',
    endTime:'',
    list:[],
  },
  onLoad(query) {
    this.setData({id:query.id})
    // 页面加载
    let title = query.type==1?'历史记录':'所有记录'; //1历史记录:管理员首页查看更多记录;2所有记录:管理员中心-所有地点萧山记录-地点列表-记录列表
    my.setNavigationBar({
        backgroundColor:'#4C8EF8',
        title
    })
    this.getEndTime();
    this.getData();
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  getData(){
    let data = {
      id:this.data.id,
      pageNo:this.data.pageNo,
      limit:this.data.limit,
      search:this.data.search
    }
    console.log(data)
    app.ajax({
      url:app.api+'code/log_list',
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
