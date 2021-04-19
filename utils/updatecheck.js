const updateManager = dd.canIUse('getUpdateManager')? dd.getUpdateManager():{};

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log("onCheckForUpdate: hasUpdate:"+res.hasUpdate) // 是否有更新
})

updateManager.onUpdateReady(function (ret) {
  console.log(ret.version) // 更新版本号
  dd.confirm({
    title: '更新提示'+ret.version,
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})
updateManager.onUpdateFailed(function () {
  // 新版本下载失败
  dd.alert({type:"fail",content:"新版本下载失败"});
})

export default {
  updateManager
}