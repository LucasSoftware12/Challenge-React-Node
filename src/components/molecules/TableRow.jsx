import TableCell from '../atoms/TableCell'

export default function TableRow ({ data, isHeader = false }) {
  return (
    <tr className={isHeader ? 'bg-light' : ''}>
      {data.map((cell, index) => (
        <TableCell key={index} isHeader={isHeader}>
          {cell}
        </TableCell>
      ))}
    </tr>
  )
}
