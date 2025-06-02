export const createButton = (text: string): HTMLButtonElement => {
  let button = document.createElement('button')
  button.setAttribute('type', 'button')
  addText(button, text)
  return button
}

export const addText = (element: HTMLElement, text: string): void => {
  const textNode = document.createTextNode(text)
  element.append(textNode)
}

export const createDiv = (id: string) => {
  const div = document.createElement('div')
  div.setAttribute('id', id)
  return div
}

export interface Dictionary<T1, T2> {
  [key: string]: [T1, T2]
}

export type BasesDict = Dictionary<HTMLButtonElement, HTMLDivElement>
