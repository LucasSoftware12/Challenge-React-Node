export const createExternalFileRepository = (apiClient) => {
  const getFilesList = async () => {
    try {
      const response = await apiClient.get('/v1/secret/files')

      const data = await response.json()

      return data.files || []
    } catch (error) {
      throw new Error('Failed to fetch files list')
    }
  }

  const getFileContent = async (fileName) => {
    try {
      const response = await apiClient.get(`/v1/secret/file/${fileName}`)

      const content = await response.text()

      return content
    } catch (error) {
      return null
    }
  }

  return {
    getFilesList,
    getFileContent
  }
}
