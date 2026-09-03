import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'GlobalMatch', description: 'Find your global match' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{margin:0, background:'#000'}}>{children}</body></html>
}
