# 创建和使用BLoC

前面我们只是知道了如何定义一个BLoC，但是如果想在应用中使用这个BLoC，就需要将其**实例化**，并且绑定在组件树上。

## 创建BLoC

### Provider

使用Provider组件可以在组件树中提供一个BLoC：

```jsx
<Provider of={FooBloc}>
  {/*...*/}
</Provider>
```

jorum会在`Provider`组件创建的时候实例化一个`FooBloc`，并且在`Provider`组件销毁的时候销毁掉对应的BLoC实例。

### 向BLoC的构造函数传参

如果`FooBloc`的构造函数是带有参数的，比如：

```typescript
@bloc
export class FooBloc {
  constructor(
    public a: string,
    public b: string
  ) {}
  //...
}
```

那么，我们可以使用`args`属性向BLoC的构造函数传参：

```jsx
<Provider of={FooBloc} args={['A', 'B']}>
  {/*...*/}
</Provider>
```

> 注意args的类型是一个数组

### withProvider

使用withProvider高阶组件可以避免在一些情况下手动创建wrapper组件：

```jsx
const ExampleComponent = withProvider({
  of: FooBloc,
  args: ['A', 'B']
})(() => {
  return (
    <div>
      {/*...*/}
    </div>
  )
})
```

`withProvider`的普通使用方式为：

```javascript
withProvider(a)(b)
```

其中`a`就是`Provider`组件的props（只不过是object而非jsx的表述形式），而`b`则是一个react组件。

如果你想根据外围输入的props动态产生`Provider`的props，也可以把上式的`a`写成一个函数：

```jsx
const ExampleComponent = withProvider(props => ({
  of: FooBloc,
  args: [props.a, props.b]
}))(() => {
  return (
    <div>
      {/*...*/}
    </div>
  )
})
```

```jsx
<ExampleComponent a="A" b="B"/>
```

### 并不需要手动实例化

对BLoC实例的维护（创建、销毁）都是由jorum负责的，我们不需要也不应该手动去维护BLoC的实例。

## 使用BLoC

### useBloc

在**函数组件**中，我们可以使用`useBloc`这个hook来获取指定BLoC的**实例**。

```jsx
const ExampleComponent = (props) => {
  const fooBloc = useBloc(FooBloc)
  // 从这里开始就可以使用fooBloc这个实例了
  return (
    <div>
      {/*...*/}
    </div>
  )
}
```

### Consumer

在**类组件**中，我们并不能使用`useBloc`，这时就需要通过`Consumer`组件来获取BLoC实例了：

```jsx
<Provider of={FooBloc}>
  <Consumer of={FooBloc}>
    {(fooBloc) => (
      //...
    )}
  </Consumer>
</Provider>
```

