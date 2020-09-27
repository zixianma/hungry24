// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTab: 0,
    isModalDisplayed: false
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
    this.run()
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

  toGamePage() {
    wx.navigateTo({
      url: '../challenge/challenge',
    })
  },

  // toIntroPage() {
  //   wx.navigateTo({
  //     url: '../intro/intro',
  //   })
  // },

  switchTab(e) {
    const tabIndex = e.currentTarget.dataset.tabIndex
    this.setData({
      selectedTab: tabIndex
    })
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
  move_horizontal(x, y) {
    cxt_vertical_line.fillRect(x, y, 3, 414)
  },
  move_vertical(x, y) {
    cxt_horizontal_line.fillRect(x, y, 414, 3)
  },
  run: function(){
    var that = this
    var cxt = wx.createCanvasContext('game')
    let rectX_horizontal = 0
    const rectY_horizontal = 0
    const rectX_vertical = 0
    let rectY_vertical = 0
    let goUp = false
    let goRight = false
    // todo add time different 

    setInterval(function() {
      if (!that.data.isStopped) {
        if(rectY_vertical == 414) {
          goUp = true
        }
        else if(rectY_vertical == 0) {
          goUp = false
        }
    
        if(rectX_horizontal == 380) {
          goRight = true
        }
        else if(rectX_horizontal == 0) {
          goRight = false
        }
  
        cxt.clearRect(0,0,500,700)
        cxt.setFillStyle('orange')
  
        // draw 2 lines
        goUp ? cxt.fillRect(rectX_vertical,rectY_vertical--,414,3) : cxt.fillRect(rectX_vertical,rectY_vertical++,414,3)
        cxt.setFillStyle('orange')
        goRight ? cxt.fillRect(rectX_horizontal--,rectY_horizontal,3,414) : cxt.fillRect(rectX_horizontal++,rectY_horizontal,3,414)
        
        // draw 3 points
        cxt.fillRect(300,70, 10,10)
        cxt.fillRect(250,300,10,10)
        cxt.fillRect(126,152,10,10)
  
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


