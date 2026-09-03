'use client'
import React, { useState } from 'react'

export default function Page() {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const daysLeft = (createdAt: number) => {
    const diff = Date.now() - createdAt
    const days = 7 - Math.floor(diff / (24 * 60 * 60 * 1000))
    return Math.max(0, days)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#09090b', color: '#fff', padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 8 }}>Global</h1>
        <div style={{ color: '#4ade80', fontSize: 14, marginBottom: 24, display: 'flex', gap: 8 }}>
          <span>Global 🌍 ON</span>
        </div>

        <div style={{ background: '#18181b', borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Create post</h2>
          <p style={{ color: '#a1a1aa', fontSize: 14 }}>What's happening?</p>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              style={{ width: '100%', minHeight: 100, background: '#27272a', color: 'white', borderRadius: 8, padding: 12, border: 'none' }}
            />

            <input type="file" accept="image/*" onChange={onFile} />

            {preview && (
              <div style={{ position: 'relative' }}>
                <img src={preview} style={{ width: '100%', borderRadius: 8 }} alt="preview" />
                <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 8, right: 8, background: '#000', color: '#fff', borderRadius: 20, padding: '4px 8px' }}>X</button>
              </div>
            )}

            <button
              onClick={() => {
                setText('')
                setPreview(null)
              }}
              style={{ background: 'white', color: 'black', padding: '10px 16px', borderRadius: 8, fontWeight: 600 }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
