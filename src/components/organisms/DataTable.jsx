import { Table } from 'react-bootstrap'
import TableRow from '../molecules/TableRow'

export default function DataTable ({ data }) {
  const headers = ['File Name', 'Text', 'Number', 'Hex']

  return (
    <Table striped bordered hover responsive>
      <thead>
        <TableRow data={headers} isHeader />
      </thead>
      <tbody>
        {data.map((row, index) => (
          <TableRow key={index} data={[row.fileName, row.text, row.number, row.hex]} />
        ))}
      </tbody>
    </Table>
  )
}
