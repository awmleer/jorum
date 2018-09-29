import {BehaviorSubject} from 'rxjs'

export class CounterBloc {
  counter = 0
  constructor() {
    setInterval(() => {
      this.counter++
      this.count$.next(this.counter)
    }, 1000)
  }
  count$ = new BehaviorSubject(0)
}
