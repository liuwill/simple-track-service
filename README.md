# Simple Track Service
[![Build Status](https://travis-ci.org/liuwill/simple-track-service.svg?branch=master)](https://travis-ci.org/liuwill/simple-track-service)
[![codecov](https://codecov.io/gh/liuwill/simple-track-service/branch/master/graph/badge.svg)](https://codecov.io/gh/liuwill/simple-track-service)
[![Maintainability](https://api.codeclimate.com/v1/badges/c6f3de9b36e0f1e902f1/maintainability)](https://codeclimate.com/github/liuwill/simple-track-service/maintainability)


Attend to build a track server for some other app, with as less component as possible for unique purpose

### 代码结构
```
simple-track-service
  |
  ├─── node_modules            # 项目代码依赖的第三方库
  |    └─── *
  ├─── app                     # 程序代码
  |    ├─── index.js           # 启动服务的脚本
  |    ├─── entry.js           # 初始化接口和路由
  |    ├─── server.js          # 对http模块server的封装
  |    ├─── router.js          # 简单实现的路由
  |    ├─── setting.js         # 读取业务配置文件
  |    ├─── track.service.js   # 将要实现的功能逻辑
  |    ├─── utils.js           # 一些工具方法
  |    └─── httpClient.js      # 对http模块client的封装
  ├─── config                  # 业务配置文件
  |    └─── *
  ├─── test                    # 单元测试代码
  |    └─── *
  ├─── Makefile                # 封装运行服务的命令
  ├─── README.md               # 简单的部署包操作手册
  └─── setting.json            # 配置文件，设置数据库和缓存服务器的地址
```
