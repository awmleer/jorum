# BLoC的生命周期

BLoC的生命周期其实非常简单，它和相关联的`Provider`组件的生命周期是**一致**的：`Provider`组件创建，BLoC也被实例化；`Provider`组件销毁，对应的BLoC也被销毁。

我们为BLoC提供了一个叫做`blocWillDestroy`的生命周期函数，当然如果你想使用它，我们推荐你同时使用预先定义好的`Bloc`接口：

```typescript
@bloc
class FooBloc implements Bloc {
  //...
  function blocWillDestroy() {
    console.log('destroy')
  }
}
```

jorum会在BLoC**即将销毁**的时候调用这个方法，因此可以在这里做一些清理操作。

