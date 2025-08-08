export type Suit = '♦' | '♣' | '♥' | '♠'
export type Rank = 'A'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'

export interface Card { suit: Suit; rank: Rank }
export interface Hand { cards: Card[] }
export type Phase = 'betting' | 'player' | 'dealer' | 'settle'

export interface GameState {
  deck: Card[]
  player: Hand
  dealer: Hand
  bank: number
  bet: number
  phase: Phase
  message?: string
}

export function newDeck(): Card[] {
  const suits: Suit[] = ['♦','♣','♥','♠']
  const ranks: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
  const deck: Card[] = []
  for (const r of ranks) for (const s of suits) deck.push({ rank: r, suit: s })
  return shuffle(deck)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function cardValue(card: Card): number {
  if (card.rank === 'A') return 11 // will be downgraded to 1 if needed
  if (card.rank === '10' || card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') return 10
  return parseInt(card.rank, 10)
}

// Returns total and whether the hand is soft (at least one Ace counted as 11)
export function handValue(hand: Hand): { total: number; soft: boolean } {
  // Sum as if all Aces are 1, then upgrade one Ace to 11 if it does not bust
  let total = 0
  let aces = 0
  for (const c of hand.cards) {
    if (c.rank === 'A') aces += 1
    else total += cardValue(c)
  }
  // Add all aces as 1
  total += aces
  let soft = false
  // Upgrade one ace to 11 if it fits
  if (aces > 0 && total + 10 <= 21) {
    total += 10
    soft = true
  }
  return { total, soft }
}

export function deal(state: GameState, n: number, to: 'player' | 'dealer') {
  for (let i = 0; i < n; i++) {
    const card = state.deck.pop()
    if (!card) return
    if (to === 'player') state.player.cards.push(card)
    else state.dealer.cards.push(card)
  }
}

export function startRound(state: GameState) {
  state.deck = newDeck()
  state.player = { cards: [] }
  state.dealer = { cards: [] }
  state.message = undefined
  state.phase = 'player'
  deal(state, 2, 'player')
  deal(state, 2, 'dealer')
}

export function settle(state: GameState) {
  const pv = handValue(state.player).total
  const dv = handValue(state.dealer).total
  if (pv > 21) {
    state.message = 'You busted.'
  } else if (dv > 21) {
    state.message = 'Dealer busted. You win!'
    state.bank += state.bet * 2
  } else if (pv > dv) {
    state.message = 'You win!'
    state.bank += state.bet * 2
  } else if (pv < dv) {
    state.message = 'Dealer wins.'
  } else {
    state.message = 'Push. Bet returned.'
    state.bank += state.bet
  }
  state.phase = 'settle'
}

export function dealerPlay(state: GameState) {
  // Dealer hits until 17 or more. Hits soft 17.
  let dv = handValue(state.dealer)
  while (dv.total < 17 || (dv.total === 17 && dv.soft)) {
    deal(state, 1, 'dealer')
    dv = handValue(state.dealer)
  }
  settle(state)
}

export function createInitialState(): GameState {
  return {
    deck: newDeck(),
    player: { cards: [] },
    dealer: { cards: [] },
    bank: 200,
    bet: 10,
    phase: 'betting',
    message: undefined,
  }
}
