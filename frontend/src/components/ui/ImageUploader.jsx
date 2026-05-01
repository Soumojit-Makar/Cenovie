/**
 * ImageUploader
 *
 * Drop-zone / click-to-upload component that:
 *   - Shows a preview of the selected image
 *   - Uploads directly to Cloudinary via useCloudinaryUpload
 *   - Calls onUpload({ url, publicId }) when done
 *   - Calls onRemove() when the user clears the image
 */
import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_MB   = 5

export default function ImageUploader({
  label        = 'Image',
  currentUrl   = '',
  onUpload,          // (result: { url, publicId }) => void
  onRemove,          // () => void
  aspectRatio  = '16/9',
  className    = '',
}) {
  const inputRef                          = useRef(null)
  const { upload, uploading, progress, error, reset } = useCloudinaryUpload()
  const [dragOver, setDragOver]           = useState(false)
  const [localError, setLocalError]       = useState('')

  const validate = (file) => {
    if (!ACCEPTED.includes(file.type)) {
      return 'Only JPG, PNG, WebP, or GIF images are allowed.'
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `File size must be under ${MAX_MB} MB.`
    }
    return null
  }

  const handleFile = async (file) => {
    const validationError = validate(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    setLocalError('')
    reset()

    try {
      const result = await upload(file)
      onUpload?.(result)
    } catch (err) {
      setLocalError(err.message || 'Upload failed. Please try again.')
    }
  }

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // reset input so the same file can be re-selected
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    reset()
    setLocalError('')
    onRemove?.()
  }

  const displayError = localError || error

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <p className="form-label-dark">{label}</p>}

      <div
        className={`relative rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
          ${dragOver          ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-400/50 bg-slate-100'}
          ${uploading         ? 'pointer-events-none'              : ''}
        `}
        style={{ aspectRatio }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={onInputChange}
        />

        {/* ── Current image preview ── */}
        {currentUrl && !uploading && (
          <>
            <img
              src={currentUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-slate-900 text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                Click to replace
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-400 text-slate-900 flex items-center justify-center shadow-lg transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}

        {/* ── Upload progress overlay ── */}
        {uploading && (
          <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <div className="w-40">
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-400 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-brand-400 text-xs text-center mt-1.5">{progress}%</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!currentUrl && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${dragOver ? 'bg-brand-100' : 'bg-slate-100'}`}>
              {dragOver
                ? <Upload className="w-6 h-6 text-brand-600" />
                : <ImageIcon className="w-6 h-6 text-slate-500" />
              }
            </div>
            <div>
              <p className="text-slate-700 text-sm font-medium">
                {dragOver ? 'Drop to upload' : 'Click or drag & drop'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                JPG, PNG, WebP · max {MAX_MB} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Error message ── */}
      {displayError && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {displayError}
        </div>
      )}
    </div>
  )
}
