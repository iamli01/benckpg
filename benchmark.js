// 文件系统
const Fs = require('fs')

// PostgreSQL Connector - 数据库连接器
const { Client } = require('pg')
const pgFormat = require('pg-format')

// CSV Parser - 解析 CSV 数据文件
const Papa = require('papaparse')  

// Chart - 输出散点图
const { JSDOM } = require('jsdom')
const Anychart = require('anychart')
const AnychartNode = require('anychart-nodejs')

async function main() {
  const client = new Client({
    user: 'root',
    password: '123456',
    database: 'kanban',
    port: 5432
  })
  await client.connect()

  // await insertData(client)
  // await analyze(client)

  await client.end()

  // await writeChart()

  // await writeAgeChart()
}

main()

// 插入模拟数据
async function insertData(client) {
  let count = 100000
  for (let i = 0; i < count; i = i + 1000) {
    let queries = []
    for (let j = 0; j < 1000; j++) {
      queries.push(
        pgFormat(`
            INSERT INTO users (
              username, 
              age
            ) VALUES (%1$L, %2$L)
          `, 
          'username' + (i + j + 1),
          Math.floor(Math.random() * 100))
      )
    }
    await client.query(queries.join(';'))
    console.log('Inserted users ' + (i + 1000))
  }
}

// 执行一次分析
async function analyze(client) {
  console.log('Analyzing username=username10000 ...')
  let data = []
  for (let i = 0; i < 1000; i++) {
    let res = await client.query(`
      EXPLAIN (FORMAT JSON, ANALYZE)  
      SELECT * FROM users 
      WHERE username = 'username10000'
      LIMIT 1;
    `)
    let time = res.rows[0]['QUERY PLAN'][0]['Execution Time']
    /*
      n,m
      1,1.036
      2,1.001
      3,0.678
      ...
    */
    data.push([i+1, time])
  }
  let results = Papa.unparse(data, {
  })
  Fs.writeFileSync('username.csv', results)
}

// 输出散点图
async function writeChart() {
  console.log('Writing chart username=username10000 ...')

  let csvString = Fs.readFileSync('username.csv', 'utf-8')
  let csvSeries = Papa.parse(csvString, {}).data

  let jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'})
  let window = jsdom.window
  let anychart = Anychart(window)
  let anychartExport = AnychartNode(anychart)

  let chart = anychart.scatter()
  let data = []
  for (let [i, item] of csvSeries.entries()) {
    // if (item[1] > 1.5) {
    //   continue
    // }
    data.push({
      x: i+1,
      value: item[1]
    })
  }
  var series1 = chart.marker(data)
  series1.fill("#08C")

  chart.bounds(0, 0, 1400, 1200)
  chart.container('container')
  chart.draw()

  let image = await anychartExport.exportTo(chart, 'jpg')
  Fs.writeFileSync('username.jpg', image)
}

// 输出合并散点图
async function writeAgeChart() {
  console.log('Writing aggetete chart username=username10000 ...')

  let csvString1 = Fs.readFileSync('username-1.csv', 'utf-8')
  let csvSeries1 = Papa.parse(csvString1, {}).data

  let csvString2 = Fs.readFileSync('username-2.csv', 'utf-8')
  let csvSeries2 = Papa.parse(csvString2, {}).data

  let csvString1i = Fs.readFileSync('username-1-i.csv', 'utf-8')
  let csvSeries1i = Papa.parse(csvString1i, {}).data

  let csvString2i = Fs.readFileSync('username-2-i.csv', 'utf-8')
  let csvSeries2i = Papa.parse(csvString2i, {}).data


  let jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'})
  let window = jsdom.window
  let anychart = Anychart(window)
  let anychartExport = AnychartNode(anychart)

  let chart = anychart.scatter()

  let data1 = []
  for (let [i, item] of csvSeries1.entries()) {
    // if (item[1] > 1.5) {
    //   continue
    // }
    data1.push({
      x: i+1,
      value: item[1]
    })
  }
  var series1 = chart.marker(data1)
  series1.fill("#08C")
  series1.stroke("#08C")

  let data2 = []
  for (let [i, item] of csvSeries2.entries()) {
    // if (item[1] > 1.5) {
    //   continue
    // }
    data2.push({
      x: i+1,
      value: item[1]
    })
  }
  var series2 = chart.marker(data2)
  series2.fill("#F00")
  series2.stroke("#F00")

  let data1i = []
  for (let [i, item] of csvSeries1i.entries()) {
    // if (item[1] > 1.5) {
    //   continue
    // }
    data1i.push({
      x: i+1,
      value: item[1]
    })
  }
  var series1i = chart.marker(data1i)
  series1i.fill("#0F0")
  series1i.stroke("#0F0")

  let data2i = []
  for (let [i, item] of csvSeries2i.entries()) {
    // if (item[1] > 1.5) {
    //   continue
    // }
    data2i.push({
      x: i+1,
      value: item[1]
    })
  }
  var series2i = chart.marker(data2i)
  series2i.fill("#0FA")
  series2i.stroke("#0FA")

  chart.bounds(0, 0, 1400, 1200)
  chart.container('container')
  chart.draw()

  let image = await anychartExport.exportTo(chart, 'jpg')
  Fs.writeFileSync('username.jpg', image)
}