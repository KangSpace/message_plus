import updatecheck from '/utils/updatecheck'
import init from '/utils/init'

App({
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    console.log('updateManage',updatecheck.updateManager);
    //初始化配置
    init.initAll();
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    hasLogin: false,
  },
});

/*
app.json tabbar;
  "tabBar": {
    "textColor": "#404040",
    "selectedColor": "#108ee9",
    "backgroundColor": "#F5F5F9",
    "items": [ 
      {
        "pagePath": "pages/biz/index/index",
        "icon": "images/icon_home.png",
        "activeIcon": "images/icon_home-two.png",
        "name": "Home"
      },
      {
        "pagePath": "pages/biz/settings/settings",
        "icon": "images/icon_setting.png",
        "activeIcon": "images/icon_setting-two.png",
        "name": "设置"
      }
    ]
  },
 */