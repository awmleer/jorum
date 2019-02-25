# 在组件中订阅数据流

在jorum中数据流是Observable而非裸的数据，因此我们需要通过一定的方式对数据进行订阅。

## useStream

在函数组件中，可以使用`useStream`来订阅数据流：

```jsx
const App = function(props) {
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

## suspense

在上面的例子中，其实存在一个小问题，`data`可能并没有被初始化：

```jsx
const App = function(props) {
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

为了解决这个问题，我们需要使用一个组件生成器：`suspense`函数。

```jsx
const App = suspense(function App(props) {
  const fooBloc = useBloc(FooBloc)
  const data = useStream(fooBloc.data$)
  return () => {
    return (
      <div>
        {data}
      </div>
    )
  }
})
```

不难发现，`suspense`的那个参数（不妨记为函数A）是一个高阶函数，它会返回另一个函数（不妨记为函数B）。通过这种方式，我们把一个函数组件切分成了两个部分，第一部分（函数A）是`useBloc`和`useStream`，第二部分（函数B）是其余的逻辑。`suspense`会先对函数A中使用到的stream进行检查，如果这些`useStream`都被初始化了，那么才会执行函数B渲染组件，反之则会直接返回null。因此，我们无需手动处理`data`是`undefined`的情况。

> 如果在开发中发现你的`suspense`组件显示不出来，请先确保：在组件被创建后，其中所有`useStream`订阅的流都发送过值。

由于`suspense`是一个**组件生成器**而非高阶组件，因此，如果有其他的组件wrapper函数，`suspense`必须写在**最内侧**：

```jsx
// √
const App = withRouter(memo(suspense(function App(props) {
    //...
})))

// ×
const App = suspense(withRouter(memo(function App(props) {
    //...
})))
```

## useSubscription

有的时候，我们希望把数据流作为事件通知器，或者是希望自定义一些数据更新时的处理逻辑，这时可以使用`useSubscription`来订阅事件。

```jsx
const App = function() {
  const fooBloc = useBloc(FooBloc)
  useSubscription(fooBloc.foo$, () => {
    // do something here
  })
  return (
    //...
  )
}
```

> `useSubscription`不需要和`suspense`配合使用。

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

