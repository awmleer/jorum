import {BehaviorSubject, Observable} from 'rxjs'
import {distinctUntilChanged, map} from 'rxjs/operators'
import {Bloc} from 'jorum'

export class CounterBloc extends Bloc {
  constructor(initialValue?: number) {
    super()
    setInterval(() => {
      this.count$.next(this.count$.value + 1)
      this.countAnother$.next(this.countAnother$.value + 2)
      console.log('tick!')
    }, 1000)
    if (initialValue) {
      this.count$.next(initialValue)
    } else {
    }
    console.log('constructed!')
  }

  count$ = new BehaviorSubject(0)

  countAnother$ = new BehaviorSubject(10)

  shouldShowResetButton$: Observable<boolean> = this.count$
    .pipe(map(val => val > 10))
    .pipe(distinctUntilChanged())

  resetCounter = () => {
    this.count$.next(0)
  }
}

export class TestBloc extends Bloc {
  a$ = new BehaviorSubject(1)
  // a$ = new Observable()
}
