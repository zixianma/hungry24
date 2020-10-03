const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({

      withShareTicket: true,

      menus: ['shareAppMessage', 'shareTimeline']

    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, 

  showModal(e) {
    const modalName = e.currentTarget.dataset.modalName
    this.setData({
      modalName
    })
  },

  hideModal() {
    this.setData({
      modalName: null
    })
  },

  onInput(e) {
    this.setData({
      amount: e.detail.value
    })
  },

  toPay() {
    const amount = this.data.amount
    var that = this
    wx.cloud.callFunction({
      name: 'unifiedOrder',
      data: {
        totalFee: amount
      },
      success: (res) => {
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success (res) {
            console.log('pay success', res)
            //add shovel
            let pages = getCurrentPages()
            let gamePage = pages[pages.length - 2]
            let gameSetting = gamePage.data.gameSetting
            gameSetting.shovel++
            gamePage.setData({
              gameSetting
            })
            that.showCertificate()
          },
          fail (res) {
            console.error('pay fail', err)
          }
        })
      },
      fail: console.error
    })
  },

  showCertificate(){
    this.setData({
      modalName: "certificate"
    })
  }
})