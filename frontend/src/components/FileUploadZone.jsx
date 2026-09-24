import { useCallback, useRef, useState } from 'react'

const UPLOAD_ICON = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m-4-4l4-4 4 4"/>
  </svg>
)

const FILE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

export default function FileUploadZone({ onFileSelect, accept = '.pdf,.jpg,.jpeg,.png,.tiff', maxMB = 20 }) {
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const addFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter(f => f.size <= maxMB * 1024 * 1024)
    setFiles(prev => {
      const updated = [...prev, ...valid]
      onFileSelect?.(updated)
      return updated
    })
  }, [maxMB, onFileSelect])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = (idx) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== idx)
      onFileSelect?.(updated)
      return updated
    })
  }

  const fmt = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  return (
    <div>
      <div
        className={`upload-zone${dragging ? ' drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="upload-icon">{UPLOAD_ICON}</div>
        <h4>Drag &amp; drop your file here</h4>
        <p>or click to browse from your device</p>
        <span className="upload-formats">PDF, JPG, PNG, TIFF — max {maxMB} MB</span>
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          accept={accept}
          multiple
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((f, i) => (
            <div key={i} className="file-item">
              <span className="file-item-icon">{FILE_ICON}</span>
              <span className="file-item-name">{f.name}</span>
              <span className="file-item-size">{fmt(f.size)}</span>
              <button className="file-item-remove" onClick={(e) => { e.stopPropagation(); removeFile(i) }}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
