// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // input parameter
  const transactionId = event.transactionId
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
    data: openIdResult
  } = await collection.where({
    transactionId
  }).get()
  if (openIdResult.length == 0) {
    operationResult.dbStatus = await db.collection('transaction').add({
      data,
      success: function (res) {
        console.log(res)
      }
    })
  }
  return operationResult
}