const currentDisplayEl = document.querySelector('.display__current');
const previousDisplayEl = document.querySelector('.display__previous');
const numberButtonEl = document.querySelectorAll('.number');
const operatorButtonEl = document.querySelectorAll('.operator');
const dotButtonEl = document.querySelector('.dot');
const clearEntityButtonEl = document.querySelector('.clearEntity');
const allClearButtonEl = document.querySelector('.allClear');
const root = document.documentElement;

let currentOperand = '';
let previousOperand = '';
let previousOperator = '';
let result = null;

numberButtonEl.forEach(number => {
  number.addEventListener('click', e => {
    if (currentOperand === '0') {
      currentOperand = e.target.innerText;
    } else {
      currentOperand += e.target.innerText;
    }
    if (currentOperand.length > 16) return
    currentDisplayEl.innerText = formatNumber(currentOperand);
  })
})

dotButtonEl.addEventListener('click', () => {
  if (currentOperand.includes('.')) return;
  currentOperand += '.';
  currentDisplayEl.innerText = currentOperand;
})

operatorButtonEl.forEach(operator => {
  operator.addEventListener('click', e => {
    if (!currentOperand || currentOperand === '0') return;
    const presentOperator = e.target.innerText;
    currentDisplayEl.innerText = `${currentOperand} ${previousOperator}`;
    if (currentOperand && previousOperator && previousOperand) {
      calculate();
    } else {
      result = Number(currentOperand);
    }
    updateDisplay(presentOperator);
    previousOperator = presentOperator;
  })
})

function formatNumber(number) {
  const stringNumber = number.toString();
  const integerDigits = Number(stringNumber.split('.')[0]);
  const decimalDigits = stringNumber.split('.')[1];
  let intergerDisplay;
  if (currentOperand.length < 12) {
    root.style.setProperty('--fs-currentDisplay', '1.9rem');
    root.style.setProperty('--fs-previousDisplay', '1.2rem');
  } else if (currentOperand.length > 12) {
    root.style.setProperty('--fs-currentDisplay', '1.5rem');
    root.style.setProperty('--fs-previousDisplay', '1.05rem');
  }
  if (isNaN(integerDigits)) {
    integerDisplay = '';
  } else {
    integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0});
  }
  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}`
  } else {
    return integerDisplay
  }
}

function updateDisplay(operator) {
  if (operator === '=') return;
  previousOperand = `${formatNumber(result)} ${operator}`;
  previousDisplayEl.innerText = previousOperand
  currentOperand = '';
  currentDisplayEl.innerText = '0';
  previousOperator = '';
}

function calculate() {
  if (!previousOperand) return
  switch(previousOperator) {
    case '+': result = Number(result) + Number(currentOperand); break;
    case '-': result = Number(result) - Number(currentOperand); break;
    case 'x': result = Number(result) * Number(currentOperand); break;
    case '÷': result = Number(result) / Number(currentOperand); break;
    case '%': result = Number(result) % Number(currentOperand); break;
  }
}

operatorButtonEl.forEach(operator => {
  if (operator.innerText === '=') {
    operator.addEventListener('click', () => {
      if (!currentOperand && !previousOperand) return;
      calculate();
      updateDisplay();
      currentOperand = formatNumber(result);
      currentDisplayEl.innerText = currentOperand;
      previousOperand = '';
      previousDisplayEl.innerText = previousOperand;
      previousOperator = '';
    })
  };
})

clearEntityButtonEl.addEventListener('click', () => {
  currentOperand = '0';
  currentDisplayEl.innerText = formatNumber(currentOperand);
})

allClearButtonEl.addEventListener('click', () => {
  currentOperand = '';
  currentDisplayEl.innerText = formatNumber('0');
  previousOperand = '';
  previousDisplayEl.innerText = previousOperand;
  previousOperator = '';
  result = '';
})

window.addEventListener('keydown', e => {
  switch(e.key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '.': selectNumber(e.key); break;
    case '+':
    case '-':
    case '=':
    case '%': selectOperator(e.key); break;
    case '/': selectOperator('÷'); break;
    case '*': selectOperator('x'); break;
    case 'Enter': selectOperator('='); break;
    case 'Delete': selectRemove(e.key); break;
    case 'Escape': selectClear(e.key); break;
  }
})

function selectNumber(key) {
  numberButtonEl.forEach(number => {
    if (number.innerText === key) {
      number.click();
      number.classList.add('button-press');
      number.classList.remove('button-press');
    }
  })
}

function selectOperator(key) {
  operatorButtonEl.forEach(operator => {
    if (operator.innerText === key) {
      operator.click();
    }
  })
}

function selectRemove(key) {
  clearEntityButtonEl.click();
}

function selectClear(key) {
 allClearButtonEl.click();
}
