// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // wx context
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // could db
  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate
  // function body
  let energy = 0
  let shovel = 0
  // get remaining energy
  const {
    list: energyResult
  } = await db.collection('energy').aggregate().match({
    openId
  }).group({
    _id: null,
    sum: $.sum("$value")
  }).end()
  console.log(energyResult)
  if (energyResult.length > 0) {
    energy = energyResult[0].sum
  }
  // get remaining shovel
  const {
    list: shovelResult
  } = await db.collection('shovel').aggregate().match({
    openId
  }).group({
    _id: null,
    sum: $.sum("$number")
  }).end()
  console.log(shovelResult)
  if (shovelResult.length > 0) {
    shovel = shovelResult[0].sum
  }
  // return
  return {
    energy,
    shovel
  }
}