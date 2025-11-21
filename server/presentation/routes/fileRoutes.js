import express from 'express'

export const createFileRoutes = (fileController) => {
  const router = express.Router()

  router.get('/files', fileController.getFiles)

  router.get('/files/data', fileController.getFilesData)

  return router
}
