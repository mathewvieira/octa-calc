export type NumberBase = 2 | 8 | 10 | 16
export type NumberBaseName = 'bin' | 'oct' | 'dec' | 'hex'
export type NumberInput = string | number

class BaseConverter {
  private readonly value: number

  constructor(value: NumberInput, fromBase: NumberBaseName | NumberBase = 10) {
    this.value = parseInt(value.toString(), normalizeBase(fromBase))

    if (isNaN(this.value)) {
      throw new Error(`Valor Inválido: ${value} p/ base ${fromBase}`)
    }
  }

  toDec(): string {
    return this.value.toString(10)
  }

  toHex(): string {
    return this.value.toString(16).toUpperCase()
  }

  toOct(): string {
    return this.value.toString(8)
  }

  toBin(): string {
    return this.value.toString(2)
  }

  toBase(base: NumberBase): string {
    const result = this.value.toString(base)
    return base === 16 ? result.toUpperCase() : result
  }
}

export interface ConversionResult {
  dec: string
  hex: string
  oct: string
  bin: string
}

export function convertToAllBases(value: NumberInput, fromBase: NumberBaseName | NumberBase = 10): ConversionResult {
  const converter = new BaseConverter(value, fromBase)

  return {
    dec: converter.toDec(),
    hex: converter.toHex(),
    oct: converter.toOct(),
    bin: converter.toBin()
  }
}

export function normalizeBase(base: NumberBaseName | NumberBase): NumberBase {
  if (typeof base === 'number') return base

  const baseMap: Record<NumberBaseName, NumberBase> = {
    bin: 2,
    oct: 8,
    dec: 10,
    hex: 16
  }

  return baseMap[base]
}
