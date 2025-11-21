import { createFileData, createFileLine } from '../../domain/entities/FileData.js'

const parseCSVLine = (line) => {
  const parts = line.split(',')

  if (parts.length < 4) {
    return null
  }

  const [, text, number, hex] = parts

  if (!text || !number || !hex) {
    return null
  }

  try {
    return createFileLine(text, number, hex)
  } catch (error) {
    return null
  }
}

const processCSVContent = (fileName, content) => {
  if (!content || content.trim() === '') {
    return createFileData(fileName)
  }

  const lines = content.split('\n')

  const parsedLines = lines
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map(parseCSVLine)
    .filter((line) => line !== null)

  return createFileData(fileName, parsedLines)
}

export const createGetFilesDataUseCase = (fileRepository) => {
  const execute = async () => {
    const filesList = await fileRepository.getFilesList()

    const fileDataPromises = filesList.map(async (fileName) => {
      const content = await fileRepository.getFileContent(fileName)
      return content !== null ? processCSVContent(fileName, content) : null
    })

    const results = await Promise.all(fileDataPromises)

    return results.filter((result) => result !== null)
  }

  return { execute }
}
