'use client'
import React, { useState, useEffect } from 'react'

type Post = {
  id: string
  text: string
  image: string | null
  createdAt: number
}

export default function Page() {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('global_posts')
    if (saved) setPosts(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('global_posts', JSON.stringify(posts))
  }, [posts])

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

  const handlePost = () => {
    if (!text.trim() &&!preview) return
    const newPost: Post = {
      id: Date.now().toString(),
      text,
      image: preview,
      createdAt: Date.now(),
    }
    setPosts([newPost,...posts])
    setText('')
    setPreview(null)
  }

  const visiblePosts = posts.filter(p => daysLeft(p.createdAt) > 0)

  return (
    <main style={{ minHeight: '100vh', background: '#09090b', color: '#fff', padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800 }}>Global</h1>
        <div style={{ color: '#4ade80', fontSize: 14, marginBottom: 24 }}>Global 🌍 ON</div>

        <div style={{ background: '#18181b', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Create post</h2>
          <p style={{ color: '#a1a1aa', fontSize: 14, marginBottom: 12 }}>What's happening?</p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's happening?"
            style={{ width: '100%', minHeight: 100, background: '#27272a', color: 'white', borderRadius: 8, padding: 12, border: 'none' }}
          />
          <input type="file" accept="image/*" onChange={onFile} style={{ marginTop: 12 }} />
          {preview && (
            <div style={{ position: 'relative', marginTop: 12 }}>
              <img src={preview} style={{ width: '100%', borderRadius: 8 }} alt="preview" />
              <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 8, right: 8, background: '#000', color: '#fff', borderRadius: 20, padding: '4px 8px' }}>X</button>
            </div>
          )}
          <button onClick={handlePost} style={{ width: '100%', marginTop: 12, background: 'white', color: 'black', padding: '12px', borderRadius: 8, fontWeight: 700 }}>Post</button>
        </div>

        {visiblePosts.map(post => (
          <div key={post.id} style={{ background: '#18181b', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.text}</p>
            {post.image && <img src={post.image} style={{ width: '100%', borderRadius: 8, marginTop: 12 }} alt="post" />}
            <div style={{ marginTop: 12, color: '#a1a1aa', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>{daysLeft(post.createdAt)} days left</span>
              <button onClick={() => setPosts(posts.filter(p => p.id!== post.id))} style={{ background: 'transparent', color: '#a1a1aa', border: 'none' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
