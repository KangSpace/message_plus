import errorView from '/pages/biz/error-view';
import util from '/utils/util';

//TODO 需设置webview安全域名
Page({
  ...util,
  ...errorView,
  data:{
    webviewId:"msg-plus-webview",
    url:"",
    //错误页数据
    errorData: {
        type: 'error',
        title: '访问地址错误',
        button: '返回',
        onButtonTap: ''
    },
  },
  
  onLoad(query){
    console.log(this.data.webviewId+" loaded,query=",query);
    let url = query.url;
    if(!url){
      this.setData({"url":"error"});
      return 0;
    }
    this.setData({"url":url});
    // this.webViewContext = dd.createWebViewContext(this.data.webviewId); 
  },
  

  //事件处理
  //webview消息交互
  onMessageInMsgPlusWebView(e){
    console.log(e);
  },

  //默认事件

  /**点击标题 复制URL路径*/
  onTitleClick(e){
    let text = this.data.url;
    util.clipboard.set(text,()=>{
        util.ui.toast("链接已复制");
    });
  },

  /** 下拉刷新处理*/
  onPullDownRefresh(e) {
    // 页面被下拉
    console.log("onPullDownRefresh:{}",e);
    dd.stopPullDownRefresh();
    let url = this.data.url;
    //重新设置相同的webview url,webview会出现白屏,暂时用dd.redirectTo解决
    this.refreshRedirectTo(url);
  },

  bindLoad(e){
    console.info(e);
  }
});