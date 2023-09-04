
import './App.css';
import './style.css'
import React,{useReducer} from 'react'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton'
export const ACTIONS =
{
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, {type, payload})
{

  switch (type)
  {
    case ACTIONS.ADD_DIGIT: 


    if (state.overwrite)
    {
      return{
        ...state,
        currentOperand: payload.digit,
        overwrite: false
      }
    }


    if (payload.digit === "0" && state.currentOperand === "0") return state
    if (payload.digit === "." && state.currentOperand.includes(".")) return state
    return {
      ...state,
      currentOperand:  `${state.currentOperand || ""}${payload.digit}`,
    }



//////////////////////////////////////////////////////////////CHOOOSE OPERATION START HERE...........................................................................................
    case ACTIONS.CHOOSE_OPERATION:

    

    if (state.currentOperand == null && state.previousOperand == null)
    {
      return state
    }





    ///////////////////////////////////// START badalida calaamada: waxaa gacanta iiga dhacde +, waxaan awood u leeyahy inaan - taabto, markaas +tii waxaa loo badali doonaa -
    if (state.currentOperand == null)
    {
      return{
        ...state,
        operation: payload.operation

      }
     
    }
    ///////////////////////////////////// END badalida calaamada: waxaa gacanta iiga dhacde +, waxaan awood u leeyahy inaan - taabto, markaas +tii waxaa loo badali doonaa -




////////////////////////////////////THIS IF CONDITION: 
      if(state.previousOperand == null)
      {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,   ///////////// maadaaama aan calaamad taabane, currentsatekeena(waxa hore noogu qornaa) qaad, oo geey kor,  si ay unoqdaan previous ama wax hore.
          currentOperand: null , ////////////////////////// xogta aan qorne eber kadhig, gaar ahaan qeebta hoose.
          // ...state, 
        }
      }


////////////////// wuxuu shaqeenaa markii calaamad 2aad lataabto, ayadoo tii hore taale: wuxuu marka hore xalinaa ama soosaaaa resultiga 2dii hore(uwacaa functionkii evaluate ka ahaa oo soosaaraaye resultiga..), kadib result ayuu kasoo qaadana wuxuuna raacsiinaa calaamadii aan taabane..
     return{
      ...state,
      previousOperand: evaluate(state), /// kor waxaa lasaari doonaa: resultiga kasoo baxo 2da hadda meesha taalo, kan kore iyo kan hoose.
      operation: payload.operation, ///// calaamadii hore badal, oo kadhig mida cusub ee hadda lataabte.
      currentOperand: null
     }



   
  



    case ACTIONS.CLEAR:
      return{}


      case ACTIONS.EVALUATE:
        ///////////////////////////////////////////  HADDII = LABAABTO AYADOO  previouska uu yahay eber, ama currentga uu yahay eber, ama aysan aalin calaamad lagu qabto shaqo, waxa laqoray lee soo celi
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null)
      {
        return state
      }


      ///////////////////////////////////////////////////////////////////////////caclucatinka sameeeey, previouska eberkadhig, currentiga: resutiga soo baxay kadhig, operation(calaamda): eber kadhig.
      return{
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state),
      }

    case ACTIONS.DELETE_DIGIT:
      ////////////////  hubi, haddii overwriteka uu yahay true: waxa meesha kuqoran halmar tirtir.. 
      if (state.overwrite)
      {
        return {}
      }
      if (state.currentOperand == null)
      {
        return{}
      }

      //////////////// haddii waxa meesha kuqoran kaliya ay yihiin 1xabo, eber kadhig.
      if (state.currentOperand.length == 1)
      {
        return{}
      }
////////////////////////////////// kan ugu danbeeyo lee tirtir......
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
      


  
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////THIS IS CALCUATION BUTTON STARTS HERE////////////////////////////////////////////////////////////////
function evaluate({currentOperand, previousOperand, operation})
{
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(current)) return "";
   let computation = "";

   switch (operation)
   {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "*":
        computation = prev * current;
        break;

      case "÷":
          computation = prev / current;
          break;
   }

   return computation.toString();
  
}
///////////////////////////////////////////////////////////////////////////////////////////////THIS IS CALCUATION BUTTON ENDS HERE////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////start FORMATING THE NUMBERS.//////////////////////////////////////////////////////////////////
const INTEGER_FORMATTER  = new Intl.NumberFormat("en-us", {
  maximumFractionDigits : 0,
})
function formatOperand(operand)
{
  if (operand == null) return

  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

//////////////////////////////////////////////////////////////////  END  start FORMATING THE NUMBERS.//////////////////////////////////////////////////////////////////





function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className='output'>
      <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
      <div className='current-operand'>{formatOperand(currentOperand)}</div>


      </div>

      <button className='span-two' onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>


     
    </div>
  );
}

export default App;

// import { useReducer } from "react"
// import DigitButton from "./DigitButton"
// import OperationButton from "./OperationButton"
// import "./style.css"

// export const ACTIONS = {
//   ADD_DIGIT: "add-digit",
//   CHOOSE_OPERATION: "choose-operation",
//   CLEAR: "clear",
//   DELETE_DIGIT: "delete-digit",
//   EVALUATE: "evaluate",
// }

// function reducer(state, { type, payload }) {
//   switch (type) {
//     case ACTIONS.ADD_DIGIT:
      

//       return {
//         ...state,
//         currentOperand: `${state.currentOperand || ""}${payload.digit}`,
//       }
    
//   }
// }


// function App() {
//   const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
//     reducer,
//     {}
//   )

//   return (
//     <div className="calculator-grid">
//       <div className="output">
//         <div className="previous-operand">
//           {previousOperand} {operation}
//         </div>
//         <div className="current-operand">{currentOperand}</div>
//       </div>
//       <button
//         className="span-two"
        
//       >
//         AC
//       </button>
//       <button >
//         DEL
//       </button>
//       <OperationButton operation="÷" dispatch={dispatch} />
//       <DigitButton digit="1" dispatch={dispatch} />
//       <DigitButton digit="2" dispatch={dispatch} />
//       <DigitButton digit="3" dispatch={dispatch} />
//       <OperationButton operation="*" dispatch={dispatch} />
//       <DigitButton digit="4" dispatch={dispatch} />
//       <DigitButton digit="5" dispatch={dispatch} />
//       <DigitButton digit="6" dispatch={dispatch} />
//       <OperationButton operation="+" dispatch={dispatch} />
//       <DigitButton digit="7" dispatch={dispatch} />
//       <DigitButton digit="8" dispatch={dispatch} />
//       <DigitButton digit="9" dispatch={dispatch} />
//       <OperationButton operation="-" dispatch={dispatch} />
//       <DigitButton digit="." dispatch={dispatch} />
//       <DigitButton digit="0" dispatch={dispatch} />
//       <button
//         className="span-two" 
//       >
//         =
//       </button>
//     </div>
//   )
// }

// export default App