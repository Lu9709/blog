# 低代码JSON数据太大如何解决

### 数据结构优化：减少JSON体积

1. 精简键名与字段。
2. 避免中文转为Unicode。
3. 采用高效数据格式：使用HPack/CJSON算法压缩重复结构。

### 传输优化：降低网络负载

1. 启用Gzip/Brotli压缩。
2. 分页与按需加载
3. 流式传输（Streaming）服务端分块输出（`Transfer-Encoding: chunked`），客户端边接收边解析，避免内存爆增。

### 解析与处理优化

1. 流式解析（Streaming JSON Parsing）：使用流式解析库（如fastjson、ijson），避免一次性加载整个JSON文档到内存。
2. 高效序列化库替换：`JSON.parse()` → `Oboe.js`（流式解析）
   服务端预处理：在返回前过滤字段（如GraphQL）、聚合数据，减少传输量

