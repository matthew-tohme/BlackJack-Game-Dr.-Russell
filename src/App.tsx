import React, { useMemo, useState } from 'react'
import Bank from './components/Bank'
import Hand from './components/Hand'
import { createInitialState, startRound, deal, dealerPlay, handValue, GameState } from './game/engine'

export default function App() {
  const [state, setState] = useState<GameState>(() => createInitialState())

  const pv = useMemo(() => handValue(state.player).total, [state.player])
  const dv = useMemo(() => handValue(state.dealer).total, [state.dealer])

  function start() {
    if (state.bet < 1 || state.bet > state.bank) return
    setState(s => {
      const ns = { ...s, bank: s.bank - s.bet, phase: 'player' as const }
      startRound(ns)
      return { ...ns }
    })
  }

  function hit() {
    if (state.phase !== 'player') return
    setState(s => {
      const ns = { ...s }
      deal(ns, 1, 'player')
      const v = handValue(ns.player).total
      if (v > 21) {
        ns.phase = 'settle'
        ns.message = 'You busted.'
      }
      return ns
    })
  }

  function stand() {
    if (state.phase !== 'player') return
    setState(s => {
      const ns = { ...s, phase: 'dealer' as const }
      dealerPlay(ns)
      return ns
    })
  }

  function nextRound() {
    setState(s => ({ ...createInitialState(), bank: s.bank, bet: s.bet }))
  }

  function setBet(n:number) {
    setState(s => ({ ...s, bet: n }))
  }

  const isBetting = state.phase === 'betting'

  return (
    <div className="min-h-screen text-slate-200 bg-gradient-to-b from-slate-950 to-slate-900">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 shadow-glow grid place-items-center text-sky-300 font-bold">BJ</div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Matthew's Blackjack</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Table</div>
              <Bank bank={state.bank} bet={state.bet} setBet={setBet} phase={state.phase} />
            </div>

            <section className="mb-6">
              <div className="text-sm text-slate-400 mb-2">Dealer</div>
              <Hand cards={state.dealer.cards} hideFirst={state.phase==='player'} />
              <div className="mt-2 text-slate-300">Total: {state.phase==='player' ? '??' : dv}</div>
            </section>

            <section className="mb-6">
              <div className="text-sm text-slate-400 mb-2">You</div>
              <Hand cards={state.player.cards} />
              <div className="mt-2 text-slate-300">Total: {pv}</div>
            </section>

            <div className="flex items-center gap-3">
              {isBetting ? (
                <button onClick={start} className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold">Deal</button>
              ) : state.phase === 'player' ? (
                <>
                  <button onClick={hit} className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold">Hit</button>
                  <button onClick={stand} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-semibold">Stand</button>
                </>
              ) : state.phase === 'settle' ? (
                <button onClick={nextRound} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">New Round</button>
              ) : null}
            </div>

            {state.message && (
              <div className="mt-4 p-3 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200">
                {state.message}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h2 className="text-lg font-semibold">How to play</h2>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
              <li>Set your bet then press Deal</li>
              <li>You act first</li>
              <li>Dealer hits on soft 17</li>
              <li>Push returns your bet</li>
            </ul>
          </aside>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Blackjack Classic. For demonstration only.
      </footer>
    </div>
  )
}
