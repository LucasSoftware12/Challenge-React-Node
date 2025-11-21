import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'
import { setSelectedFileName } from '../../store/filesSlice'

export default function FileFilter ({ files }) {
  const dispatch = useDispatch()
  const selectedFileName = useSelector((state) => state.files.selectedFileName)

  const handleFileChange = (event) => {
    const value = event.target.value
    dispatch(setSelectedFileName(value === '' ? '' : value))
  }

  return (
    <div className='mb-4'>
      <Form.Group>
        <Form.Label>
          <strong>Filter by File:</strong>
        </Form.Label>
        <Form.Select
          value={selectedFileName || ''}
          onChange={handleFileChange}
          aria-label='Select file to filter'
        >
          <option value=''>All Files</option>
          {files.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  )
}
