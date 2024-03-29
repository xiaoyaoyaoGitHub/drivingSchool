/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-20 15:19:44
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-15 11:04:13
 * @FilePath: /wxapp-boilerplate/src/pages/products/products.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const app = getApp(); //  eslint-disable-line no-undef
const apis = app.apis;
const MODULE_CODE = {
  USED_CAR: 'USED_CAR'
}
import { throttle } from '@/utils/lodash-fix';
Page({
  data: {
    modulesInfo: []
  },
  onLoad() { },
  onShow() {
    this.getSubjectList()
  },
  /**
   * 获取安架科目
   */
  async getSubjectList() {
    const { USED_CAR } = MODULE_CODE || {};
    const { code, data: modulesInfo = {} } = await apis.GET_MODULE_CONTENT({ moduleCode: `${USED_CAR}`, pageNum: 1, pageSize: 1000 });
    if (code === 200) {
      this.setData({
        modulesInfo
      })
    }
  },
  /**
   * 查看商品详情
   */
  productDetail: throttle(function (e) {
    const { currentTarget: { dataset: { index = '' } = {} } = {} } = e || {};
    console.log(`this.data.modulesInfo[index]`,this.data.modulesInfo[index]);
    // 点击计数
    apis.USER_WANT_INCR({articalId:this.data.modulesInfo[index].articalId})
    const info = JSON.stringify(this.data.modulesInfo[index]);
    console.log(`/pages/productUsedDetail/productUsedDetail?info=${info}`);
    wx.navigateTo({
      url:`/pages/productUsedDetail/productUsedDetail?info=${encodeURIComponent(info)}`
    })
  }),
});
