const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isUserInfoAuthorized: false,
    isTimeAfter202010160000: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this

    const now = Date.parse(new Date())
    if (now > 1602777600000) {
      this.setData({
        isTimeAfter202010160000: true
      })
    }

    wx.showLoading({
      title: '加载中',
    })

    // note: login is conducted in Promise.all at the end of this function

    // get user info authorization state


    // get the source of the user
    // const fromUser = "e656fa635f7dd452013d9a093878dc29"
    const fromUser = options.from_user
    if (fromUser) {
      const {
        result: inviterInfo
      } = await wx.cloud.callFunction({
        name: 'getInviterInfo',
        data: {
          fromUser
        }
      })
      console.log({
        inviterInfo
      })
      if (inviterInfo) {
        if (options.scenario == "shovel") {
          this.setData({
            modalName: "invite",
            inviterInfo
          })
        }
      }
    }

    //Load all image
    await Promise.all([
      this.login(),
      this.getGameSetting(),
      this.getUserInfoAuthorizationStatus(),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/shovel.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/0.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/1.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/2.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/3.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/4.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/5.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/6.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/7.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/8.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/9.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/signup_preview.png'),
      this.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/shovel_preview.png')
    ]).then(([, , , shovel, potato, sweet_potato, cassava, soybean, wheat, rice, corn, sorghum, chickpea, teff, signup_preview, shovel_preview]) => {
      const imageObject = [
        [shovel],
        [cassava, chickpea, teff],
        [wheat, rice, corn, sorghum,],
        [soybean, potato, sweet_potato],
        [signup_preview, shovel_preview]
      ]
      app.globalData.imageObject = imageObject
      that.setData({
        imageObject,
        isGameReady: true
      }, () => {
        wx.hideLoading()
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {

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
  onShareAppMessage: function (options) {
    const userId = this.data.userInfo._id
    const userNickName = this.data.userInfo.nickName ? this.data.userInfo.nickName : '我'
    let shareSetting = {
      title: userNickName + '已报名参加饥饿24小时公益体验活动',
      path: '/pages/index/index?from_user=' + userId + '&scenario=signup',
      imageUrl: this.data.imageObject[4][0].path
    }
    if (options.from == 'button') {
      var targetID = options.target.id
      if (targetID == "shovel") {
        shareSetting.imageUrl = this.data.imageObject[4][1].path
        shareSetting.path = '/pages/index/index?from_user=' + userId + '&scenario=shovel'
      } else if (targetID == "signup") {
        shareSetting.imageUrl = this.data.imageObject[4][0].path
      }
    }
    console.log({ shareSetting })
    return shareSetting
  },

  login() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: (res) => {
          console.log({ login: res.result })
          let userInfo = res.result.userInfo
          if (res.result.code == 1) {
            userInfo._id = res.result.dbStatus._id
          }
          app.globalData.userInfo = userInfo
          this.setData({
            userInfo
          })
          resolve(userInfo)
        },
        fail: (err) => {
          console.error(err)
          reject(err)
        }
      })
    })
  },

  getGameSetting() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getGameSetting',
        data: {},
        success: (res) => {
          console.log({ gameSetting: res.result })
          app.globalData.gameSetting = res.result
          resolve(res.result)
        },
        fail: (err) => {
          console.error(err)
          reject(err)
        }
      })
    })
  },

  getUserInfoAuthorizationStatus() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            that.getUserInfo()
            that.setData({
              isUserInfoAuthorized: true
            })
          }
          resolve()
        },
        fail: (err) => {
          console.error(err)
          reject()
        }
      })
    })
  },

  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: function (res) {
          console.log({
            getUserInfo: res
          })
          wx.cloud.callFunction({
            name: 'updateUserInfo',
            data: {
              cloudID: res.cloudID
            },
            success: function (res) {
              console.log({
                updateUserInfo: res.result
              })
            },
            fail: console.error
          })
          resolve(res)
        },
        fail: function (err) {
          console.error(err)
          reject(err)
        }
      })
    })
  },

  async toGetUserInfoAndPlay() {
    const promiseGetUserInfo = this.getUserInfo()
    promiseGetUserInfo.then(() => {
      this.toPlay()
    })
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

  toPlay() {
    wx.navigateTo({
      url: '../play/play',
    })
  },

  toRestaurant() {
    wx.navigateTo({
      url: '../restaurant/restaurant',
    })
  },

  toDonate() {
    wx.navigateTo({
      url: '../donation/donation',
    })
  },

  toRank() {
    wx.navigateTo({
      url: '../rank/rank',
    })
  },

  promiseGetImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          console.error(err)
          reject(err)
        }
      })
    })
  },

  async toAcceptChallenge() {
    const inviterInfo = this.data.inviterInfo
    console.log("success!")
    if (inviterInfo) {
      const {
        result: addShareRecordResult
      } = await wx.cloud.callFunction({
        name: 'addShareRecord',
        data: {
          fromUser: inviterInfo._id
        }
      })
      console.log({
        addShareRecordResult
      })
    }

    this.toPlay()
  }
})