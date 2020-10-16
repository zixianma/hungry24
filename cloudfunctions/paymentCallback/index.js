// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // input parameter
  const transactionId = event.transactionId
  const subOpenid = event.subOpenid
  let data = event
  delete data.userInfo
  // cloud db
  const db = cloud.database()
  const collection = db.collection('transaction')
  const _ = db.command
  // function body
  var operationResult = {
    transactionId
  }
  const {
    data: transactionResult
  } = await collection.where({
    transactionId
  }).get()
  if (transactionResult.length == 0) {
    operationResult.dbStatus1 = await db.collection('transaction').add({
      data
    })
    operationResult.dbStatus2 = await db.collection('shovel').add({
      data: {
        openId: subOpenid,
        number: 1,
        reason: "donate"
      }
    })
  }
  return operationResult
}