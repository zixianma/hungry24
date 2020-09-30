const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTab: 0,
    gameStatus: "在这儿挖",
    remainingShovelNumber: 5,
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
      [6, 7, 8, 9]
    ],
    cropsChinese: [
      ['土豆', '番薯', '木薯'],
      ['大豆', '小麦', '稻米'],
      ['玉米', '高粱', '鹰嘴豆', '苔麸']
    ],

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

    // get the source of the user
    const fromUser = options.from_user
    console.log({
      fromUser
    })
    if (fromUser) {
      wx.cloud.callFunction({
        name: 'addShareRecord',
        data: {
          fromUser
        },
        success: function (res) {
          console.log({
            addShareRecord: res.result
          })
        },
        fail: console.error
      })
    }

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
    // get random position
    const screenWidth = app.globalData.screenWidth
    let position = this.data.position
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
      let isStopped = this.data.isStopped
      this.setData({
        isStopped: false
      })
      this.startLineMove()
    } else {
      clearInterval(this.data.lineMoveTimer)
      clearInterval(this.data.progressBarTimer)
    }
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
    let changeState = true //for just performing else statement once

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
        } else {
          // that.drawPlant(cxt)
          // // cxt.globalAlpha = 1
          // cxt.drawImage('https://hunger24.cfpa.org.cn/images/铲子.png', crossPoint_x - 50, crossPoint_y - 50, 100, 100)
          // cxt.draw()

          //Calculating the distance and update canvas
          if (changeState) {
            that.shovelShaking(cxt, crossPoint_x, crossPoint_y, 50, 50)
            setTimeout(function () {
              that.renewDrawPlant(crossPoint_x, crossPoint_y)
              cxt.clearRect(0, 0, 500, 700)
              cxt.setFillStyle('orange')
              that.drawPlant(cxt)
              cxt.drawImage('https://tx-static-2.kevincdn.cn/images/铲子.png', crossPoint_x, crossPoint_y, 50, 50)
              cxt.draw()
            }, 1200)
            if (that.data.freeTrial > 0) {
              let freeTrial = that.data.freeTrial
              freeTrial--
              that.setData({
                freeTrial
              })
            } else {
              let gameSetting = that.data.gameSetting
              gameSetting.shovel--
              that.setData({
                gameSetting
              })
            }

          }
          changeState = false
        }
      }
    })
    that.setData({
      lineMoveTimer
    })
  },

  drawPlant(cxt) {
    var currentLevel = this.data.currentLevel
    var currentCrops = this.data.cropsChinese[currentLevel]
    var numberOfCrops = currentCrops.length
    //Generating the position of crops
    for (let i = 0; i < numberOfCrops; i++) {
      if (this.data.usedCrop[currentLevel][i] == 0) {
        cxt.drawImage('https://hunger24.cfpa.org.cn/images/' + currentCrops[i] + '.png', this.data.position[currentLevel][i][0], this.data.position[currentLevel][i][1], 100, 100)
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
    let cropCollected = this.data.cropsID[this.data.currentLevel][min_distance_index]
    if (min_distance < screenWidth / 4) {
      let usedCrop = this.data.usedCrop
      usedCrop[this.data.currentLevel][min_distance_index] = 1
      let currentNumberOfCrop = this.data.currentNumberOfCrop
      let gameSetting = this.data.gameSetting
      gameSetting.energy += parseInt(this.data.cropsData[cropCollected]['val'])
      currentNumberOfCrop--
      collectSuccess = true
      this.setData({
        gameSetting,
        usedCrop,
        currentNumberOfCrop
      })
    } else {
      collectSuccess = false
    }
    this.setData({
      modalName: "share",
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

  shovelShaking(cxt, crossPoint_x, crossPoint_y, width, height) {
    var x = crossPoint_x
    var y = crossPoint_y
    var border = -30
    var goRight_shovel = false
    var that = this
    var shaking = setInterval(function () {
      cxt.clearRect(0, 0, that.data.screenWidth, that.data.screenHeight)
      that.drawPlant(cxt)
      if (border == 0) {
        cxt.drawImage('https://tx-static-2.kevincdn.cn/images/铲子.png', crossPoint_x, crossPoint_y , width, height)
        cxt.draw()
        clearInterval(shaking)
      }
      else if (x - crossPoint_x == border) {
        goRight_shovel = !goRight_shovel
        border = (-border > 0) ? (-border - 5) : (-border + 5)
      }
      else {
        goRight_shovel ? cxt.drawImage('https://tx-static-2.kevincdn.cn/images/铲子.png', x++, y, width, height) : cxt.drawImage('https://tx-static-2.kevincdn.cn/images/铲子.png', x--, y, width, height)
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
  },

  promiseGetImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success: (res) => {
          resolve(res)
        }
      })
    })
  },

  shareGame() {
    var that = this
    // this.setData({
    //   isResultModalDisplayed: true,
    //   finalSuccess: true
    // })
    Promise.all([
      that.promiseGetImageInfo("https://hunger24.cfpa.org.cn/images/铲子.png"),
      that.promiseGetImageInfo("https://hunger24.cfpa.org.cn/images/玉米.png"),
      that.promiseGetImageInfo("https://hunger24.cfpa.org.cn/images/稻米.png")
    ]).then(res => {
      const ctx = wx.createCanvasContext('shareResult')

      // 底图
      if (finalSuccess) {
        console.log("Success!")
        ctx.drawImage(res[0].path, 0, 0, 600, 900)
      } else {
        ctx.drawImage(res[1].path, 0, 0, 600, 900)
      }
      // 作者名称
      ctx.setTextAlign('center') // 文字居中
      ctx.setFillStyle('#000000') // 文字颜色：黑色
      ctx.setFontSize(22) // 文字字号：22px
      ctx.fillText("作者： 张杰", 600 / 2, 500)
      // 小程序码
      // const qrImgSize = 180
      // ctx.drawImage(res[1].path, (600 - qrImgSize) / 2, 530, qrImgSize, qrImgSize)
      // ctx.stroke()
      // ctx.draw()
    })
  },

  stopGame() {
    this.setData({
      modalName: "exit"
    })
  },

  toRestaurant() {
    wx.navigateTo({
      url: '../restaurant/restaurant',
    })
  },

  checkFinalGameStatus() {
    if (remainingTimePercentage == 0) {
      if (remainingEnergy > 0) {
        finalSuccess = true
      } else {
        finalSuccess = false
      }
      this.setData({
        modalName: "result",
        finalSuccess
      })
    }
  },

  exitGame() {}
})