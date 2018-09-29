import React, {Component, ReactNode} from 'react'
import {Observable} from 'rxjs'

interface Props<T> {
  to: Observable<T>
  children: (data: T) => ReactNode
}

class State<T> {
  data: T = null
}

export class Subscription<T> extends Component<Props<T>, State<T>> {
  state = new State<T>()
  constructor(props: Props<T>) {
    super(props)
    if (this.props.to) {
      this.props.to.subscribe({
        next: (v) => {
          this.setState({
            data: v
          })
        }
      })
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
