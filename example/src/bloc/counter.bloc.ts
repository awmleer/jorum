import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs'
import {distinctUntilChanged, map} from 'rxjs/operators'
import {bloc, Bloc} from 'jorum'

@bloc
export class CounterBloc implements Bloc {
  interval: number = null

  constructor(initialValue?: number) {
    this.interval = window.setInterval(() => {
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

  blocWillDestroy(): void {
    window.clearInterval(this.interval)
  }
}

@bloc
export class TestBloc implements Bloc {
  a$ = new BehaviorSubject(1)
  b$ = new ReplaySubject(1)
  // a$ = new Observable()
  constructor(inital?: number) {
    if (inital) {
      this.a$.next(inital)
    }
    setTimeout(() => {
      this.b$.next('b')
    }, 10000)
  }

  blocWillDestroy(): void {
    console.log('destroy!')
  }
}
