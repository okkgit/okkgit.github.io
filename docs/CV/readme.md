---
# sidebarDepth: 0
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

###
### 个人信息
<div style="width: 100%; height:0">
<img src="https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/my-profile-picture.jpg" style="width: 16%;position:relative;left: 83%; top:10px"/>
</div>

- 王恩超 / 男 / 26岁 / 江西理工大学20届软件工程
- 工作经验：2-3年 
- 联系方式：18507009002 / enchao_wang@qq.com
- 求职意向：golang 工程师
- 个人网站：[blog.enchao.wang](http://blog.enchao.wang)

### 专业技能

1. 一年以上golang开发经验，有并发编程经验、对map、slice、chan、gc 及 GMP 模型有深入了解
2. 熟悉linux使用, 熟练使用常用命令, 文件操作、vim等  
3. 熟悉docker、git的使用，有使用公司集群完整部署新项目的经验
4. 熟悉mysql, 有mysql优化经验、了解索引、B+tree
5. 熟悉redis, 数据类型及使用场景
6. 熟悉python常用语法，有非常多脚本开发经验、包括数据转储脚本、opencv图像处理脚本、图像分类工具脚本等
7. 有多个三方平台数据同步经验，包括bigquery、zohocrm、feiyu、feishu、sendcloud、尘锋crm等 


### 工作经历

::: tip 深圳店匠科技有限公司
- golang后端 `2021.07 至 2022.08`
- 围绕BI任务管理，开发任务管理系统、BI任务、ETL任务。上线3个月以来、有1000+的任务模板、产生20000+的任务实例。为运营团队提供诸如营销短信发送、crm数据同步、数仓底表更新等功能，以及任务间依赖关系的构建管理
:::

::: tip 苏州贝康医疗股份有限公司
- 人工智能工程师 `2019.12 至 2021.04`
- 参与的眼底图像初筛项目精度达95%以上
- 智能精子质量分析仪项目中参与形态分析算法部分的设计和训练，算法获得医生认可，分析仪目前已上架公司官网销售渠道
:::

<br/>

### 项目经验
::: tip BI任务调度系统
- 需求：解决托管在BigQuery的周期性sql脚本任务间依赖问题、错误告警、数据来源问题。后期延伸出多平台数据同步，sql任务产出报表管理等需求
- 方案：使用golang技术栈，类比`xxl-job、airflow`等开源项目，实现`web、scheduler`和`worker`模块及之间的协作，详情见架构图
- 贡献：负责调度模型的整体设计，以及`web`、`scheduler`和`部分worker`的开发
- 成果：该项目上线后为`BI任务`、`webhook任务`、`Python脚本`、`ETL数据转储`、`定时营销短信发送`等任务编排管理提供支持，累计维护任务模板1k+，任务实例2w+
- 架构图：
![](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/flowbq.png)
:::

::: tip ETL数据转储项目
- 需求：从DBA接手数据从线上多仓库同步至数仓，并解决失败告警、重跑等功能
- 方案：golang实现 `E、T、L`模块, 并封装ETL任务作为BI任务调度系统的一个worker模块
- 贡献：完成`sqlExtract、bqLoad、dorisDbLoad、luaTransform`等模块的开发
- 成果：在BI调度系统内实现了依赖、重跑、告警等功能，完成300多个线上数据库的整库同步
:::

<br/>

::: tip 精子项目
- 研发相关算法协助医生实现非染色精子图像的活性、形态、异常、密度等指标的检测
- 贡献：开发数据标注工具、设计训练多模型算法、api部署及对接工作
- 使用头体尾分割后分类及形态分析的方案取代大模型，减少了50%以上gpu资源的使用
:::

### 校园经历

::: tip 在器人团队收获颇丰
- 学习3D建模，能够熟练构建3D模型，熟练使用3D打印技术制作机器人零件
- 自学stm32单片机，通过查阅文档观看教学视频等学习方法，对uart、IIC、GPIO、SPI、Timer片载外设有充分的了解，能够满足机器人开发过程中，电机、舵机、光敏、六轴加速度、lcd、红外遥控等硬件设备驱动程序的开发
- 自学树莓派、Python、OpenCV。设计实现基于uart的树莓派与单片机简单通信协议。通过编写opencv-python脚本，给机器人巡线增添了新的解决方案
- 学习使用ubuntu开发环境， 学习git，为机器人工作室搭建了本地gitlab服务器
- 机器人控制算法的些许研究，应用PID算法到机器人电机控速转弯等方面。并开发出团队第一款[麦克纳姆轮机器人](https://www.bilibili.com/video/BV1d5411a7Uu)
::: 
