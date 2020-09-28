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
  const collection = db.collection('user')
  // function body
  var operationResult = {
    openId
  }
  const {
    data: openIdResult
  } = await collection.where({
    openId,
    challengeStartedAt: _.exists(false)
  }).get()
  if (openIdResult.length > 0) {
    operationResult.dbStatus = await collection.where({
      openId
    }).update({
      data: {
        challengeStartedAt: new Date()
      },
      success: function (res) {
        console.log(res)
      }
    })
  }
  return operationResult
}