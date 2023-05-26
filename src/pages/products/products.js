/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-20 15:19:44
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-26 10:10:09
 * @FilePath: /wxapp-boilerplate/src/pages/products/products.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const app = getApp(); //  eslint-disable-line no-undef
const apis = app.apis;
const MODULE_CODE = {
  MEMBER_PRODUCT: 'MEMBER_PRODUCT'
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
    const { MEMBER_PRODUCT } = MODULE_CODE || {};
    const { code, data: modulesInfo = {} } = await apis.GET_MODULE_CONTENT({ moduleCode: `${MEMBER_PRODUCT}`, pageNum: 1, pageSize: 1000 });
    if (code === 200) {
      modulesInfo.forEach(element => {
        element.integral = element.integral ? element.integral : 0
      });
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
    const info = encodeURIComponent(JSON.stringify(this.data.modulesInfo[index]))
    wx.navigateTo({
      url:`/pages/productDetail/productDetail?info=${info}`
    })
  }),
});
