const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,
    type:"",
    // state:false,
    id:'', //大门id
    info:'', //详情
    list:[], //最近消杀时间列表
    year:'', //跳动的年月
    time:'', //跳动的时分秒
    timer:'', //暂存时间定时器
    timer2:'', //上次时间差定时器
    date:'', //存储本地的个人信息
    lastTime:{     //上次消杀时间
      time:'',
      disH:'',
      disM:'',
      disS:'',
    }
  },
  onLoad(option) {
    //id 存储本地 三者公用
    my.setStorage({
      key: 'type_id',
      data: option.id?option.id:'',
    });

    //获取存放本地的个人信息
    let info = my.getStorageSync({ key: 'info' }).data;
    //-------------------------------
    my.setNavigationBar({
      backgroundColor:'#4C8EF8',
    })
    //外面扫码带的id
    this.setData({
      id:option.id?option.id:'',
      date:info,
      type:info&&info.nowType?info.nowType:'',
    })
    // let type = JSON.stringify(res);//0游客，1员工，2管理员
    //入口页面---------------------------
    if(!info){
      my.reLaunch({
        url: '/pages/index/index'
      });
    }else{
      //判断身份
      let role = info.nowType;
      // console.log(role);
      if(role==0||role==2){//游客或其管理员，在当前页获取数据
        this.get_Info();
        this.time_Controls();
        this.data.timer = setInterval(()=>{
          this.time_Controls();
        },1000)
      }else if(role==1){//员工，跳到员工首页
        my.reLaunch({
          url: '/pages/staff_index/staff_index'
        });
      }
    }
  },
  onShow(){
    
  },
  //页面详情
  get_Info(){
    var _this=this;
    app.ajax({
      url: app.api + 'code/code_info',
      type: 'get',
      data:{
        id:_this.data.id,
      },
      success:res => {
        _this.setData({
          info:res.info,
          list:res.list,
        })
        this.initTime();
        this.data.timer2 = setInterval(()=>{
          this.initTime();
        },1000)
        
      },
      complete:com => {
      }
    });
  },
  //判断是不是大于3次了, 大于三次提示，并不给跳转
  number_link(){
    var _this=this;
    app.ajax({
      url: app.api + 'code/feedback_number',
      type: 'get',
      data:{},
      success:res => {
        if(res.count>=3){
           my.alert({
            title: '温馨提示',
            content: '每人每天最多可提交三次反馈意见，您的次数已用完，请勿反复提交',
          });
        }else{
          my.navigateTo({ url: '/pages/feedback/feedback' })
        }
      },
      complete:com => {
      }
    });
  },
  //处理时间格式
  initTime(){
    let data = this.data.list[0];
    if(data){
      let now = new Date(),last = new Date(data.createTime);
      let dis = now.getTime()-last.getTime();
      // console.log(now,last);
      let lastTime = {};
      lastTime.time = (last.getMonth()+1)+'月'+last.getDate()+'日 '+last.getHours()+':'+last.getMinutes()+':'+last.getSeconds();
      lastTime.disH = parseInt(dis/1000/60/60);
      lastTime.disM = parseInt(dis%(1000*60*60)/1000/60);
      lastTime.disS = parseInt(dis%(1000*60)/1000);
      this.setData({
        lastTime
      })
    }
  },
  //时间控制器
  time_Controls(){
    var new_time=new Date();
    var year = new_time.getMonth()+1 + "月" + new_time.getDate() + '日';
    var time=new_time.getHours() + ':' + new_time.getMinutes() + ':' + new_time.getSeconds();
    this.setData({
      year:year,
      time:time
    })
  },
  //查看全部
  lookAll(){
    my.navigateTo({
      url: '/pages/admin_recond/admin_recond?type=1'
    });
  },
  //首页跳转
  home_Link(){
    var _this=this,data=_this.data.data;
    
  },
  //个人中心跳转
  center_Link(){
    var _this=this;
    
  },
  onUnload(){
    clearInterval(this.data.timer);
    clearInterval(this.data.timer2);
  },
});
