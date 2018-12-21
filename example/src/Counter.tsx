import * as React from 'react'
import {CounterBloc} from './bloc/counter.bloc'
import {Consumer, Subscribe, useBloc, useObservable, suspense} from 'jorum'

// export class Counter extends React.Component {
//   render() {
//
//     return (
//       <Consumer of={CounterBloc}>
//         {counterBloc => (
//           <React.Fragment>
//             <Subscribe to={[counterBloc.count$, counterBloc.countAnother$]}>
//               {(count, countAnother) => (
//                 <div>
//                   <p>{count}</p>
//                   <p>{countAnother}</p>
//                 </div>
//               )}
//             </Subscribe>
//             <Subscribe to={counterBloc.shouldShowResetButton$}>
//               {data => {
//                 console.log(data)
//                 return data && <button onClick={counterBloc.resetCounter}>reset</button>
//               }}
//             </Subscribe>
//           </React.Fragment>
//         )}
//       </Consumer>
//     )
//   }
// }


export const Counter = suspense((props: {}) => {
  const [state, setState] = React.useState(123)
  const counterBloc = useBloc(CounterBloc)
  const count = useObservable(counterBloc.count$)
  const countAnother = useObservable(counterBloc.countAnother$)
  return (
    <React.Fragment>
      <div>
        123
        <p>{count}</p>
        <p>{countAnother}</p>
      </div>
    </React.Fragment>
  )
})
