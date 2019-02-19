import * as React from 'react'
import {Component, ReactNode, useEffect, useRef, useState} from 'react'
import {Observable, PartialObserver, Subscribable, Subscription} from 'rxjs'
import {sharedData} from './shared-data'

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


//TODO rewrite Subscribe into FC
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
      console.warn('Subscribing to multiple observables at one time is deprecated. Please avoid using this feature.')
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
  const {streamStatus} = sharedData
  const initializedRef = useRef(false)
  
  const [state, setState] = useState<T>(initialValue)
  if (streamStatus.isFirstRun) {
    if (initialValue !== undefined) { // with initialValue
      initializedRef.current = true
    } else { // without initialValue
      if (streamStatus) streamStatus.waitingCount++
    }
  }
  useEffect(() => {
    if (stream) {
      const subscription = stream.subscribe((v) => {
        if (initializedRef.current === false) {
          initializedRef.current = true
          if (streamStatus) streamStatus.waitingCount--
        }
        setState(v)
      })
      return () => {
        subscription.unsubscribe()
      }
    }
  },[stream])
  return state
}

export function useSubscription<T>(stream: Subscribable<T>, observer: PartialObserver<T>, deps?: any[]): void
export function useSubscription<T>(stream: Subscribable<T>, next: (value: T) => void, deps?: any[]): void
export function useSubscription<T>(stream: Subscribable<T>, subscribeArg: any, deps: any[] = []): void {
  useEffect(() => {
    if (stream) {
      const subscription = stream.subscribe(subscribeArg)
      return subscription.unsubscribe.bind(subscription)
    }
  },[stream, ...deps])
}
