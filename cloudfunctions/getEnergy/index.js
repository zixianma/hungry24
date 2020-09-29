// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate
  const {
    list: energy
  } = await db.collection('energy').aggregate().match({
    openId
  }).group({
    _id: null,
    sum: $.sum("$value")
  }).end()
  return energy
}