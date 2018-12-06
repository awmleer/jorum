import * as React from 'react'
import {Component, ReactNode} from 'react'
import {BehaviorSubject, Observable, Subscribable, Subscription} from 'rxjs'

interface PropsMulti {
  to: Observable<any>[]
  children: (...listOfData: any[]) => ReactNode
}

interface PropsSingle<T> {
  to: Observable<T>
  children: (data: T) => ReactNode
}

class State {
  data: any[] = []
}


export class Subscribe<T> extends Component<PropsSingle<T> | PropsMulti, State> {
  state = new State()
  
  subscriptions: Subscription[] = []
  
  constructor(props: PropsMulti) {
    super(props)
  }
  
  componentDidMount() {
    this.subscribeTo(this.props.to)
  }
  
  componentWillReceiveProps(nextProps: PropsMulti) {
    this.unsubscribe()
    this.setState({
      data: []
    })
    this.subscribeTo(nextProps.to)
  }
  
  componentWillUnmount() {
    this.unsubscribe()
  }
  
  handleObservable(observable: Observable<any>, index:number) {
    const subscription = observable.subscribe({
      next: (v) => {
        this.setState((prevState: State) => {
          const data = [...prevState.data];
          data[index] = v
          return {
            data
          }
        });
      }
    })
    this.subscriptions.push(subscription)
  }
  
  subscribeTo(to: Observable<any> | Observable<any>[]) {
    if (!to) return
    if (Array.isArray(to)) {
      //TODO: remove feature of subscribing to multiple observables at one time
      console.warn('Subscribing to multiple observables at one time will be deprecated in the next major version. Please avoid using this feature.')
      to.forEach(this.handleObservable.bind(this))
    } else {
      this.handleObservable(to, 0);
    }
  }
  
  unsubscribe() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
    this.subscriptions = []
  }
  
  render() {
    if (!this.state.data.length) {
      return null;
    } else {
      return (this.props.children as any)(...this.state.data)
    }
  }
  
}

export function useStream<T>(stream: Subscribable<T>): T {
  const initialValue = (stream as BehaviorSubject<T>).value
  const isBehaviorSubject = initialValue === undefined
  const [state, setState] = React.useState<T>(isBehaviorSubject ? null : initialValue)
  React.useEffect(() => {
    if (stream) {
      let valid = !isBehaviorSubject
      const subscription = stream.subscribe({
        next: (v) => {
          if (valid) setState(v)
          valid = true
        }
      })
      return () => {
        subscription.unsubscribe()
      }
    }
  },[stream])
  return state
}

export function useObservable<T>(observable: Observable<T>): T {
  // console.warn('useObservable hook is deprecated and will be removed in the next major version. Please use useStream instead.')
  return useStream(observable)
}
