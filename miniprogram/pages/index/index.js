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

  toIntroPage() {
    wx.navigateTo({
      url: '../intro/intro',
    })
  },

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
  }

})

