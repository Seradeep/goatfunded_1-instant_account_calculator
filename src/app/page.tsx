'use client';

import { useState } from 'react';
import Calculator from '@/components/Calculator';
import ConsistencyCalculator from '@/components/ConsistencyCalculator';

export default function Home() {
  const [activeView, setActiveView] = useState<'calculator' | 'consistency'>('consistency');

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[rgba(255,215,0,0.05)] to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--primary)] opacity-5 blur-[100px] rounded-full pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Goat Funded Instant Account Calculator",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "A free tool to calculate consistency rules, valid trading days, and payouts for Goat Funded Trader instant accounts.",
              "featureList": "Consistency Calculator, Risk Management, Payout Estimator, Prop Firm Rules",
              "author": {
                "@type": "Organization",
                "name": "Goat Funded Community"
              }
            })
          }}
        />

        <div className="flex flex-col items-center justify-center mb-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
            <span className="text-3xl font-bold text-black">G</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-center tracking-tight">
            GOAT <span className="text-[var(--primary)]">FUNDED</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl text-center">
            Instant Account Calculator & Risk Manager
          </p>
        </div>

        {/* Rack Navigation */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-1 px-4 relative z-10 bottom-[-1px]">
            <button
              onClick={() => setActiveView('consistency')}
              className={`group relative px-6 py-3 rounded-t-xl font-bold text-sm tracking-widest transition-all duration-200 border-t border-x ${activeView === 'consistency'
                ? 'bg-[var(--surface-1)] border-[var(--surface-3)] text-[var(--success)] z-20'
                : 'bg-[#050505] border-transparent text-[var(--text-tertiary)] hover:bg-[var(--surface-1)]/50 hover:text-[var(--text-secondary)]'
                }`}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-colors ${activeView === 'consistency' ? 'text-[var(--success)]' : 'group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
                ANALYZER
              </div>
              {activeView === 'consistency' && (
                <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-[var(--surface-1)]" />
              )}
            </button>

            <button
              onClick={() => setActiveView('calculator')}
              className={`group relative px-6 py-3 rounded-t-xl font-bold text-sm tracking-widest transition-all duration-200 border-t border-x ${activeView === 'calculator'
                ? 'bg-[var(--surface-1)] border-[var(--surface-3)] text-[var(--primary)] z-20'
                : 'bg-[#050505] border-transparent text-[var(--text-tertiary)] hover:bg-[var(--surface-1)]/50 hover:text-[var(--text-secondary)]'
                }`}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-colors ${activeView === 'calculator' ? 'text-[var(--primary)]' : 'group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25" />
                </svg>
                PLANNER
              </div>
              {/* Active Tab Connector hiding the border line */}
              {activeView === 'calculator' && (
                <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-[var(--surface-1)]" />
              )}
            </button>
          </div>

          {/* Main Folder Body */}
          <div className="bg-[var(--surface-1)] border border-[var(--surface-3)] rounded-b-2xl rounded-tr-2xl rounded-tl-sm p-1 pt-6 relative shadow-2xl shadow-black/50 min-h-[600px]">
            {/* Diagonal corner for visual flair if planner is active, or generic rounded */}

            <div className="animate-in fade-in zoom-in-95 duration-300">
              {activeView === 'calculator' ? <Calculator /> : <ConsistencyCalculator />}
            </div>
          </div>
        </div>


        <footer className="mt-20 text-center text-sm text-[var(--text-tertiary)] space-y-4 max-w-2xl mx-auto opacity-75 hover:opacity-100 transition-opacity">

          {/* Personal Dedication */}
          <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
            <p className="text-[10px] text-gray-500 font-mono italic">
              ✨ Built for my friend <span className="text-[var(--primary)] font-bold">Sriram</span>, mostly so he stops calling me to do the math 📞�
            </p>
          </div>

          <p>© {new Date().getFullYear()} Goat Funded Trader Tools. Unofficial Utility.</p>
          <div className="text-xs border-t border-white/10 pt-4">
            <p className="font-semibold text-[var(--warning)] mb-1">⚠️ Disclaimer</p>
            <p>
              This tool is for educational and planning purposes only. Computers and software can make mistakes.
              Always cross-check the results with your official account dashboard and rules.
              We are not responsible for any financial losses or account breaches.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
