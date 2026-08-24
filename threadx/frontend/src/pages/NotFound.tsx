import { Link } from 'react-router-dom'
import Button from '@/components/Button'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-6xl uppercase">404</h1>
      <p className="mt-3 mb-8 text-ink/50">This page doesn't exist.</p>
      <Link to="/"><Button>Back to Home</Button></Link>
    </div>
  )
}
