# 在组件中订阅数据流

在jorum中数据流是Observable而非裸的数据，因此我们需要通过一定的方式对数据进行订阅。

## useStream & suspense

在函数组件中，可以使用`useStream`来订阅数据流：

```jsx
const App = suspense((props) => {
  const fooBloc = useBloc(FooBloc)
  const data = useStream(fooBloc.data$)
  return (
    <div>
      {data}
    </div>
  )
})
```

当data更新时，`App`组件也会自动重新渲染。

> `useStream`本质上就是`useEffect`加`useState`，订阅数据流并在其更新的时候自动`setState`。

如果在组件中使用了`useStream`，那么**必须**用`suspense`函数来生成组件。

suspense的作用是，在数据流没有被初始化的时候**阻断**组件的渲染，并让组件返回null。

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

