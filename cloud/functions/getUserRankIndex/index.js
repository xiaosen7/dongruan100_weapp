// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async ({  scoreName ,score}, context) => {

  const { total } = await db.collection('users').count();

  let lastIndex = 0;

  const batchTimes = Math.ceil(total / 100);

  for (let i = 0; i < batchTimes; i++) {
    const { data: rankList } = await db.collection('users').orderBy(scoreName,'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    const idx = rankList.findIndex(user => user[scoreName] == score);

    if (idx < 0) {
      //没有
      i++
      lastIndex += MAX_LIMIT;
    } else {
      //有
      return {
        order: idx + 1 + lastIndex
      }
    }
  }


  return {

  }
}
