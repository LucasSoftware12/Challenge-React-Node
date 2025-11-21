export const createFileRepository = ({ getFilesList, getFileContent }) => {
  if (typeof getFilesList !== 'function' || typeof getFileContent !== 'function') {
    throw new Error('Repository must implement getFilesList and getFileContent functions')
  }

  return {
    getFilesList,
    getFileContent
  }
}
