'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

type Profile = { id: string, full_name?: string, age?: number, city?: string, bio?: string, avatar_url?: string }

const DEMO: Profile[] = [
  { id: '1', full_name: 'Sofia', age: 26, city: 'Madrid', bio: 'Love travel & coffee', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { id: '2', full_name: 'Marcus', age: 28, city: 'London', bio: 'Gym, music, adventure', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: '3', full_name: 'Aisha', age: 25, city: 'Dubai', bio: 'Designer | Dreamer', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
]

export default function Page() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) { setProfiles(DEMO); setLoading(false); return }
      const { data } = await supabase.from('profiles').select('*').limit(12)
      setProfiles(data?.length ? data as Profile[] : DEMO)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'system-ui'}}>
      <header style={{display:'flex', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid #222'}}>
        <div style={{display:'flex', gap:8, alignItems:'center', fontWeight:700}}><div style={{width:32, height:32, background:'#fff', color:'#000', borderRadius:8, display:'grid', placeItems:'center'}}>S</div> GlobalMatch</div>
        <div style={{fontSize:12, color:'#888'}}>Deployed on Vercel • Zero config</div>
      </header>
      <main style={{maxWidth:1000, margin:'0 auto', padding:'48px 24px'}}>
        <div style={{textAlign:'center', marginBottom:48}}>
          <h1 style={{fontSize:48, fontWeight:800, marginBottom:12}}>Your site is live for real.</h1>
          <p style={{color:'#888'}}>This is app/page.tsx - save and Vercel auto-deploys. Connected to Supabase: {supabase ? 'Yes' : 'Add keys in Vercel Settings'}</p>
        </div>
        {loading ? <div style={{textAlign:'center', color:'#666'}}>Loading...</div> : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20}}>
            {profiles.map(p=>(
              <div key={p.id} style={{background:'#111', border:'1px solid #222', borderRadius:16, overflow:'hidden'}}>
                <img src={p.avatar_url} alt="" style={{width:'100%', height:240, objectFit:'cover'}}/>
                <div style={{padding:16}}>
                  <div style={{fontWeight:600}}>{p.full_name} {p.age? `• ${p.age}`:''}</div>
                  <div style={{fontSize:12, color:'#666'}}>{p.city}</div>
                  <div style={{fontSize:14, color:'#999', marginTop:8}}>{p.bio}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
