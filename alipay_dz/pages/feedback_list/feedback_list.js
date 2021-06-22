const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,
    list:[],
    pageNo:1,
    limit:20,
    count:0,
  },
  onLoad() {
    my.setNavigationBar({
      backgroundColor:'#4C8EF8',
    })
    let info = my.getStorageSync({ key: 'info' }).data;
    this.setData({
      date:info
    })
    this.get_list();
  },
  get_list(){
    var _this=this;
    app.ajax({
      url: app.api + 'code/feedback_list',
      type: 'get',
      data:{
        pageNo:_this.data.pageNo,
        limit:_this.data.limit
      },
      success:res => {
        let list = this.data.list;
        if(list.length<res.count){
          list.push(...res.list);
          this.setData({list})
        }
      },
      complete:com => {
      }
    });
  },
  lower(){
    let pageNo = this.data.pageNo;
    pageNo++;
    this.setData({pageNo});
    this.get_list();
  },
});
