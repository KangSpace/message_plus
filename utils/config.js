import util from '/utils/util';
import constants from '/utils/constants';

/**
 * 配置相关处理:
 * 获取配置,更新配置,缓存配置等
 **/


export default{
        /**本地缓存的配置 */
     storedConfig : {
        //APP类型
        appType:{
          type:"remote"
        },
        // 
        requestType:{
          //请求模式
          type:"local",
          serverUrl:"https://oapi.dingtalk.com",
          ///message/send_to_conversation
          messagePathUrl:"https://oapi.dingtalk.com/message/send_to_conversation",
          ///gettoken
          getTokenPathUrl:"https://oapi.dingtalk.com/gettoken",
          // 免登陆获取用户信息
          getUserInfoUrl:"https://oapi.dingtalk.com/user/getuserinfo",
          //媒体文件上传
          mediaUploadUrl:"https://oapi.dingtalk.com/media/upload",

        },
        //本地模式下有效
        appInfo:{
          appKey:"",
          appSecret:"",
          accessToken:"",
          //保存时间
          cacheTime:0,
          //有效时长,单位s
          exipreIn:0,
        },
        userInfo:{
          userId:"",
          name:""
        }
      },

      config:{
        /** 获取storedConfig结构 */
        getDefaultStoredConfigStruct(){
          let pages = getCurrentPages();
          let page = pages[pages.length -1 ];

          return JSON.parse(JSON.stringify(page.storedConfig));
        },
        configKey :"messageplus_runtime_config",
        /**获取配置,配置不存在时使用初始化配置 */
        getStoredConfig(){
           let storedConfig = util.store.getSync(this.configKey).data;
           if(!storedConfig){
            //  util.ui.toast("配置信息不存在,请重新打开小程序再试~");
            return this.initDefaultCoinfg();
           }
           return storedConfig;
        },
         /**初始化默认配置 */
        initDefaultCoinfg(){
          let storedConfig = this.getDefaultStoredConfigStruct();
          try{
              console.log("storedConfig not exists,init default config...");

              let appDefaultInfo = constants.constants.appDefaultInfo;

              storedConfig.appType.type = appDefaultInfo.appType.type;
              storedConfig.requestType.type = appDefaultInfo.requestType.type;
              
              //自建APP
              if(storedConfig.appType.type == "custom"){
                  storedConfig.requestType.serverUrl = appDefaultInfo.localServerUrl;
                  storedConfig.appInfo.appKey = appDefaultInfo.appInfo.appKey;
                  storedConfig.appInfo.appSecret = appDefaultInfo.appInfo.appSecret;
              }else{
                //托管
                  storedConfig.requestType.serverUrl = appDefaultInfo.hostedServerUrl;
              }
              //local模式上传文件使用托管服务的上传接口
              let mediaUploadUrlHost = storedConfig.requestType.serverUrl;
              if(storedConfig.requestType.type == "local"){
                    mediaUploadUrlHost = appDefaultInfo.hostedServerUrl;
              } 

              storedConfig.requestType.messagePathUrl = storedConfig.requestType.serverUrl+appDefaultInfo.messagePath;
              storedConfig.requestType.getTokenPathUrl = storedConfig.requestType.serverUrl+appDefaultInfo.getTokenPath;
              storedConfig.requestType.getUserInfoUrl = storedConfig.requestType.serverUrl+appDefaultInfo.getUserInfoPath;
              storedConfig.requestType.mediaUploadUrl = mediaUploadUrlHost+appDefaultInfo.mediaUploadPath;

              this.saveStoredConfig(storedConfig,function(){
                console.log("storedConfig not exists,inited config...! new data:",storedConfig);
              });

            }catch(e){
              console.error("配置初始化错误,",e)
            }
            return storedConfig;
        },
        /**检查配置是否存在 */
        checkStoreConfigIsExists(){
          return util.store.getSync(this.configKey).data;
        },
        saveStoredConfig(configData,successFn){
          util.store.save(this.configKey,configData,function(){
              console.log("saveStoredConfig 配置保存成功");
              if(successFn){ 
                successFn();
              }
          });
        },
        saveUserInfoToStoredConfig(userInfo){
          let configData = this.getStoredConfig();
          if(!configData){
            configData = {};
          }
          //{"userId":"xxx","name":"xxx"}
          configData.userInfo = userInfo;
          this.saveStoredConfig(configData);
        },
      },
   
    /**
     * 初始化配置
     */
    initConfig(){
      console.log("call initConfig");
      let page = this;
      //获取缓存配置
      let configData = this.config.checkStoreConfigIsExists();
      let storedConfig = configData;
      if(!configData){
        util.ui.loading(true,"初始化配置中ing...");
        try{
          this.config.initDefaultCoinfg();

        }catch(e){
          console.error("配置初始化错误,",e)
        }finally{ 
           util.ui.loading(false);
        }
       
      }
      //设置缓存配置
      console.log("call initConfig end!");

      this.storedConfigUtil.checkAndRefreshAccessToken(this,storedConfig,function(accessToken){
        if(accessToken || storedConfig.appType.type == "hosted"){
          //刷新用户信息
          page.storedConfigUtil.checkAndRefreshUserInfo(page,storedConfig,accessToken);
        }
      });
    },

    storedConfigUtil:{ 
      getMessagePathUrl(page){
        let storedConfig = page.config.getStoredConfig();
        return storedConfig && storedConfig.requestType.messagePathUrl?storedConfig.requestType.messagePathUrl:null;
      },
      
      getTokenPathUrl(page){
        let storedConfig = page.config.getStoredConfig();
        return storedConfig && storedConfig.requestType.getTokenPathUrl?storedConfig.requestType.getTokenPathUrl:null;
      },

      getAppInfo(page){
        let storedConfig = page.config.getStoredConfig();
        return storedConfig && storedConfig.appInfo?storedConfig.appInfo:null;
      },

      getAccessToken(page){
        let storedConfig = page.config.getStoredConfig();
        return storedConfig && storedConfig.appInfo.accessToken?storedConfig.appInfo.accessToken:null;
      },
      checkAndRefreshAccessToken(page,storedConfig,successFn,failFn){

        if(storedConfig.appType.type == "custom" && storedConfig.requestType.type == "local"){
          let accessToken = this.checkAccessTokenExpireTime((page.$page?page.$page:page));
          console.log("checkAccessTokenExpireTime accessToken:"+accessToken);
          if(!accessToken){
            this.refreshAccessToken(page,successFn,failFn);
            // this.storedConfigUtil.refreshAccessToken(page,successFn,failFn);
          }else{
            successFn(accessToken);
          }
        }else{
          successFn('');
        }
      },
      /**
       * 检查accessToken超时时间
       * @returns string :accessToken
       *          false :accessToken expired or not exists
       */
      checkAccessTokenExpireTime(page){
        console.log("call checkAccessTokenExpireTime")
        let storedConfig = page.config.getStoredConfig();
        let result = false;

        if(storedConfig && storedConfig.appInfo.accessToken){
          let cacheTime = storedConfig.appInfo.cacheTime;
          let expireIn = storedConfig.appInfo.exipreIn;
          if(cacheTime+expireIn>(new Date().getTime()/1000)){
            result = storedConfig.appInfo.accessToken;
          }
        }
        return result; 
      },

      /**
       * 刷新AccessToken及缓存
       */
      refreshAccessToken(page,successFn,failFn){
        let storedConfig = page.config.getStoredConfig();
        if(storedConfig && storedConfig.appInfo){
          let appInfo = storedConfig.appInfo;
          let appKey = appInfo.appKey;
          let appSecret = appInfo.appSecret;
          if(appKey && appSecret){
            let url = this.getTokenPathUrl(page);
            let appInfo = this.getAppInfo(page);
            url+="?appkey="+appInfo.appKey+"&appsecret="+appInfo.appSecret;
            util.net.getRequest(url,function(response){
                let res = response.data;
                // {
                //     "errcode": 0,
                //     "access_token": "96fc7a7axxx",
                //     "errmsg": "ok",
                //     "expires_in": 7200 
                // }
                if(res.errcode == 0){
                  //设置token
                  storedConfig = page.config.getStoredConfig();
                  storedConfig.appInfo.accessToken = res.access_token;
                  storedConfig.appInfo.exipreIn = res.expires_in;
                  storedConfig.appInfo.cacheTime = new Date().getTime()/1000;
                  page.config.saveStoredConfig(storedConfig,function(){
                    console.log("refreshAccessToken OK");
                  });
                  if(successFn){
                    successFn(storedConfig.appInfo.accessToken);
                  }
                  return 1;
                }else if(res.errcode =40096){
                  util.ui.alert(res.errmsg);
                }else if(res.errcode =60020){
                  util.ui.alert(res.errmsg,"获取AccessToken失败!");
                }else{
                  console.log("refreshAccessToken request fail,response:",res);
                }
                if(failFn){
                  failFn(res);
                }
            },function(res){ 
              util.ui.toast("获取token失败,请检查网络！","fail");
              if(failFn){
                  failFn(res);
                }
            },function(){

            });
          }else{
            console.log("refreshAccessToken: appKey or appSecret not found , check the storeConfig:"+config.configKey)
          }
        }
      },
      checkAndRefreshAccessTokenAndUserInfo(){
        //TODO
      },

      /**
       * 检查并刷新用户信息
       */
      checkAndRefreshUserInfo(page,storedConfig,accessToken,successFn){
        //自建应用且请求类型为本地需要检查并刷新用户信息
        //托管应用或自建的请求类型为服务器的需从服务器端拉取用户信息
        if(!storedConfig.userInfo.userId){
          if(storedConfig.appType.type == "custom" && storedConfig.requestType.type == "local"){
              console.log("checkAndRefreshUserInfo: 用户信息不存在,开始重新获取");
              this.getUserInfo(page,accessToken,"local",storedConfig,successFn);
          }else{
            // console.warn("checkAndRefreshUserInfo: remote getUserInfo not implement!");
            this.getUserInfo(page,accessToken,"remote",storedConfig,successFn);
          }
        }
      }, 
      //** 获取用户信息,并更新缓存*/
      getUserInfo(page,accessToken,requestType,storedConfig,successFn){
        util.ui.loading(true,"正在获取用户信息...");
        try{
          util.openapi.getAuthCode(function(res){ 
            let authCode = res.authCode;
            let url = storedConfig.requestType.getUserInfoUrl+"?code="+authCode;
            if(accessToken){
              url+="&access_token="+accessToken;
            }
            util.net.getRequest(url,function(response){
              let res = response.data;
              if(res.errcode == 0){
                //v2版本接口返回 {errcode: 0, errmsg: "ok", request_id: "w1oxcq3z7qge", result: {…}}
                if(res.result){
                  res = res.result;
                }
                let userInfo = {"userId":res.userid,"name":res.name};
                page.config.saveUserInfoToStoredConfig(userInfo);
                if(successFn){
                  successFn(userInfo);
                }
              }else if(res.errcode == 60020){
                util.ui.toast("获取用户信息请求失败,请检查网络和IP白名单~");
              }else{
                util.ui.toast(res.errmsg)
              }
            },function(e){
              util.ui.toast("获取用户信息请求失败,请检查网络");
              console.error("getUserInfo: 获取用户信息请求失败,",e);
            },function(){
              util.ui.loading(false);
            });
            // if(requestType == "local"){
            //   let url = storedConfig.requestType.getUserInfoUrl+"?access_token="+accessToken+
            //   "&code="+authCode;
            //   util.net.getRequest(url,function(response){
            //     let res = response.data;
            //     if(res.errcode == 0){
            //       let userInfo = {"userId":res.userid,"name":res.name};
            //       page.config.saveUserInfoToStoredConfig(userInfo); 
            //       if(successFn){
            //         successFn(userInfo);
            //       }
            //     }else if(res.errcode == 60020){
            //       util.ui.toast("获取用户信息请求失败,请检查网络和IP白名单~");
            //     }else{
            //       util.ui.toast(res.errmsg)
            //     }
            //   },function(e){
            //     util.ui.toast("获取用户信息请求失败,请检查网络");
            //     console.error("getUserInfo: 获取用户信息请求失败,",e);
            //   });
            // }else{
            //   console.warn("getUserInfo: remote getUserInfo not implement!");
            // }
          },function(e){
            util.ui.loading(false);
            util.ui.toast("网络异常...")
            console.error("getUserInfo getAuthCode失败:",e);
          },function(){
            
          });
        }catch(e){
          console.error(e);
        }finally{
          
        }
        
      }
    }
 }