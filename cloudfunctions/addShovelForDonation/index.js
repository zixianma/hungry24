// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // input parameter
  const value = event.value
  // wx context
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // cloud db
  const db = cloud.database()
  // function body
  var operationResult = {
    openId
  }

  operationResult.dbStatus1 = await db.collection('shovel').add({
    data: {
      openId,
      number: 1,
      reason: "donation"
    },
    success: function (res) {
      console.log(res)
    }
  })
  return operationResult
}