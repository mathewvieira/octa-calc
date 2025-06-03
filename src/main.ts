import './style.css'

import { type BasesDict } from './helpers.ts'
import { type NumberBaseName } from './converter.ts'

import { createButton, createDiv } from './helpers.ts'
import { convertToAllBases } from './converter.ts'

/* Estrutura -> Geração */
const app = document.querySelector<HTMLDivElement>('#app')!

const modelNameDiv = createDiv('model-name')

const displayDiv = createDiv('display')
const displayScreenDiv = createDiv('display-screen')

const screenCalculationsDiv = createDiv('screen-calculations')
const screenBasesDiv = createDiv('screen-bases')

const screenCalculationsSecondaryDiv = createDiv('screen-calculations-secondary')
const screenCalculationsResultDiv = createDiv('screen-calculations-result')

const screenBasesReferencesDiv = createDiv('screen-bases-references')
const screenBasesResultsDiv = createDiv('screen-bases-results')
const screenBasesCursorDiv = createDiv('screen-bases-cursor')

const screenHexDiv = createDiv('screen-hex')
const screenDecDiv = createDiv('screen-dec')
const screenOctDiv = createDiv('screen-oct')
const screenBinDiv = createDiv('screen-bin')

const basesDiv = createDiv('bases')
const baseHexButton = createButton('hex')
const baseDecButton = createButton('dec')
const baseOctButton = createButton('oct')
const baseBinButton = createButton('bin')

const symbolsDiv = createDiv('symbols')

/* Estrutura -> Organização */
app.append(modelNameDiv)
app.append(displayDiv)
app.append(basesDiv)
app.append(symbolsDiv)

displayDiv.append(displayScreenDiv)

displayScreenDiv.append(screenCalculationsDiv)
displayScreenDiv.append(screenBasesDiv)

screenCalculationsDiv.append(screenCalculationsSecondaryDiv)
screenCalculationsDiv.append(screenCalculationsResultDiv)

screenBasesDiv.append(screenBasesReferencesDiv)
screenBasesDiv.append(screenBasesResultsDiv)
screenBasesDiv.append(screenBasesCursorDiv)

screenBasesResultsDiv.append(screenHexDiv)
screenBasesResultsDiv.append(screenDecDiv)
screenBasesResultsDiv.append(screenOctDiv)
screenBasesResultsDiv.append(screenBinDiv)

basesDiv.append(baseHexButton)
basesDiv.append(baseDecButton)
basesDiv.append(baseOctButton)
basesDiv.append(baseBinButton)

const symbols = [
  ['A', '<<', '>>', 'Clear', '⌫'],
  ['B', '(', ')', '%', '÷'],
  ['C', '7', '8', '9', 'x'],
  ['D', '4', '5', '6', '-'],
  ['E', '1', '2', '3', '+'],
  ['F', '±', '0', ',', '=']
]

for (let symbol of symbols.flat()) {
  symbolsDiv.append(createButton(symbol))
}

/* Estrutura -> Add. Informações */
modelNameDiv.textContent = 'OCTA-CALC-BR01'

screenCalculationsSecondaryDiv.innerHTML = '0'
screenCalculationsResultDiv.innerHTML = '0'

screenBasesReferencesDiv.innerHTML = `
  <div>HEX</div>
  <div>DEC</div>
  <div>OCT</div>
  <div>BIN</div>
`

screenHexDiv.textContent = '0'
screenDecDiv.textContent = '0'
screenOctDiv.textContent = '0'
screenBinDiv.textContent = '0'

screenBasesCursorDiv.innerHTML = `
  <br />
  < <br />
  <br />
  <br />
`

baseDecButton.classList.add('active')

/* Estrutura -> Helpers */
let screenBaseSelected = screenDecDiv
let baseSelected = baseDecButton

const basesNames = ['hex', 'dec', 'oct', 'bin']

const basesDict: BasesDict = {
  hex: [baseHexButton, screenHexDiv],
  dec: [baseDecButton, screenDecDiv],
  oct: [baseOctButton, screenOctDiv],
  bin: [baseBinButton, screenBinDiv]
}

const clearLastDigit = (key: string, baseSelected: HTMLDivElement) => {
  if (key !== '⌫') return

  if (baseSelected.textContent!.length === 1) {
    baseSelected.textContent = '0'
    screenCalculationsResultDiv.textContent = baseSelected.textContent
  }

  if (baseSelected.textContent !== '0') {
    baseSelected.textContent = baseSelected.textContent!.slice(0, -1)
    screenCalculationsResultDiv.textContent = baseSelected.textContent
  }
}

const clearAll = (key: string, fillWithZeros: boolean = true) => {
  if (key !== 'Clear') return

  const value = fillWithZeros ? '0' : ''

  screenCalculationsSecondaryDiv.textContent = value
  screenCalculationsResultDiv.textContent = value

  screenHexDiv.textContent = value
  screenDecDiv.textContent = value
  screenOctDiv.textContent = value
  screenBinDiv.textContent = value
}

