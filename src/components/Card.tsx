import React from 'react'
import type { Card as TCard } from '../game/engine'

const suitColor = (s: TCard['suit']) => (s === '♦' || s === '♥' ? 'text-rose-400' : 'text-sky-200')

export default function Card({ card, hidden=false }: { card: TCard, hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="w-16 h-24 bg-slate-800/80 rounded-xl border border-slate-700 shadow-glow flex items-center justify-center">
        <div className="w-10 h-16 bg-slate-700/80 rounded-lg" />
      </div>
    )
  }
  return (
    <div className="w-16 h-24 bg-slate-900 rounded-xl border border-slate-700 shadow-glow p-1 flex flex-col justify-between">
      <div className="text-sm text-slate-300">{card.rank}</div>
      <div className={`text-center text-2xl ${suitColor(card.suit)}`}>{card.suit}</div>
      <div className="flex justify-end text-sm text-slate-300">{card.rank}</div>
    </div>
  )
}
