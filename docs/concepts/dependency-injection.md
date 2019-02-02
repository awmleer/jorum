# 依赖注入

在一个项目中，多个BLoC之前并不是完全孤立的，他们往往是相互依赖的，例如评论模块可能依赖了帖子模块和账户模块，同时帖子模块自己也依赖了账户模块。如果我们需要手动地去维护这些BLoC实例之间的联系的话，将无比的繁琐和低效。

在jorum，我们可以在BLoC的构造函数中使用`@inject`**修饰器**来实现自动的**依赖注入**：

```typescript
@bloc
export class FooBloc {
  //...
}

@bloc
export class BarBloc {
  constructor(
    @inject public fooBloc: FooBloc
  ) {}
  //...
}
```

这样，jorum就会在创建`BarBloc`的时候，找到Context树上最近的`FooBloc`的实例，并将其作为**参数**传给`BarBloc`的**构造函数**。

也就是说，虽然是有依赖注入器，但是，我们仍然需要在上级组件树中先使用`Provider`**提供**一个`FooBloc`：

```jsx
<Provider of={FooBloc}>
  <Provider of={BarBloc}>
    {/*...*/}
  </Provider>
</Provider>
```

但是注入也可以是**可选的**，我们只需要把构造函数对应的参数标记为可选即可：

```typescript
@bloc
export class BarBloc {
  constructor(
    @inject public fooBloc?: FooBloc //注意我们在fooBloc参数的后面加上了一个optional标记
  ) {}
  //...
}
```

这样，jorum会尝试获取一个`FooBloc`的实例，但是如果拿不到的话，就会把`null`作为`fooBloc`参数。

```jsx
<Provider of={BarBloc}>
  {/* 在这里barBloc.fooBloc是null */}
</Provider>

<Provider of={FooBloc}>
  <Provider of={BarBloc}>
    {/* 在这里barBloc.fooBloc是一个正常的实例 */}
  </Provider>
</Provider>
```

如果我们想同时给`BarBloc`的构造函数设置一些额外的自定义的参数，那么我们需要把**注入型参数**（也就是`@inject`修饰的参数）放到最后面：

```typescript
@bloc
export class BarBloc {
  constructor(
    public a: string,
    b: string,
    @inject public fooBloc: FooBloc,
  ) {}
  //...
}
```

然后在使用`Provider`提供`BarBloc`的时候，忽略注入型参数即可：

```jsx
<Provider of={BarBloc} args={['A', 'B']}></Provider>
```

