# Benchmark Demo

Table users -> 数据仓库

Action： 基准测试
Objective： 获得更优的查询程序

## 性能分析工具

[EXPLAIN ANALYZE](https://www.postgresql.org/docs/11/sql-explain.html) 

## 依赖软件包

### PostgreSQL 数据库连接器

- [pg 开发文档](https://node-postgres.com/)
- [pg-format 开发文档](https://github.com/datalanche/node-pg-format)

```sh
npm install pg pg-format
```

### CSV 解析器

papaparse:

- [开发文档](https://www.papaparse.com/)

```sh
npm install papaparse
```

### Chart 图片包

JSDOM:

- [软件仓库](https://github.com/jsdom/jsdom)

AnyChart:

- [安装文档](https://www.anychart.com/technical-integrations/samples/nodejs-charts)
- [开发文档](https://www.anychart.com/products/anychart/docs/)

```sh
sudo apt-get install imagemagick librsvg2-dev librsvg2-bin
```

```sh
npm install jsdom anychart@8.3.0 anychart-nodejs
```

## 环境

- 存储 10000 行 user
- 存储 100000 行 user
- 存储 1000000 行 user
- 存储 10000000 行 user

## Schema

```sql
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id        serial       NOT NULL PRIMARY KEY,
  username  varchar(255) NOT NULL,
  age       int          NOT NULL
);

CREATE UNIQUE INDEX index_users_on_username on users (username);

```

## 测试报告

### 查询

#### id 范围

```sql
SELECT * FROM users 
WHERE id > 10000 AND id < 90000;
```

![](https://img04.sogoucdn.com/v2/thumb/resize/w/120/h/90/zi/on/iw/90.0/ih/67.5?t=2&url=http%3A%2F%2Fpic.baike.soso.com%2Fugc%2Fbaikepic2%2F3250%2F20170802112011-1924069671.jpg%2F300&appid=200524&referer=http%3A%2F%2Fbaike.sogou.com%2Fv8031668.htm%3FfromTitle%3Dbenchmark)

#### username 值

```sql
SELECT * FROM users 
WHERE username = 'username1';

SELECT * FROM users 
WHERE username = 'username1' LIMIT 1;

SELECT * FROM users 
WHERE username = 'username10000';

SELECT * FROM users 
WHERE username = 'username10000' LIMIT 1;

SELECT * FROM users 
WHERE username = 'username100000';

SELECT * FROM users 
WHERE 
username = 'username100000' LIMIT 1;

SELECT * FROM users 
WHERE username = 'username1000000';

SELECT * FROM users 
WHERE username = 'username1000000' LIMIT 1;
```

![](https://img04.sogoucdn.com/v2/thumb/resize/w/120/h/90/zi/on/iw/90.0/ih/67.5?t=2&url=http%3A%2F%2Fpic.baike.soso.com%2Fugc%2Fbaikepic2%2F3250%2F20170802112011-1924069671.jpg%2F300&appid=200524&referer=http%3A%2F%2Fbaike.sogou.com%2Fv8031668.htm%3FfromTitle%3Dbenchmark)

####

### 存储

Table |Size
--|--------
users 10000 |? MB
users 100000|? MB
users 1000000|? MB

###

## 过程

1. 创建伪（模拟的）数据集 10000， 100000， 1000000

2. 分析 SQL 性能

3. 分析结果存储

4. 分析结果成像 (散点图)

5. 合并同一测试组的散点图 （比较）

6. 批量测试，制作测试报告

PS. 需要继续改造，将生成模拟数据和分析分离执行，并将SQL脚本变成可配置方式。
