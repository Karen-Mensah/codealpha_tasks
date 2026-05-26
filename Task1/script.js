// Select display elements
const previousOperation = document.getElementById("previous-operation");
const currentOperation = document.getElementById("current-operation");

// Select all buttons
const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");
const clearButton = document.querySelector(".btn-clear");
const deleteButton = document.querySelector(".btn-delete");
const equalButton = document.querySelector(".btn-equal");

// Variables
let currentInput = "0";
let previousInput = "";
let operator = null;

// Update display
function updateDisplay() {
  currentOperation.innerText = currentInput;

  if (operator !== null) {
    previousOperation.innerText = `${previousInput} ${operator}`;
  } else {
    previousOperation.innerText = "";
  }
}

// Add numbers
numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    // Prevent multiple dots
    if (value === "." && currentInput.includes(".")) return;

    // Replace 0 with first number
    if (currentInput === "0" && value !== ".") {
      currentInput = value;
    } else {
      currentInput += value;
    }

    updateDisplay();
  });
});

// Operators
operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    // Prevent operator without number
    if (currentInput === "") return;

    // If already has operation, calculate first
    if (previousInput !== "") {
      calculate();
    }

    operator = value;
    previousInput = currentInput;
    currentInput = "";

    updateDisplay();
  });
});

// Calculate result
function calculate() {
  let result;

  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operator) {
    case "+":
      result = prev + current;
      break;

    case "-":
      result = prev - current;
      break;

    case "*":
      result = prev * current;
      break;

    case "/":
      result = current === 0 ? "Error" : prev / current;
      break;

    default:
      return;
  }

  currentInput = result.toString();
  operator = null;
  previousInput = "";

  updateDisplay();
}

// Equal button
equalButton.addEventListener("click", () => {
  calculate();
});

// Clear button
clearButton.addEventListener("click", () => {
  currentInput = "0";
  previousInput = "";
  operator = null;

  updateDisplay();
});

// Delete button
deleteButton.addEventListener("click", () => {
  currentInput = currentInput.toString().slice(0, -1);

  if (currentInput === "") {
    currentInput = "0";
  }

  updateDisplay();
});

// Initial display
updateDisplay();