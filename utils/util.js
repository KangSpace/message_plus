/**
 * api,util所有操作的统一出口
 */
import client from '/utils/api/client/clientapi';
//MessagePlus Webview路径
const messagePlusWebviewPagePath = "/pages/biz/webview/webview";

export default{
  ...client,
  messagePlusWebviewPagePath,
  /**
   * ```
   * href 跳转
   * 参数: href,必须为元素添加data-href属性
   * 用法:
   * <view class="href" catchTap="goto" data-href="https://example.org"></view>
   * 注意: 
   *    此处需使用非冒泡事件 cacheTap
   * ```
   * @see https://developers.dingtalk.com/document/app/event-overview
   */
  goto(e){
    let url = e.target.dataset.href;
    if(!url){
      console.error("goto(e) error: data-url not found!",e);
      return 0;
    }
    if(this.isHttpSchema(url)){
        url = messagePlusWebviewPagePath+"?url="+encodeURIComponent(url);
    }
    client.ui.nav.navigateTo(url,function(data){
        console.log(data);
    },function(e){
        console.log(e); 
    }); 
    console.log("call goto: url="+url);
    
  },

  refreshRedirectTo(url){
    this.redirectTo({target:{dataset:{url:url}}});
  },

  /**
   * 重定向跳转,关闭当前页面
   * @param {url} url 
   */
  redirectTo(e){
    let url = e.target.dataset.url;
    if(!url){
      console.error("redirectTo(e) error: data-url not found!",e);
      return 0;
    }
    if(this.isHttpSchema(url)){
        url = messagePlusWebviewPagePath+"?url="+encodeURIComponent(url);
    }
    client.ui.nav.redirectTo(url,function(){
        console.log(e);
    },function(e){
        console.log(e); 
    }); 
    console.log("call redirectTo: url="+url);
  },
   

  /**
   * 是否http协议的URL
   * @param {*} url 
   */
  isHttpSchema(url){
      return (url && url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://"));
  },

  onSelectImg(e){
      let page = this;
      let modifyData = e.currentTarget.dataset.modifyData;
      //TODO 需处理
      client.ui.loading(false);
      client.media.chooseImage(1,(res) => {
          if(modifyData){
            let data = {};
            data[modifyData]= res.filePaths[0];
            page.setData(data);
            // console.log(res);
            
          }
          // this.ui.toast("图片选取成功,modifyData:"+modifyData);
       },(error)=>{
         console.error(e);
       });
    },
    onRemoveImg(e){
      let modifyData = e.currentTarget.dataset.modifyData;
      let data = {};
      data[modifyData]= '';
      this.setData(data);
    },
    onCounterChangeUp(e){
      // let maxCount = e.currentTarget.dataset.maxCount;
      // if(!maxCount){
      //   console.warn("call onCounterChangeUp:data-maxCount not found!");
      // }
      let modifyData = e.currentTarget.dataset.modifyData;
      if(!modifyData){
        console.warn("call onCounterChangeUp:data-modifyData not found!");
        return 0;
      }
      let oldData = this.getDataByVarName(modifyData);
      let data = {};
      data[modifyData]= !oldData?2:(oldData+1);
      this.setData(data);
    },

    onCounterChangeDown(e){
      let page = this;
      let modifyData = e.currentTarget.dataset.modifyData;
      if(!modifyData){
        console.warn("call onCounterChangeUp:data-modifyData not found!");
        return 0;
      }
      let oldData = this.getDataByVarName(modifyData);
      let data = {};
      data[modifyData]= !oldData || oldData<0?1:(oldData-1);
      page.setData(data);
      console.log(this.data);
    },
    onInputChangeValueSet(e){
      let modifyDataKey = e.currentTarget.dataset.modifyData;
      this.setModifyDataValue(modifyDataKey ,e.detail.value,"onInputChangeValueSet");
    },
    setModifyDataValue(modifyDataKey,value,funName=""){
      if(!modifyDataKey){
        console.warn(funName+" setModifyDataValue data-modifyData not found!");
        console.trace();
        return 0;
      }
      let page = this;
      let data = {};
      data[modifyDataKey]= value;

      page.setData(data);
      // console.log("call "+funName+" setModifyDataValue ok ,key:"+modifyDataKey+", new value:"+ this.getDataByVarName(modifyDataKey));
    },

    /**
     * 根据属性名获取data里的数据
     * 支持.分隔符
     * @param {*} varname 
     */
    getDataByVarName(varname){
      let oldData;
      if(varname){
        let tempData = this.data;
        varname.split(".").forEach(e => {
          if(e.indexOf("[")>-1){
            try{
              let nestKeys = e.split("[");
              let tempNestData = tempData[nestKeys[0]];
              for(let i=1;i<nestKeys.length;i++){
                let iKey = nestKeys[i];
                iKey = iKey.substring(0,iKey.length-1);
                tempData = tempNestData[iKey];
              }
            }catch(e){
              console.error("getDataByVarName key invalid:"+varname,e);
            }
          }else{
            tempData = tempData[e];
          }
        });
        oldData = tempData;
      }
      return oldData;
    },
    //**转换为钉钉客户端打开的URL */
    toDTalkClientUrl(url){
      //&pc_slide=true
      return url?("dingtalk://dingtalkclient/page/link?url="+encodeURIComponent(url)):"";
    }
    
}