"use client"

import { useState, useMemo } from "react"
import DestinationSearch from "@/components/DestinationSearch"
import MatchRevealCard, { TravelProfile } from "@/components/MatchRevealCard"
import Footer from "@/components/Footer"

const PROFILES: TravelProfile[] = [
  { id: "1", displayName: "Sofia", age: 28, bio: "Solo traveler • Yoga teacher • Chasing sunsets and good coffee. Heading to Ubud for a month to reset.", travelStyles: ["Yoga","Reset","Coffee Hunter"], avatarUrl: "https://i.pravatar.cc/150?img=5", isVerified: true, currentDestination: "Ubud, Bali" },
  { id: "2", displayName: "Kenji", age: 31, bio: "Remote dev • Surf mornings, code nights • Building a nomad community here.", travelStyles: ["Surf","Remote Work"], avatarUrl: "https://i.pravatar.cc/150?img=12", isVerified: true, currentDestination: "Encuentro, Sosua DR" },
  { id: "3", displayName: "Maya", age: 26, bio: "Photographer • Van life • Looking for a buddy to explore waterfalls around Ubud.", travelStyles: ["Photo","Hike","Slow Travel"], avatarUrl: "https://i.pravatar.cc/150?img=32", isVerified: true, currentDestination: "Ubud, Bali" },
]

export default function Home() {
  const [destination, setDestination] = useState("")
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (!destination) return PROFILES
    return PROFILES.filter(p => p.currentDestination.toLowerCase().includes(destination.toLowerCase()))
  }, [destination])

  return (
    <main className="min-h-screen bg-[#FFFBF6] flex flex-col">
      <div className="max-w-6xl mx-auto p-6 md:p-10 w-full flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold tracking-[0.2em]">LIVE IN 42 DESTINATIONS</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-4 leading-[0.9]">Meet travelers<br/>going same way.</h1>
            <p className="opacity-60 mt-3 max-w-[420px]">No swiping fatigue. Filter by destination. Tap to reveal.</p>
          </div>
        </div>

        <div className="mt-8 max-w-[520px]">
          <DestinationSearch value={destination} onChange={setDestination} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filtered.map(p => (
            <MatchRevealCard
              key={p.id}
              profile={p}
              isRevealed={revealed.has(p.id)}
              onReveal={() => setRevealed(s => new Set(s).add(p.id))}
            />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
