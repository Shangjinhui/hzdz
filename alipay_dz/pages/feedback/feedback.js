const app = getApp();
Page({
  data: {
    content:'',
  },
  onLoad() {
    my.setNavigationBar({
      backgroundColor:'#4C8EF8',
    })
  },
  putCon(e){
    this.setData({
        content:e.detail.value
    })
  },


  submit(){
    if(!this.data.content) return;
    let data = {
      content:this.data.content
    }
    app.ajax({
      url:app.api+'code/feedback',
      type:'post',
      data,
      success:res => {
        // my.showToast({type:'success',content: com.data.msg});
        my.showToast({
            type:'success',
            content: '提交成功',
            success: () => {
              my.navigateBack()
            },
        });
      },
      // complete:com => {
        // console.log(com);
        // if(com.data.returnCode=='0011'){
        //   my.alert({
        //     title: '温馨提示',
        //     content: com.data.msg,
        //     buttonText: '我知道了',
        //     success: () => {
        //       my.reLaunch({
        //         url: '/pages/center/center'
        //       });
        //     }
        //   });
        // }else if(com.data.returnCode=='0000'){
        //   my.showToast({type:'success',content: com.data.msg});
        //   my.navigateBack();
        // }
      // }
    })
  }
});
