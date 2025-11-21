import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFilesList = createAsyncThunk('files/fetchFilesList', async () => {
  const response = await fetch('http://localhost:3000/files')

  if (!response.ok) throw new Error('Failed to fetch files list')

  return response.json()
})

export const fetchFilesData = createAsyncThunk('files/fetchFilesData', async (fileName = '') => {
  const url = fileName ? `http://localhost:3000/files/data?fileName=${fileName}` : 'http://localhost:3000/files/data'

  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch files data')
  return response.json()
})

const filesSlice = createSlice({
  name: 'files',

  initialState: {
    files: [],
    data: [],
    loading: false,
    error: null,
    selectedFileName: ''
  },

  reducers: {
    setSelectedFileName: (state, action) => {
      state.selectedFileName = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesList.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchFilesList.fulfilled, (state, action) => {
        state.loading = false
        state.files = action.payload
      })

      .addCase(fetchFilesList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(fetchFilesData.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchFilesData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })

      .addCase(fetchFilesData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { setSelectedFileName } = filesSlice.actions

export default filesSlice.reducer
