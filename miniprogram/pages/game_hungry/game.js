// miniprogram/pages/game/game.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStopped: false,
    gameStatus: "Pause"
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
        cxt.setFillStyle('brown')
  
        // draw 2 lines
        goUp ? cxt.fillRect(rectX_vertical,rectY_vertical--,414,3) : cxt.fillRect(rectX_vertical,rectY_vertical++,414,3)
        cxt.setFillStyle('blue')
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
      gameStatus: isStopped ? "Pause" : "Resume"
    })
  }
})









// run : function (e) {
//   var test_case = setInterval(function(){
//     cxt_vertical_line.clearRect(rectX_horizontal, rectY_horizontal, 3, 414)
//     cxt_horizontal_line.clearRect(rectX_vertical, rectY_vertical, 414, 3)
//     point1.clearRect(100, 200, 5, 5)
//     point2.clearRect(300,400,5,5)
//     point3.clearRect(150,350,5,5)
    
//     point1.fillRect(100,200,5,5)
//     point2.fillRect(300,400,5,5)
//     point3.fillRect(150,350,5,5)
//     buttom_resume.fillRect(90, 50, 200, 50)
//     buttom_stop.fillRect(90, 650, 200, 50)
//     if(rectY_vertical == 150+414) {
//       goUp = true
//     }
//     else if(rectY_vertical == 150) {
//       goUp = false
//     }

//     if(rectX_horizontal == 380) {
//       goRight = true
//     }
//     else if(rectX_horizontal == 0) {
//       goRight = false
//     }

//     if(goUp) {
//       // cxt_horizontal_line.fillRect(rectX_vertical, rectY_vertical--, 414, 3)
//       move_vertical(rectX_vertical, rectY_vertical--)
//     }
//     else {
//       // cxt_horizontal_line.fillRect(rectX_vertical, rectY_vertical++, 414, 3)
//       move_vertical(rectX_vertical, rectY_vertical++)
//     }

//     if(goRight) {
//       // cxt_vertical_line.fillRect(rectX_horizontal--, rectY_horizontal, 3, 414)
//       move_horizontal(rectX_horizontal--, rectY_horizontal)
      
//     }
//     else {
//       // cxt_vertical_line.fillRect(rectX_horizontal++, rectY_horizontal, 3, 414)
//       move_horizontal(rectX_horizontal++, rectY_horizontal)
//     }
//     // if(rectX_horizontal == 414) {
//     // }
//   }, 2)
//   wx.onTouchStart(function(e){
//     var touch = e.changedTouches[0]
//     var x_coord = touch.clientX
//     var y_coord = touch.clientY
//     if(button_stop_range[0] <= x_coord && x_coord <= button_stop_range[1] && button_stop_range[2] <= y_coord && y_coord <= button_stop_range[3]){
//       console.log(Math.min(rectY_vertical - 150, 564 - rectY_vertical))
//       clearInterval(test_case)
//       // setTimeout(function() {
//       //  continue
//       // }, 2000)
//     }
//     // else if(0 <= x_coord && x_coord <= 414 && 0 <= y_coord && y_coord <= 100){
//     //   clearInterval(test)
//     //   run()
//     //   var test = run()
//     // }
//   })
// }

// run()
// wx.onTouchStart(function(e){
//   var touch = e.changedTouches[0]
//   var x_coord = touch.clientX
//   var y_coord = touch.clientY
//   // if(button_horizontal[0] <= x_coord && x_coord <= button_horizontal[1] && button_vertical[0] <= y_coord && y_coord <= button_vertical[1]){
//   //   console.log(Math.min(rectY_vertical - 150, 564 - rectY_vertical))
//   //   clearInterval(test_case)
//     // setTimeout(function() {
//     //  continue
//     // }, 2000)
//   // }

//   if(button_resume_range[0] <= x_coord && x_coord <= button_resume_range[1] && button_resume_range[2] <= y_coord && y_coord <= button_resume_range[3]){
//     // clearInterval(test)
//     run()
//   }
// })





