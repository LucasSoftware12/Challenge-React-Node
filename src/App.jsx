import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import MainLayout from './components/templates/MainLayout'
import LoadingState from './components/molecules/LoadingState'
import Alert from './components/molecules/Alert'
import DataTable from './components/organisms/DataTable'
import FileFilter from './components/organisms/FileFilter'
import { fetchFilesList, fetchFilesData } from './store/filesSlice'

function App () {
  const dispatch = useDispatch()

  const { files, data, loading, error, selectedFileName } = useSelector((state) => state.files)

  useEffect(() => {
    dispatch(fetchFilesList())

    dispatch(fetchFilesData())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchFilesData(selectedFileName))
  }, [selectedFileName, dispatch])

  const flattenedData = useMemo(() => {
    const flattened = []

    data.forEach((file) => {
      file.lines.forEach((line) => {
        flattened.push({
          fileName: file.file,
          ...line
        })
      })
    })

    return flattened
  }, [data])

  return (
    <MainLayout>
      <FileFilter files={files} />

      {loading && <LoadingState />}

      {error && <Alert message={error} variant='danger' />}

      {!loading && !error && flattenedData.length === 0 && <Alert message='No data available' variant='info' />}

      {!loading && !error && flattenedData.length > 0 && <DataTable data={flattenedData} />}
    </MainLayout>
  )
}

export default App
