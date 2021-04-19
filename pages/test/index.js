Page({
  data: {
    pageName: 'test/index',
    pageDesc:'消息+消息发送测试',
    pageInfo: {
      pageId: 0,
    },
    curIndex: 0,
    accessToken:'a85f28db6cc831669550af5d7e102649',
    userId:'045401002324522813',
    cTime:'2021/4/8 21:39:26',
    cId:'',
    tempVal:{
      messageType:"text",
    },
    settings:{
      appInfo:{
        appKey:"dingjdpldfbdak",
        appSecret:"",
      },
      //消息类型
      messageTypes:[
        {
          type:"text",
          name:"文本",
          index:0,
          // checked:true
        },
        {
          type:"image",
          name:"图片",
          index:1
        },
        {
          type:"voice",
          name:"语音",
          index:2,
          disabled:false
        },
        {
          type:"file",
          name:"文件",
          index:3,
          disabled:false
        },
        {
          type:"link",
          name:"链接",
          index:4
        },
        {
          type:"oa",
          name:"OA",
          index:5
        },
        {
          type:"markdown",
          name:"Markdown",
          index:6
        },
        {
          type:"action_card_1",
          name:"卡片(整体跳转)",
          index:7
        },
        {
          type:"action_card_2",
          name:"卡片(独立跳转)",
          index:8
        }
      ],
      //网络请求模式
      requestType:[
        {
          id:"local",
          name:"本地模式",
          desc:"网络请求模式-本地模式,需要配置本地IP白名单(服务器出口IP:https://developers.dingtalk.com/document/app/app-faq/title-9eg-fgn-1ml)\n"+
          "本地模式下需手工添加userId和access_token;",
          checked:true
        },
        {
          id:"remote",
          name:"服务端模式",
          desc:"网络请求模式-服务端模式,需要配置IP白名单(服务器出口IP:https://developers.dingtalk.com/document/app/app-faq/title-9eg-fgn-1ml)\n"+
          "服务端模式会根据配置的appKey和appSecret自动请求access_token",
          disabled:true
        }
      ]
    }

  },
  //input修改变量值
  onInputChange(e){
      let val = e.detail.value;
      let varName = e.currentTarget.dataset.varName;
      if(varName){
        let data ={};
        data[varName] = val;
        this.setData({...data});
      }
      console.log(e);
  },
  onTitleClick(e) {
    console.log(this)
    // 标题被点击
    console.log("onTitleClick:{}",e)
    dd.showToast({
      type: 'success',
      content: '点击标题',
      duration: 1000,
      success: () => {
        dd.alert({
          title: 'toast 消失了',
        });
      },
    });
  },
  onPullDownRefresh(e) {
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
  onReachBottom(e) {
    // 页面被拉到底部
    console.log("onReachBottom:{}",e)
  },
  onShareAppMessage(e) {
   // 返回自定义分享信息
   let returnObj = {
      title: '消息+分享测试',
      desc: '消息+分享简单测试。',
      path: 'pages/test/index?param=123',
      imageUrl:'https://kangspace.org/img/logo/KangSpace-white.20200828.png',
      fallbackUrl:'https://kangspace.org',
      desktopContainerType:'side_panel'

    };
   console.log("onShareAppMessage:{}",e,returnObj)
    return returnObj;
  },
  onReady() {
    // 页面加载完成
    let accessTokenObj = this.getAccessToken();
    if(accessTokenObj && accessTokenObj.accessToken){
      this.setData({"accessToken":accessTokenObj.accessToken,
                    "userId":accessTokenObj.userId,
                  "cTime":new Date(accessTokenObj.cTime).toString()});
    }
    if(accessTokenObj && accessTokenObj.appKey){
      this.setData({"settings.appInfo.appKey":accessTokenObj.appKey,
                    "settings.appInfo.appSecret":accessTokenObj.appSecret});
    }
  },

  //自定义操作部分 
  complexChoose(e){
    //打开通讯录
    console.log("call getConcatList");
      dd.complexChoose({
          title:"选择发送对象",            //标题
          multiple:true,            //是否多选
          limitTips:"超出了",          //超过限定人数返回提示
          maxUsers:2,            //最大可选人数
          pickedUsers:[],            //已选用户，值为userId列表
          pickedDepartments:[],          //已选的部门id
          disabledUsers:[],            //不可选用户，值为userId列表
          disabledDepartments:[],        //不可选部门id
          requiredUsers:[],            //必选用户（不可取消选中状态）
          requiredDepartments:[],        //必选部门（不可取消选中状态）
          permissionType:"xxx",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
          responseUserOnly:false,        //返回人，或者返回人和部门
          success:function(res){
              /**
              {
                  "selectedCount":1, //选择人数
                  "users":[{"name":"xxx","avatar":"xxx","userId":"xxx"}], //返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），userId（用户工号）三个字段
                  "departments":[{"id":123,"name":"xxx","count":1}] //返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
              }
              */    
             let selectedCount = res.selectedCount;
             let users = res.users.map(t=>t.name).join(",");
             let departments = res.departments.map(t=>t.name).join(",");
            console.log(res);
            dd.alert({
                title: '亲',
                content: '发送消息给:'+selectedCount+'人:'+users,
                buttonText: '我知道了'
              });
          },
          fail:function(err){
            console.log(err);
            if(err.error == -1 && err.errorMessage=="Canceled"){
              dd.showToast({
                  type: 'fail',
                  content: '取消选择发送对象',
                  duration: 1000,
                  success: () => {},
                });
              }
        }
    })
  },
  choosePhonebook(){
    dd.choosePhonebook({
      multiple: true, //是否多选： true多选 false单选； 默认true
      maxUsers: 2, //人数限制，当multiple为true才生效，可选范围1-1500
      limitTips:"只能选2人", //超过人数限制的提示语可以用这个字段自定义
      title : "选择通讯录好友", // 如果你需要修改选人页面的title，可以在这里赋值
      success:function(res){
        //onSuccess将在选人结束，点击确定按钮的时候被回调
        /* res结构
        [{
          "name": "张三", //姓名
          "mobile": "110", //用户手机号
          "avatar": 'RSDFS', //用户头像id
        },
        ...
        ]
        */
       let selectedCount = res.length;
        let users = res.map(t=>t.name).join(",");
        dd.alert({
          title: '亲',
          content: '发送消息给:'+selectedCount+'人:'+users,
          buttonText: '我知道了'
        });   
      },
      fail:function(err){
        console.log(err);
        dd.showToast({
            type: 'fail',
            content: '取消选择发送对象',
            duration: 1000,
            success: () => {},
        });
      } 
    });
  },
  chooseChat(){
    dd.chooseChat({
        isAllowCreateGroup:false,//是否允许创建会话
        filterNotOwnerGroup:false,//是否限制为自己创建的会话
        success: res => {
            /*{
                chatId: 'xxxx',
                title:'xxx'
            }*/
            console.log(res);
            dd.alert({
              title:'亲',
              content:JSON.stringify(res),
              fail(e){
                  dd.showToast({
                    content: e,
                    duration: 1000,
                  });
              }
            })
        },
        fail: err =>{
            dd.alert({
                content:JSON.stringify(err)
            })
        }
    });
  },
chooseChatForNormalMsg(){

    dd.chooseChatForNormalMsg({
      isConfirm: true, //是否弹出确认窗口，默认为true
        success: res => {
            // 该cid和服务端开发文档-普通会话消息接口配合使用，而且只能使用一次，之后将失效
          /*{
              cid: 'xxxx',
              title:'xxx'
          }*/
            console.log(res);
            this.setData({"cId":res.cid});
            dd.alert({
              title:'亲',
              content:JSON.stringify(res),
              fail(e){
                  dd.showToast({
                    content: e,
                    duration: 1000,
                  });
              }
            });
        },
        fail: err =>{
            dd.alert({
                content:JSON.stringify(err)
            })
        }
    });
  },

  sendTestMessage(){
    console.log("call sendTestMessage");
    if(!this.data.cId){
        dd.showToast({type:"fail",content:"请先「获取会话信息」"});
        let page = this;
        this.chooseChatForNormalMsg({
          run(){
            page.sendTestMessageRun();
          }
      });
      return false;
    }
    this.sendTestMessageRun();
    
  },
  sendTestMessageRun(){
    //发送测试消息
    let url = "https://oapi.dingtalk.com/message/send_to_conversation";
    url +="?access_token="+this.data.accessToken;
    let userId = this.data.userId;
    let cid = this.data.cId;

    switch(this.data.tempVal.messageType){
      case 'text':
        this.commonMessageRequest(url,userId,cid,
          { "msgtype":"text", "text":{ "content":"消息+:发送普通消息测试 @18500153754"}});
          break;
      case 'image':
        //媒体文件mediaid。可以通过上传媒体文件接口获取。建议宽600像素 x 400像素，宽高比3 : 2。
        //@lADOADmaWMzazQKA
        this.commonMessageRequest(url,userId,cid,
          { "msgtype":"image", "image":{ "media_id":"@lALPDfJ6TFp-VAvNAljNAyA"}});
        break;
      case 'voice':
        this.commonMessageRequest(url,userId,cid,
          {
              "msgtype": "voice",
              "voice": {
                "media_id": "@lATPDgtYuwY3hH7OOLrcU84ApkhY",
                "duration": "10"
              }
          });
        break;
      case 'file':
        // dd.alert({type:"fail",content:"Not Supported!"});
        this.commonMessageRequest(url,userId,cid,
              {
              "msgtype": "file",
              "file": {
                "media_id": "@lADOADmaWMzazQKA"
              }
        });

        break;
      case 'link':
        this.commonMessageRequest(url,userId,cid,{
          "msgtype": "link",
          "link": {
              "messageUrl": "https://kangspace.org",
              "picUrl":"@lALOACZwe2Rk",
              "title": "消息+",
              "text": "链接消息测试"
          }
        });
        break;
        
      case 'oa':
        this.commonMessageRequest(url,userId,cid,
          {
            "msgtype": "oa",
            "oa": {
                "message_url": "dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true",
                "head": {
                    "bgcolor": "FFBBBBBB",
                    //长度限制为最多10个字符。
                    "text": "消息+"
                },
                "body": {
                    "title": "OA测试消息",
                    "form": [
                        {
                            "key": "组织:",
                            "value": "\tKangSpace"
                        },
                        {
                            "key": "域名:",
                            "value": "\tkangspace.org"
                        },
                        {
                            "key": "成员数:",
                            "value": "\t2人"
                        }
                    ],
                    "rich": {
                        "num": "100%",
                        "unit": "数据完整度"
                    },
                    "content": "消息+OA消息测试内容：\n企业内部增强消息发送APP",
                    "image": "@lADOADmaWMzazQKA",
                    "file_count": "3",
                    "author": "kangspace",
                    "status_bar":{
                      "status_value":"2021-04-08",
                      "status_bg":"0xFFF65E5E"
                    }
                }
            }
        });
        break;
      case 'markdown':
        this.commonMessageRequest(url,userId,cid,
          {
            "msgtype": "markdown",
            "markdown": {
                "title": "消息+ Markdown消息",
                // "text": "# 这是支持markdown的文本  \n  * 可点击图片跳转;  \n  [![kangspace.org](https://img.alicdn.com/tps/TB1XLjqNVXXXXc4XVXXXXXXXXXX-170-64.png)](http://kangspace.org)  "
                "text": "[![kangspace.org](https://img.alicdn.com/tps/TB1XLjqNVXXXXc4XVXXXXXXXXXX-170-64.png)](http://kangspace.org)  \n"+
                      "[这是支持markdown的文本](dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true)"
            }
        }
        );
        break;
      case 'action_card_1':
        this.commonMessageRequest(url,userId,cid,
            {
                "msgtype": "action_card",
                "action_card": {
                    "title": "# 消息+ 整体跳转卡片",
                    "markdown": "# 支持markdown格式的正文内容  \n   > A man who stands for nothing will fall for anything.  \n  * 支持Markdown标题  \n  * 支持Markdown链接，图片  \n  * 支持Markdown 有序/无序列表  "+
                    "  \n  ![样例](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/1634199951/p158174.png)",
                    "single_title": "查看详情",
                    "single_url": "dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true"
                }
            }
          );
          break;
      case 'action_card_2':
        this.commonMessageRequest(url,userId,cid,
              {
                "msgtype": "action_card",
                "action_card": {
                    "title": "消息+ 独立跳转卡片",
                    "markdown": "# 支持markdown格式的正文内容  \n  使用独立跳转ActionCard样式时的按钮列表;  \n  按钮可横排，可竖排  \n  "+
                    "  \n  ![样例](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/1634199951/p158175.png)",
                    "btn_orientation": (new Date().getTime()%2),
                    //默认0,竖向排列, 只有当btn_json_list =2 时横向有效
                    "btn_json_list": [
                        {
                            "title": "订阅",
                            "action_url": "https://kangspace.org"
                        },
                        {
                            "title": "取消订阅",
                            "action_url": "dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true"
                        },
                        // {
                        //     "title": "取消订阅2",
                        //     "action_url": "dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true"
                        // },
                        // {
                        //     "title": "取消订阅3",
                        //     "action_url": "dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true"
                        // },
                        // {
                        //     "title": "取消订阅4",
                        //     "action_url": "dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Fkangspace.org&pc_slide=true"
                        // }
                    ]
                }
            }
          );
          break;
    }
    this.setData({cId:""});
    console.log("发送消息,类型:"+this.data.tempVal.messageType);
  },
  //公共消息发送方法
  commonMessageRequest(url,userId,cid,msg){
    var data = {
      "sender":userId,
      "cid":cid,
      "msg":msg
      };
    this.postRequest(url,data);
  },
  postRequest(url,data){
    this.ajaxRequest("POST",url,data);
  },
  getRequest(url,succeccCallBack){
    this.ajaxRequest("GET",url,null,succeccCallBack);
  },
  ajaxRequest(type,url,data,succeccCallBack){
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
        console.log(res);
        dd.showToast({content: 'success:'+JSON.stringify(res.data)});
        if(succeccCallBack){
          succeccCallBack.run(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        dd.alert({content: 'fail'});
      },
      complete: function(res) {
        console.log(res);
        // dd.alert({content: 'complete'});
      }
    });
  },
  //刷新access_token
  refreshAccessToken(successCallback){
    console.log("call refreshAccessToken");
    let appKey = this.data.settings.appInfo.appKey;
    let appSecret = this.data.settings.appInfo.appSecret;
    let url = "https://oapi.dingtalk.com/gettoken?appkey="+appKey+"&appsecret="+appSecret;
    let page = this;
    this.getRequest(url,{
      run(res){
        // {
        //     "errcode": 0,
        //     "access_token": "96fc7a7axxx",
        //     "errmsg": "ok",
        //     "expires_in": 7200
        // }
        if(res.errcode == 0){
          page.setData({"accessToken":res.access_token});
          if(successCallback){
            successCallback.run();
          }
        }else{
          dd.alert({content:JSON.stringify(res)});
        }
      }
    });
  },
  //刷新access_token并保存
  refreshAccessTokenAndSave(){
    console.log("call refreshAccessTokenAndSave");
    if(!this.data.settings.appInfo.appKey || !this.data.settings.appInfo.appSecret){
      dd.showToast({type:"fail",content:"请输入AppKey和AppSecret"});
      return false;
    }
    let page = this;
    this.refreshAccessToken({
      run(){
          page.saveAccessToken();
      }
    });
  },

  /**
   * 保存access_token
   */
  saveAccessToken(){
    console.log("call saveAccessToken");
      let accessToken = this.data.accessToken;
      let userId = this.data.userId;
      if(!accessToken){
        dd.alert({content:"请输入access_token"});
        return false;
      }
      if(!userId){
        dd.alert({content:"请输入user_id"});
        return false;
      }
      let nowDate = new Date();
      let appKey = this.data.settings.appInfo.appKey;
      let appSecret = this.data.settings.appInfo.appSecret;
      dd.setStorage({
        key: 'accessToken',
        data: {
          accessToken: accessToken,
          userId:userId,
          cTime: nowDate.getTime(),
          appKey:appKey,
          appSecret:appSecret
        },
        success: function() {
          dd.showToast({content: '保存成功'});
        }
      });
      this.setData({cTime:nowDate.toString()});
  },

  getAccessToken(){
     let res = dd.getStorageSync({ key: 'accessToken' });
     console.log("access_token:",JSON.stringify(res.data))
     return res.data;
  },
  //消息类型改变
  messageTypeChange(e){
    //event.detail = {value: 选中项 radio 的 value}。
    console.log(e);
    this.setData({"tempVal['messageType']":e.detail.value});
    console.log("消息类型修改为:"+this.data.tempVal.messageType);
  }
});
