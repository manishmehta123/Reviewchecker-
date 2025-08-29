import React, { useState } from 'react'
import api from '../api.js'

export default function UploadBattle({ onUploaded }) {
  const [title, setTitle] = useState('')
  const [leftCaption, setLeftCaption] = useState('')
  const [rightCaption, setRightCaption] = useState('')
  const [leftFile, setLeftFile] = useState(null)
  const [rightFile, setRightFile] = useState(null)
  const [previewLeft, setPreviewLeft] = useState('')
  const [previewRight, setPreviewRight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onFile = (setter, previewSetter) => e => {
    const f = e.target.files[0]
    if (f) {
      setter(f)
      previewSetter(URL.createObjectURL(f))
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!leftFile || !rightFile) return setError('Please select both images')
    try {
      setLoading(true); setError('')
      const form = new FormData()
      form.append('title', title || 'Untitled')
      form.append('leftCaption', leftCaption)
      form.append('rightCaption', rightCaption)
      form.append('leftImage', leftFile)
      form.append('rightImage', rightFile)
      await api.post('/battles', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setTitle(''); setLeftCaption(''); setRightCaption(''); setLeftFile(null); setRightFile(null); setPreviewLeft(''); setPreviewRight('')
      onUploaded && onUploaded()
    } catch (e) {
      setError(e?.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-card">
      <h3 className="section-title">Create a new Battle</h3>
      <form onSubmit={submit} className="upload-grid">
        <div className="upload-col">
          <label className="small">Title</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Battle title (e.g., Sunset vs City)" />
          <div className="two-col">
            <div className="uploader">
              <label className="small">Left Image</label>
              {previewLeft ? <img className="thumb" src={previewLeft} /> : <div className="drop">Choose left image</div>}
              <input type="file" accept="image/*" onChange={onFile(setLeftFile, setPreviewLeft)} />
              <input className="input" value={leftCaption} onChange={e=>setLeftCaption(e.target.value)} placeholder="Left caption" />
            </div>
            <div className="uploader">
              <label className="small">Right Image</label>
              {previewRight ? <img className="thumb" src={previewRight} /> : <div className="drop">Choose right image</div>}
              <input type="file" accept="image/*" onChange={onFile(setRightFile, setPreviewRight)} />
              <input className="input" value={rightCaption} onChange={e=>setRightCaption(e.target.value)} placeholder="Right caption" />
            </div>
          </div>
        </div>
        <div className="upload-actions">
          {error && <div className="error">{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Uploading…' : 'Upload Battle'}</button>
          <div className="hint">After upload, your battle appears on the front page automatically.</div>
        </div>
      </form>
    </div>
  )
}
