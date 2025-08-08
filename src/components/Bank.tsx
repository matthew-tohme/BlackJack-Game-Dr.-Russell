import React from 'react'

export default function Bank({ bank, bet, setBet, phase }:{ bank:number, bet:number, setBet:(n:number)=>void, phase:'betting'|'player'|'dealer'|'settle'}) {
  const disabled = phase !== 'betting'
  return (
    <div className="flex items-center gap-4">
      <div className="text-slate-300">Bank: <span className="font-semibold text-white">${bank}</span></div>
      <div className="flex items-center gap-2">
        <label className="text-slate-300">Bet</label>
        <input
          type="number"
          min={1}
          max={bank}
          step={1}
          value={bet}
          onChange={e => setBet(Math.max(1, Math.min(Number(e.target.value || 1), bank)))}
          disabled={disabled}
          className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-white disabled:opacity-60"
        />
      </div>
    </div>
  )
}
