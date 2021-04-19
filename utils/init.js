import util from '/utils/util'
import config from '/utils/config'

//初始化相关js
export default{
  
  /**
   * 初始化所有数据
   */
  initAll(){
    console.log("call initAll");
    config.initConfig();
    // config.
    console.log("call initAll end!");
  }
}