// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // cloud db
  const db = cloud.database()
  const collection = db.collection('energy')
  const _ = db.command
  const $ = _.aggregate
  // function body
  const {
    list
  } = await collection.aggregate().group({
      _id: "$openId",
      sum: $.sum("$value")
    }).sort({
      sum: -1
    })
    .limit(5)
    .lookup({
      from: "user",
      localField: "_id",
      foreignField: "openId",
      as: "userInfo"
    }).project({
      "sum": 1,
      "userInfo._id": 1
    }).end()
  return list
}