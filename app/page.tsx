'use client'
import { useState, useEffect, useRef } from 'react'

type Post = {
  id: string
  text: string
  image?: string
  createdAt: number
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('globalmatch-wall')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Post[]
        const sevenDays = 7 * 24 * 60 * 60 * 1000
        const now = Date.now()
        const fresh = parsed.filter(p => now - p.createdAt < sevenDays)
        setPosts(fresh)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('globalmatch-wall', JSON.stringify(posts))
  }, [posts, mounted])

  const addPost = () => {
    if (!text.trim() &&!preview) return
    const newPost: Post = {
      id: Date.now().toString(),
      text: text.trim(),
      image: preview || undefined,
      createdAt: Date.now(),
    }
    setPosts([newPost,...posts])
    setText('')
    setPreview(null)
  }

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
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', textAlign: 'center', margin: '32px 0 8px' }}>GLOBAL MATCH</h1>
        <div style={{ color: '#4ade80', textAlign: 'center', fontWeight: 600, marginBottom: 24, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
          <span>Global 🌍 ON</span><span style={{ width: 12, height: 12, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
        </div>

        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Wall Tab - Live</h2>
          <p style={{ color: '#a1a1aa', fontSize: 14, margin: 0 }}>Public messages + pics that disappear after 7 days</p>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's happening globally?"
              style={{ width: '100%', minHeight: 80, background: '#27272a', border: '1px solid #3f3f46', borderRadius: 12, color: '#fff', padding: 12, fontSize: 15, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
            {preview && (
              <div style={{ position: 'relative' }}>
                <img src={preview} style={{ width: '100%', borderRadius: 12, maxHeight: 300, objectFit: 'cover' }} />
                <button onClick={() =>
