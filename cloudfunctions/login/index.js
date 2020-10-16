// 云函数入口文件
const cloud = require('wx-server-sdk')
const timestampOf202010160000 = 1602777600000
const timestampOf202010160800 = 1602806400000

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // wx context
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // cloud db
  const db = cloud.database()
  const collection = db.collection('user')
  // function body
  var operationResult = {
    openId
  }
  const {
    data: openIdResult
  } = await collection.where({
    openId
  }).get()
  if (openIdResult.length > 0) {
    operationResult.code = 0
    operationResult.status = "exists"
    const userInfo = openIdResult[0]
    if (userInfo.challengeStartedAt) {
      let challengeStartedAt = Date.parse(userInfo.challengeStartedAt)
      if (challengeStartedAt > timestampOf202010160000 && challengeStartedAt < timestampOf202010160800) {
        userInfo.challengeStartedAt = new Date(timestampOf202010160800)
      }
    }
    operationResult.userInfo = userInfo
  } else {
    operationResult.code = 1
    operationResult.status = "created"
    operationResult.userInfo = {
      openId
    }
    operationResult.dbStatus = await collection.add({
      data: {
        openId
      }
    })
  }
  return operationResult
}