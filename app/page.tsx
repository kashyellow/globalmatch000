"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl as string, supabaseKey as string)
    : null;

const PROFILES = [
  { id: 1, name: "Sofia", age: 27, bio: "Loves hiking and coffee. Based in Boston.", image: "https://i.pravatar.cc/600?img=5" },
  { id: 2, name: "Marcus", age: 29, bio: "Engineer, gym, travel. Looking for something real.", image: "https://i.pravatar.cc/600?img=8" },
  { id: 3, name: "Aisha", age: 26, bio: "Artist + dog mom. Let's explore the city.", image: "https://i.pravatar.cc/600?img=32" },
];

export default function Page() {
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<typeof PROFILES>([]);

  const cur = PROFILES[idx % PROFILES.length];
  const hasKeys = !!supabase;

  const handleLike = async () => {
    setLiked((l) => [...l, cur]);
    if (supabase) {
      const { error } = await supabase.from("likes").insert({ profile_name: cur.name, profile_age: cur.age });
      if (error) console.error(error.message);
    }
    setIdx((i) => i + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px 0' }}>GlobalMatch</h1>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          {hasKeys ? `Connected to Supabase ✓` : `Add keys in Vercel Settings`}
        </p>
        <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <img src={cur.image} alt={cur.name} style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }} />
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{cur.name}, {cur.age}</div>
            <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>{cur.bio}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={() => setIdx(i => i + 1)} style={{ flex: 1, padding: '14px 0', borderRadius: 12, border: '1px solid #ddd', background: 'white', fontWeight: 700 }}>Pass</button>
              <button onClick={handleLike} style={{ flex: 1, padding: '14px 0', borderRadius: 12, border: 'none', background: 'black', color: 'white', fontWeight: 700 }}>Like ❤️</button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: '#888' }}>Liked: {liked.length}</div>
      </div>
    </div>
  );
}
