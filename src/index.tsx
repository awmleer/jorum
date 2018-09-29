import React, {Component, ReactNode} from 'react'
import {Observable, Subscription} from 'rxjs'

interface Props<T> {
  to: Observable<T>
  children: (data: T) => ReactNode
}

class State<T> {
  data: T = null
}

export class Subscribe<T> extends Component<Props<T>, State<T>> {
  state = new State<T>()

  subscription: Subscription

  constructor(props: Props<T>) {
    super(props)
    if (this.props.to) {
      this.subscription = this.props.to.subscribe({
        next: (v) => {
          this.setState({
            data: v
          })
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
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
