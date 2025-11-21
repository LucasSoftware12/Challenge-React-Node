import { Container } from 'react-bootstrap'
import Header from '../molecules/Header'

export default function MainLayout ({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header title='React Test App' />
      <Container style={{ marginTop: '30px', marginBottom: '30px' }}>{children}</Container>
    </div>
  )
}
