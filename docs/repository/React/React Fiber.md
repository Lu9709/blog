# React Fiber

**React Fiber** 是 React 16 引入的一种新的 协调（reconciliation）引擎实现。

它的核心目的是：提高其在动画、布局和手势等领域的适用性。

主要特性是**incremental rendering**: 将渲染任务**拆分为小的任务块**并将任务分配到**多个帧**上的能力。

从架构角度来看，Fiber 是对 React核心算法（即调和过程）的重写

从编码角度来看，Fiber 是 React内部所定义的一种数据结构，它是 Fiber树结构的节点单位，也就是 React 16 新架构下的虚拟DOM