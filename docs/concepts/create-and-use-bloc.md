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



### 并不需要手动实例化

对BLoC实例的维护（创建、销毁）都是由jorum负责的，我们不需要也不应该手动去维护BLoC的实例。

## 使用BLoC

### useBloc

### Subscribe