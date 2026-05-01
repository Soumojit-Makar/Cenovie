/**
 * FileUploader
 *
 * For non-image files (PDF resumes, documents).
 * Uploads directly to Cloudinary using the signed upload flow.
 * Returns the secure_url to the parent via onUpload(url).
 */
import { useRef, useState } from 'react'
import { Paperclip, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'

const ACCEPTED_TYPES = {
  'application/pdf':  '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}
const MAX_MB = 5

export default function FileUploader({
  label     = 'File',
  accept    = Object.keys(ACCEPTED_TYPES).join(','),
  maxMB     = MAX_MB,
  onUpload,   // (url: string) => void
  onRemove,   // () => void
  currentUrl  = '',
  className   = '',
  required    = false,
}) {
  const inputRef = useRef(null)
  const { upload, uploading, progress, error, reset } = useCloudinaryUpload()
  const [fileName, setFileName]   = useState(() => {
    if (!currentUrl) return ''
    const parts = currentUrl.split('/')
    return decodeURIComponent(parts[parts.length - 1])
  })
  const [localError, setLocalError] = useState('')

  const validate = (file) => {
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      return 'Only PDF, DOC, or DOCX files are accepted.'
    }
    if (file.size > maxMB * 1024 * 1024) {
      return `File must be under ${maxMB} MB.`
    }
    return null
  }

  const handleFile = async (file) => {
    const err = validate(file)
    if (err) { setLocalError(err); return }

    setLocalError('')
    setFileName(file.name)
    reset()

    try {
      const result = await upload(file)
      onUpload?.(result.url)
    } catch (e) {
      setLocalError(e.message || 'Upload failed. Please try again.')
      setFileName('')
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    setFileName('')
    setLocalError('')
    reset()
    onRemove?.()
  }

  const displayError = localError || error

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <p className="form-label-dark">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      {/* ── Uploaded file chip ── */}
      {(currentUrl || fileName) && !uploading ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent-500/10 border border-accent-500/20">
          <CheckCircle2 className="w-4 h-4 text-accent-400 flex-shrink-0" />
          <span className="text-accent-300 text-sm flex-1 truncate">
            {fileName || 'File uploaded'}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-accent-400 hover:text-red-400 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : uploading ? (
        /* ── Progress bar ── */
        <div className="px-4 py-3 rounded-lg bg-slate-100 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
            <span className="text-slate-700 text-sm truncate">{fileName}</span>
            <span className="text-brand-600 text-xs ml-auto">{progress}%</span>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        /* ── Empty trigger button ── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-100 border border-dashed border-slate-200 hover:border-brand-400/50 hover:bg-brand-500/5 transition-all text-left group"
        >
          <Paperclip className="w-4 h-4 text-slate-500 group-hover:text-brand-600 transition-colors flex-shrink-0" />
          <div>
            <p className="text-slate-400 text-sm group-hover:text-slate-900 transition-colors">
              Click to attach file
            </p>
            <p className="text-slate-600 text-xs">
              PDF, DOC, DOCX · max {maxMB} MB
            </p>
          </div>
        </button>
      )}

      {displayError && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {displayError}
        </div>
      )}
    </div>
  )
}
