export default function Text ({ children, variant = 'body', className = '' }) {
  const variants = {
    heading: 'h1 text-white m-0',
    body: 'mb-0',
    error: 'text-danger fw-bold',
    muted: 'text-muted'
  }

  const Component = variant === 'heading' ? 'h1' : 'p'

  return <Component className={`${variants[variant]} ${className}`}>{children}</Component>
}
