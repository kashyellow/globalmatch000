import DestinationSearch from "@/components/DestinationSearch"
import MatchRevealCard from "@/components/MatchRevealCard"
import Footer from "@/components/Footer"

const mockProfiles = [
  { id: "1", displayName: "Sofia", age: 28, bio: "Solo traveler • Yoga teacher • Chasing sunsets and good coffee. Heading to Ubud for a month to reset.", travelStyles: ["Yoga","Reset","Coffee Hunter"], avatarUrl: "https://i.pravatar.cc/150?img=5", isVerified: true, currentDestination: "Ubud, Bali" },
  { id: "2", displayName: "Kenji", age: 31, bio: "Remote dev • Surf mornings, code nights • Building a nomad community here.", travelStyles: ["Surf","Remote Work"], avatarUrl: "https://i.pravatar.cc/150?img=12", isVerified: true, currentDestination: "Encuentro, Sosua DR" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFBF6]">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-black tracking-tight">LIVE IN 42 DESTINATIONS</h1>
        <p className="opacity-60 mt-2">Meet travelers heading to same destination. No swiping fatigue. Blur-to-reveal ON.</p>
        <div className="mt-6 max-w-[520px]">
          <DestinationSearch />
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {mockProfiles.map(p => <MatchRevealCard key={p.id} profile={p} />)}
        </div>
      </div>
      <Footer />
    </main>
  )
}
