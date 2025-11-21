export const createFileController = (getFilesDataUseCase) => {
  const getFiles = async (req, res) => {
    try {
      const data = await getFilesDataUseCase.execute()

      const fileNames = data.map((file) => file.file)

      res.json(fileNames)
    } catch (error) {
      console.error('Error in FileController:', error)

      res.status(500).json({ error: 'Internal server error' })
    }
  }

  const getFilesData = async (req, res) => {
    try {
      const { fileName } = req.query

      const data = await getFilesDataUseCase.execute()

      if (fileName) {
        const filtered = data.filter((file) => file.file === fileName)
        res.json(filtered)
      } else {
        res.json(data)
      }
    } catch (error) {
      console.error('Error in FileController:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  return { getFiles, getFilesData }
}
