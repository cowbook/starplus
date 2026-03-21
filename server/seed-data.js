const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'starplus';
const COLLECTION_NAME = 'submissions';

const properties = ['星瀚广场', '中心商场', '新都汇', '世纪广场', '城市中心'];
const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '余十一', '何十二'];
const areas = ['商场', '停车场', '餐饮', '维修', '保洁', '安保', '其他'];
const satisfactions = ['非常满意', '满意', '一般', '不满意', '非常不满意'];

function generateRandomPhone() {
  const prefix = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
  const p = prefix[Math.floor(Math.random() * prefix.length)];
  const num = Math.random().toString().slice(2, 10);
  return p + num;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSubmission() {
  const companies = ['公司A', '公司B', '公司C', '公司D', '公司E'];
  const units = ['1', '2', '3', '4', '5', '6'];
  const today = new Date().toISOString().slice(0, 10);
  
  const submission = {
    物业: getRandomItem(properties),
    姓名: getRandomItem(names),
    手机号: generateRandomPhone(),
    区域: getRandomItem(areas),
    单元: getRandomItem(units),
    公司名称: getRandomItem(companies),
    调查日期: today,
    '1.1 整体满意度': getRandomItem(satisfactions),
    '2.1 客服/礼宾台员工仪容仪表': getRandomItem(satisfactions),
    '2.2 前台礼宾服务': getRandomItem(satisfactions),
    '2.3 晨间迎宾服务及指引': getRandomItem(satisfactions),
    '2.4 咨询和投诉的处理': getRandomItem(satisfactions),
    '2.5 服务响应效率': getRandomItem(satisfactions),
    '2.6 信息发布与通知工作': getRandomItem(satisfactions),
    '2.7 请问您对客户服务有什么其他意见？': `意见${Math.floor(Math.random() * 10)}`,
    '3.1 维修人员仪容仪表': getRandomItem(satisfactions),
    '3.2 维修响应及收费合理性': getRandomItem(satisfactions),
    '3.3 中央空调舒适度': getRandomItem(satisfactions),
    '3.4 电梯及扶手电梯': getRandomItem(satisfactions),
    '3.5 公区照明': getRandomItem(satisfactions),
    '3.6 茶水间': getRandomItem(satisfactions),
    '3.7 装修管理': getRandomItem(satisfactions),
    '3.8 请问您对设施维护有什么其他意见?': `维护意见${Math.floor(Math.random() * 10)}`,
    '4.1 保洁人员仪容仪表': getRandomItem(satisfactions),
    '4.2 保洁人员服务态度': getRandomItem(satisfactions),
    '4.3 大堂及外墙清洁状况': getRandomItem(satisfactions),
    '4.4 公共走廊及楼梯清洁状况': getRandomItem(satisfactions),
    '4.5 电梯及扶手电梯清洁状况': getRandomItem(satisfactions),
    '4.6 卫生间清洁状况': getRandomItem(satisfactions),
    '4.7 卫生间易耗品补给及时性': getRandomItem(satisfactions),
    '4.8 外围清洁状况': getRandomItem(satisfactions),
    '4.9 公区绿植养护': getRandomItem(satisfactions),
    '4.10 请问您对公共区域清洁及绿化有什么其他意见?': `清洁意见${Math.floor(Math.random() * 10)}`,
    '5.1 保安人员仪容仪表': getRandomItem(satisfactions),
    '5.2 保安人员服务态度': getRandomItem(satisfactions),
    '5.3 突发事件紧急处理': getRandomItem(satisfactions),
    '5.4 室内抽烟管理': getRandomItem(satisfactions),
    '5.5 消防/火灾预防': getRandomItem(satisfactions),
    '5.6 交通指引及安全管控': getRandomItem(satisfactions),
    '5.7 请问您对保安及消防安全有什么其他意见?': `安全意见${Math.floor(Math.random() * 10)}`,
    '6.1 清洁': getRandomItem(satisfactions),
    '6.2 照明': getRandomItem(satisfactions),
    '6.3 指示牌清晰度': getRandomItem(satisfactions),
    '6.4 寻车便捷性': getRandomItem(satisfactions),
    '6.5 支付便捷性': getRandomItem(satisfactions),
    '6.6 请问您对停车场管理有什么其他意见？': `停车意见${Math.floor(Math.random() * 10)}`,
    createdAt: new Date().toISOString(),
    ip: '127.0.0.1'
  };
  
  return submission;
}

async function seedData() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const documents = [];
    for (let i = 0; i < 20; i++) {
      documents.push(generateSubmission());
    }
    
    const result = await collection.insertMany(documents);
    console.log(`✓ Successfully inserted ${result.insertedCount} documents`);
    
    const count = await collection.countDocuments();
    console.log(`✓ Total documents in collection: ${count}`);
    
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('✓ Connection closed');
    }
  }
}

seedData();
