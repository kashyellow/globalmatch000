"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey? createClient(supabaseUrl as string, supabaseKey as string) : null;

type Profile = { id: string; name: string; age: number; city: string; bio: string; image: string; interests: string[]; };

const PROFILES: Profile[] = [
  { id: "1", name: "Sofia", age: 27, city: "Boston", bio: "Loves hiking, coffee, and weekend trips. Looking for something real.", image: "https://i.pravatar.cc/600?img=5", interests: ["Hiking","Coffee","Travel"] },
  { id: "2", name: "Marcus", age: 29, city: "Cambridge", bio: "Engineer by day, chef by night. Let's find the best tacos in town.", image: "https://i.pravatar.cc/600?img=8", interests: ["Cooking","Gym","Music"] },
  { id: "3", name: "Aisha", age: 26, city: "Somerville", bio: "Artist + dog mom. Museum dates are my love language.", image: "https://i.pravatar.cc/600?img=32", interests: ["Art","Dogs","Design"] },
  { id: "4", name: "Daniel", age: 30, city: "Boston", bio: "Runner, reader, terrible dancer. Good at dad jokes.", image: "https://i.pravatar.cc/600?img=12", interests: ["Running","Books"] },
  { id: "5", name: "Lena", age: 28, city: "Brookline", bio: "Startup founder. Love deep conversations and late night walks.", image: "https://i.pravatar.cc/600?img=26", interests: ["Startups","Yoga"] },
  { id: "6", name: "Jake", age: 27, city: "Allston", bio: "Photographer. Let's trade playlists and explore the city.", image: "https://i.pravatar.cc/600?img=15", interests: ["Photo","Indie"] },
];

export default function Page() {
  const [tab, setTab] = useState<"discover"|"matches"|"liked">("discover");
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [showMatch, setShowMatch] = useState<Profile|null>(null);
  const cur = PROFILES[idx];

  const handleLike = async () => {
    if (!cur) return;
    setLiked(l => [cur,...l]);
    if (Math.random() > 0.5) { setMatches(m => [cur,...m]); setShowMatch(cur); }
    if (supabase) await supabase.from("likes").insert({ profile_id: cur.id, profile_name: cur.name });
    setIdx(i => i + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f2', fontFamily: 'system-ui', color: '#111' }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>GlobalMatch</div>
        <div style={{ fontSize: 12, color: supabase? '#16a34a' : '#888' }}>{supabase? '● Supabase ✓' : '○ Demo'}</div>
      </div>

      <div style={{ maxWidth: 420, margin: '16px auto', padding: '0 20px', display: 'flex', gap: 8 }}>
        <button onClick={() => setTab("discover")} style={{ flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', background: tab==="discover"?'black':'white', color: tab==="discover"?'white':'#111', fontWeight: 700, fontSize: 13 }}>Discover</button>
        <button onClick={() => setTab("matches")} style={{ flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', background: tab==="matches"?'black':'white', color: tab==="matches"?'white':'#111', fontWeight: 700, fontSize: 13 }}>Matches ({matches.length})</button>
        <button onClick={() => setTab("liked")} style={{ flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', background: tab==="liked"?'black':'white', color: tab==="liked"?'white':'#111', fontWeight: 700, fontSize: 13 }}>Liked ({liked.length})</button>
      </div>

      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 20px 40px' }}>
        {tab==="discover" && (!cur? (
          <div style={{ background: 'white', borderRadius: 24, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>🎉</div><div style={{ fontWeight: 800, marginTop: 8 }}>All caught up!</div>
            <button onClick={() => setIdx(0)} style={{ marginTop: 16, padding: '12px 20px', borderRadius: 999, border: 'none', background: 'black', color: 'white', fontWeight: 700 }}>Start Over</button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
            <div style={{ position: 'relative' }}>
              <img src={cur.image} alt={cur.name} style={{ width: '100%', height: 540, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 16px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', fontWeight: 800, fontSize: 22 }}>{cur.name}, {cur.age} • {cur.city}</div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, color: '#444' }}>{cur.bio}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>{cur.interests.map(i => <span key={i} style={{ fontSize: 11, padding: '6px 10px', borderRadius: 999, background: '#f4f4f5', fontWeight: 600 }}>{i}</span>)}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <button onClick={() => setIdx(i => i + 1)} style={{ flex: 1, height: 54, borderRadius: 16, border: '1px solid #ddd', background: 'white', fontWeight: 800 }}>✕ Pass</button>
                <button onClick={handleLike} style={{ flex: 1, height: 54, borderRadius: 16, border: 'none', background: 'black', color: 'white', fontWeight: 800 }}>Like ♥</button>
              </div>
            </div>
          </div>
        ))}

        {tab==="matches" && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{matches.length===0? <div style={{ gridColumn: '1/3', textAlign: 'center', color: '#888', marginTop: 40 }}>No matches yet</div> : matches.map(p => <div key={p.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}><img src={p.image} style={{ width: '100%', height: 160, objectFit: 'cover' }} /><div style={{ padding: 10, fontWeight: 700, fontSize: 14 }}>{p.name}</div></div>)}</div>}

        {tab==="liked" && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{liked.length===0? <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No likes yet</div> : liked.map(p => <div key={p.id} style={{ background: 'white', borderRadius: 16, padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}><img src={p.image} style={{ width: 50, height: 50, borderRadius: 999, objectFit: 'cover' }} /><div style={{ fontWeight: 700 }}>{p.name}, {p.age}</div></div>)}</div>}
      </div>

      {showMatch && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}><div style={{ background: 'white', borderRadius: 28, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center' }}><div style={{ fontSize: 40 }}>💘</div><div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>It's a Match!</div><div style={{ fontSize: 14, color: '#666', marginTop: 6 }}>You and {showMatch.name} liked each other</div><img src={showMatch.image} style={{ width: 90, height: 90, borderRadius: 999, objectFit: 'cover', margin: '20px auto 0', display: 'block' }} /><button onClick={() => setShowMatch(null)} style={{ marginTop: 20, width: '100%', height: 50, borderRadius: 999, border: 'none', background: 'black', color: 'white', fontWeight: 800 }}>Keep Swiping</button></div></div>}
    </div>
  );
}
