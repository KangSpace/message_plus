import util from '/utils/util'
import constants from '/utils/constants'
import config from '/utils/config'

Page({
  ...util,
  ...config,
  data:{
    ...constants,
    pageName: 'index/index',
    pageDesc:'消息Plus',
    messageTabs:constants.constants.messageTypes,
    page:{
      //
      fullScreen:false
    }
    
  },

  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    //加载页面
    this.sortMsgTypes();
  },
  sortMsgTypes(){
    let types = this.data.constants.getMessageTypes().sort((t1,t2)=>t1.index-t2.index);
    let page =this;
    setTimeout(function(){
      page.setData({messageTabs:types});
    },20);
  },
  changeSort(){
    console.log("call changeSort");
    let messageTypes = this.data.constants.getMessageTypes();
    messageTypes.forEach(element => {
      element.index = (element.index+1) >= messageTypes.length?0:(element.index+1);
    });
    this.sortMsgTypes();
  },
  scrollInto(){
      this.setData({"scrollInfoView":'tab_'+this.data.i%9,i:(this.data.i+1)});
      console.log("scrollInfoView:"+this.data.scrollInfoView)
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
    dd.stopPullDownRefresh();
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '消息Plus',
      desc: '消息Plus应用分享',
      path: 'pages/biz/index/index',
    };
  },
  onFullScreen(e){
    var type = e.currentTarget.dataset.type;
    this.setData({"page.fullScreen":(type && type =="true"?true:false)});
  },
  getLastHeight(rawHeight){
    // return this.data.page.fullScreen?(rawHeight+150):rawHeight;
    return rawHeight;
  }
});
