---
sidebarDepth: 0
sidebar: false
navbar: false
prev: false
next: false
tags:
    - 简历
    - 关于我
    - 博主
    - 我的联系方式
---

## 王恩超
联系电话：18507009002  
个人邮箱：okkgit@163.com  
求职意向：嵌入式软件工程师  
大学专业：软件工程（自动化方向）  
个人博客：blog.okkgit.top

## 专业技能

熟练掌握 C 编程语言，具备良好代码编程习惯与优化能力；  
熟悉嵌入式系统开发，熟悉freeRTOS，掌握内存管理，任务调度底层原理；  
熟悉stm32系列MCU，了解ESP32，熟悉 USART TIM I2C SPI 等片上外设；  
能读懂原理图，能够完成简单PCB设计，了解常用片内片外器件使用。具备较强动手能力；  
熟悉linux操作系统、熟悉常用命令、了解内存管理、进程线程模型；  
熟练使用linux开发环境，掌握 git 等开发工具。了解gitlab以及CICD使用；  
掌握操作系统、数据结构、常见算法等基础；  
熟悉 MySQL, SQLite, Redis，MQTT 常用中间件的使用；  
熟练掌握golang, 主力语言，对协程，chan, map，GMP, GC 模型等概念深入了解；  
熟悉使用python, php脚本，有相关开发经验；  

## 个人履历

- 江西理工大学；软件工程（机制自动化）；校机器人团队核心人员；
- 苏州贝康医疗器械股份有限公司；19.12-21.5；算法工程师；图像算法主要研发及接口开发；
- 深圳店匠科技；21.7-22.9；软件工程师；数据中台任务调度管理系统研发；
- 深圳市明源云客电子商务有限公司：22.10-23.2；用户中台开发；单点登录微服务开发人员；
- 武汉佰钧成; 23.4-至今; 软件工程师；小度车载签约、激活模块主要开发人员；

## 项目经验

### 全向车型机器人平台
`背景`：校实验室需要新一代车型机器人平台，应对车型搬运、寻宝、越野等国家级比赛项目；各参赛项目的可复用及难点部分需要软硬件框架统一；   
`技术点`：板载传感器驱动、PID算法、freeRTOS、好用可用的程序框架；  
`负责内容`：STM32F4核心板、驱动板PCB设计；3D打印件设计；电机、AB相编码器、灰度、MPU6050、超声波、颜色等传感器底层驱动代码封装; 电机PD算法、麦克纳姆林全向驱动算法等硬件相关模块代码封装；

### 智能精 子分析仪
`背景`：贝康医疗上市医疗器械公司承接上海红房子医院研发精 子智能分析仪，解决对样本的活性、形态、密度、空泡面积比等指标检测时人工成本高、准确度差、标准难一致等问题。  
`技术点`：采集图像的预处理、目标检测、图像分割、基于OpenCV的图形计算，云端flask接口。  
`负责内容`：为团队研发基于OpenCV及现有AI算法数据标注工具提升数倍效率。负责图像深度学习算法研发，云端接口开发，部分硬件设备接口SDK。  

### 数据中台 任务调度
`背景`：店匠科技作为国内最大跨境电商平台，产生数以千万计/天的埋点数据，需要多个BI任务按流程分析，需要一个符合公司情景的任务调度、数据迁移平台。  
`技术点`：基于DAG图的任务调度系统(task运行环境)，BI专用的规则引擎研发。  
`负责内容`：任务调度底层代码研发, 数据迁移task, 迁移task, 规则引擎task研发。  

### 小度车载 激活签约管理
`背景`：百度系车载系统覆盖市场十数家主流车企，车机联网后台管理系统（TSP）需要实现车机按应用划分管理，实现按需激活，按配置方案校验，以及应用协议签约管理等功能。  
`技术点`：基于golang客户端接口，php（TSP后台），对激活和签约数据的多维度管理，包括不限于版本，车型，应用等维度；使用Go高并发模型并引入多层缓存结构确保客户端接口性能；  
`负责内容`：多点签约、多点激活设计文档编写、数据库表设计、接口框架搭建；TSP后台接口开发，客户端接口开发；