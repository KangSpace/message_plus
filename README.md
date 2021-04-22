# 消息Plus App项目

## 为什么创建这个项目
最初接触钉钉API发送消息的是使用[自定义机器人](https://developers.dingtalk.com/document/app/custom-robot-access)功能，自定义机器人中可以发链接消息，Markdown消息(可图文组合)，还有卡片消息等内容丰富类型的消息。  

但在钉钉会话中我们基本只能发送文本，图片这些消息，然后从[钉钉开放平台API](https://developers.dingtalk.com/document/app/)了解到[消息通知](https://developers.dingtalk.com/document/app/message-notification-overview)中的[普通消息](https://developers.dingtalk.com/document/app/send-normal-messages) API可以发送Markdown，卡片等类型的消息。  

由此引出了创建消息Plus项目的想法。


## 项目类型
消息Plus(MessagePlus) 项目为钉钉小程序项目，目前用于企业内部应用。

## 项目说明
消息Plus项目通过集成钉钉小程序[普通消息](https://developers.dingtalk.com/document/app/send-normal-messages)API，扩展个人的会话消息发送类型。  

支持的5种[消息类型](https://developers.dingtalk.com/document/app/message-types-and-data-format):  
* 文本消息
* 图片消息
* OA消息
* Markdown消息
* 卡片消息(2种类型,3种展现方式)
* ~~语音消息(未实现)~~
* ~~文件消息(未实现)~~
* ~~链接消息(未实现)~~


## 消息Plus实现方案
> 实现方案的核心流程：通过钉钉小程序[普通消息](https://developers.dingtalk.com/document/app/send-normal-messages)API,从前端或后端发送消息给会话。

### 1. 纯前端实现(local)
纯前端实现又称为local模式,

### 2. 前端+后端实现(remote)
前端+后端实现又称为remote模式,

### 项目模块
  略

### 用到的API列表  

  小程序API:  

| 小程序API |
| :-----|
| [更新管理小程序](https://developers.dingtalk.com/document/app/UpdateManager) |
| [发网络请求](https://developers.dingtalk.com/document/app/send-network-requests) |
| [上传文件](https://developers.dingtalk.com/document/app/upload-objects) |
| [缓存](https://developers.dingtalk.com/document/app/cache-overview) |
| [web-view](https://developers.dingtalk.com/document/app/web-view) |
| [剪切板](https://developers.dingtalk.com/document/app/dd-setclipboard) |
| [企业内部应用免登陆](https://developers.dingtalk.com/document/app/enterprise-internal-application-logon-free) |

  服务端API:  

  | 服务端API |  备注 |
  | :-----| :-----|
  | [企业应用获取access_token]()| -- |
  | [通过免登码获取用户信息](https://developers.dingtalk.com/document/app/get-user-userid-through-login-free-code#topic-1936806)| [企业内部应用免登](https://developers.dingtalk.com/document/app/enterprise-internal-application-logon-free?#topic-2021731) | --|
  | [上传媒体文件](https://developers.dingtalk.com/document/app/upload-media-files?#topic-1936786)| -- |


### 配置
1. [utils/constances.js](utils/constances.js)下constants.appDefaultInfo配置默认信息  
   默认AppType: hosted  

2. 小程序配置  
   登录[钉钉开放平台-开发者后台](https://open-dev.dingtalk.com/#/index)

   a. 创建小程序
   选择菜单「应用开发」-「企业内部开发」-「小程序」-「创建应用」。
   输入“应用名称”，“应用描述”，选择“企业自主开发”的开发方式，「确认创建」即可。

   b. 管理配置
   选择创建好的小程序：「应用开发」-「企业内部开发」-「小程序」-「消息Plus」。
   * 「开发管理」-「服务器出口IP」配置当前调用钉钉API接口机器的外网IP(可配置多个,支持带一个*号通配符的IP格式)  
   * 「人员管理」-「开发人员」 添加使用[IDE](https://developers.dingtalk.com/document/resourcedownload/miniapp-tool?pnamespace=app)开发的成员  
   * 「权限管理」添加接口权限和权限范围  
   * 「安全中心」-「HTTP安全域名」/「Webview安全域名」为小程序中使用[网络请求](https://developers.dingtalk.com/document/app/send-network-requests)
      和[web-view](https://developers.dingtalk.com/document/app/web-view) 组件可访问的域名列表。




## 主程序入口
> /pages/index/index  

应用主入口


## 基本功能测试入口
> /pages/test/index  

用于简单测试钉钉普通消息发送API相关接口。

# 截图
  * Markdown 消息  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/markdown.png" style="height:300px;" />  

  * OA消息    
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/oa.png" style="height:300px;" />  

  * 卡片消息(整体跳转)    
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/actioncard.png" style="height:300px;" />  

  * 卡片消息(独立跳转)    
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/actioncard2.png" style="height:300px;" />  

  * 图片消息    
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/image.png" style="height:300px;" />  

  * 文本消息    
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/text.png" style="height:300px;" />  



# <a id="preview">消息形式预览</a>

  * Markdown 消息   
    输入:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/markdown.png" style="height:300px;" />    
    消息显示:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/markdown_preview.png" style="height:300px;" />      

  * OA消息    
    输入:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/oa_input.png" style="height:300px;" />  
    消息显示:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/oa_preview.png" style="height:300px;" />   

  * 卡片消息(整体跳转)    
    输入:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/actioncard_input.png" style="height:300px;" />  
    消息显示:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/actioncard_preview.png" style="height:300px;" />   

  * 卡片消息(独立跳转)    
    输入:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/actioncard2_input.png" style="height:300px;" />  
    消息显示:  
    <img src="https://github.com/KangSpace/message_plus/raw/main/snapshots/preview/actioncard2_preview.png" style="height:300px;" />  




# <a id="howtouse">如何使用</a>
  通过2个简单步骤即可快速使用「消息Plus」小程序:

  1. 加入「消息Plus」钉钉组织
     使用钉钉扫描二维码加入。  
     
     <img src="https://github.com/KangSpace/message_plus/raw/main/images/howtouse/messageplus_join_qrcode.jpg" style="height:300px;" />  

  2. 选择「工作台」-「全员」-「消息Plus」
     
     <img src="https://github.com/KangSpace/message_plus/raw/main/images/howtouse/messageplus_workbench.jpg" style="height:300px;" />  
     
     消息Plus首页：  

     <img src="https://github.com/KangSpace/message_plus/raw/main/images/howtouse/messageplus_homepage.jpg" style="height:300px;" />  

  这样即可使用「消息Plus」小程序发送多媒体消息了。


## Version History

| Version | 更新时间 | 更新内容 |
| :-----| ----: | :----: |
| 1.0 | 2021-04-18 | 自建APP本地请求模式(custom_local)和托管模式上线 |
