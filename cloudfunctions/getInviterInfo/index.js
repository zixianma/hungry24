// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // input parameters
  const fromUser = event.fromUser
  // cloud db
  const db = cloud.database()
  const collection = db.collection('user')
  // function body
  const {
    data: userInfoResult
  } = await collection.where({
    _id: fromUser
  }).field({
    nickName: 1,
    avatarUrl: 1
  }).get()
  if (userInfoResult.length > 0) {
    return userInfoResult[0]
  }
  return
}