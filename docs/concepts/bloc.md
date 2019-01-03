# BLoC

BLoC（Business Logic Component）可以理解为业务逻辑单元



```javascript
export class CounterBloc extends Bloc {
  interval = null
  constructor() {
    super()
    this.interval = setInterval(() => {
      this.count$.next(this.count$.value + 1)
      this.countAnother$.next(this.countAnother$.value + 2)
    }, 1000)
  }

  count$ = new BehaviorSubject(0)

  countAnother$ = new BehaviorSubject(10)

  shouldShowResetButton$ = this.count$
    .pipe(map(val => val > 10))
    .pipe(distinctUntilChanged())

  resetCounter = () => {
    this.count$.next(0)
  }
  
  blocWillDestroy(){
    clearInterval(this.interval)
  }
}
```
