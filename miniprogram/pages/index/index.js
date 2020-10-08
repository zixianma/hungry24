const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isUserInfoAuthorized: false,
    currentTab: 0,
    gameStatus: "在这儿挖",
    remainingShovelNumber: 5,
    earlyTermination: false,
    cropsData: [{
        'name': '土豆',
        'val': '1',
        'intro': '土豆，别称马铃薯、地蛋、洋芋等，茄科茄属，一年生草本植物。马铃薯是中国五大主食之一，其营养价值高、适应力强、产量大，是全球重要的粮食作物。'
      },
      {
        'name': '番薯',
        'val': '1',
        'intro': '番薯，别称地瓜、红薯、红苕等。一年生草本植物，番薯是一种高产而适应性强的粮食作物，全世界的热带、亚热带地区广泛栽培，中国大多数地区普遍栽培。 '
      },
      {
        'name': '木薯',
        'val': '1',
        'intro': '木薯，直立灌木，块根圆柱状。原产巴西，现全世界热带地区广泛栽培。中国福建、台湾、广东、海南、广西、贵州及云南等省区有栽培。非洲的木薯产量占全世界60%，木薯在非洲的地位相当于我国的小麦、稻米,它是非洲人民的主食之一。'
      },
      {
        'name': '小麦',
        'val': '2',
        'intro': '小麦是小麦系植物的统称，是一种在世界各地广泛种植的禾木科植物，人类的主食之一，小麦是三大谷物之。中国是世界最早种植小麦的国家之一。'
      },
      {
        'name': '稻米',
        'val': '2',
        'intro': '稻米也叫稻或水稻，脱壳的粮食是大米，是我国的主要粮食作物之一。稻米不仅是食粮，同时还可以作为酿酒、制造饴糖的原料。全世界有一半的人口食用它，因能维持较多人口的生活，联合国规定2004年为"国际稻米"年。'
      },
      {
        'name': '大豆',
        'val': '2',
        'intro': '大豆，通称黄豆。豆科大豆属一年生草本，原产中国，中国各地均有栽培，东北为主产区，亦广泛栽培于世界各地，已有五千年栽培历史，。大豆是中国重要粮食作物之一，含有丰富植物蛋白质的作物，常用来做各种豆制品、榨取豆油、 酿造酱油和提取蛋白质。'
      },
      {
        'name': '玉米',
        'val': 3,
        'intro': '玉米是禾本科玉蜀黍属一年生草本植物，是重要的粮食作物和饲料作物，全世界总产量最高的农作物。玉米原产于中南美洲，现在世界各地均有栽培，我国的玉米主要产区是东北、华北和西南山区。'
      },
      {
        'name': '高粱',
        'val': 3,
        'intro': '高粱是禾本科一年生草本植物。秆较粗壮，直立，基部节上具支撑根。性喜温暖，抗旱、耐涝。中国栽培较广，以东北各地为最多。食用高粱谷粒供食用、酿酒。'
      },
      {
        'name': '鹰嘴豆',
        'val': 4,
        'intro': '鹰嘴豆为豆科草本植物，起源于亚洲西部和近东地区，是世界上栽培面积较大的豆类植物，其中印度和巴基斯坦两国的种植面积 占全世界的80%以上，中国只有零星分布。鹰嘴豆因其面形奇特，尖如鹰嘴，故称此名。鹰嘴豆的淀粉具有板栗香味，加上奶粉制成豆乳粉，易于吸收消化，是上乘的营养食品。'
      },
      {
        'name': '苔麸',
        'val': 5,
        'intro': '苔麸，又称埃塞俄比亚画眉草，是一种禾本科谷物，生活在埃塞俄比亚和厄立特里亚海拔3000多米高原上的一种作物。埃塞俄比亚人和厄立特里亚人最喜爱的主食"英吉拉"的原材料，产量极低，只适应埃塞俄比亚和厄立特里亚的高原气候。'
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
    showRules: true,
    isImageLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this

    wx.showLoading({
      title: '加载中',
    })

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
    if (loginResult) {
      const userInfo = loginResult.userInfo
      app.globalData.userInfo = userInfo
      this.setData({
          userInfo
        }
        // hideLoading after loading shovel and crops images
        // , () => {
        //   wx.hideLoading()
        // }
      )
    }

    // get user info authorization state
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.getUserInfo()
        }
      }
    })

    // get the source of the user
    const fromUser = options.from_user
    console.log({
      fromUser
    })
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
        this.setData({
          modalName: "invite",
          inviterInfo
        })
      }
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

    //Load all image
    await Promise.all([
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/shovel.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/0.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/1.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/2.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/3.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/4.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/5.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/6.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/7.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/8.png'),
      that.promiseGetImageInfo('https://hunger24.cfpa.org.cn/images/crop/9.png'),
    ]).then(([shovel, potato, sweet_potato, cassava, soybean, wheat, rice, corn, sorghum, chickpea, teff]) => {
      that.setData({
        imageObject: [
          [shovel],
          [potato, sweet_potato, cassava],
          [soybean, wheat, rice],
          [corn, sorghum, chickpea, teff]
        ],
        isImageLoaded: true
      }, () => {
        wx.hideLoading()
      })
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
          positionPoint.push(Math.random() * 0.9 * screenWidth)
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
    const userId = this.data.userInfo._id
    return {
      path: '/pages/index/index?from_user=' + userId
    }
  },

  getUserInfo() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: function (res) {
          console.log({
            getUserInfo: res
          })
          that.setData({
            isUserInfoAuthorized: true
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

  async toGetUserInfo() {
    const promiseGetUserInfo = this.getUserInfo()
    promiseGetUserInfo.then(() => {
      // this.startGame()
      // this.setData({
      //   currentTab: 1
      // })
      this.toAcceptChallenge()
    })
  },

  switchTab(e) {
    const tabIndex = e.currentTarget.dataset.tabIndex
    const currentTab = this.data.currentTab

    if (tabIndex == currentTab) {
      return
    }

    this.setData({
      currentTab: tabIndex
    })

    if (tabIndex == 1) {
      this.startGame()
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
    
    this.setData({
      currentTab: 1,
      modalName: null
    })
    // if (currentTab == 1) {
    this.startGame()
    // } else {
    //   clearInterval(this.data.lineMoveTimer)
    //   clearInterval(this.data.progressBarTimer)
    // }
  },

  toDonate() {
    wx.navigateTo({
      url: '../donation/donation',
    })
  },

  startGame() {
    var that = this
    let userInfo = this.data.userInfo
    const isUserInfoAuthorized = this.data.isUserInfoAuthorized
    const isImageLoaded = this.data.isImageLoaded
    if (isUserInfoAuthorized && userInfo && isImageLoaded) {
      if (!userInfo.challengeStartedAt) {
        wx.showLoading({
          title: '加载中',
        })
        //set current level
        wx.setStorage({
          data: {
            currentLevel: 0,
            currentNumberOfCrop: 3,
            usedCrop: [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0, 0]
            ]
          },
          key: 'crop',
        })
        wx.cloud.callFunction({
          name: 'startChallenge',
          data: {},
          success: function (res) {
            console.log({
              startChallenge: res.result
            })
            userInfo.challengeStartedAt = new Date()
            that.setData({
              userInfo,
              gameSetting: {
                shovel: 5,
                energy: 0
              }
            }, () => {
              wx.hideLoading()
            })

            that.setData({
              modalName: "rule",
            })
            // that.lineMove()
          },
          fail: console.error
        })
      }
      // read level
      wx.getStorage({
        key: "crop",
        success: (res) => {
          this.setData({
            currentLevel: res.data.currentLevel,
            currentNumberOfCrop: res.data.currentNumberOfCrop,
            usedCrop: res.data.usedCrop
          })
        }
      })

      //when game is stopped, show result in tab 1
      if (this.data.earlyTermination) {
        this.setData({
          //TODO modalname and new notification for early termination
          modalName: "result",
          earlyTermination: true,
          finalSuccess: false
        })
      } else if (this.data.remainingTimePercentage == 0) {
        that.setData({
          modalName: "result"
        })
      } else {
        this.startProgressBarTimer()
        if (this.data.gameSetting.shovel > 0) {
          this.setData({
            isStopped: false
          })
          this.lineMove()
        } else {
          this.setData({
            modalName: "shareShovel",
            isStopped: true
          })
        }
      }
    }
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
        remainingTimePercentage = remainingTimePercentage <= 100 ? remainingTimePercentage : 100

        // remain energy
        // let remainingEnergy = gameSetting.energy - ((now - startTime) / (3600 * 1000))
        let remainingEnergy = gameSetting.energy
        let remainingEnergyPercentage = ((remainingEnergy / 24) * 100).toFixed(2)
        remainingEnergyPercentage = remainingEnergyPercentage <= 100 ? remainingEnergyPercentage : 100
        // set data
        that.setData({
          remainingTimePercentage,
          remainingEnergyPercentage
        })

        //check if game ends
        if (remainingTimePercentage == 100) {
          clearInterval(progressBarTimer)
          let finalSuccess = false
          if (remainingEnergy == 100) {
            finalSuccess = true
          }
          that.setData({
            modalName: "result",
            finalSuccess
          })
        }
      }, 1000);
      this.setData({
        progressBarTimer
      })
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
    const shovel = that.data.imageObject[0][0].path
    const lineMoveTimer = setInterval(function () {
      let gameSetting = that.data.gameSetting
      if (gameSetting.shovel > 0) {
        crossPoint_x = rectX_horizontal
        crossPoint_y = rectY_vertical
        if (!that.data.isStopped) {
          changeState = true
          if (rectY_vertical > 0.9 * screenWidth) {
            goUp = true
          } else if (rectY_vertical < 0) {
            goUp = false
          }

          if (rectX_horizontal > screenWidth) {
            goRight = false
          } else if (rectX_horizontal < 0) {
            goRight = true
          }
          cxt.clearRect(0, 0, 500, 700)
          cxt.setFillStyle('orange')
          that.drawPlant(cxt)

          // draw 2 lines' movement
          cxt.globalAlpha = 0.2
          let updateSpeed_x = 0.3 * (that.data.currentLevel + 1)
          let updateSpeed_y = 0.5 * (that.data.currentLevel + 1)
          goUp ? cxt.fillRect(rectX_vertical, rectY_vertical -= updateSpeed_y, 414, 3) : cxt.fillRect(rectX_vertical, rectY_vertical += updateSpeed_y, 414, 3)
          cxt.setFillStyle('orange')
          goRight ? cxt.fillRect(rectX_horizontal += updateSpeed_x, rectY_horizontal, 3, 414) : cxt.fillRect(rectX_horizontal -= updateSpeed_x, rectY_horizontal, 3, 414)
          cxt.globalAlpha = 1
          cxt.drawImage(shovel, rectX_horizontal - 25, rectY_vertical - 25, 50, 50)
          cxt.draw()
        } else {
          if (changeState) {
            //shake shovel animation
            that.shovelShaking(cxt, crossPoint_x - 25, crossPoint_y - 25, 50, 50)

            // update shovel number
            let gameSetting = that.data.gameSetting
            gameSetting.shovel--
            that.setData({
              gameSetting
            })
            app.globalData.gameSetting = gameSetting
            changeState = false

            //update existing plant
            setTimeout(function () {
              that.renewDrawPlant(crossPoint_x, crossPoint_y)
              cxt.clearRect(0, 0, 500, 700)
              cxt.setFillStyle('orange')
              that.drawPlant(cxt)
              cxt.drawImage(shovel, crossPoint_x - 25, crossPoint_y - 25, 50, 50)
              cxt.draw()
            }, 1200)

            // show shareShovel
            setTimeout(function () {
              if (gameSetting.shovel == 0) {
                that.setData({
                  modalName: "shareShovel",
                  isStopped: true
                })
                clearInterval(that.data.lineMoveTimer)
              }
            }, 2400)
          }
        }
      } else {
        that.setData({
          isStopped: true
        })
        clearInterval(that.data.lineMoveTimer)
      }
    }, 1)
    that.setData({
      lineMoveTimer
    })
  },


  drawPlant(cxt) {
    var that = this
    let currentLevel = this.data.currentLevel
    let currentCrops = this.data.cropsID[currentLevel]
    let numberOfCrops = currentCrops.length
    const image = that.data.imageObject

    //Generating the position of crops
    for (let i = 0; i < numberOfCrops; i++) {
      if (this.data.usedCrop[currentLevel][i] == 0) {
        cxt.drawImage(image[currentLevel + 1][i].path, this.data.position[currentLevel][i][0], this.data.position[currentLevel][i][1], 75, 75)
      }
    }
  },

  //update the plant we need to draw
  renewDrawPlant(crossPoint_x, crossPoint_y) {
    const screenWidth = app.globalData.screenWidth
    let min_distance = screenWidth / 6 //the range of the shovel
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
    let gainedEnergy = 0
    if (min_distance < screenWidth / 6) {
      let usedCrop = this.data.usedCrop
      usedCrop[this.data.currentLevel][min_distance_index] = 1
      let currentNumberOfCrop = this.data.currentNumberOfCrop
      let gameSetting = this.data.gameSetting
      gainedEnergy = parseInt(this.data.cropsData[cropCollected]['val'])
      gameSetting.energy += gainedEnergy

      currentNumberOfCrop--
      collectSuccess = true
      this.setData({
        gameSetting,
        usedCrop,
        currentNumberOfCrop
      })
      wx.setStorage({
        data: {
          currentLevel: this.data.currentLevel,
          currentNumberOfCrop: currentNumberOfCrop,
          usedCrop: usedCrop
        },
        key: 'crop',
      })
    } else {
      collectSuccess = false
    }

    // upload game setting to db
    wx.cloud.callFunction({
      name: 'addGameResult',
      data: {
        value: gainedEnergy
      },
      success: function (res) {
        console.log({
          addGameResult: res.result
        })
      },
      fail: console.error
    })

    this.setData({
      modalName: "share",
      collectSuccess,
      cropCollected,
    })

    // Continue to next level 
    if (this.data.currentNumberOfCrop == 0 && this.data.currentLevel < 2) {
      let currentLevel = this.data.currentLevel
      currentLevel++
      let currentNumberOfCrop = this.data.usedCrop[this.data.currentLevel].length
      this.setData({
        currentLevel,
        currentNumberOfCrop
      })
      wx.setStorage({
        data: {
          currentLevel: currentLevel,
          currentNumberOfCrop: currentNumberOfCrop,
          usedCrop: this.data.usedCrop
        },
        key: 'crop',
      })
    }
  },

  shovelShaking(cxt, crossPoint_x, crossPoint_y, width, height) {
    var x = crossPoint_x
    var y = crossPoint_y
    var border = -30
    var goRight_shovel = false
    var that = this
    const shovel = that.data.imageObject[0][0].path

    //shaking animation
    var shaking = setInterval(function () {
      cxt.clearRect(0, 0, that.data.screenWidth, that.data.screenHeight)
      that.drawPlant(cxt)
      if (border == 0) {
        cxt.drawImage(shovel, crossPoint_x, crossPoint_y, width, height)
        cxt.draw()
        clearInterval(shaking)
      } else if (x - crossPoint_x == border) {
        goRight_shovel = !goRight_shovel
        border = (-border > 0) ? (-border - 5) : (-border + 5)
      } else {
        goRight_shovel ? cxt.drawImage(shovel, x++, y, width, height) : cxt.drawImage(shovel, x--, y, width, height)
        cxt.draw()
      }
    }, 1)
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
  stopGame() {
    clearInterval(this.data.lineMoveTimer)
    clearInterval(this.data.progressBarTimer)
    this.setData({
      //TODO modalname and new notification for early termination
      modalName: "result",
      earlyTermination: true
    })
  },

  toRestaurant() {
    wx.navigateTo({
      url: '../restaurant/restaurant',
    })
  },

  toRank() {
    wx.navigateTo({
      url: '../rank/rank',
    })
  },

  askForDonation() {
    this.setData({
      modalName: "donate"
    })
  },

  stopTimer() {
    this.hideModal()
  },

  exitGame() {},

  saveImageToAlbum() {
    const imageURL = "https://hunger24.cfpa.org.cn/images/share_poster.png"
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