import Spinner from '../atoms/Spinner'
import Text from '../atoms/Text'

export default function LoadingState ({ message = 'Loading data...' }) {
  return (
    <div className='text-center py-5'>
      <Spinner />
      <Text className='mt-2'>{message}</Text>
    </div>
  )
}
