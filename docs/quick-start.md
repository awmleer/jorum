# 快速上手

## 安装

首先，请确保jorum和RxJS已经被正确的安装，并且相关的环境配置已经完成。这部分的操作在[这里](https://jorum.gitbook.io/jorum/installation)有所介绍。

## 定义BLoC

BLoC（Business Logic Component）可以理解为业务逻辑单元，是存放一组数据及其操作的容器。

听起来很高深？

其实并不，BLoC其实只是一个普通的类，只是我们需要用`@bloc`修饰器来修饰它，这样jorum才能够将其识别。

```typescript
import {bloc} from 'jorum'

@bloc
export class FooBloc {
  
}
```

## 往BLoC中添加数据

在定义好BLoC后，我们可以在其中添加数据：

```typescript
@bloc
export class FooBloc {
  data$ = new BehaviorSubject(1)
  
  constructor() {
    setTimeOut(() => {
      this.data$.next(2)
    }, 5000)
  }
}
```

> 这里的“数据”都是[RxJS](https://rxjs-dev.firebaseapp.com/)中的Observable，在这篇文档中，我们假设你已经对RxJS有所了解。

## 在组件中提供BLoC

现在，我们可以使用`Provider`组件将`FooBloc`加入到React的组件树中：

```jsx
<Provider of={FooBloc}>
  {/*...*/}
</Provider>
```

`Provider`会自动创建和销毁一个`FooBloc`的实例，并且，只有`Provider`节点下面的子节点可以获取到这个`FooBloc`的实例。

> jorum中的Provider组件是基于React的[Context API](https://reactjs.org/docs/context.html)的。

## 获取这个BLoC的实例

在子组件中，使用`useBloc`hook可以获取到外层提供的`FooBloc`的实例：

```jsx
export const ShowFoo: FC = () => {
  const fooBloc = useBloc(FooBloc)
  return (
    <div>
      {fooBloc ? 'foo' : ''}
    </div>
  )
}
```

> 看起来不像是一个正常的React组件？这是React的新特性：[Hooks](https://reactjs.org/docs/hooks-intro.html)

## 订阅BLoC中的数据

BLoC中的数据是Observable，我们并不能像下面这样直接渲染到页面上：

```jsx
return (
  <div>
    {fooBloc.data$}
    {/*↑这样写并不能拿到data的值*/}
  </div>
)
```

因此，我们需要使用jorum提供的另一个hook：`useStream`

```jsx
export const ShowFoo: FC = suspense(() => {
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

当`fooBloc.data$`更新时，`ShowFoo`会被通知并重新渲染。

> 不同于典型的响应式框架，在jorum中，我们对数据的订阅是**显式**的。

由于`useStream`是异步加载数据的，所以需要用`suspense`对组件进行加工。

## 不止于此

上面只是一个最简单的样例，jorum还有更多高级和有趣的概念和用法，请移步“概念”章节。