// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // wx context
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // decrypt encrypted data
  const res = await cloud.getOpenData({
    list: new Array(event.cloudID)
  })
  console.log(res.list)
  let userInfo = res.list[0].data
  delete userInfo.watermark
  console.log(userInfo)
  // cloud db
  const db = cloud.database()
  const collection = db.collection('user')
  // function body
  var operationResult = {
    openId,
    userInfo
  }
  operationResult.dbStatus = await collection.where({openId: openId}).update({
    data: userInfo,
    success: function(res) {
      console.log(res.data)
    }
  })
  return operationResult
}