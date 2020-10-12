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
  const inviterUserId = fromUser
  const inviteeOpenId = openId
  operationResult = {
    inviterUserId,
    inviteeOpenId
  }
  // check if invite record already existed
  const {
    data: shareResult
  } = await db.collection('share').where({
    inviterUserId,
    inviteeOpenId
  }).get()
  if (shareResult.length == 0) {
    // add share record
    operationResult.dbStatus1 = await db.collection('share').add({
      data: {
        inviterUserId,
        inviteeOpenId
      },
      success: function (res) {
        console.log(res)
      }
    })
    // find inviter openId
    const {
      data: openIdResult
    } = await db.collection('user').where({
      _id: fromUser
    }).get()
    if (openIdResult.length > 0) {
      const inviterOpenId = openIdResult[0].openId
      // add shovel for inviter
      operationResult.dbStatus2 = await db.collection('shovel').add({
        data: {
          openId: inviterOpenId,
          number: 1,
          reason: "invite"
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
  }
  return operationResult
}