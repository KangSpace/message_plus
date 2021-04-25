import util from '/utils/util';
import config from '/utils/config';
import constants from '/utils/constants';

Component({
  mixins: [],
  data: {
    tabSwaper:{
        selectedIndex:0,
        //是否显示滑块指示点
        indicatorDots:false,
        currentMsgType:"",
        height:400
    },
    messageInfo:{
        text:{
          content:""
        },
        oa:{
          title:'',
          content:'',
          img:'',
          //已缓存的上传信息
          imgMedia:{
            "mediaId":'',
            "img":""
          },
          props:[
            {key:"",value:""},
            {key:"",value:""},
            {key:"",value:""},
            {key:"",value:""},
            {key:"",value:""},
            {key:"",value:""},
          ],
          rich:{
            text:"",
            num:"",
          },
          attach:{
            num:""
          },
          author:"",
          msgUrl:"",
          propsCount:1
        },
        image:{
          img:'',
          imgMedia:{
            "mediaId":'',
            "img":""
          },
        },
        actionCard:{
          title:"",
          content:"",
          msgBtn:{
            title:"",
            msgUrl:""
          }
        },
        actionCard2:{
          title:"",
          content:"",
          msgBtns:[
            {title:"",msgUrl:""},
            {title:"",msgUrl:""},
            {title:"",msgUrl:""},
            {title:"",msgUrl:""},
            {title:"",msgUrl:""},
            {title:"",msgUrl:""},
          ],
          btnOrient:0,
          btnCount:1,
          btnOrients:[{value:0, label:'竖排', checked:true}, {value:1, label:'横排'}]
        },
        markdown:{
          title:"",
          content:""
        }
    }
  },
  props: {
    //输入的tab页
    /**
     * @see /utils/constants.js/messageTypes
     * {type:"text",name:"文本",index:0}
     */
    tabs:[],
    scrollInfoView:"",
    swiperHeight:400
  },
  didMount() {
    
  },
  didUpdate() {
    let currentMsgType = this.props.tabs[this.data.tabSwaper.selectedIndex].type;
    this.setData({"tabSwaper.currentMsgType":currentMsgType}) ;
    // console.log("call onTabSwaperChange ok! currentMsgType:"+currentMsgType);
    this.doSwipperAutoHeight();
  },
  didUnmount() {},
  onLoad(){
    
  },

  methods: { 
    ...util,
    doSwipperAutoHeight(){
      // console.log("call doSwipperAutoHeight");
      let page = this.$page?this.$page:this;
      let swiper = util.ui.selector().select(".swiper-item").boundingClientRect().exec((ret) => {
        if(ret && ret.length>0){
          // +20
          let height =page.getLastHeight(ret[0].height);
          page.setData({"tabSwaper.height":height});
        }
      });
    },
    //事件处理
    /**swaper换页 */
    onTabSwaperChange(e){
      //下标从0开始
      // console.log("call onTabSwaperChange:",e);
      let index = e.detail.current;
      this.setData({"tabSwaper.selectedIndex":index});
      //index转类型
      // let page = this;
      // setTimeout(function(){
      //   page.setData({"tabSwaper.selectedIndex":index});
      //   console.log("tabSwaper.selectedIndex:"+index);
      // },300);


    },
    /**点击tab换页 */
    onChangeTabSwaperTab(e){
      console.log("call onChangeTabSwaperTab:",e);
      var index = e.currentTarget.dataset.index;
      this.onTabSwaperChange({detail:{current:index}});
    },

    onActionCardCounterChangeUp(e){
      this.onCounterChangeUp(e);
      if(this.data.messageInfo.actionCard2.btnCount!=2){
        this.setData({"messageInfo.actionCard2.btnOrients[0].checked":true,
                    "messageInfo.actionCard2.btnOrients[1].checked":false});
      }
    },
    onActionCardCounterChangeDown(e){
      this.onCounterChangeDown(e);
    },
    testUploadImageHandler(){

      this.uploadImageHandle("https://resource/apmlc083ea548fbada301118a10e6e869584.png","66661fc97da831a3818c74f85ae75239",{requestType:{mediaUploadUrl:"http://127.0.0.1:5000/media/upload"},function(data){
        console.log(daata);
      }});
    },
    /**发送按钮点击处理 */
    onTapMessageSubmit(e){
      // this.testUploadImageHandler();
      console.log("call onMessageTabSwapperSubmit");
      let currentMsgType = this.data.tabSwaper.currentMsgType;
      if(!currentMsgType){
        console.warn("call onTapMessageSubmit fail: 当前无消息类型,currentMsgType:"+currentMsgType)
        return 0;
      }
      switch(this.data.tabSwaper.currentMsgType){
        case 'text':
          this.textMsgSubmitHandle();
          break;
        case 'image':
          //媒体文件mediaid。可以通过上传媒体文件接口获取。建议宽600像素 x 400像素，宽高比3 : 2。
          this.imgMsgSubmitHandle();
          break;
        case 'oa':
          this.oaMsgSubmitHandle();
          break;
        case 'markdown':
          this.markdownMsgSubmitHandle();
          break;
        case 'action_card_1':
          this.actionCardMsgSubmitHandle();
          break;
        case 'action_card_2':
          this.actionCard2MsgSubmitHandle();
          break;
        case 'voice':  
        case 'file':
        case 'link':
          util.ui.toast("不支持的消息类型!");
          break;
      }

    },
    textMsgSubmitHandle(){
      // this.$page
      let content = this.data.messageInfo.text.content;
      //校验参数
      if(!content){
        util.ui.toast("请输入消息内容~");
        return 0;
      }
      console.log("textMsgSubmitHandle content:"+content);
      let msg={ "msgtype":"text", "text":{ "content":content}};
      this.prepareSendMsgHandle(msg);
    },
    imgMsgSubmitHandle(){
      let page = this;
      let mediaInfo = this.data.messageInfo.image.imgMedia;
      let image = this.data.messageInfo.image.img;
      //校验参数
      if(!image){
        util.ui.toast("请选择图片~");
        return 0;
      }
      
      console.log("imgMsgSubmitHandle image:"+image);
      let imgMediaId;
      if(mediaInfo.img == image){
        imgMediaId = mediaInfo.mediaId;
      }
      // 上传图片,并设置上传结果缓存
      let msg={ "msgtype":"image", "image":{ "media_id":imgMediaId}};
      let imageUploadCallback
      if(!imgMediaId){
        imageUploadCallback = function(mediaRes){
          let mediaId = mediaRes.media_id;
          msg.image["media_id"] = mediaId
          page.setData({"messageInfo.image.imgMedia.mediaId":mediaId,
                      "messageInfo.image.imgMedia.img":image,})
          return msg;
        }
      }

      this.prepareSendMsgHandle(msg,imageUploadCallback,image);
    },
    markdownMsgSubmitHandle(){
      let markdown = this.data.messageInfo.markdown;
      //校验参数
      if(!markdown.content){
        util.ui.toast("请输入消息标题和内容~");
        return 0;
      }
      if(!markdown.title){
        markdown.title = this.getTitleFromContent(markdown.content);
      }
      let title = markdown.title;
      let content = util.optimizeMarkdown(markdown.content);
      console.log("markdownMsgSubmitHandle markdown:",markdown);
      let msg={
            "msgtype": "markdown",
            "markdown": {
                "title": title,
                // "text": "# 这是支持markdown的文本  \n  * 可点击图片跳转;  \n  [![kangspace.org](https://img.alicdn.com/tps/TB1XLjqNVXXXXc4XVXXXXXXXXXX-170-64.png)](http://kangspace.org)  "
                "text": content
            }
        };
      this.prepareSendMsgHandle(msg);
    },
    oaMsgSubmitHandle(){
      let page = this;
      let oa = this.data.messageInfo.oa;
      //校验参数
      if(!oa.content){
        util.ui.toast("请输入消息内容~");
        return 0;
      }
      if(!oa.msgUrl){
        util.ui.toast("请输入跳转链接~");
        return 0;
      }
      if(oa.attach.num && oa.attach.num<1){
        util.ui.toast("请输入正确的附件数量~");
        return 0;
      }

      let propsCount = oa.propsCount;
      let form = [];
      if(propsCount>0){
        let props = oa.props;
        //需要提交的form信息
        for(let i=0;i<propsCount;i++){
          let tempForm = props[i];
          if(!tempForm.key && !tempForm.value){
            util.ui.toast("请输入名称或值~");
            return 0;
          }
          form.push({key:tempForm.key+"\t",value:tempForm.value});
        }
      }
      let title = oa.title?oa.title:"";
      let content = oa.content;
      let rich = {
        "num":oa.rich.text,
        "unit":oa.rich.num
      }
      let fileCount = oa.attach.num;
      let author = oa.author;
      //URL做统一跳转样式处理
      let msgUrl = util.toDTalkClientUrl(oa.msgUrl);
      
      console.log("oaMsgSubmitHandle oa:",oa);
     
      let imgMeidaId;
      let imageUploadCallback
      let image = oa.img;

      let msg={
            "msgtype": "oa",
            "oa": {
                "message_url": msgUrl,
                "head":constants.constants.messageOADefaultInfo.head,
                "body": {
                    "title": title,
                    "form": form,
                    "rich": rich,
                    "content": content,
                    "image": imgMeidaId,
                    "file_count": fileCount?fileCount:'',
                    "author": author
                    //, "status_bar":{
                    //   "status_value":"2021-04-08",
                    //   "status_bg":"0xFFF65E5E"
                    // }
                }
            }
        };

      if(image){
        let mediaInfo = oa.imgMedia;
        //上传图片,存mediaId缓存
        if(mediaInfo.img == image){
          imgMeidaId = mediaInfo.mediaId;
        }
        
        if(!imgMeidaId){ 
          imageUploadCallback = function(mediaRes){
            let mediaId = mediaRes.media_id;
            msg.oa.body.image = mediaId
            page.setData({"messageInfo.oa.imgMedia.mediaId":mediaId,
                        "messageInfo.oa.imgMedia.img":image,})
            return msg; 
          }
        }else{
          msg.oa.body.image = imgMeidaId;
        }
      }
      
       
      this.prepareSendMsgHandle(msg,imageUploadCallback,image);
    },
    actionCardMsgSubmitHandle(){
      let actionCard = this.data.messageInfo.actionCard;
      //校验参数
      if(!actionCard.content){
        util.ui.toast("请输入消息标题和内容~");
        return 0;
      }
      if(!actionCard.title){
        actionCard.title = this.getTitleFromContent(actionCard.content);
      }
      if(!actionCard.msgBtn.msgUrl){
        util.ui.toast("请输入跳转链接~");
        return 0;
      }
      if(!actionCard.msgBtn.title){
        actionCard.msgBtn.title = "查看详情";
      }
      console.log("actionCardMsgSubmitHandle actionCard:",actionCard);
      let title = actionCard.title;
      let content = util.optimizeMarkdown(actionCard.content);
      let singleTitle = actionCard.msgBtn.title;
      //URL做统一跳转样式处理
      let singleUrl = util.toDTalkClientUrl(actionCard.msgBtn.msgUrl);
      var msg={
                "msgtype": "action_card",
                "action_card": {
                    "title": title,
                    "markdown": content,
                    "single_title": singleTitle,
                    "single_url": singleUrl
                }
            };
      this.prepareSendMsgHandle(msg);
    },
    actionCard2MsgSubmitHandle(){
      let actionCard2 = this.data.messageInfo.actionCard2;
      //校验参数
      if(!actionCard2.content){
        util.ui.toast("请输入消息标题和内容~");
        return 0;
      }
      if(!actionCard2.title){
        actionCard2.title = this.getTitleFromContent(actionCard2.content);
      }
      if(!actionCard2.msgBtns.length){
        util.ui.toast("请输入链接文本和跳转链接~");
        return 0;
      }
      let btnCount = actionCard2.btnCount;
      let btns = actionCard2.msgBtns;
      //需要提交的btn信息
      let btnJsonList = [];
      for(let i=0;i<btnCount;i++){
        let tempBtn = btns[i];
        if(!tempBtn.title || !tempBtn.msgUrl){
          util.ui.toast("请将链接文本和跳转链接输入完整~");
          return 0;
        }
        //URL做统一跳转样式处理
        btnJsonList.push({title:tempBtn.title,action_url:util.toDTalkClientUrl(tempBtn.msgUrl)});
      }
      console.log("actionCard2MsgSubmitHandle actionCard2:",actionCard2," ,btnJsonList:",btnJsonList);
      let title = actionCard2.title;
      let content = util.optimizeMarkdown(actionCard2.content);
      let btnOrient = btnCount==2?actionCard2.btnOrient:0;
      var msg={
                "msgtype": "action_card",
                "action_card": {
                    "title": title,
                    "markdown": content,
                    "btn_orientation": btnOrient,
                    //默认0,竖向排列, 只有当btn_json_list =2 时横向有效
                    "btn_json_list": btnJsonList
                }
            };
      this.prepareSendMsgHandle(msg);
    },
   
    /**
     * 获取accessToken,选择会话,发送消息,上传图片
     * @param {*} msg 
     * @param {*} uploadImgCallback(res) ,若存在上传图片,则执行上传图片的回调,
     *            参数为:res,上传成功后,上传媒体文件接口返回的信息
     *            返回: 新的消息内容msg对象
     */
    prepareSendMsgHandle(msg,uploadImgCallback,imgUrl){
      let page = this;
      let storedConfig = config.config.getStoredConfig();
      //自建应用,且为本地应用时需要手工生成acccess_token
      //托管应用不需要access_token
      if(storedConfig.appType.type == 'custom' && storedConfig.requestType.type=='local'){
        config.storedConfigUtil.checkAndRefreshAccessToken(this,storedConfig,function(accessToken){
          if(accessToken){
            accessToken = "?access_token="+accessToken;
          }
          page.sendMsgHandleWithImg(accessToken,msg,storedConfig,uploadImgCallback,imgUrl);
        })
      }else{
        page.sendMsgHandleWithImg('',msg,storedConfig,uploadImgCallback,imgUrl);
      }
    },

    /**上传图片,上传到服务器再转发到钉钉Server */
    uploadImageHandle(imgLocalPath,accessToken,storedConfig,successFn,failFn){
      if(!imgLocalPath){
        console.warn(" imgUrl is empty!")
        if(failFn){
          failFn();
        }
        return 0; 
      }
      let fileName = imgLocalPath.substring(imgLocalPath.lastIndexOf("/")+1)
      let fileFormName = "file"
      let url = storedConfig.requestType.mediaUploadUrl;
      if(accessToken){
        url+="?access_token="+accessToken;
      }

      util.ui.loading(true,"正在上传图片...");
      util.net.uploadFile(url,"image",fileFormName,imgLocalPath,function(response){

        let res ={};
        if(response.statusCode == 200){
            res = typeof response.data == "string"? JSON.parse(response.data):
                response.data;
        }else if(response.statusCode == 413){
          
          if(failFn){
            failFn("文件过大");
          }else{
            util.ui.toast("图片上传失败~,文件过大~");
          }
          return false;
        }
        
        if(res && res.errcode == 0){ 
            if(successFn){
              /*
               * data:
               * {
                  "errcode": 0,
                  "errmsg": "ok",
                  "media_id": "$iAEKAqNwbmcDBgTNAk",
                  "created_at": 1605863153573,
                  "type": "image"
              }
               */
              successFn(res);
            }
        }else{
          util.ui.toast("图片上传失败~"+(res&&res.errmsg?res.errmsg:""));
          if(failFn){
            failFn(res);
          }
        }
      },function(e){
        console.error("图片上传失败!",e)
        util.ui.toast("图片上传网络请求错误,请检查网络后重试~");
        if(failFn){
          failFn(e);
        }
      },function(){
        util.ui.loading(false);
      });
    },

    sendMsgHandleWithImg(accessToken,msg,storedConfig,uploadImgCallback,imgUrl){
      let page = this;
      if(uploadImgCallback){
        page.uploadImageHandle(imgUrl,accessToken,storedConfig,
          function(res){
            msg = uploadImgCallback(res);
            page.chooseChatAndSendMessage(accessToken,msg,storedConfig);
          },
          function(res){
            util.ui.toast("图片上传失败,请重试。失败原因:"+ (typeof res == "string"?res:JSON.stringify(res)));
          }
        );
      }else{
        page.chooseChatAndSendMessage(accessToken,msg,storedConfig);
      }
    },

    chooseChatAndSendMessage(accessToken,msg,storedConfig){
      let page = this;
      if(!storedConfig){
        storedConfig = config.config.getStoredConfig();
      }
      let url = storedConfig.requestType.messagePathUrl;
      let userId = storedConfig.userInfo.userId;
      //accessToken,url,userId,
      url += accessToken;
      console.log("chooseChatAndSendMessage: url:",url," ,msg:",msg)
      if(!userId){
        //刷新用户信息
        config.storedConfigUtil.checkAndRefreshUserInfo(page,storedConfig,accessToken,function(userInfo){
          page.chooseChatAndSubmitMsg(url,userInfo.userId,msg);
        });
      }else{
        page.chooseChatAndSubmitMsg(url,userId,msg);
      }
    },
    chooseChatAndSubmitMsg(url,userId,msg){
      let page = this;
      //获取会话
      util.openapi.chooseChatForNormalMsg(function(res){
        let cid = res.cid;
        page.commonMessageRequest(url,userId,cid,msg,function(response){
          let res = response.data;
          if(res.errcode==0){
            util.ui.toast("消息发送成功~");
          }else{
            util.ui.toast("消息发送失败,"+res.errmsg);
          }
        },function(res){
          util.ui.toast("消息发送错误,"+ JSON.stringify(res));
        });
      });
    },

    commonMessageRequest(url,userId,cid,msg,successFn,failFn){
      console.log("call commonMessageRequest url:",url," ,userId:",userId," ,cid:",cid," ,msg:",msg)
      util.ui.loading(true);
      try{      
        var data = {
          "sender":userId,
          "cid":cid,
          "msg":msg
          };
        util.net.postRequest(url,data,successFn,failFn,function(){
          util.ui.loading(false);
        });
      }catch(e){
        console.error(e);
      }

    },
    onFullScreen(e){
      this.$page.onFullScreen(e);
    },
    /** 从content中取title,最多150字,多有的...,过滤markdown标签 */
    getTitleFromContent(content){
      content = util.filterMarkdownTag(content);
      if(!content){
        return content;
      }
      let maxLength = content.length>150?150:content.length;
      return content.substring(0,maxLength)+(maxLength<=150?"...":"");
    }
  },
});
