import Text from '../atoms/Text'

export default function Header ({ title }) {
  return (
    <div className='bg-danger p-3'>
      <div className='container'>
        <Text variant='heading'>{title}</Text>
      </div>
    </div>
  )
}
