# 在组件中订阅数据流

在jorum中数据流是Observable而非裸的数据，因此我们需要通过一定的方式对数据进行订阅。

## useStream

在函数组件中，可以使用`useStream`来订阅数据流：

```jsx
const App = (props) => {
  const fooBloc = useBloc(FooBloc)
  const data = useStream(fooBloc.data$)
  return (
    <div>
      {data}
    </div>
  )
}
```

当data更新时，`App`组件也会自动重新渲染。

> `useStream`本质上就是`useEffect`加`useState`，订阅数据流并在其更新的时候自动`setState`。

## suspense & checkStream

在上面的例子中，其实存在一个小问题，`data`可能并没有被初始化：

```jsx
const App = (props) => {
  const fooBloc = useBloc(FooBloc)
  const data = useStream(fooBloc.data$)
  console.log(data)
  //...
}

//first time: undefined
//second time: "some value"
```

即便`fooBloc.data$`是`BehaviorSubject`或`ReplaySubject`，`data`变量在第一次渲染的时候都会是`undefined`，除非我们给它指定了一个初始值：

```jsx
const data = useStream(fooBloc.data$, 'some initial value')
console.log(data)

//first time: "some initial value"
//second time: "some value"
```

为了解决这个问题，我们需要做两件事情：

1. 用`suspense`函数来生成组件
2. 在**合适的位置**调用`checkStream`函数

> `checkStream`和`suspense`是一组工具，必须一起配合使用

```jsx
const App = suspense((props) => {
  const fooBloc = useBloc(FooBloc)
  const data = useStream(fooBloc.data$)
  checkStream()
  return (
    <div>
      {data}
    </div>
  )
})
```

那`checkStream()`到底应该写在哪里呢？

我们不妨先来看一下`checkStream`的**作用**：`checkStream`会检查在本组件中，之前通过`useStream`被使用过的所有的流是否都被初始化了，如果没有的话，就会抛出一个异常。这个异常会被`suspense`生成的组件捕捉并识别，从而让这个组件渲染为`null`。

由于`checkStream`会抛出异常，也就意味着会造成组件渲染函数的中断，因此我们需要留意`checkStream()`之后的代码没有被执行的这种情况。

因此，`checkStream()`应该写在**其他所有的hooks之后**，`return`语句之前。

> 为什么是“其他所有的***hooks***之后”，而不是“所有的***useStream***之后”呢？
>
> 这是因为React对hooks有一条规定：每次组件渲染，必须按照同样的顺序、执行同样多的hooks。因此如果有hook在`checkStream`之后，那么它可能在第一次组件渲染的时候不会被执行（`checkStream`抛出异常直接导致函数中断），也就违反了这条规定。

而对于`suspense`，也有一些需要注意的地方。

如果有其他的组件wrapper函数，`suspense`必须写在**最内侧**：

```jsx
// √
const App = withRouter(memo(suspense((props) => {
    //...
})))

// ×
const App = suspense(withRouter(memo((props) => {
    //...
})))
```

> `suspense`虽然看起来像是一个高阶组件，但是实际上它并不是。准确的讲，`suspense`是一个**组件生成函数**，传入它的那个**参数**并不是React Component，而是一个render function。

## useSubscription

有的时候，我们希望把数据流作为事件通知器，或者是希望自定义一些数据更新时的处理逻辑，这时可以使用`useSubscription`来订阅事件。

```jsx
const App = suspense(() => {
  const fooBloc = useBloc(FooBloc)
  useSubscription(fooBloc.foo$, () => {
    // do something here
  })
  return (
    //...
  )
})
```

> 和`useStream`一样，`useSubscription`也只能在函数组件中使用。

## Subscribe

在普通类组件中，可以直接使用`Subscribe`组件：

```jsx
<Subscribe to={fooBloc.data$}>
  {data => (
    <div>
      {data}
    </div>
  )}
</Subscribe>
```

