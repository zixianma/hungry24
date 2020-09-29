// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // wx context
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // cloud db
  const db = cloud.database()
  const _ = db.command
  // function body
  var operationResult = {
    openId
  }
  const {
    data: openIdResult
  } = await db.collection('user').where({
    openId,
    challengeStartedAt: _.exists(false)
  }).get()
  if (openIdResult.length > 0) {
    operationResult.dbStatus1 = await db.collection('user').where({
      openId
    }).update({
      data: {
        challengeStartedAt: new Date()
      },
      success: function (res) {
        console.log(res)
      }
    })
    operationResult.dbStatus2 = await db.collection('energy').add({
      data: {
        openId,
        value: 2
      },
      success: function (res) {
        console.log(res)
      }
    })
    operationResult.dbStatus3 = await db.collection('shovel').add({
      data: {
        openId,
        number: 5,
        reason: "initialize"
      },
      success: function (res) {
        console.log(res)
      }
    })
  }
  return operationResult
}