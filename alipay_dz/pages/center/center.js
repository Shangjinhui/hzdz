const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,
    date:'',
    list:[],
    state:false,
  },
  onLoad() {
    my.setNavigationBar({
      backgroundColor:'#4C8EF8',
    })
    let info = my.getStorageSync({ key: 'info' }).data;
    this.setData({
      date:info
    })
    console.log(info)

  },
  home_link:function(){
    my.navigateTo({ url: '/pages/staff_index/staff_index' })
  }
});
