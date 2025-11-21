import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createApiClient } from './infrastructure/http/ApiClient.js'
import { createExternalFileRepository } from './infrastructure/repositories/ExternalFileRepository.js'
import { createGetFilesDataUseCase } from './application/use-cases/GetFilesData.js'
import { createFileController } from './presentation/controllers/FileController.js'
import { createFileRoutes } from './presentation/routes/fileRoutes.js'

const API_BASE_URL = 'https://echo-serv.tbxnet.com'
const API_KEY = 'Bearer aSuperSecretKey'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, '../dist')

const apiClient = createApiClient(API_BASE_URL, API_KEY)
const fileRepository = createExternalFileRepository(apiClient)
const getFilesDataUseCase = createGetFilesDataUseCase(fileRepository)
const fileController = createFileController(getFilesDataUseCase)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/', createFileRoutes(fileController))

app.use(express.static(distPath))

app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
