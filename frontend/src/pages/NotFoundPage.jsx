import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Code2, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — Cenovie</title></Helmet>
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Code2 className="w-8 h-8 text-gold-500" />
          </div>
          <p className="text-8xl font-bold text-white/10 mb-2 font-display">404</p>
          <h2 className="font-display font-bold text-white text-2xl mb-3">Page not found</h2>
          <p className="text-white/40 mb-8">This route doesn't exist — but the rest of our stack does.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary"><Home className="w-4 h-4" /> Back to Home</Link>
            <button onClick={() => window.history.back()} className="btn-outline-white"><ArrowLeft className="w-4 h-4" /> Go Back</button>
          </div>
        </div>
      </div>
    </>
  )
}
