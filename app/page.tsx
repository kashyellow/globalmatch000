export default function Page() {
  return (
    <main style={{fontFamily:'ui-sans-system,-apple-system,BlinkMacSystemFont,Inter,sans-serif',background:'#0a0a0a',color:'#fafafa',minHeight:'100vh',lineHeight:1.6}}>
      <style>{`
        .wrap{max-width:1100px;margin:0 auto;padding:0 24px}
        nav{height:64px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #222;position:sticky;top:0;background:rgba(10,10,10,.8);backdrop-filter:blur(12px);z-index:10}
        .logo{font-weight:700;display:flex;gap:8px;align-items:center}
        .logo i{width:28px;height:28px;background:#fff;color:#000;display:grid;place-items:center;border-radius:8px;font-style:normal;font-weight:900}
        .btn{padding:10px 18px;border-radius:999px;border:1px solid #222;background:#fafafa;color:#000;font-weight:600;font-size:14px;cursor:pointer}
        .btn-ghost{background:transparent;color:#fafafa}
        .hero{padding:100px 0 60px;text-align:center}
        .badge{display:inline-flex;gap:8px;align-items:center;padding:6px 12px;border:1px solid #222;border-radius:999px;font-size:12px;color:#a1a1aa;margin-bottom:24px;background:#121212}
        .badge span{width:6px;height:6px;background:#22c55e;border-radius:50%}
        h1{font-size:clamp(36px,7vw,72px);line-height:.95;letter-spacing:-.04em;font-weight:800;max-width:800px;margin:0 auto 20px}
        h1 em{font-style:normal;background:linear-gradient(180deg,#fff,#888);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .sub{font-size:19px;color:#a1a1aa;max-width:560px;margin:0 auto 32px}
        .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:80px 0}
        .card{background:#121212;border:1px solid #222;border-radius:16px;padding:24px;text-align:left}
        .card h3{font-size:15px;margin-bottom:8px}
        .card p{font-size:14px;color:#a1a1aa}
        .deploy{background:#fff;color:#000;border-radius:20px;padding:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin:20px 0 80px}
        footer{border-top:1px solid #222;padding:32px 0;color:#a1a1aa;font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap}
        @media(max-width:800px){.grid{grid-template-columns:1fr}.hero{padding:60px 0 40px}}
      `}</style>

      <div className="wrap">
        <nav>
          <div className="logo"><i>S</i> Site</div>
          <a className="btn btn-ghost" href="mailto:hello@example.com">Contact</a>
        </nav>

        <section className="hero">
          <div className="badge"><span></span> Deployed on Vercel • Zero config</div>
          <h1>Your site is <em>live</em> in one file.</h1>
          <p className="sub">You are editing <code>app/page.tsx</code> — this is your homepage. Save this file and Vercel will auto-deploy.</p>
          <div className="cta">
            <a className="btn" href="#features">Get Started</a>
            <a className="btn btn-ghost" href="https://vercel.com">Vercel →</a>
          </div>

          <div id="features" className="grid">
            <div className="card"><div>⚡</div><h3>Instant Deploy</h3><p>Push to main branch and Vercel redeploys automatically.</p></div>
            <div className="card"><div>🎨</div><h3>Fully Editable</h3><p>All code is in this one file. Change text, colors, sections.</p></div>
            <div className="card"><div>🔒</div><h3>ZDR Ready</h3><p>Static UI, no data collection. Works with your ZDR settings.</p></div>
          </div>

          <div className="deploy">
            <div>
              <strong>How it works</strong><br/>
              <span style={{opacity:.7,fontSize:'14px'}}>Edit app/page.tsx → Commit → Live in 30s</span>
            </div>
            <code style={{background:'#000',color:'#fff',padding:'8px 12px',borderRadius:'8px'}}>git push</code>
          </div>
        </section>

        <footer>
          <div>© {new Date().getFullYear()} Your Brand</div>
          <div>Edit this in app/page.tsx</div>
        </footer>
      </div>
    </main>
  )
}
