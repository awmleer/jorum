import * as React from 'react'
import {Bloc} from './bloc'

class BlocMap<T extends Bloc> {
  bloc: T
  constructor(blocClass: { new (): T }) {
    this.bloc = new blocClass()
  }
  prev?: BlocMap<Bloc>
}

// const blocMap = new BlocMap()

// export const BlocMapContext = React.createContext(blocMap)

// export class JorumContext extends React.Component {
//   render() {
//     return (
//       <BlocMapContext.Provider value={blocMap}>
//         {this.props.children}
//       </BlocMapContext.Provider>
//     )
//   }
// }
