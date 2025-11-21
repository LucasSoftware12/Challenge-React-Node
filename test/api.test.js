/* eslint-disable no-unused-expressions */
/* eslint no-unused-expressions: 0 */

import app from '../server/index.js'
import { expect } from 'chai'
import { it, describe } from 'mocha'

describe('API Tests', function () {
  this.timeout(30000)

  describe('GET /files/data', function () {
    it('should return an array', async function () {
      const PORT = 3001
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files/data`)
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array')
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })

    it('should return files with correct structure', async function () {
      const PORT = 3002
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files/data`)
        const data = await response.json()

        expect(response.status).to.equal(200)

        if (data.length > 0) {
          const firstFile = data[0]

          expect(firstFile).to.have.property('file')
          expect(firstFile).to.have.property('lines')
          expect(firstFile.lines).to.be.an('array')

          if (firstFile.lines.length > 0) {
            const firstLine = firstFile.lines[0]

            expect(firstLine).to.have.property('text')
            expect(firstLine).to.have.property('number')
            expect(firstLine).to.have.property('hex')

            expect(firstLine.text).to.be.a('string')
            expect(firstLine.number).to.be.a('number')
            expect(firstLine.hex).to.be.a('string')

            expect(firstLine.hex).to.match(/^[0-9a-f]{32}$/)
          }
        }
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })

    it('should handle empty files gracefully', async function () {
      const PORT = 3003
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files/data`)
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array')

        const emptyFiles = data.filter((file) => file.lines.length === 0)

        emptyFiles.forEach((file) => {
          expect(file).to.have.property('file')
          expect(file).to.have.property('lines')
          expect(file.lines).to.be.an('array')
          expect(file.lines).to.have.lengthOf(0)
        })
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })

    it('should return content-type application/json', async function () {
      const PORT = 3004
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files/data`)
        const contentType = response.headers.get('content-type')

        expect(response.status).to.equal(200)
        expect(contentType).to.include('application/json')
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })

    it('should filter by fileName query parameter', async function () {
      const PORT = 3005
      const server = app.listen(PORT)

      try {
        const allResponse = await fetch(`http://localhost:${PORT}/files/data`)
        const allData = await allResponse.json()

        if (allData.length > 0) {
          const targetFile = allData[0].file

          const filteredResponse = await fetch(`http://localhost:${PORT}/files/data?fileName=${targetFile}`)
          const filteredData = await filteredResponse.json()

          expect(filteredResponse.status).to.equal(200)
          expect(filteredData).to.be.an('array')

          filteredData.forEach((file) => {
            expect(file.file).to.equal(targetFile)
          })
        }
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })

    it('should parse numbers correctly as integers', async function () {
      const PORT = 3006
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files/data`)
        const data = await response.json()

        expect(response.status).to.equal(200)

        const fileWithLines = data.find((file) => file.lines.length > 0)

        if (fileWithLines) {
          fileWithLines.lines.forEach((line) => {
            expect(line.number).to.be.a('number')

            expect(Number.isInteger(line.number)).to.be.true
          })
        }
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })

    it('should normalize hex values to lowercase', async function () {
      const PORT = 3007
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files/data`)
        const data = await response.json()

        expect(response.status).to.equal(200)

        const fileWithLines = data.find((file) => file.lines.length > 0)

        if (fileWithLines) {
          fileWithLines.lines.forEach((line) => {
            expect(line.hex).to.equal(line.hex.toLowerCase())

            expect(line.hex).to.have.lengthOf(32)

            expect(line.hex).to.match(/^[0-9a-f]+$/)
          })
        }
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })
  })

  describe('GET /files', function () {
    it('should return an array of file names', async function () {
      const PORT = 3008
      const server = app.listen(PORT)

      try {
        const response = await fetch(`http://localhost:${PORT}/files`)
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array')

        data.forEach((fileName) => {
          expect(fileName).to.be.a('string')
          expect(fileName).to.not.be.empty
        })
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    })
  })
})
