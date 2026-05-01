/**
 * useCloudinaryUpload
 *
 * Uploads a file directly from the browser to Cloudinary using a
 * backend-issued signed upload signature.
 *
 * Flow:
 *   1. Ask backend GET /api/media/sign → { signature, timestamp, apiKey, cloudName, folder }
 *   2. POST file + signature directly to Cloudinary's upload API
 *   3. Return { url, publicId } — no file bytes ever pass through Vercel
 *
 * Usage:
 *   const { upload, uploading, progress } = useCloudinaryUpload()
 *   const { url, publicId } = await upload(file)
 */
import { useState, useCallback } from 'react'
import { mediaAPI } from '../services/api'

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState(null)

  const upload = useCallback(async (file) => {
    if (!file) throw new Error('No file provided')

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Step 1: get signed params from our backend
      const { data } = await mediaAPI.getSignature()
      const { signature, timestamp, apiKey, cloudName, folder } = data

      // Step 2: build FormData for direct Cloudinary upload
      const formData = new FormData()
      formData.append('file',       file)
      formData.append('api_key',    apiKey)
      formData.append('timestamp',  timestamp)
      formData.append('signature',  signature)
      formData.append('folder',     folder)

      // Step 3: upload directly to Cloudinary via XHR so we get progress
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            try {
              const err = JSON.parse(xhr.responseText)
              reject(new Error(err.error?.message || 'Upload failed'))
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`)
        xhr.send(formData)
      })

      setProgress(100)
      return {
        url:      result.secure_url,
        publicId: result.public_id,
        width:    result.width,
        height:   result.height,
        format:   result.format,
        bytes:    result.bytes,
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setError(null)
    setUploading(false)
  }, [])

  return { upload, uploading, progress, error, reset }
}
