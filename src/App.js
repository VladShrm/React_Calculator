import './App.css';

import { useState } from 'react';
import Button from './Button';

const buttons = [
  "AC", "+/-", "%", "÷",
  "7", "8", "9", "x",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "="];

function App() {

  // You can use this to maintain the calculator buffer
  const [calcBuffer, setCalcBuffer] = useState([]);
  const [display, setDisplay] = useState("0");
  const [lastInput, setLastInput] = useState(null);
  const [firstInput, setFirstInput] = useState(true);

  // Handle button clicks here
  function handleClick(value) {
    if (value === "AC") {
      resetCalculator();
    } else if (value === "+/-") {
      toggleSign();
    } else if (value === "=") {
      calculateResult();
    } else if (value === "%") {
      handlePercent();
    } else if (["+", "-", "x", "÷"].includes(value)) {
      handleOperator(value);
    } else {
      handleDigit(value);
    }
  }

  function resetCalculator() {
    setDisplay("0");
    setCalcBuffer([]);
    setLastInput(null);
    setFirstInput(true);
  }

  function toggleSign() {
    if (!isNaN(lastInput) && display[display.length - 1] !== "0") {
      const newValue = parseFloat(display[display.length - 1]) * -1;
      const newDisplay = [...display.slice(0, display.length - 1), newValue];
      setDisplay(newDisplay);

      const newBuffer = calcBuffer.slice();
      newBuffer[newBuffer.length - 1] = newValue.toString();

      setCalcBuffer(newBuffer);
    }
  }

  function handleDigit(value) {
    if (value === "." && display[display.length - 1].includes(".")) return;
    if (value === "." && calcBuffer.length >= 2 && calcBuffer[calcBuffer.length - 2].includes(".")) return;
    if (firstInput && value === "0" && display[display.length - 1].includes("0")) return;

    if (value === "." && display === "0") {
      setDisplay("0.");
      setCalcBuffer([ "0." ]);
      setLastInput(".");
      setFirstInput(false);
      return;
    }

    if (lastInput === "=") {
      setDisplay(value);
      setCalcBuffer([value]);
      setLastInput(value);
      setFirstInput(false);
      return;
    }

    const lastValue = calcBuffer[calcBuffer.length - 1];

    const newDisplay = (isNaN(lastValue) || lastValue === "=" || lastValue === undefined)
        ? value
        : lastValue + value;

    const newBuffer = (isNaN(lastInput) || lastInput === "=")
        ? [...calcBuffer, value]
        : [...calcBuffer.slice(0, -1), newDisplay];

    setCalcBuffer(newBuffer);
    updateDisplay(newBuffer);
    setLastInput(value);
    setFirstInput(false);
  }

  function handleOperator(value) {
    if (firstInput) return;

    if (["+", "-", "x", "÷"].includes(lastInput)) {
      const newBuffer = [...calcBuffer.slice(0, -1), value];
      setCalcBuffer(newBuffer);
      updateDisplay(newBuffer);
      setLastInput(value);
    } else {
      const newBuffer = [...calcBuffer, value];
      setCalcBuffer(newBuffer);
      updateDisplay(newBuffer);
      setLastInput(value);
    }
  }

  function handlePercent() {
    if (calcBuffer.length > 0) {
      const lastValue = calcBuffer[calcBuffer.length - 1];
      if (!isNaN(lastValue)) {
        const result = parseFloat(lastValue) / 100;
        const newBuffer = [...calcBuffer.slice(0, -1), result.toString()];
        setCalcBuffer(newBuffer);
        updateDisplay(newBuffer);
        setLastInput(result.toString());
      }
    }
  }

  function calculateResult() {
    if (!calcBuffer.length) return;

    let expression = calcBuffer.join("")
        .replace("x", "*")
        .replace("÷", "/")
        .replace("--","+")

    try {
      let result = eval(expression);
      result = result % 1 !== 0 ? result.toFixed(2) : result;
      setDisplay(result.toString());
      setCalcBuffer([result.toString()]);
      setLastInput("=");
      setFirstInput(true);
    } catch {
      setDisplay("Error");
      setCalcBuffer([]);
    }
  }

  function updateDisplay(buffer) {
    const displayString = buffer.join("");
    if (displayString.length > 20) {
      setDisplay("Too long expression");
    } else {
      setDisplay(displayString);
    }
  }

  return (
    <div className="App">
      <div>
        <header className="App-header">
          <h1>Calculator</h1>
        </header>
      </div>
      <main className="calculator">
        <div className="display">{display}</div>
        <div className="keypad">
          {buttons.map((button, index) => {
            return <Button key={index} label={button} handleClick={()=>handleClick(button)} />
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