const setKeysLayout = (base: string = 'dec') => {
  const buttons = app.querySelectorAll('button')

  let keysToDisable = new Set(['<<', '>>', '(', ')', '%', '±', ','])

  if (base !== 'hex') ['A', 'B', 'C', 'D', 'E', 'F'].forEach(keysToDisable.add, keysToDisable)
  if (base === 'bin') ['2', '3', '4', '5', '6', '7', '8', '9'].forEach(keysToDisable.add, keysToDisable)
  if (base === 'oct') ['8', '9'].forEach(keysToDisable.add, keysToDisable)

  buttons.forEach((button) => {
    button.disabled = keysToDisable.has(button.textContent!.trim())
  })
}

const isButton = (target: HTMLElement) => {
  return target && target.tagName === 'BUTTON'
}

const isBase = (key: string) => {
  return basesNames.includes(key)
}

const isNumber = (key: string) => {
  return /^\d$/.test(key)
}

const isLetter = (key: string) => {
  return /^[A-F]$/.test(key)
}

const isOperation = (key: string) => {
  return ['÷', 'x', '-', '+'].includes(key)
}

const isCalc = (key: string) => {
  return key === '='
}

const isHexa = (base: string, key: string) => {
  return base === 'hex' && (isLetter(key) || isNumber(key))
}

const isDecimal = (base: string, key: string) => {
  return base === 'dec' && isNumber(key)
}

const isOctal = (base: string, key: string) => {
  return base === 'oct' && /^[0-7]$/.test(key)
}

const isBinary = (base: string, key: string) => {
  return base === 'bin' && /^[0-1]$/.test(key)
}

const writeScreen = (key: string, baseSelected: HTMLDivElement, base: string = 'dec') => {
  if (isOperation(key) && screenCalculationsResultDiv.textContent !== '0') {
    let expression = screenCalculationsSecondaryDiv.textContent

    screenCalculationsSecondaryDiv.textContent = `
      ${expression === '0' ? '' : expression}
      ${screenCalculationsResultDiv.textContent} ${key}
    `

    screenCalculationsResultDiv.textContent = '0'
    screenHexDiv.textContent = '0'
    screenDecDiv.textContent = '0'
    screenOctDiv.textContent = '0'
    screenBinDiv.textContent = '0'

    return
  }

  if (isCalc(key) && screenCalculationsSecondaryDiv.textContent !== '0') {
    let expression = `
      ${screenCalculationsSecondaryDiv.textContent}
      ${screenCalculationsResultDiv.textContent}
    `

    expression = expression.replace('÷', '/').replace('x', '*')

    // ! TO DO: eval to hex, oct, bin
    const result = eval(expression)

    screenCalculationsSecondaryDiv.textContent = '0'
    screenCalculationsResultDiv.textContent = result
    screenHexDiv.textContent = result
    screenDecDiv.textContent = result
    screenOctDiv.textContent = result
    screenBinDiv.textContent = result

    return
  }

  if (isHexa(base, key) || isDecimal(base, key) || isOctal(base, key) || isBinary(base, key)) {
    if (baseSelected.textContent === '0') {
      baseSelected.textContent = key
      screenCalculationsResultDiv.textContent = key
      return
    }

    if (baseSelected.textContent!.length < 12) {
      baseSelected.textContent += key
      screenCalculationsResultDiv.textContent += key
    }
  }
}

const removeAllClassActive = (basesDiv: HTMLDivElement) => {
  basesDiv.querySelectorAll('.active').forEach((el) => el.classList.remove('active'))
}

const changeBase = (key: string) => {
  if (isBase(key)) {
    removeAllClassActive(basesDiv)
    baseSelected = basesDict[key][0]
    baseSelected.classList.add('active')
    screenBaseSelected = basesDict[key][1]
    screenCalculationsResultDiv.textContent = screenBaseSelected.textContent
    setKeysLayout(baseSelected.textContent!)
  }
}

const changeCursorPosition = (base: string) => {
  screenBasesCursorDiv.innerHTML = `
    ${base === 'hex' ? '<' : ''} <br />
    ${base === 'dec' ? '<' : ''} <br />
    ${base === 'oct' ? '<' : ''} <br />
    ${base === 'bin' ? '<' : ''} <br />
  `
}

window.onload = () => setKeysLayout('dec')

app.onclick = (e) => {
  if (!isButton(e.target as HTMLElement)) return

  const key = (e.target as HTMLElement).textContent!

  changeBase(key)
  changeCursorPosition(baseSelected.textContent!)
  writeScreen(key, screenBaseSelected, baseSelected.textContent!)
  clearLastDigit(key, screenBaseSelected)
  clearAll(key)

  const bases = convertToAllBases(screenBaseSelected.textContent!, baseSelected.textContent as NumberBaseName)

  screenHexDiv.textContent = bases.hex
  screenDecDiv.textContent = bases.dec
  screenOctDiv.textContent = bases.oct
  screenBinDiv.textContent = bases.bin
}
