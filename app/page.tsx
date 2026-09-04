"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
   ? createClient(supabaseUrl as string, supabaseKey as string)
    : null;

type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  image: string;
  interests: string[];
};

const MOCK: Profile[] = [
  { id: "1", name: "Sofia", age: 27, city: "Boston", bio: "Loves hiking, coffee, and weekend trips. Looking for something real.", image: "https://i.pravatar.cc/600?img=5", interests: ["Hiking", "Coffee", "Travel"] },
  { id: "2", name: "Marcus", age: 29, city: "Cambridge", bio: "Engineer by day, chef by night. Let's find the best tacos in town.", image: "https://i.pravatar.cc/600?img=8", interests: ["Cooking", "Gym", "Music"] },
  { id: "3", name: "Aisha", age: 26, city: "Somerville", bio: "Artist + dog mom. Museum dates are my love language.", image: "https://i.pravatar.cc/600?img=32", interests: ["Art", "Dogs", "Design"] },
  { id: "4", name: "Daniel", age: 30, city: "Boston", bio: "Runner, reader, terrible dancer. Good at dad jokes.", image: "https://i.pravatar.cc/600?img=12", interests: ["Running", "Books", "Comedy"] },
  { id: "5", name: "Lena", age: 28, city: "Brookline", bio: "Startup founder. Love deep conversations and late night walks.", image: "https://i.pravatar.cc/600?img=26", interests: ["Startups", "Yoga", "Wine"] },
  { id: "6", name: "Jake", age: 27, city: "Allston", bio: "Photographer. Let's trade playlists and explore the city.", image: "https://i.pravatar.cc/600?img=15", interests: ["Photo", "Indie", "Skate"] },
];

export default function Page() {
  const [tab, setTab] = useState<"discover" | "matches" | "liked">("discover");
  const [profiles, setProfiles] = useState<Profile[]>(MOCK);
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const cur = profiles[idx];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (supabase) {
        const { data, error } = await supabase.from("profiles").select("*").limit(20);
        if (!error && data && data.length > 0) {
          setProfiles(data as any);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleLike = async () => {
    if (!cur) return;
    const isMatch = Math.random() > 0.6;
    setLiked((l) => [cur,...l]);
    if (isMatch) {
      setMatches((m) => [cur,...m]);
      setShowMatch(cur);
    }
    if (supabase) {
      await supabase.from("likes").insert({ profile_id: cur.id, profile_name: cur.name }).then(() => {});
    }
    setIdx((i) => i + 1);
  };

  const handlePass = () => setIdx((i) => i + 1);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>Loading GlobalMatch...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f2', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>GlobalMatch</div>
        <div style={{ fontSize: 12, color: supabase? '#16a34a' : '#a1a1aa' }}>{supabase? '● Connected to Supabase ✓' : '○ Demo Mode'}</div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 420, margin: '16px auto', padding: '0 20px', display: 'flex', gap: 8 }}>
        {[
          { k: 'discover', l: `Discover` },
          { k: 'matches', l: `Matches (${matches.length})` },
          { k: 'liked', l: `Liked (${liked.length})` },
        ].map((t: any) => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', background: tab === t.k? 'black' : 'white', color: tab === t.k? 'white' : '#111', fontWeight: 700, fontSize: 13, boxShadow: tab === t.k? 'none' : '0 1px 3px rgba(0,0,0,0.08)' }}>{t.l}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 20px 40px' }}>
        {tab === 'discover' && (
          <>
            {!cur? (
              <div style={{ background: 'white', borderRadius: 24, padding: 40, textAlign: 'center', marginTop: 20 }}>
                <div style={{ fontSize: 32 }}>🎉</div>
                <div style={{ fontWeight: 800, marginTop: 8 }}>You're all caught up!</div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>No more profiles. Check your Matches.</div>
                <button onClick={() => setIdx(0)} style={{ marginTop: 16, padding: '12px 20px', borderRadius: 999, border: 'none', background: 'black', color: 'white', fontWeight: 700 }}>Start Over</button>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
                <div style={{ position: 'relative' }}>
                  <img src={cur.image} alt={cur.name} style={{ width: '100%', height: 540, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 16px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                    <div style={{ fontSize: 26, fontWeight: 800 }}>{cur.name}, {cur.age} • {cur.city}</div>
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>{cur.bio}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>{cur.interests.map(i => <span key={i} style={{ fontSize: 11, padding: '6px 10px', borderRadius: 999, background: '#f4f4f5', fontWeight: 600 }}>{i}</span>)}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                    <button onClick={handlePass} style={{ flex: 1, height: 54, borderRadius: 16, border: '1px solid #e4e4e7', background: 'white', fontWeight: 800, fontSize: 15 }}>✕ Pass</button>
                    <button onClick={handleLike} style={{ flex: 1, height: 54, borderRadius: 16, border: 'none', background: 'black', color: 'white', fontWeight: 800, fontSize: 15 }}>Like ♥</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'matches' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {matches.length === 0 && <div style={{ gridColumn: '1/3', textAlign: 'center', color: '#888', marginTop: 40 }}>No matches yet. Keep liking!</div>}
            {matches.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <img src={p.image} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 10, fontWeight: 700, fontSize: 14 }}>{p.name}, {p.age}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'liked' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {liked.length === 0 && <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>You haven't liked anyone yet.</div>}
            {liked.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 16, padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={p.image} style={{ width: 50, height: 50, borderRadius: 999, objectFit: 'cover' }} />
                <div><div style={{ fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 12, color: '#666' }}>{p.city}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Match Modal */}
      {showMatch && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 28, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>💘</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>It's a Match!</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 6 }}>You and {showMatch.name} liked each other</div>
            <img src={showMatch.image} style={{ width: 90, height: 90, borderRadius: 999, objectFit: 'cover', margin: '20px auto 0', display: 'block' }} />
            <button onClick={() => setShowMatch(null)} style={{ marginTop: 20, width: '100%', height: 50, borderRadius: 999, border: 'none', background: 'black', color: 'white', fontWeight: 800 }}>Keep Swiping</button>
            <button onClick={() => { setShowMatch(null); setTab('matches'); }} style={{ marginTop: 10, width: '100%', height: 50, borderRadius: 999, border: '1px solid #e4e4e7', background: 'white', fontWeight: 800 }}>View Match</button>
          </div>
        </div>
      )}
    </div>
  );
}
