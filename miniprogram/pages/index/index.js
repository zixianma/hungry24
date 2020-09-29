const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTab: 0,
    isModalDisplayed: false,
    gameStatus: "暂停",
    screenHeight: 0,
    screenWidth: 0,
    crossPoint_x: 0,
    crossPoint_y: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    const userInfo = app.globalData.userInfo

    this.setData({
      userInfo
    })
    
    let timer = setInterval(function () {
      let startTime = Date.parse(new Date(userInfo.challengeStartedAt))
      let now = Date.parse(new Date())
      let remainPercentage = ((now - startTime) / (3600 * 24 * 1000) * 100).toFixed(2)
      that.setData({
        remainPercentage
      })
    }, 1000);
    this.setData({
      timer
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.line_move()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  switchTab(e) {
    const tabIndex = e.currentTarget.dataset.tabIndex
    this.setData({
      selectedTab: tabIndex
    })

    if (!this.data.userInfo.challengeStartedAt && tabIndex == 1) {
      wx.cloud.callFunction({
        name: 'startChallenge',
        data: {},
        success: function (res) {
          console.log({startChallenge: res.result})
        },
        fail: console.error
      })
    }
  },

  showModal() {
    this.setData({
      isModalDisplayed: true
    })
  },

  hideModal() {
    this.setData({
      isModalDisplayed: false
    })
  },

  jumpTo() {
    wx.navigateTo({
      url: '../donation/donation',
    })
  },


  line_move: function () {
    var that = this

    const screenHeight = app.globalData.screenHeight
    const screenWidth = app.globalData.screenWidth

    var cxt = wx.createCanvasContext('game')
    let rectX_horizontal = 0
    const rectY_horizontal = 0
    const rectX_vertical = 0
    let rectY_vertical = 0
    let goUp = false
    let goRight = false
    // todo add time different 

    setInterval(function () {
      that.setData({
        crossPoint_x: rectX_horizontal,
        crossPoint_y: rectY_vertical
      })

      if (rectY_vertical == Math.floor(0.47 * screenHeight)) {
        goUp = true
      } else if (rectY_vertical == 0) {
        goUp = false
      }

      if (rectX_horizontal == screenWidth) {
        goRight = true
      } else if (rectX_horizontal == 0) {
        goRight = false
      }

      cxt.clearRect(0, 0, 500, 700)
      cxt.setFillStyle('orange')

      // draw 3 points
      cxt.drawImage('https://tx-static-2.kevincdn.cn/images/cassava.png', 100, 70, 100, 100)
      cxt.drawImage('https://tx-static-2.kevincdn.cn/images/potato.png', 250, 100, 100, 100)
      cxt.drawImage('https://tx-static-2.kevincdn.cn/images/sweet_potato.png', 126, 152, 100, 100)

      if (that.data.selectedTab == 1 && !that.data.isStopped) {
        // draw 2 line 
        goUp ? cxt.fillRect(rectX_vertical, rectY_vertical--, 414, 3) : cxt.fillRect(rectX_vertical, rectY_vertical++, 414, 3)
        cxt.setFillStyle('orange')
        goRight ? cxt.fillRect(rectX_horizontal--, rectY_horizontal, 3, 414) : cxt.fillRect(rectX_horizontal++, rectY_horizontal, 3, 414)
        cxt.draw()
      }
      else if(that.data.selectedTab == 1 && that.data.isStopped) {
        // cxt.globalAlpha = 0.3
        // cxt.setFillStyle('orange')
        // cxt.fillRect(rectX_vertical, rectY_vertical, 414, 3)
        // cxt.fillRect(rectX_horizontal, rectY_horizontal, 3, 414)
        // cxt.globalAlpha = 1
        cxt.drawImage('https://tx-static-2.kevincdn.cn/images/shovel.png', that.data.crossPoint_x - screenHeight / 16, that.data.crossPoint_y - screenHeight / 16, screenHeight / 8, screenHeight / 8)
        cxt.draw()
      }
    })


  },
  gameControl(e) {
    const isStopped = this.data.isStopped
    this.setData({
      isStopped: !isStopped,
      gameStatus: isStopped ? "停止" : "继续"
    })
  }
})