# BNUZ TMS Crawler [![GitHub license](https://img.shields.io/github/license/JoviCheng/BNUZ_TMS_Crawler.svg?style=flat-square)](https://github.com/JoviCheng/BNUZ_TMS_Crawler/blob/master/LICENSE) ![](https://img.shields.io/badge/language-nodejs-orange.svg?style=flat-square)

##### 该项目初衷是为了获取 BNUZ 学生自己的课程信息，一开始设想的两种方法：

- [ ] 爬取 ES 方正教务系统，通过正则匹配获得
- [x] 通过 TMS 教务系统获取

###### 第一种方法登陆过程简单，但获取课程信息需要进行正则匹配，意味着这个过程中还会遇到许多不明确的问题。

###### 发现第二种方法是因为分析了 TMS 的 network 请求，发现课程信息直接通过 JSON 返回，大大降低了分析数据成本，以及保证了信息的正确率，虽然 TMS 的登录过程验证较为复杂，但考虑到往后使用的方便，于是决定使用这种方法。

#### 爬虫原理：

##### 通过 SuperAgent 模块进行模拟登录 TMS 教务系统，获取学生课程等各类信息。

##### TMS 在登录过程中会进行多次重定向，不断交替更换 TOKEN 等验证信息，通过 tms.js 模拟了用户正常登录过程，从而获取到学生课程等各类信息。

## Installation

node:

```
$ npm install
```

## Usage

node:

```
$ npm start
```

##### 然后使用 Postman 等工具进行 POST 请求。

##### 具体路径为: http://localhost:6226/tms

##### x-www-form-urlencoded

##### 参数如下：

```js
stuNum //学号
password //密码
```

## TODOS updata#2018/12/06

- [x] 更改模拟登陆步骤
- [x] 获取学生基本信息
- [x] 获取学生课程表信息
- [ ] 验证 Payload 的用户名及密码，返回验证信息
- [ ] 封装成 API，供线上使用

## About Me

##### JoviCheng

##### 16 级数媒 2 班

## License

MIT
