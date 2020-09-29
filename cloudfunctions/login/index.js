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
    operationResult.code = 1
    operationResult.status = "exists"
    operationResult.userInfo = openIdResult[0]
  } else {
    operationResult.code = 0
    operationResult.status = "created"
    operationResult.userInfo = {
      openId
    }
    operationResult.dbStatus = await collection.add({
      data: {
        openId
      },
      success: function (res) {
        console.log(res)
      }
    })
  }
  return operationResult
}