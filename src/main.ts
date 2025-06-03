import './style.css'

import { type BasesDict } from './helpers.ts'
import { type ConversionResult, type NumberBaseName } from './converter.ts'

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

const clearAll = (key: string) => {
  if (key !== 'Clear') return

  screenCalculationsSecondaryDiv.innerHTML = '&nbsp;'
  screenCalculationsResultDiv.innerHTML = '0'
  resetScreenBases()
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

const isBase = (value: string) => {
  return basesNames.includes(value)
}

const isNumber = (value: string) => {
  return /^\d+$/.test(value)
}

const isLetter = (value: string) => {
  return /^[A-F]+$/.test(value)
}

const isOperation = (value: string) => {
  return ['÷', 'x', '-', '+'].includes(value)
}

const isCalc = (value: string) => {
  return value === '='
}

const isHexa = (value: string, base: string = 'hex') => {
  return base === 'hex' && (isLetter(value) || isNumber(value))
}

const isDecimal = (value: string, base: string = 'dec') => {
  return base === 'dec' && isNumber(value)
}

const isOctal = (value: string, base: string = 'oct') => {
  return base === 'oct' && /^[0-7]+$/.test(value)
}

const isBinary = (value: string, base: string = 'bin') => {
  return base === 'bin' && /^[01]+$/.test(value)
}

function convertToDecimal(numStr: string) {
  return parseInt(numStr.trim().toUpperCase(), 10)
}

const getRightResultBase = (bases: ConversionResult, selectedBase: string) => {
  if (selectedBase === 'hex') {
    return bases.hex
  }

  if (selectedBase === 'oct') {
    return bases.oct
  }

  if (selectedBase === 'bin') {
    return bases.bin
  }

  return bases.dec
}

const fillScreenBases = (bases: ConversionResult) => {
  screenHexDiv.innerHTML = bases.hex
  screenDecDiv.innerHTML = bases.dec
  screenOctDiv.innerHTML = bases.oct
  screenBinDiv.innerHTML = bases.bin
}

const resetScreenBases = () => {
  screenHexDiv.innerHTML = '0'
  screenDecDiv.innerHTML = '0'
  screenOctDiv.innerHTML = '0'
  screenBinDiv.innerHTML = '0'
}

const writeScreen = (key: string, screenValue: HTMLDivElement, base: string = 'dec') => {
  if (isOperation(key) && screenCalculationsResultDiv.textContent !== '0') {
    let expression = screenCalculationsSecondaryDiv.textContent

    screenCalculationsSecondaryDiv.textContent = `
      ${expression === '0' ? '' : expression}
      ${screenCalculationsResultDiv.textContent} ${key}
    `

    screenCalculationsResultDiv.textContent = '0'
    resetScreenBases()

    return
  }

  if (isCalc(key) && !['0', '&nbsp;'].includes(screenCalculationsSecondaryDiv.textContent!)) {
    let expression = `
      ${screenCalculationsSecondaryDiv.textContent}
      ${screenCalculationsResultDiv.textContent}
    `

    expression = expression.replace('÷', '/').replace('x', '*').trim()

    expression = expression.replace(/[0-9A-F]+/gi, (match) => {
      return convertToDecimal(match).toString()
    })

    const bases = convertToAllBases(eval(expression), 'dec')

    screenCalculationsSecondaryDiv.innerHTML = '&nbsp;'
    screenCalculationsResultDiv.textContent = getRightResultBase(bases, baseSelected.textContent!)
    fillScreenBases(bases)

    return
  }

  if (isHexa(key, base) || isDecimal(key, base) || isOctal(key, base) || isBinary(key, base)) {
    if (screenValue.textContent === '0') {
      screenValue.textContent = key
      screenCalculationsResultDiv.textContent = key
      return
    }

    if (screenValue.textContent!.length < 12) {
      screenValue.textContent += key
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
    screenCalculationsSecondaryDiv.innerHTML = '&nbsp;'
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

window.onload = () => {
  modelNameDiv.textContent = 'OCTA-CALC-BR01'

  screenCalculationsSecondaryDiv.innerHTML = '&nbsp;'
  screenCalculationsResultDiv.innerHTML = '0'

  screenBasesReferencesDiv.innerHTML = `
    <div>HEX</div>
    <div>DEC</div>
    <div>OCT</div>
    <div>BIN</div>
  `

  resetScreenBases()

  screenBasesCursorDiv.innerHTML = `
  <br />
  < <br />
  <br />
  <br />
  `

  baseDecButton.classList.add('active')

  setKeysLayout('dec')
}

app.onclick = (e) => {
  if (!isButton(e.target as HTMLElement)) return

  const key = (e.target as HTMLElement).textContent!

  changeBase(key)
  changeCursorPosition(baseSelected.textContent!)
  writeScreen(key, screenBaseSelected, baseSelected.textContent!)
  clearLastDigit(key, screenBaseSelected)
  clearAll(key)

  const bases = convertToAllBases(screenBaseSelected.textContent!, baseSelected.textContent as NumberBaseName)

  fillScreenBases(bases)
}
