---
sidebar: auto
---

# 常用的api
1. Task Management (vTask, xTask)
- xTaskCreate: 创建一个新任务。
- vTaskDelete: 删除任务。
- vTaskDelay: 任务延迟指定的时间。
- vTaskDelayUntil: 将任务延迟到指定的时间点。
- xTaskResumeAll: 恢复所有调用 vTaskSuspendAll 暂停的任务。
- vTaskSuspend: 暂停任务。
- vTaskResume: 恢复被暂停的任务。
- uxTaskPriorityGet: 获取任务的优先级。
- vTaskPrioritySet: 设置任务的优先级。
- vTaskStartScheduler: 启动调度器，开始调度任务。
- vTaskEndScheduler: 停止调度器。
2. Queue Management (xQueue, vQueue)
- xQueueCreate: 创建队列。
- xQueueSend: 向队列发送数据。
- xQueueReceive: 从队列接收数据。
- xQueueSendFromISR: 从中断中向队列发送数据。
- xQueueReceiveFromISR: 从中断中接收队列数据。
- xQueuePeek: 查看队列中的数据而不移除它。
- uxQueueMessagesWaiting: 获取队列中未处理的消息数量。
3. Semaphore Management (xSemaphore, vSemaphore)
- xSemaphoreCreateBinary: 创建二值信号量。
- xSemaphoreTake: 获取二值或计数信号量。
- xSemaphoreGive: 释放二值或计数信号量。
- xSemaphoreCreateMutex: 创建互斥信号量。
- xSemaphoreGiveFromISR: 从中断中释放信号量。
- xSemaphoreTakeFromISR: 从中断中获取信号量。
4. Timer Management (xTimer, vTimer)
- xTimerCreate: 创建一个软件定时器。
- xTimerStart: 启动定时器。
- xTimerStop: 停止定时器。
- xTimerReset: 重置定时器。
- xTimerChangePeriod: 更改定时器的周期。
- xTimerDelete: 删除定时器。
5. Event Group Management (xEventGroup)
- xEventGroupCreate: 创建事件组。
- xEventGroupSetBits: 设置事件组中的位。
- xEventGroupClearBits: 清除事件组中的位。
- xEventGroupWaitBits: 等待事件组中的某些位被设置。
- xEventGroupGetBits: 获取事件组中的位。
- xEventGroupDelete: 删除事件组。
6. Memory Management (pvPort, vPort)
- pvPortMalloc: 动态分配内存。
- vPortFree: 释放动态分配的内存。
- pvPortRealloc: 重新分配内存。
7. Task Notifications (xTaskNotify, ulTaskNotify)
- xTaskNotify: 向任务发送通知。
- xTaskNotifyGive: 向任务发送一个计数通知。
- xTaskNotifyTake: 从任务接收一个计数通知。
- xTaskNotifyStateClear: 清除任务的通知状态。
8. Scheduler Control (vTaskStartScheduler, vTaskEndScheduler, vTaskSuspendAll, xTaskResumeAll)
- vTaskStartScheduler: 启动任务调度。
- vTaskEndScheduler: 停止任务调度。
- vTaskSuspendAll: 暂停调度器，不再进行任务切换。
- xTaskResumeAll: 恢复调度器，开始任务切换。
9. ISR Safe APIs (xFromISR, vFromISR)
- xQueueSendFromISR: 从 ISR 中发送队列数据。
- xSemaphoreGiveFromISR: 从 ISR 中释放信号量。
- xTaskNotifyFromISR: 从 ISR 中发送任务通知。
- portYIELD_FROM_ISR: 从 ISR 中触发任务调度。
10. Miscellaneous (vApplication, vPort, etc.)
- vApplicationIdleHook: 空闲任务钩子函数。
- vApplicationTickHook: 时钟节拍钩子函数。
- vApplicationMallocFailedHook: 内存分配失败钩子函数。
- vPortEnterCritical: 进入临界区。
- vPortExitCritical: 退出临界区。


# 常见问题
## 优先级翻转
- 一句话解释：由于低优先级task占用高优先级所需资源，被中优先级抢占后，中优先高执行，这就是优先级翻转；
- 解决办法：
    - 互斥信号量：可以自动实现优先级继承，(低优占用锁期间，优先级从高优先级继承)
    - 手动提高优先级，比如某资源的处理代码全部提高到最高优先级xxx
    - 关闭调度器操作资源
    - 消息队列方式只有一个任务操作资源。。。


# 信号量

## 二值信号量
- 长度为0的消息队列，多用于同步
- 中断和任务同步，任务间同步

## 互斥信号量
- 与二值信号量差不多，到那时多了优先级继承的操作
- 使用与资源访问边界限制，类似与linux应用编程的 mutux \ 锁

## 数值信号量
- 计数功能的信号量，可以用来统计数量，类似库存xxx

# 消息队列
- 消息队列
- 任务 & 中断 之间通信： 1:1 1:n
- 可以传递数据，静态，动态方式
- 可以通过指针，总之（c语言任何数据都只是字节流而已）

# 空闲函数
- 低功耗，比如stm32可以在空闲函数进入睡眠模式
- 清理任务尸体
- 比如任务删除自己的时候，尸体没有办法真正清理，在空闲任务才能清理

# freertos任务管理
- 任务状态
    - 运行中
    - 挂起
    - 就绪
    - 阻塞

# 定时器，
- 软件模拟定时器
- 支持，设置始终周期，callback,定时器创建，启动，停止...