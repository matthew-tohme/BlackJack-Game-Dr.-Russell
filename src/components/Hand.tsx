import React from 'react'
import Card from './Card'
import type { Card as TCard } from '../game/engine'

export default function Hand({ cards, hideFirst=false }: { cards: TCard[], hideFirst?: boolean }) {
  return (
    <div className="flex gap-2">
      {cards.map((c, i) => (
        <Card key={i} card={c} hidden={hideFirst && i === 0} />
      ))}
    </div>
  )
}
