import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import './AdminDashboard.css'
import './AdminImages.css'

interface GalleryImage {
  id: string
  url: string
  label: string
  category: string
  active: boolean
  sort_order: number
  created_at: string
}

const CATEGORIES = ['treatments', 'results', 'studio']

// Compress image in browser before upload
// Resizes to max 1200px and compresses to ~80% quality
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 800  // gallery thumbnails ~320px, lightbox ~600px max
      let { width, height } = img

      // Scale down if larger than MAX
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height / width) * MAX)
          width = MAX
        } else {
          width = Math.round((width / height) * MAX)
          height = MAX
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (!blob) { resolve(file); return }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressed)
        },
        'image/jpeg',
        0.82 // 82% quality — good balance of size and sharpness
      )
    }
    img.src = url
  })
}

export default function AdminImages() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState('treatments')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (data) setImages(data)
    setLoading(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    // Accept any size — we compress before upload
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setError('')
    setPreview(URL.createObjectURL(f)) // show original as preview immediately

    // Compress in background
    const compressed = await compressImage(f)
    setFile(compressed)

    const originalMB = (f.size / 1024 / 1024).toFixed(1)
    const compressedKB = (compressed.size / 1024).toFixed(0)
    setSuccess(`Compressed: ${originalMB}MB → ${compressedKB}KB`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleUpload = async () => {
    if (!file || !label.trim()) {
      setError('Please select an image and enter a label')
      return
    }

    setUploading(true)
    setError('')

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filename)

    // Save to database
    const { error: dbError } = await supabase.from('gallery_images').insert({
      url: publicUrl,
      label: label.trim(),
      category,
      active: true,
      sort_order: images.length,
    })

    if (dbError) {
      setError('Failed to save image: ' + dbError.message)
      setUploading(false)
      return
    }

    setSuccess('Image uploaded successfully!')
    setFile(null)
    setPreview(null)
    setLabel('')
    setCategory('treatments')
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setSuccess(''), 3000)
    fetchImages()
    setUploading(false)
  }

  const toggleActive = async (img: GalleryImage) => {
    await supabase
      .from('gallery_images')
      .update({ active: !img.active })
      .eq('id', img.id)
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, active: !i.active } : i))
  }

  const deleteImage = async (img: GalleryImage) => {
    if (!confirm(`Delete "${img.label}"? This cannot be undone.`)) return
    setDeleting(img.id)

    // Extract filename from URL and delete from storage
    const filename = img.url.split('/').pop()
    if (filename) {
      await supabase.storage.from('gallery').remove([filename])
    }

    await supabase.from('gallery_images').delete().eq('id', img.id)
    setImages(prev => prev.filter(i => i.id !== img.id))
    setDeleting(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Upload Card */}
      <div className="admin-card">
        <div className="admin-card-title">Upload New Image</div>

        <div className="upload-area">
          {/* Drop zone */}
          <div
            className={`drop-zone ${preview ? 'has-preview' : ''}`}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="upload-preview" />
            ) : (
              <>
                <span className="drop-icon">🖼️</span>
                <p className="drop-text">Click to select an image</p>
                <p className="drop-sub">Any size — auto compressed before upload</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Fields */}
          <div className="upload-fields">
            <div className="form-group">
              <label>Image Label</label>
              <input
                type="text"
                placeholder="e.g. Deep Cleansing Session"
                value={label}
                onChange={e => setLabel(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="auth-error">⚠ {error}</div>}
            {success && <div className="auth-success">✓ {success}</div>}

            <button
              className="auth-btn-primary"
              onClick={handleUpload}
              disabled={uploading || !file || !label.trim()}
              style={{ marginTop: '8px' }}
            >
              {uploading ? '⏳ Uploading...' : '⬆ Upload Image'}
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="admin-card">
        <div className="admin-card-title">{images.length} Gallery Images</div>

        {loading ? (
          <div className="loading-spinner">⏳ Loading images...</div>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <p>No images yet. Upload your first one above.</p>
          </div>
        ) : (
          <div className="images-grid">
            {images.map(img => (
              <div key={img.id} className={`image-card ${!img.active ? 'inactive' : ''}`}>
                <div className="image-thumb-wrap">
                  <img src={img.url} alt={img.label} className="image-thumb" loading="lazy" />
                  {!img.active && <div className="image-hidden-badge">Hidden</div>}
                </div>
                <div className="image-info">
                  <span className="image-label">{img.label}</span>
                  <span className={`status-badge status-${img.category === 'treatments' ? 'confirmed' : img.category === 'results' ? 'completed' : 'pending'}`}>
                    {img.category}
                  </span>
                </div>
                <div className="image-actions">
                  <button
                    className={`admin-btn ${img.active ? 'admin-btn-cancel' : 'admin-btn-confirm'}`}
                    onClick={() => toggleActive(img)}
                  >
                    {img.active ? '👁 Hide' : '👁 Show'}
                  </button>
                  <button
                    className="admin-btn admin-btn-cancel"
                    onClick={() => deleteImage(img)}
                    disabled={deleting === img.id}
                  >
                    {deleting === img.id ? '...' : '🗑 Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
