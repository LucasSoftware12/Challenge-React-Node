export default function Spinner ({ size = 'md' }) {
  return (
    <div className='text-center p-5'>
      <div className={`spinner-border text-primary ${size === 'lg' ? 'spinner-border-lg' : ''}`} role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}
