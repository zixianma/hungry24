// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // input parameters
  const fromUser = event.fromUser
  // wx context
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // cloud db
  const db = cloud.database()
  // function body
  const inviter = fromUser
  const invitee = openId
  operationResult = {
    inviter,
    invitee
  }
  // check if invite record already existed
  const {
    data: shareResult
  } = await db.collection('share').where({
    inviter,
    invitee
  }).get()
  if (shareResult.length == 0) {
    operationResult.dbStatus1 = await db.collection('share').add({
      data: {
        inviter,
        invitee
      },
      success: function (res) {
        console.log(res)
      }
    })
    operationResult.dbStatus2 = await db.collection('shovel').add({
      data: {
        openId,
        number: 1,
        reason: "invite"
      },
      success: function (res) {
        console.log(res)
      }
    })
  }
  // bring back inviter info
  const {
    data: userInfoResult
  } = await db.collection('user').where({
    _id: fromUser
  }).field({
    nickName: 1,
    avatarUrl: 1
  }).get()
  if (userInfoResult) {
    operationResult.inviterInfo = userInfoResult
  }
  return operationResult
}