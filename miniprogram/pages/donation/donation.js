const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWritePhotosAlbumAuthorized: true,
    modalName: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    var that = this
    const amount = parseFloat(this.data.amount)
    if (isNaN(amount) || amount < 1) {
      wx.showModal({
        title: "输入无效",
        content: "输入金额无效，请再次输入。",
        showCancel: false
      })
    } else {
      wx.cloud.callFunction({
        name: 'unifiedOrder',
        data: {
          totalFee: amount
        },
        success: (res) => {
          const payment = res.result.payment
          wx.requestPayment({
            ...payment,
            success(res) {
              console.log('pay success', res)
              //add shovel
              let gameSetting = app.globalData.gameSetting
              gameSetting.shovel++
              that.showCertificate()
            },
            fail(err) {
              console.error('pay fail', err)
            }
          })
        },
        fail: console.error
      })
    }
  },

  showCertificate() {
    this.setData({
      modalName: "certificate"
    })
  },

  saveImageToAlbum(e) {
    var that = this
    const imageUrl = e.currentTarget.dataset.imageUrl
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        //图片保存到本地相册
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          //授权成功，保存图片
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          //授权失败
          fail: function (err) {
            console.error(err)
            that.setData({
              isWritePhotosAlbumAuthorized: false
            })
            wx.showModal({
              title: '提示',
              content: '保存图片需要您的授权哦',
              showCancel: false
            })
          }
        })
      }
    })
  },

  requestAuthorizationOfWritePhotosAlbum(e) {
    console.log(e)
    if (e.detail.authSetting['scope.writePhotosAlbum']) { //用户打开了保存图片授权开关
      this.setData({
        isWritePhotosAlbumAuthorized: true
      })
      wx.showModal({
        title: '授权成功',
        content: '再点一次「保存图片」即可保存',
        showCancel: false,
      })
    } else { //用户未打开保存图片到相册的授权开关
      wx.showModal({
        title: '授权失败',
        content: '需要您的授权才能保存图片哦',
        showCancel: false,
      })
    }
  }

})