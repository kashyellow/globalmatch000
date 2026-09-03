'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey? createClient(supabaseUrl, supabaseAnonKey) : null

type Profile = { id: string, full_name?: string, username?: string, age?: number, city?: string, bio?: string, avatar_url?: string }

const DEMO: Profile[] = [
  { id: '1', full_name: 'Sofia', age: 26, city: 'Madrid', bio: 'Love travel & coffee', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500' },
  { id: '2', full_name: 'Marcus', age: 28, city: 'London', bio: 'Gym, music, adventure', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
  { id: '3', full_name: 'Aisha', age: 25, city: 'Dubai', bio: 'Designer | Dreamer', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500' },
  { id: '4', full_name: 'Lena', age: 27, city: 'Berlin', bio: 'Techno & books', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' },
  { id: '5', full_name: 'David', age: 30, city: 'NYC', bio: 'Founder. Let’s build.', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500' },
  { id: '6', full_name: 'Mia', age: 24, city: 'Boston', bio: 'Nurse, dog mom', avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500' },
]

export default function Page() {
  const [view, setView] = useState<'discover'|'matches'|'messages'>('discover')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [idx, setIdx] = useState(0)
  const [liked, setLiked] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Profile[]>([])

  useEffect(() => {
    async function load() {
      if (!supabase) { setProfiles(DEMO); return }
      const { data } = await supabase.from('profiles').select('*').limit(30)
      setProfiles(data?.length? data as Profile[] : DEMO)
    }
    load()
  }, [])

  const cur = profiles[idx]
  const like = async () => {
    if (!cur) return
    setLiked(l => [...l, cur])
    if (Math.random() > 0.5) setMatches(m => [...m, cur]) // demo 50% match
    if (supabase) await supabase.from('likes').insert({ liked_user_id: cur.id }).catch(()=>{})
    setIdx(i => i+1)
  }
  const pass = () => setIdx(i => i+1)

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'system-ui'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid #222', position:'sticky', top:0, background:'#000', zIndex:10}}>
        <div style={{display:'flex', gap:8, alignItems:'center', fontWeight:800}}><div style={{width:28, height:28, background:'#fff', color:'#000', borderRadius:8, display:'grid', placeItems:'center'}}>S</div> GlobalMatch</div>
        <div style={{display:'flex', gap:6, background:'#111', border:'1px solid #222', borderRadius:999, padding:4}}>
          {(['discover','matches','messages'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:'6px 14px', borderRadius:999, fontSize:13, background: view===v?'#fff':'transparent', color: view===v?'#000':'#888', fontWeight:600, textTransform:'capitalize'}}>{v}</button>
          ))}
        </div>
      </header>

      {!supabase && <div style={{margin:12, padding:10, background:'#221a00', border:'1px solid #332d00', borderRadius:12, fontSize:12, color:'#ffdb6e'}}>Demo mode - 3 pics only because Supabase keys missing. Add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY in Vercel > Settings > Env Vars to see all your real profiles from table `profiles`.</div>}

      <main style={{maxWidth:440, margin:'0 auto', padding:20}}>
        {view==='discover' && (
          cur? (
            <div style={{background:'#111', border:'1px solid #222', borderRadius:24, overflow:'hidden'}}>
              <img src={cur.avatar_url} style={{width:'100%', height:520, objectFit:'cover'}}/>
              <div style={{padding:16}}>
                <div style={{fontSize:22, fontWeight:800}}>{cur.full_name||cur.username} • {cur.age||''}</div>
                <div style={{fontSize:13, color:'#666'}}>{cur.city} • {cur.bio}</div>
                <div style={{display:'flex', gap:12, marginTop:16}}>
                  <button onClick={pass} style={{flex:1, height:52, borderRadius:999, background:'#222', border:'1px solid #333'}}>✕ Pass</button>
                  <button onClick={like} style={{flex:1, height:52, borderRadius:999, background:'#fff', color:'#000', fontWeight:800}}>♥ Like</button>
                </div>
              </div>
            </div>
          ) : <div style={{textAlign:'center', padding:80, color:'#666'}}>No more profiles - you saw all {profiles.length}!</div>
        )}

        {view==='matches' && (
          <div>
            <h2 style={{fontSize:20, fontWeight:700, marginBottom:12}}>Matches ({matches.length}) • Liked ({liked.length})</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              {(matches.length?matches:liked).map(p=>(
                <div key={p.id} style={{background:'#111', border:'1px solid #222', borderRadius:16, overflow:'hidden'}}>
                  <img src={p.avatar_url} style={{width:'100%', height:180, objectFit:'cover'}}/>
                  <div style={{padding:10, fontSize:13, fontWeight:600}}>{p.full_name}</div>
                </div>
              ))}
            </div>
            {!liked.length && <div style={{color:'#666', marginTop:20}}>Like someone in Discover to see them here.</div>}
          </div>
        )}

        {view==='messages' && (
          <div style={{padding:40, textAlign:'center', color:'#666'}}>
            Messages will show here when you connect `messages` table in Supabase.<br/>Liked profiles can chat here.
          </div>
        )}
      </main>
    </div>
  )
}
