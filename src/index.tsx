import * as React from 'react'
import {Component, ReactNode} from 'react'
import {Observable, Subscription} from 'rxjs'
import * as r from 'rxjs'

interface Props<T> {
  to: Observable<T>
  children: (data: T) => ReactNode
}

class State<T> {
  data: T = null
}

export class Subscribe<T> extends Component<Props<T>, State<T>> {
  state = new State<T>()

  subscription: Subscription = null

  constructor(props: Props<T>) {
    super(props)
  }

  componentDidMount() {
    this.subscribeToObservable(this.props.to)
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    this.unsubscribe()
    this.subscribeToObservable(nextProps.to)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  subscribeToObservable(observable: Observable<T>) {
    if (!observable) {
      return
    }
    this.subscription = observable.subscribe({
      next: (v) => {
        this.setState({
          data: v
        })
      }
    })
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  render() {
    if (this.state.data === null) {
      return null;
    } else {
      return this.props.children(this.state.data)
    }
  }

}
