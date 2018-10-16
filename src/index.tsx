import * as React from 'react'
import {Component, ReactNode} from 'react'
import {Observable, Subscription} from 'rxjs'

interface Props {
  to: Observable<any> | Observable<any>[]
  children: (...listOfData: any[]) => ReactNode
}

class State {
  data: any[] = []
}

export class Subscribe extends Component<Props, State> {
  state = new State()

  subscriptions: Subscription[] = []

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    this.subscribeTo(this.props.to)
  }

  componentWillReceiveProps(nextProps: Props) {
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
      return this.props.children(...this.state.data)
    }
  }

}
