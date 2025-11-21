export const createFileLine = (text, number, hex) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string')
  }

  const parsedNumber = parseInt(number, 10)

  if (isNaN(parsedNumber)) {
    throw new Error('Number must be a valid integer')
  }

  if (!/^[0-9a-fA-F]{32}$/.test(hex)) {
    throw new Error('Hex must be a 32-character hexadecimal string')
  }

  return {
    text: text.trim(),
    number: parsedNumber,
    hex: hex.trim().toLowerCase()
  }
}

export const createFileData = (fileName, lines = []) => {
  if (!fileName || typeof fileName !== 'string') {
    throw new Error('File name must be a non-empty string')
  }

  return {
    file: fileName,
    lines
  }
}

export const addLineToFile = (fileData, fileLine) => ({
  ...fileData,
  lines: [...fileData.lines, fileLine]
})
