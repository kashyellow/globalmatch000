"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
const DESTINATIONS = [
  { country: "Dominican Republic", city: "Encuentro, Sosua DR", slug: "encuentro-sosua-dr", flag: "🇩🇴" },
  { country: "Indonesia", city: "Ubud, Bali", slug: "ubud-bali", flag: "🇮🇩" },
  { country: "Indonesia", city: "Canggu, Bali", slug: "canggu-bali", flag: "🇮🇩" },
  { country: "Colombia", city: "Medellin", slug: "medellin-colombia", flag: "🇨🇴" },
  { country: "Portugal", city: "Lisbon", slug: "lisbon-portugal", flag: "🇵🇹" },
  { country: "Mexico", city: "Mexico City", slug: "mexico-city-mexico", flag: "🇲🇽" },
  { country: "Thailand", city: "Chiang Mai", slug: "chiang-mai-thailand", flag: "🇹🇭" },
]
export default function DestinationSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const filtered = useMemo(() => {
    if (!query) return DESTINATIONS.slice(0, 8)
    const q = query.toLowerCase()
    return DESTINATIONS.filter(d => d.country.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)).slice(0, 10)
  }, [query])
  return (
    <div className="relative w-full max-w-[520px]">
      <div className="relative">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }} onFocus={() => setIsOpen(true)} placeholder="Search country or city..." className="w-full pl-11 pr-4 py-4 bg-white border-2 border-black rounded-full text-[15px] shadow-[4px_4px_0px_0px_black]" />
      </div>
      {isOpen && (
        <div className="absolute top-[60px] w-full bg-white border-2 border-black rounded-[20px] shadow-[6px_6px_0px_0px_black] z-50">
          <div className="p-3">{filtered.map(d => (<button key={d.slug} onClick={() => { router.push(`/hub/${d.slug}`); setIsOpen(false) }} className="w-full text-left px-3 py-3 rounded-xl hover:bg-black hover:text-white flex justify-between">{d.flag} {d.city} →</button>))}</div>
        </div>
      )}
    </div>
  )
}
