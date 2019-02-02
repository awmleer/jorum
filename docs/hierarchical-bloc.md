# 多层级的BLoC

在jorum中，BLoC的实现是基于react的[Context](https://reactjs.org/docs/context.html)的，因此，`Provider`是可以嵌套使用的，`Consumer`或`useBloc`会获取到离它最近的一个BLoC实例。

例如：

```jsx
<Provider of={FooBloc}> -> A
  <Provider of={FooBloc}> -> B
    <Provider of={BarBloc}> -> C
      <Consumer of={FooBloc}>
        {bloc => (
          // 这里的bloc是B提供的FooBloc实例
        )}
      </Consumer>
    </Provider>
  </Provider>
</Provider>
```

