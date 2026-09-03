'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey? createClient(supabaseUrl, supabaseAnonKey) : null

type Profile = {
  id: string
  username?: string
  full_name?: string
  age?: number
  city?: string
  bio?: string
  avatar_url?: string
}

const MOCK: Profile[] = [
  { id: '1', full_name: 'Sofia', age: 26, city: 'Madrid', bio: 'Love travel & coffee', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { id: '2', full_name: 'Marcus', age: 28, city: 'London', bio: 'Gym, music, adventure', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: '3', full_name: 'Aisha', age: 25, city: 'Dubai', bio: 'Designer | Dreamer', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
]

export default function Page() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setProfiles(MOCK)
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from('profiles').select('*').limit(12)
      if (error ||!data?.length) {
        setProfiles(MOCK)
      } else {
        setProfiles(data as Profile[])
      }
      setLoading(false)
    }
    load()
  }, [])

  const toggleLike = async (id: string) => {
    const isLiked = liked.has(id)
    const next = new Set(liked)
    if (isLiked) next.delete(id)
    else next.add(id)
    setLiked(next)

    if (supabase) {
      try {
        if (!isLiked) await supabase.from('likes').insert({ liked_user_id: id })
        else await supabase.from('likes').delete().eq('liked_user_id', id)
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black">S</div>
          <span className="font-semibold">GlobalMatch</span>
        </div>
        <button className="px-4 py-2 rounded-full border border-zinc-700 text-sm">Contact</button>
      </header>

      {!supabase && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm">
          Supabase keys not set in Vercel. Go to Vercel &gt; Settings &gt; Environment Variables and add
          <code className="mx-1">NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then Redeploy. Showing demo data for now.
        </div>
      )}

      <main className="px-6 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Deployed on Vercel • Live now
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Your site is <span className="text-zinc-500">live</span> for real.
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            This is your homepage from <code>app/page.tsx</code>. Profiles come from Supabase when env vars are set.
          </p>
        </div>

        {loading? (
          <div className="text-center py-20 text-zinc-500">Loading profiles...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {profiles.map(p => (
              <div key={p.id} className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                <img src={p.avatar_url || MOCK[0].avatar_url} alt={p.full_name} className="w-full h-64 object-cover" />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{p.full_name || p.username} {p.age? `• ${p.age}` : ''}</h3>
                      <p className="text-xs text-zinc-500">{p.city || 'Global'}</p>
                    </div>
                    <button
                      onClick={() => toggleLike(p.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition ${liked.has(p.id)? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                    >
                      ♥
                    </button>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{p.bio || 'New here 👋'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <h4 className="font-semibold mb-2">⚡ Instant Deploy</h4>
            <p className="text-sm text-zinc-400">Push to main branch and Vercel redeploys automatically. No config needed.</p>
          </div>
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <h4 className="font-semibold mb-2">🔒 Supabase Connected</h4>
            <p className="text-sm text-zinc-400">Using tables: profiles, likes, matches, messages + Avatars bucket.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
