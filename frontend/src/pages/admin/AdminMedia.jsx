/**
 * AdminMedia
 *
 * Allows admins to upload images to Cloudinary from the panel
 * and copy the resulting URL for use in project/blog forms.
 *
 * Upload flow: browser → Cloudinary (directly, via signed URL from backend)
 */
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Copy, Check, Trash2, ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mediaAPI } from '../../services/api'
import ImageUploader from '../../components/ui/ImageUploader'

function MediaCard({ item, onDelete }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(item.url)
    setCopied(true)
    toast.success('URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
      <div className="aspect-video overflow-hidden bg-white">
        <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3 space-y-2">
        <p className="text-slate-500 text-xs truncate font-mono">{item.publicId}</p>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-50 text-brand-600 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button
            onClick={() => onDelete(item.publicId)}
            className="p-1.5 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors"
            title="Delete from Cloudinary"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminMedia() {
  // Session-only gallery — persists while the page is open
  const [uploads, setUploads] = useState([])

  const handleUpload = ({ url, publicId }) => {
    setUploads(prev => [{ url, publicId, id: Date.now() }, ...prev])
    toast.success('Image uploaded successfully')
  }

  const handleDelete = async (publicId) => {
    if (!window.confirm('Delete this image from Cloudinary? This cannot be undone.')) return
    try {
      await mediaAPI.delete(publicId)
      setUploads(prev => prev.filter(u => u.publicId !== publicId))
      toast.success('Image deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <>
      <Helmet><title>Media — Cenovie Admin</title></Helmet>
      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="font-display font-bold text-slate-900 text-2xl">Media Upload</h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload images directly to Cloudinary. Copy the URL to paste into project or blog forms.
          </p>
        </div>

        {/* Upload zone */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Upload New Image</h2>
          <ImageUploader
            label=""
            currentUrl=""
            onUpload={handleUpload}
            onRemove={() => {}}
            aspectRatio="21/7"
          />
          <p className="text-slate-500 text-xs mt-3">
            Images are uploaded directly from your browser to Cloudinary — no server file storage needed.
          </p>
        </div>

        {/* Session gallery */}
        {uploads.length > 0 ? (
          <div>
            <h2 className="font-semibold text-slate-900 mb-4">Uploaded This Session</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploads.map(item => (
                <MediaCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Uploaded images will appear here</p>
          </div>
        )}

        {/* How it works */}
        <div className="p-5 rounded-xl bg-brand-50 border border-brand-100">
          <p className="text-brand-600 text-sm font-semibold mb-2">How image uploads work</p>
          <ol className="text-slate-500 text-sm space-y-1 list-decimal list-inside">
            <li>Your browser requests a signed upload token from the Cenovie backend</li>
            <li>The file is uploaded directly from your browser to Cloudinary (no server intermediary)</li>
            <li>Cloudinary returns a <code className="text-brand-600 text-xs bg-brand-50 px-1 rounded">secure_url</code> which is stored and displayed here</li>
            <li>Copy that URL and paste it into any Project or Blog form field</li>
          </ol>
        </div>
      </div>
    </>
  )
}
