import util from '/utils/util'
import constants from '/utils/constants'
import config from '/utils/config'

Page({
  ...util,
  ...config,
  data: {
    ...constants,
    pageName: 'biz/settings/settings',
    pageDesc:'消息Plus-设置',
    /**配置信息 */
    settings:{
      /** API配置*/
      appInfo:{
        appKey:"",
        appSecret:""
      },
      /** 接口请求模式*/
      requestType:{ 
        //默认Local
        type:"local",
        serverUrl:""
      },
      /** App类型配置 */
      appType:{
        // type:"custom"
        type:"hosted"
      },
      //配置是否改变
      status:{ 
        loading:false,
        changed:false,
      },
      userInfo:{
        userId:"",
        name:""
      }

    },
  },
  /**配置状态修改 */
  settingStatusChanged(stat){
    if(typeof stat !="undefined"){
      this.setData({"settings.status.changed":(stat?true:false)}); 
      if(stat){
        this.setData({"settings.status.loading":false}); 
      }
    }
    return this.data.settings.status.changed;
  },
  settingStatusLoading(stat){
    if(typeof stat !="undefined"){
      this.setData({"settings.status.loading":(stat?true:false)}); 
    }
    util.ui.loading(stat);
    return this.data.settings.status.loading;
  },
  // 页面逻辑处理方法


  //事件处理

  /**App类型切换 */
  onAppTypeChangeHandle(e){
      this.setData({"settings.appType.type":e.detail.value});
      this.settingStatusChanged(true);
      console.log("设置-APP模式选择为:"+this.data.settings.appType.type);
  },
  
  /**请求类型切换 */
  onRequestTypeChangeHandle(e){
      this.setData({"settings.requestType.type":e.detail.value});
      this.settingStatusChanged(true);
      console.log("设置-请求模式选择为:"+this.data.settings.requestType.type);
  }, 

  onAppKeySettingInputChanged(e){
    this.setData({"settings.appInfo.appKey":e.detail.value});
    this.settingStatusChanged(true);
    console.log("设置-AppKey修改为:"+this.data.settings.apiConfig.appKey);
  },
  onAppSecretSettingInputChanged(e){
    this.setData({"settings.appInfo.appSecret":e.detail.value});
    this.settingStatusChanged(true);
    console.log("设置-AppSecret修改为:"+this.data.settings.apiConfig.appSecret);
  },

  onServerUrlSettingInputChanged(e){
    let value = e.detail.value;
    while(value.endsWith("/")){
      value = value.substring(0,value.length-1);
    }
    this.setData({"settings.requestType.serverUrl":value});
    this.settingStatusChanged(true);
    console.log("设置-serverUrl修改为:"+this.data.settings.requestType.serverUrl);
  },
  //保存设置处理
  onSettingSaveHandle(e){
    let page =this;
    this.settingStatusLoading(true);
    this.settingStatusChanged(false);
    //保存配置到缓存
    let newSettings = this.data.settings;
    let storedConfig = config.config.getStoredConfig();
    let appDefaultInfo = constants.constants.appDefaultInfo;

    storedConfig.appType.type = newSettings.appType.type;
    storedConfig.requestType.type = newSettings.requestType.type;
    let isReloadAppId = false;
    //自建APP
    if(storedConfig.appType.type == "custom"){
      if(!newSettings.appInfo.appKey|| !newSettings.appInfo.appSecret){
        page.settingStatusLoading(false);
        util.ui.toast("请输入AppKey和AppSecret~");
        return 0; 
      }
      let serverUrl;
      if(storedConfig.requestType.type == "local"){
        //设置默认值
        serverUrl = appDefaultInfo.localServerUrl;
      }else{
        serverUrl = newSettings.requestType.serverUrl;
      }
      storedConfig.requestType.serverUrl = serverUrl;
      //key不同清空当前配置
      if(storedConfig.appInfo.appKey != newSettings.appInfo.appKey){
        storedConfig.appInfo.accessToken = "";
        storedConfig.appInfo.cacheTime = 0;
        storedConfig.appInfo.exipreIn = 0;
        storedConfig.userInfo = {};
        isReloadAppId = true;
      }
      storedConfig.appInfo.appKey = newSettings.appInfo.appKey;
      storedConfig.appInfo.appSecret = newSettings.appInfo.appSecret;
      
    }else{
      //托管,设置默认值
      storedConfig.requestType.serverUrl = appDefaultInfo.hostedServerUrl;
      isReloadAppId = true;
    }
    //local模式上传文件使用托管服务的上传接口
    let mediaUploadUrlHost = storedConfig.requestType.serverUrl;
    if(storedConfig.requestType.type == "local"){
          mediaUploadUrlHost = appDefaultInfo.hostedServerUrl;
    } 

    storedConfig.requestType.messagePathUrl = newSettings.requestType.serverUrl+appDefaultInfo.messagePath;
    storedConfig.requestType.getTokenPathUrl = newSettings.requestType.serverUrl+appDefaultInfo.getTokenPath;
    storedConfig.requestType.getUserInfoUrl = newSettings.requestType.serverUrl+appDefaultInfo.getUserInfoPath;
    storedConfig.requestType.mediaUploadUrl = mediaUploadUrlHost+appDefaultInfo.mediaUploadPath;
  
    try{
      config.config.saveStoredConfig(storedConfig,function(){
        util.ui.toast("保存成功！");
        //保存成功后,状态更新
        page.settingStatusLoading(false);
        //刷新一个AccessToken和用户信息
  
        if(isReloadAppId){
          if(storedConfig.appType.type == "custom" && storedConfig.requestType.type == "local"){
            //刷新access_token,再刷新用户信息
            config.storedConfigUtil.refreshAccessToken(page,function(accessToken){
              config.storedConfigUtil.getUserInfo(page,accessToken,'local',storedConfig,function(){
                page.reloadUserInfo(userInfo);
              });
            });
          }else{
            //直接刷新用户信息
            config.storedConfigUtil.getUserInfo(page,null,'remote',storedConfig,function(userInfo){
                page.reloadUserInfo(userInfo);
            });
          }
        }
      });
    }catch(e){
      console.error(e);
    }finally{
      page.settingStatusLoading(false);
    }
   
  },
  //重新加载页面上的用户信息
  reloadUserInfo(userInfo){
    this.setData({"settings.userInfo.userId":userInfo.userId,
                 "settings.userInfo.name":userInfo.name})
  },
 
  //默认事件处理方法
  onReady(){
    this.initSettings();
  },

  onPullDownRefresh(e) {
    this.initSettings()
  // 页面被下拉
    console.log("onPullDownRefresh:{}",e)
    dd.stopPullDownRefresh();
    dd.showToast({
      type: 'success',
      content: '刷新成功',
      duration: 1000,
      success: () => {}, 
    });
  },
  /** 从缓存中初始化设置 */
  initSettings(){
    let page = this;
    console.log("call initSettings");
    //从缓存中获取配置信息
    let storedConfig = config.config.getStoredConfig();
    //将缓存配置更新到页面
    let updateData = {
      "settings.appType.type":storedConfig.appType.type,
      "settings.requestType.type":storedConfig.requestType.type,
      "settings.requestType.serverUrl":storedConfig.requestType.serverUrl,
      "settings.appInfo.appKey":storedConfig.appInfo.appKey,
      "settings.appInfo.appSecret":storedConfig.appInfo.appSecret,
      "settings.userInfo.userId":storedConfig.userInfo.userId,
      "settings.userInfo.name":storedConfig.userInfo.name,
    }
    this.setData(updateData);
    this.settingStatusChanged(false);
    console.log("call initSettings ok!");
    //刷新用户信息
    config.storedConfigUtil.checkAndRefreshUserInfo(page,storedConfig,storedConfig.appInfo.accessToken,function(userInfo){
          page.setData({
            "settings.userInfo.userId":userInfo.userId,
            "settings.userInfo.name":userInfo.name,
          });
    });
  }
})