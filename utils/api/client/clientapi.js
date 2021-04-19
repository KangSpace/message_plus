let clientApi = dd;
export default{
  
  /**ui */
  ui:{
    /** alert */
    alert(content,title="亲",successFn,failFn,buttonText="我知道了"){
      dd.alert({
        title: title,
        content: content,
        buttonText: buttonText,
        success: successFn,
        fail:failFn
      });
    },
    /** toast */
    toast(content,type,duration=1000,successFn,failFn){
        dd.showToast({
          type: type,
          content: content,
          duration: duration, 
          success: successFn,
          fail:failFn
        });
    },
    loading(type,content,successFn,failFn){
      if(type){
        dd.showLoading({
          content: content,
          succecc:successFn,
          fail:failFn
        });
      }else{
        dd.hideLoading({});
      }
    },
    selector(){
      return dd.createSelectorQuery();
    },
    /**导航 */
    nav:{
      /**页面跳转（保留当前页） */
      navigateTo(url,successFn,failFn,completeFn){
        clientApi.navigateTo({
          url:url,
          success:successFn,
          fail:failFn,
          complete:completeFn
        });
      },
      /**页面跳转（关闭当前页） */
      redirectTo(url,successFn,failFn,completeFn){
        clientApi.redirectTo({
          url:url,
          success:successFn,
          fail:failFn,
          complete:completeFn
        });
        
      },
      /**页面跳转（关闭所有页面） */
      reLaunch(url,successFn,failFn,completeFn){
        clientApi.reLaunch({
          url:url,
          success:successFn,
          fail:failFn,
          complete:completeFn
        });
      },
      
      /**返回上一级或多级页面 */
      navigateBack(delta=1){
        clientApi.navigateBack({
          delta:delta
        });
      },
    },
  },
  /**存储 */
  store:{
    /**同步保存 */
    saveSync(key,value){
      dd.setStorageSync({
        key: key,
        data: value
      });
    },

    /**异步保存 */
    save(key,value,successFn,failFn){
      dd.setStorage({
        key: key,
        data: value,
        success: successFn,
        fail:failFn
      });
    },

    /**同步获取 */
    getSync(key){
      let data;
      try{
        data = dd.getStorageSync({ key: key });
      }catch(e){
        console.error("getSync("+key+") error,",e);
      }
      return data;
      
    },
    /**异步获取 */
    get(key,successFn,failFn){
        dd.getStorage({
          key: key,
          success: successFn,
          fail: failFn
        });
    }
  },
  /**网络请求 */
  net:{
    postRequest(url,data,succeccFn,failFn,completeFn){
      this.httpRequest("POST",url,data,succeccFn,failFn,completeFn);
    },
    getRequest(url,succeccFn,failFn,completeFn){
      this.httpRequest("GET",url,null,succeccFn,failFn,completeFn);
    },
    httpRequest(type,url,data,succeccFn,failFn,completeFn){
      console.log("call ajaxRequest,type:"+type+"url:"+url+",data:"+JSON.stringify(data));
      // Content-Type为application/json时，data参数只支持json字符串，用户需要手动调用JSON.stringify进行序列化
      dd.httpRequest({
        headers: {
          "Content-Type": (data?"application/json":"test/html")
        },
        url: url,
        method: type,
        // 需要手动调用JSON.stringify将数据进行序列化
        data: (data?JSON.stringify(data):""),
        dataType: 'json',
        success: function(res) {
          console.log("request success: url:"+url+" response:",res);
          if(succeccFn){
            succeccFn(res);
          }
        },
        fail: function(res) {
          console.log("request fail: url:"+url+" response:",res);
          if(failFn){
            failFn(res);
          }
        },
        complete: function(res) {
          if(completeFn){
            completeFn();
          }
        }
      });
    },
    /**
     * 上传文件到开发者服务器
     * @param {*} url 
     * @param {*} fileType 
     * @param {*} fileName form表单文件的key
     * @param {*} filePath 
     * @param {*} successFn 
     * @param {*} failFn 
     * @param {*} completeFn 
     */
    uploadFile(url,fileType="image",fileName,filePath,successFn,failFn,completeFn){
      dd.uploadFile({
        url: url,
        fileType: fileType,
        fileName: fileName,
        filePath: filePath,
        success: function(data){
          console.log("uploadFile success,url:",url,"filePath:",filePath,",response:",data);
          if(successFn){
            successFn(data);
          }
        },
        fail:function(e){
          console.log("uploadFile fail,url:",url,"filePath:",filePath,",error:",e);
          if(failFn){
            failFn(e);
          }
        },
        complete:completeFn
      });
    },
  },
  /**剪切板 */
  clipboard:{
    set(text,successFn,failFn,completeFn){
      clientApi.setClipboard({
        text:text,
        success: successFn,
        fail:failFn,
        completeFn
      });
    },
    /**
     * 获取剪切板数据
     * @param {*} successFn(text) 
     * @param {*} failFn 
     * @param {*} completeFn 
     */
    get(successFn,failFn,completeFn){
      clientApi.getClipboard({
        success: successFn,
        fail:failFn,
        completeFn
      });
    }
  },
  media:{
    chooseImage(count=1,successFn,failFn){
      dd.chooseImage({
        count: count,
        success: successFn,
        fail:failFn
      });
    },

  },
  openapi:{
    /**选择会话 */
    chooseChatForNormalMsg(successFn,failFn,completeFn){
      dd.chooseChatForNormalMsg({
        isConfirm: true, //是否弹出确认窗口，默认为true
          success: res => {
              // 该cid和服务端开发文档-普通会话消息接口配合使用，而且只能使用一次，之后将失效
            /*{
                cid: 'xxxx',
                title:'xxx'
            }*/
            successFn(res);
          },
          fail: failFn,
          complete:completeFn
      });
    },
    getAuthCode(successFn,failFn,completeFn){
      dd.getAuthCode({
         /*{
              authCode: 'hYLK98jkf0m' //string authCode
          }*/
          success:successFn,
          fail:failFn,
          complete:completeFn
      });
    }
  }
}