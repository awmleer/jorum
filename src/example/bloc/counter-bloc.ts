import {BehaviorSubject} from 'rxjs'
import {map} from 'rxjs/operators'

export class CounterBloc {
  constructor() {
    setInterval(() => {
      this.count$.next(this.count$.value + 1)
    }, 1000)
  }

  count$ = new BehaviorSubject(0)

  shouldShowResetButton$ = this.count$.pipe(map(val => val > 10))

  resetCounter = () => {
    this.count$.next(0)
  }
}
