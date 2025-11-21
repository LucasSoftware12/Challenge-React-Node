export default function Alert ({ message, variant = 'danger' }) {
  return (
    <div className={`alert alert-${variant}`} role='alert'>
      {variant === 'danger' && <strong>Error: </strong>}
      {message}
    </div>
  )
}
