const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectedTab: 0,
    isRuleModalDisplayed: false,
    gameStatus: "暂停",
    remainingShovelNumber: 5,
    isShareModalDisplayed: false,
    cropsData: [{
      'name': '土豆',
      'val': '1'
    },
    {
      'name': '番薯',
      'val': '1'
    },
    {
      'name': '木薯',
      'val': '1'
    },
    {
      'name': '小麦',
      'val': '2'
    },
    {
      'name': '稻米',
      'val': '2'
    },
    {
      'name': '大豆',
      'val': '2'
    },
    {
      'name': '玉米',
      'val': 3
    },
    {
      'name': '高粱',
      'val': 3
    },
    {
      'name': '鹰嘴豆',
      'val': 4
    },
    {
      'name': '苔麸',
      'val': 5
    }
    ],
    cropsID: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8, 9]],
    cropsChinese: [['土豆', '番薯', '木薯'],
    ['大豆', '小麦', '稻米'],
    ['玉米', '高粱', '鹰嘴豆', '苔麸']],

    crops: [
      ['potato', 'sweet_potato', 'cassava'],
      ['soybean', 'wheat', 'rice'],
      ['corn', 'sorghum', 'chickpea', 'teff']
    ],
    currentLevel: 0,
    currentNumberOfCrop: 3,
    position: [],
    usedCrop: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0, 0]
    ],
    freeTrial: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this

    // get the source of the user
    const fromUser = options.from_user
    console.log({ fromUser })

    // login
    const {
      result: loginResult
    } = await wx.cloud.callFunction({
      name: 'login',
      data: {}
    })
    console.log({
      loginResult
    })
    const userInfo = loginResult.userInfo
    app.globalData.userInfo = userInfo
    this.setData({
      userInfo
    })

    // get game setting
    const {
      result: gameSetting
    } = await wx.cloud.callFunction({
      name: 'getGameSetting',
      data: {}
    })
    console.log({
      gameSetting
    })
    this.setData({
      gameSetting
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
    return {
      path: '/pages/index/index?from_user=sunnie'
    }
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
          console.log({
            startChallenge: res.result
          })
        },
        fail: console.error
      })
    }

    if (tabIndex == 1) {
      this.startProgressBarTimer()
      this.startLineMove()
    } else {
      clearInterval(this.data.lineMoveTimer)
      clearInterval(this.data.progressBarTimer)
    }
  },

  showRuleModal() {
    this.setData({
      isRuleModalDisplayed: true
    })
  },

  hideRuleModal() {
    this.setData({
      isRuleModalDisplayed: false
    })
  },

  hideShareModal() {
    this.setData({
      isShareModalDisplayed: false
    })
  },

  toDonate() {
    wx.navigateTo({
      url: '../donation/donation',
    })
  },

  startProgressBarTimer() {
    var that = this
    const userInfo = this.data.userInfo
    const gameSetting = this.data.gameSetting
    if (userInfo.challengeStartedAt) {
      let progressBarTimer = setInterval(function () {
        let startTime = Date.parse(new Date(userInfo.challengeStartedAt))
        let now = Date.parse(new Date())
        // remaining time
        let remainingTimePercentage = ((now - startTime) / (3600 * 24 * 1000) * 100).toFixed(2)
        // remain energy
        let remainingEnergy = gameSetting.energy - ((now - startTime) / (3600 * 1000))
        let remainingEnergyPercentage = ((remainingEnergy / 24) * 100).toFixed(2)
        // set data
        that.setData({
          remainingTimePercentage,
          remainingEnergyPercentage
        })
      }, 1000);
      this.setData({
        progressBarTimer
      })
    }
  },

  startLineMove() {
    if (this.data.gameSetting) {

      // get random position
      const screenWidth = app.globalData.screenWidth
      let position = []
      for (let i = 0; i < this.data.crops.length; i++) {
        let positionLevel = []
        for (let j = 0; j < this.data.crops[i].length; j++) {
          let positionPoint = []
          for (let t = 0; t < 2; t++) {
            positionPoint.push(Math.random() * 0.6 * screenWidth)
          }
          positionLevel.push(positionPoint)
        }
        position.push(positionLevel)
      }
      this.setData({
        position
      })
      this.lineMove()
    }
  },

  lineMove: function () {
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

    let crossPoint_x = rectX_horizontal
    let crossPoint_y = rectY_vertical
    let changeState = true  //for just performing else statement once

    const lineMoveTimer = setInterval(function () {
      let gameSetting = that.data.gameSetting
      if (that.data.freeTrial > 0 || gameSetting.shovel > 0) {
        crossPoint_x = rectX_horizontal
        crossPoint_y = rectY_vertical
        if (!that.data.isStopped) {
          changeState = true

          if (rectY_vertical >= Math.floor(0.47 * screenHeight)) {
            goUp = true
          } else if (rectY_vertical == 0) {
            goUp = false
          }

          if (rectX_horizontal >= screenWidth) {
            goRight = false
          } else if (rectX_horizontal == 0) {
            goRight = true
          }
          cxt.clearRect(0, 0, 500, 700)
          cxt.setFillStyle('orange')

          that.drawPlant(cxt)
          // draw 2 lines
          goUp ? cxt.fillRect(rectX_vertical, rectY_vertical -= 1.5, 414, 3) : cxt.fillRect(rectX_vertical, rectY_vertical += 1.5, 414, 3)
          cxt.setFillStyle('orange')
          goRight ? cxt.fillRect(rectX_horizontal++, rectY_horizontal, 3, 414) : cxt.fillRect(rectX_horizontal--, rectY_horizontal, 3, 414)
          cxt.draw()
        }
        else {
          that.drawPlant(cxt)
          // cxt.globalAlpha = 1
          cxt.drawImage('https://tx-static-2.kevincdn.cn/images/铲子.png', crossPoint_x - 50, crossPoint_y - 50, 100, 100)
          cxt.draw()
          //Calculating the distance and update canvas
          if (changeState) {
            setTimeout(function () {
              that.renewDrawPlant(crossPoint_x, crossPoint_y)
            }, 1000)
            if (that.data.freeTrial > 0) {
              let freeTrial = that.data.freeTrial
              freeTrial--
              that.setData({
                freeTrial
              })
            }
            else {
              let gameSetting = that.data.gameSetting
              gameSetting.shovel--
              that.setData({
                gameSetting
              })
            }
            
          }
          changeState = false
        }
        that.setData({
          lineMoveTimer
        })
      }
    })
  },

  drawPlant(cxt) {
    var currentLevel = this.data.currentLevel
    var currentCrops = this.data.cropsChinese[currentLevel]
    var numberOfCrops = currentCrops.length
    //Generating the position of crops
    for (let i = 0; i < numberOfCrops; i++) {
      if (this.data.usedCrop[currentLevel][i] == 0) {
        cxt.drawImage('https://tx-static-2.kevincdn.cn/images/' + currentCrops[i] + '.png', this.data.position[currentLevel][i][0], this.data.position[currentLevel][i][1], 100, 100)
      }
    }
    // }
  },

  //update the plant we need to draw
  renewDrawPlant(crossPoint_x, crossPoint_y) {
    const screenWidth = app.globalData.screenWidth
    let min_distance = screenWidth / 4 //the range of the shovel
    let min_distance_index = 5
    for (let i = 0; i < this.data.crops[this.data.currentLevel].length; i++) {
      //detected counted
      if (this.data.usedCrop[this.data.currentLevel][i] == 1) {
        continue
      }

      // Calculating Euclidean distance
      let x_dis = Math.abs(this.data.position[this.data.currentLevel][i][0] - crossPoint_x)
      let y_dis = Math.abs(this.data.position[this.data.currentLevel][i][1] - crossPoint_y)
      let distance = Math.sqrt(Math.pow(x_dis, 2) + Math.pow(y_dis, 2))
      if (distance < min_distance) {
        min_distance = distance
        min_distance_index = i
      }
    }

    //if crop is in the range
    let collectSuccess = false
    let isShareModalDisplayed = true
    let cropCollected = this.data.cropsID[this.data.currentLevel][min_distance_index]
    if (min_distance < screenWidth / 4) {
      let usedCrop = this.data.usedCrop
      usedCrop[this.data.currentLevel][min_distance_index] = 1
      let currentNumberOfCrop = this.data.currentNumberOfCrop
      let gameSetting = that.data.gameSetting
      gameSetting.energy += that.cropsData[cropCollected]['val']
      currentNumberOfCrops--
      collectSuccess = true
      this.setData({
        gameSetting,
        usedCrop,
        currentNumberOfCrops
      })
    } else {
      collectSuccess = false
    }
    this.setData({
      isShareModalDisplayed,
      collectSuccess,
      cropCollected,
    })
    if (this.data.currentNumberOfCrops == 0 && this.data.currentLevel < 2) {
      let currentLevel = this.data.currentLevel
      currentLevel++
      let currentNumberOfCrops = this.data.usedCrop[this.data.currentLevel].length
      this.setData({
        currentLevel,
        currentNumberOfCrops
      })
    }
  },

  gameControl(e) {
    const isStopped = this.data.isStopped
    this.setData({
      isStopped: !isStopped,
      gameStatus: isStopped ? "停止" : "继续"
    })
  },

  shareGame() {
    const wxGetImageInfo = promisify(wx.getImageInfo)
    wxGetImageInfo({
      src: 'http://some-domain/bg.png'
    }).then(res => {
      const ctx = wx.createCanvasContext('shareCanvas')
      ctx.drawImage(res.path, 0, 0, 600, 900)
      ctx.draw()
    })
  }
})