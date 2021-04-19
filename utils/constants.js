export default{
    /**常量信息 */
    constants:{
      /**
       * API默认信息
       */
      appDefaultInfo:{
        appInfo:{
          appKey:"",
          appSecret:"",
        },
        appType:{
          // type:"custom"
          type:"hosted" 
        },
        requestType:{
          type:"local"
        },
        //托管模式的serverUrl https://msgplus.kangspace.org , http://127.0.0.1:5000
        hostedServerUrl:"https://msgplus.kangspace.org",
        //自建APP的本地模式serverUrl
        localServerUrl:"https://oapi.dingtalk.com",
        //发送消息的接口path
        messagePath:"/message/send_to_conversation",
        //获取token的接口path
        getTokenPath:"/gettoken",
        // 免登陆获取用户信息
        getUserInfoPath:"/user/getuserinfo",
        // 媒体文件上传
        mediaUploadPath:"/media/upload"
      },
      
      /**APP类型 */
      appTypes:[
        {
          id:"hosted",
          name:"托管",
          desc:"使用「消息Plus」小程序的APP信息,该类型的接口请求模式为「服务端模式」。",
          appKey:"dingjdpldfbdake87ubq",
          appSecret:"SRH6Y_UIlCLTik3opo2pBjREjpgEtFqlN6YVANTbz0NJu99OwkCzRtIR0F7TwwaH"
        },
        {
          id:"custom",
          name:"自建APP",
          desc:"使用已有APP信息进行配置"
        }
      ],
      
      /**消息类型 */
      messageTypes:[
        {
          type:"text",
          name:"文本",
          index:5,
          // checked:true
        },
        {
          type:"image",
          name:"图片",
          index:4
        },
        {
          type:"markdown",
          name:"Markdown",
          index:0
        },
        {
          type:"oa",
          name:"OA",
          index:1
        },
        
        {
          type:"action_card_1",
          name:"卡片(整体跳转)",
          index:2
        },
        {
          type:"action_card_2",
          name:"卡片(独立跳转)",
          index:3
        },
        {
          type:"voice",
          name:"语音",
          index:6,
          disabled:true
        },
        {
          type:"file",
          name:"文件",
          index:7,
          disabled:true
        },
        {
          type:"link",
          name:"链接",
          index:8,
          disabled:true
        },
      ],
      //OA消息默认信息
      messageOADefaultInfo:{
        head: {
              "bgcolor": "ff38adff",
              //长度限制为最多10个字符。
              "text": "消息Plus"
          }
      },
      getMessageTypes(){
        return this.messageTypes.filter(t=>!t.disabled);
      },
      //网络请求模式
      requestTypes:[
        {
          id:"local",
          name:"本地模式",
          desc:"适用于功能演示场景,所有钉钉API均在本地发起请求,需要配置本地IP白名单",
          helpTags:[{
            name:"(见:服务器出口IP配置)",
            url:"https://developers.dingtalk.com/document/app/app-faq/title-9eg-fgn-1ml"
          }]
        },
        {
          id:"remote",
          name:"服务端模式",
          desc:"适用于正常使用场景,钉钉API请求将由服务端发起,客户端调用服务端提供的API接口。",
          disabled:true
        }
      ]
    },
}