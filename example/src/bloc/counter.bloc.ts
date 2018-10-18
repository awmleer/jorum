import {BehaviorSubject} from 'rxjs'
import {distinctUntilChanged, map} from 'rxjs/operators'
import {Bloc} from '../../../lib'

export class CounterBloc extends Bloc {
  constructor() {
    super()
    setInterval(() => {
      this.count$.next(this.count$.value + 1)
      this.countAnother$.next(this.countAnother$.value + 2)
      console.log('tick!')
    }, 1000)
    console.log('constructed!')
  }

  count$ = new BehaviorSubject(0)

  countAnother$ = new BehaviorSubject(10)

  shouldShowResetButton$ = this.count$
    .pipe(map(val => val > 10))
    .pipe(distinctUntilChanged())

  resetCounter = () => {
    this.count$.next(0)
  }
}

export class TestBloc extends Bloc {
  a$ = new BehaviorSubject('test-a')
}
