const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,
    list:[],
    state:false,
    url:'',
  },
  onLoad(option) {
    console.log(option)
    my.setNavigationBar({
      backgroundColor:'#4C8EF8',
    })
    this.setData({
      url:option.url,
    })
  },
});
