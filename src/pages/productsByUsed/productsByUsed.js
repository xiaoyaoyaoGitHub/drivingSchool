/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-20 15:19:44
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-09 13:00:00
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
    wx.navigateTo({
      url:`/pages/productUsedDetail/productUsedDetail?info=${JSON.stringify(this.data.modulesInfo[index])}`
    })
  }),
});
