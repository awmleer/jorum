import * as React from 'react'
import {Component, ReactNode, useRef} from 'react'
import {Observable, Subscribable, Subscription} from 'rxjs'
import {StreamNotInitialized} from './suspense'

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

export function useStream<T>(stream: Subscribable<T>, initialValue?: T): T {
  const initializedRef = useRef(false)
  const [state, setState] = React.useState<T>(initialValue)
  if (initialValue !== undefined) {
    initializedRef.current = true
  }
  React.useEffect(() => {
    if (stream) {
      const subscription = stream.subscribe({
        next: (v) => {
          initializedRef.current = true
          setState(v)
        }
      })
      return () => {
        subscription.unsubscribe()
        initializedRef.current = false
      }
    }
  },[stream])
  if (!initializedRef.current) {
    throw new StreamNotInitialized()
  }
  return state
}

export function useObservable<T>(observable: Observable<T>): T {
  // console.warn('useObservable hook is deprecated and will be removed in the next major version. Please use useStream instead.')
  return useStream(observable)
}
