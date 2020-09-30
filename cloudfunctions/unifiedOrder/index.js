// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function formatDate(date, fmt) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

function generateNonce() {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = ""
  for (i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result
}

function generateTradeNumber() {
  let result = formatDate(new Date(), "YYYYmmddHHMMSS")
  for (i = 0; i < 6; i++) {
    result += Math.floor(Math.random() * 10)
  }
  return result
}

// 云函数入口函数
exports.main = async (event, context) => {
  // request parameters
  const body = "中国扶贫基金会-捐赠"
  const outTradeNo = generateTradeNumber()
  const spbillCreateIp = "127.0.0.1"
  const subMchId = "1603050771"
  const totalFee = event.totalFee * 100
  const envId = "cfpa-jwovu"
  const functionName = "paymentCallback"
  // function body
  const order = {
    body,
    outTradeNo,
    spbillCreateIp,
    subMchId,
    totalFee,
    envId,
    functionName
  }
  console.log({order})
  const res = await cloud.cloudPay.unifiedOrder(order)
  return res
}