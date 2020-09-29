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

    crops: [['potato', 'sweet_potato', 'cassava'],
      ['soybean', 'wheat', 'rice'],
      ['corn', 'sorghum', 'chickpea', 'teff']] ,
    currentLevel: 0,
    position: [],
    usedCrops: [[0, 0, 0],
    [0, 0, 0],
    [0, 0, 0, 0]],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this

    console.log(options.from_user)

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

    let timer = setInterval(function () {
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
      timer
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const screenWidth = app.globalData.screenWidth
    let position = []
    for (let i = 0; i < this.data.crops.length; i++) {
      let position_level = []
      for (let j = 0; j < this.data.crops[i].length; j++) {
        let position_point = []
        for (let t = 0; t < 2; t++) {
          position_point.push(Math.random() * 0.8 * screenWidth)
        }
        position_level.push(position_point)
      }
      position.push(position_level)
    }
    this.setData({
      position
    })
    this.line_move()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({

      withShareTicket:true,
      
      menus:['shareAppMessage','shareTimeline']
      
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
  },

  showModal() {
    this.setData({
      isRuleModalDisplayed: true
    })
  },

  hideModal() {
    this.setData({
      isRuleModalDisplayed: false
    })
  },

  jumpTo() {
    wx.navigateTo({
      url: '../donation/donation',
    })
  },
  drawPlant(cxt) {
    //randomly generate points if no plant exist
    // if(exist_plant_number == 0) {
    // this.setData({
    //   currentLevel: currentLevel + 1
    // })
    var currentLevel = this.data.currentLevel
    var currentCrops = this.data.crops[currentLevel]
    var numberOfCrops = currentCrops.length
    //Generating the position of crops
    for (let i = 0; i < numberOfCrops; i++) {
      if (this.data.usedCrops[currentLevel][i] == 0) {
        cxt.drawImage('https://tx-static-2.kevincdn.cn/images/' + currentCrops[i] + '.png', this.data.position[currentLevel][i][0], this.data.position[currentLevel][i][1], 100, 100)
      }
    }
    // }
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
    let crossPoint_x = rectX_horizontal
    let crossPoint_y = rectY_vertical
    let wewanttochange = true
    // todo add time different 
    setInterval(function () {
      crossPoint_x = rectX_horizontal
      crossPoint_y = rectY_vertical
      if (that.data.selectedTab == 1 && !that.data.isStopped) {
        wewanttochange = true
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
        that.drawPlant(cxt)
        // draw 2 line 
        goUp ? cxt.fillRect(rectX_vertical, rectY_vertical--, 414, 3) : cxt.fillRect(rectX_vertical, rectY_vertical++, 414, 3)
        cxt.setFillStyle('orange')
        goRight ? cxt.fillRect(rectX_horizontal--, rectY_horizontal, 3, 414) : cxt.fillRect(rectX_horizontal++, rectY_horizontal, 3, 414)
        cxt.draw()
      }
      else if (that.data.selectedTab == 1 && that.data.isStopped) {
        // cxt.globalAlpha = 0.3
        // cxt.setFillStyle('orange')
        // cxt.fillRect(rectX_vertical, rectY_vertical, 414, 3)
        // cxt.fillRect(rectX_horizontal, rectY_horizontal, 3, 414)
        that.drawPlant(cxt)
        // cxt.globalAlpha = 1
        cxt.drawImage('https://tx-static-2.kevincdn.cn/images/shovel.png', crossPoint_x - 50, crossPoint_y - 50, 100, 100)
        cxt.draw()
        // that.imageShake(cxt, crossPoint_x - 50, crossPoint_y - 50, 100, 100)
        //Calculating the distance and update canvas
        if (wewanttochange == true) {
          that.renewDrawPlant(crossPoint_x, crossPoint_y)
        }
        wewanttochange = false
      }

    })
  },
  renewDrawPlant(crossPoint_x, crossPoint_y) {
    const screenWidth = app.globalData.screenWidth
    let min_distance = screenWidth / 3
    let min_distance_index = 5
    for (let i = 0; i < this.data.crops[this.data.currentLevel].length; i++) {
      //TODO dismiss detected
      if (this.data.usedCrops[this.data.currentLevel][i] == 1){
        continue
      }
      let x_dis = Math.abs(this.data.position[this.data.currentLevel][i][0] - crossPoint_x)
      let y_dis = Math.abs(this.data.position[this.data.currentLevel][i][1] - crossPoint_y)
      let distance = Math.sqrt(Math.pow(x_dis, 2) + Math.pow(y_dis, 2))
      if (distance < min_distance) {
        min_distance = distance
        min_distance_index = i
      }
    }

    //if in the range
    if (min_distance <  screenWidth / 3) {
      this.data.usedCrops[this.data.currentLevel][min_distance_index] = 1
      this.data.currentNumberOfCrops = this.data.currentNumberOfCrops - 1
      console.log(this.data.currentNumberOfCrops)
    // this.setData({
    //   usedCrops: usedCrops,
    //   currentNumberOfCrops: currentNumberOfCrops - 1
    }

    if (this.data.currentNumberOfCrops == 0 && this.data.currentLevel < 2) {
      this.data.currentLevel++
      this.data.currentNumberOfCrops = this.data.usedCrops[this.data.currentLevel].length
      // this.setData({
      //   currentLevel: currentLevel + 1,
      //   currentNumberOfCrops: this.data.usedCrops[this.data.currentLevel].length
      // })
    }
  },
  imageShake(cxt, crossPoint_x, crossPoint_y, width, height) {
    var x = crossPoint_x
    var y = crossPoint_y
    var border = - 50
    var goRight_shovel = false
    setInterval(function () {
      cxt.clearRect(0, 0, that.data.screenWidth, that.data.screenHeight)
      this.drawPlant()
      if (border != 0 && x - crossPoint_x == border) {
        goRight_shovel = !goRight_shovel
        border = (-border > 0) ? (-border - 1) : (-border + 1)
      }
      goRight_shovel ? ctx.drawImage('https://tx-static-2.kevincdn.cn/images/shovel.png', x++, y, width, height) : ctx.drawImage('https://tx-static-2.kevincdn.cn/images/shovel.png', x--, y, width, height)
      cxt.draw()
    })
  },
  
  gameControl(e) {
    const isStopped = this.data.isStopped
    this.setData({
      isStopped: !isStopped,
      gameStatus: isStopped ? "停止" : "继续"
    })
  }, 

  goToRestaurant () {
    wx.navigateTo({
      url: '../restaurant/restaurant',
    })
  }
})