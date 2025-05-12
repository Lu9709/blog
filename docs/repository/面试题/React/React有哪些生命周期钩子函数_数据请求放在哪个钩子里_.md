[React.Component – React](https://reactjs.org/docs/react-component.html#the-component-lifecycle)

[React Lifecycle Methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

![](https://cdn.nlark.com/yuque/0/2023/png/2749296/1677402112214-5abce611-bd9e-48af-b4c3-77276996d250.png)

总得来说：

1. 挂载时调用`constructor`，更新时不调用
2. 更新时调用`shouldComponentUpdate`和`getSnapshotBeforeUpdate`，挂载时不调用
3. `shouldComponentUpdate`在`render`前调用，`getSnapshotBeforeUpdate`在`render`后调用
4. 请求放在`componentDidMount`里。

原因是`constructor`无法放AJAX请求，是因为它会在SSR的时候会被调用，是会在服务端进行调用，服务端是拿不到数据的，更新时的钩子放请求会不断调用，可能会造成死循环，卸载时的钩子只会在生命周期结束的时候进行调用。

