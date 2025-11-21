export default function TableCell ({ children, isHeader = false }) {
  const Component = isHeader ? 'th' : 'td'

  return <Component>{children}</Component>
}
