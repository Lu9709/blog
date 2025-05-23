**TCP**是一种**面向连接的**、**可靠的**、**基于字节流的传输层通信协议**。

**建立TCP连接**需要进行**三次握手**

1. 第一次握手（SYN）：客户端向服务器发送一个带有SYN（同步）标志的TCP报文段，请求建立连接。该报文段携带客户端的一个初始序列号（ISN）发送给服务器。
2. 第二次握手（SYN+ACK）：服务器收到客户端的请求后，发送一个带有SYN/ACK（同步/确认）标志的TCP报文段，表示接受连接请求并准备建立连接。服务器也选择一个初始序列号，并确认客户端的序列号。
3. 第三次握手（ACK）：客户端收到服务器的确认后，发送一个带有ACK（确认）标志的TCP报文段，表示连接已建立。客户端确认服务器端序列号。

完成三次握手后，TCP连接正式建立，双方可以开始进行数据传输。

**断开TCP连接**需要进行**四次挥手**

1. 第一次挥手（FIN）：当一个端点（客户端或服务器）希望关闭连接时，它发送一个带有 FIN（结束）标志的 TCP 报文段，表示不再发送数据。
2. 第二次挥手（ACK）：接收到关闭请求的一方发送一个带有 ACK（确认）标志的 TCP 报文段，表示已收到关闭请求。
3. 第三次挥手（FIN）：被动关闭的一方也希望关闭连接，发送一个带有 FIN 标志的 TCP 报文段。
4. 第四次挥手（ACK）：另一方收到关闭请求后，发送一个带有 ACK 标志的 TCP 报文段，表示确认关闭请求。

完成四次挥手后，TCP 连接正式关闭，双方不再进行数据传输。

