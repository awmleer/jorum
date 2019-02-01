# BLoC

BLoC（Business Logic Component）可以理解为业务逻辑单元。

在实际使用中，我们常常把BLoC作为数据流和业务逻辑的容器。

比如，下面是一个最简单的bloc：

```javascript
@bloc
export class FooBloc {
  data$ = new ReplaySubject('lalala')
  change = () => {
    this.data$.next('hahaha')
  }
}
```

在这个bloc容器中，我们盛放了一个名为`data$`的数据流（有关数据流的概念会在下一节介绍），和一个操作这个数据流的方法`change`。

这个bloc和普通的TypeScript（JavaScript）类并没有什么本质区别，唯一不同的是，我们需要用`@bloc`修饰器**修饰**这个类，从而让jorum能够**识别**它。

