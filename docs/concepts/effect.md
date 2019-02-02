# 通过@effect定义副作用

在BLoC中，我们不应该**手动地**去订阅`Observable`，因为一旦没有做好清理，就非常容易造成内存泄露。而jorum提供了一套更为安全的模式：`@effect`。

```typescript
@bloc
class FooBloc {
  readonly data$ = interval(1000)
  
  @effect
  private readonly handleDataChange$ = this.data$.pipe(
    map((data) => {
      alert(data)
    })
  )
}
```

jorum会在BLoC实例化的时候自动订阅被`@effect`修饰的流，并且会在BLoC销毁的时候自动取消订阅。