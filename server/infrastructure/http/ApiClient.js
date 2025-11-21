export const createApiClient = (baseURL, apiKey) => {
  const get = async (endpoint) => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      headers: {
        authorization: apiKey
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  }

  return { get }
}
