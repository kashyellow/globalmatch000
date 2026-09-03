"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Works with both old and new Supabase keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl as string, supabaseKey as string)
    : null;

type Profile = {
  id: number;
  name: string;
  age: number;
  bio: string;
  image: string;
};

const PROFILES: Profile[] = [
  { id: 1, name: "Sofia", age: 27, bio: "Loves hiking and coffee. Based in Boston.", image: "https://i.pravatar.cc/400?img=5" },
  { id: 2, name: "Marcus", age: 29, bio: "Engineer, gym, travel. Looking for something real.", image: "https://i.pravatar.cc/400?img=8" },
  { id: 3, name: "Aisha", age: 26, bio: "Artist + dog mom. Let's explore the city.", image: "https://i.pravatar.cc/400?img=32" },
];

export default function Page() {
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);

  const cur = PROFILES[idx % PROFILES.length];
  const hasKeys = !!supabase;

  const handleLike = async () => {
    setLiked((l) => [...l, cur]);
    if (Math.random() > 0.5) {
      setMatches((m) => [...m, cur]);
    }

    // Safe Supabase insert - no .catch() after await
    if (supabase) {
      const { error } = await supabase.from("likes").insert({
        profile_name: cur.name,
        profile_age: cur.age,
      });
      if (error) {
        console.error("Supabase insert failed:", error.message);
      }
    }

    setIdx((i) => i + 1);
  };

  const handlePass = () => {
    setIdx((i) => i + 1);
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">GlobalMatch</h1>
        <p className="text-sm text-zinc-500 mb-4">
          {hasKeys ? `Connected to Supabase ✓ - ${PROFILES.length} profiles` : "Connected to Supabase: Add keys in Vercel Settings"}
        </p>

        {!hasKeys && (
          <div className="bg-yellow-100 border border-yellow-300 p-3 rounded text-sm mb-4">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel &gt; Settings &gt; Environment Variables, then Redeploy.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cur.image} alt={cur.name} className="w-full h-96 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold">{cur.name}, {cur.age}</h2>
            <p className="text-sm text-zinc-600 mt-1">{cur.bio}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={handlePass} className="flex-1 py-3 rounded-xl bg-zinc-200 font-semibold">Pass</button>
              <button onClick={handleLike} className="flex-1 py-3 rounded-xl bg-black text-white font-semibold">Like ❤️</button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-zinc-500">
          Liked: {liked.length} | Matches: {matches.length}
        </div>
      </div>
    </main>
  );
}
