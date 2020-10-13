const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  saveCertificateToAlbum() {
    const imageURL = "https://hunger24.cfpa.org.cn/images/certificate.png"
    // console.log(imageURL)
    wx.downloadFile({
      url: imageURL,
      success: function (res) {
        var benUrl = res.tempFilePath;
        //图片保存到本地相册
        wx.saveImageToPhotosAlbum({
          filePath: benUrl,
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
            if (err.errMsg) { //重新授权弹框确认
              wx.showModal({
                title: '提示',
                content: '您好,请先授权，在保存此图片。',
                showCancel: false,
                success(res) {
                  if (res.confirm) { //重新授权弹框用户点击了确定
                    wx.openSetting({ //进入小程序授权设置页面
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) { //用户打开了保存图片授权开关
                          wx.saveImageToPhotosAlbum({
                            filePath: benUrl,
                            success: function (data) {
                              wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                              })
                            },
                          })
                        } else { //用户未打开保存图片到相册的授权开关
                          wx.showModal({
                            title: '温馨提示',
                            content: '授权失败，请稍后重新获取',
                            showCancel: false,
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  }
})