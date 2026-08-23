import { useState, useCallback } from "react";

type Suit = "♠" | "♥" | "♣" | "♦";
type Card = { suit: Suit; rank: number; faceUp: boolean };
type Pile = Card[];

const SUITS: Suit[] = ["♠", "♥", "♣", "♦"];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const RANK_LABELS: Record<number, string> = { 1: "A", 11: "J", 12: "Q", 13: "K" };
const LABEL = (r: number) => RANK_LABELS[r] || String(r);

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, faceUp: false });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initGame() {
  const deck = createDeck();
  const tableau: Pile[] = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = col; row < 7; row++) {
      const card = deck[idx++];
      if (row === col) card.faceUp = true;
      tableau[row].push(card);
    }
  }
  const stock: Pile = deck.slice(idx);
  return { stock, waste: [] as Pile, tableau, foundations: [[], [], [], []] as Pile[] };
}

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  menu: { display: "flex", gap: 8, padding: "4px 8px", background: "#ece9d8", borderBottom: "1px solid #7f9db9" },
  menuItem: { cursor: "pointer", fontSize: 12, padding: "2px 6px" },
  top: { display: "flex", justifyContent: "space-between", padding: "6px 8px" },
  topLeft: { display: "flex", gap: 6 },
  topRight: { display: "flex", gap: 4 },
  tableau: { flex: 1, display: "flex", gap: 4, padding: "0 4px" },
  col: { flex: 1, display: "flex", flexDirection: "column", gap: 0, position: "relative" as const },
  card: { width: "100%", height: 28, borderRadius: 4, border: "1px solid #666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", boxSizing: "border-box" as const, position: "relative" as const },
  cardFaceDown: { background: "linear-gradient(135deg, #3a6ea5, #1a3a6a)", color: "transparent" },
  cardEmpty: { width: "100%", height: 28, borderRadius: 4, border: "1px dashed #999", background: "transparent", cursor: "pointer" },
  stockPile: { width: 56, height: 28, borderRadius: 4, border: "1px solid #666", background: "linear-gradient(135deg, #3a6ea5, #1a3a6a)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", color: "transparent" },
  wastePile: { width: 56, height: 28, borderRadius: 4, border: "1px solid #666", background: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  foundation: { width: 56, height: 28, borderRadius: 4, border: "1px solid #666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: "#fff", cursor: "pointer" },
  foundationEmpty: { width: 56, height: 28, borderRadius: 4, border: "1px dashed #999", background: "transparent", cursor: "pointer" },
  selected: { boxShadow: "0 0 0 2px #ff0" },
};

function cardFaceUpStyle(c: Card): React.CSSProperties {
  return { background: "#fff", color: c.suit === "♥" || c.suit === "♦" ? "#c00" : "#000" };
}

function cardSlotStyle(offset: number): React.CSSProperties {
  return { marginTop: offset === 0 ? 0 : -22 };
}

function CardView({ card, selected, onClick, offset }: { card: Card; selected: boolean; onClick: () => void; offset: number }) {
  const base = card.faceUp ? cardFaceUpStyle(card) : s.cardFaceDown;
  return (
    <div style={{ ...s.card, ...base, ...(selected ? s.selected : {}), ...cardSlotStyle(offset) }} onClick={onClick}>
      {card.faceUp ? `${card.suit}${LABEL(card.rank)}` : ""}
    </div>
  );
}

export default function Solitaire(_: { id: string }) {
  const [game, setGame] = useState(initGame);
  const [selected, setSelected] = useState<{ type: "tableau" | "waste" | "foundation"; col: number; cardIndex: number } | null>(null);
  const [wins, setWins] = useState(0);

  const newGame = useCallback(() => { setGame(initGame()); setSelected(null); }, []);

  const flipTop = (pile: Pile): Pile => {
    if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
      const p = [...pile];
      p[p.length - 1] = { ...p[p.length - 1], faceUp: true };
      return p;
    }
    return pile;
  };

  const canPlaceOnTableau = (card: Card, target: Pile): boolean => {
    if (target.length === 0) return card.rank === 13;
    const top = target[target.length - 1];
    if (!top.faceUp) return false;
    const red = card.suit === "♥" || card.suit === "♦";
    const targetRed = top.suit === "♥" || top.suit === "♦";
    return red !== targetRed && card.rank === top.rank - 1;
  };

  const canPlaceOnFoundation = (card: Card, target: Pile): boolean => {
    if (target.length === 0) return card.rank === 1;
    const top = target[target.length - 1];
    return top.suit === card.suit && card.rank === top.rank + 1;
  };

  const handleStockClick = () => {
    setGame((g) => {
      if (g.stock.length === 0 && g.waste.length > 0) {
        return { ...g, stock: [...g.waste].reverse().map((c) => ({ ...c, faceUp: false })), waste: [] };
      }
      const dealt = g.stock.slice(-3);
      const rest = g.stock.slice(0, -3);
      return { ...g, stock: rest, waste: [...g.waste, ...dealt.map((c) => ({ ...c, faceUp: true }))] };
    });
    setSelected(null);
  };

  const handleWasteClick = () => {
    setSelected((prev) => {
      if (prev?.type === "waste" && prev.col === 0) return null;
      return { type: "waste", col: 0, cardIndex: -1 };
    });
  };

  const handleTableauClick = (col: number, idx: number) => {
    const pile = game.tableau[col];
    const clicked = pile[idx];
    if (!clicked.faceUp) return;

    if (selected) {
      if (selected.type === "tableau" && selected.col === col && selected.cardIndex === idx) {
        setSelected(null);
        return;
      }
      let cards: Card[];
      if (selected.type === "tableau") {
        cards = game.tableau[selected.col].slice(selected.cardIndex);
      } else if (selected.type === "waste") {
        cards = [game.waste[game.waste.length - 1]];
      } else return;
      if (cards.length > 0 && canPlaceOnTableau(cards[0], pile)) {
        setGame((g) => {
          const newTableau = g.tableau.map((p) => [...p]);
          if (selected.type === "tableau") {
            newTableau[selected.col] = flipTop(g.tableau[selected.col].slice(0, selected.cardIndex));
          }
          newTableau[col] = [...newTableau[col], ...cards];
          const newWaste = selected.type === "waste" ? g.waste.slice(0, -1) : g.waste;
          return { ...g, tableau: newTableau, waste: newWaste };
        });
        setSelected(null);
      }
      return;
    }

    if (idx === pile.length - 1 && pile.length > 0) {
      const fIdx = SUITS.indexOf(pile[idx].suit);
      if (canPlaceOnFoundation(pile[idx], game.foundations[fIdx])) {
        setGame((g) => {
          const newTableau = g.tableau.map((p) => [...p]);
          newTableau[col] = flipTop(g.tableau[col].slice(0, -1));
          const newFoundations = g.foundations.map((p) => [...p]);
          newFoundations[fIdx] = [...newFoundations[fIdx], pile[idx]];
          const won = newFoundations.every((f) => f.length === 13);
          if (won) setWins((w) => w + 1);
          return { ...g, tableau: newTableau, foundations: newFoundations };
        });
        return;
      }
    }
    setSelected({ type: "tableau", col, cardIndex: idx });
  };

  const handleFoundationClick = (fIdx: number) => {
    if (selected) {
      let cards: Card[];
      if (selected.type === "tableau") {
        const pile = game.tableau[selected.col];
        const card = pile[pile.length - 1];
        if (!card || pile.length - 1 !== selected.cardIndex) return;
        cards = [card];
      } else if (selected.type === "waste") {
        cards = [game.waste[game.waste.length - 1]];
      } else return;
      if (cards.length > 0 && canPlaceOnFoundation(cards[0], game.foundations[fIdx])) {
        setGame((g) => {
          const newTableau = g.tableau.map((p) => [...p]);
          if (selected.type === "tableau") {
            newTableau[selected.col] = flipTop(g.tableau[selected.col].slice(0, -1));
          }
          const newFoundations = g.foundations.map((p) => [...p]);
          newFoundations[fIdx] = [...newFoundations[fIdx], cards[0]];
          const newWaste = selected.type === "waste" ? g.waste.slice(0, -1) : g.waste;
          const won = newFoundations.every((f) => f.length === 13);
          if (won) setWins((w) => w + 1);
          return { ...g, tableau: newTableau, foundations: newFoundations, waste: newWaste };
        });
        setSelected(null);
      }
    }
  };

  return (
    <div style={s.container}>
      <div style={s.menu}>
        <span style={s.menuItem} onClick={newGame}>New Game</span>
        <span style={{ ...s.menuItem, marginLeft: "auto" }}>Wins: {wins}</span>
      </div>
      <div style={s.top}>
        <div style={s.topLeft}>
          <div style={s.stockPile} onClick={handleStockClick}>♠</div>
          <div style={s.wastePile} onClick={handleWasteClick} onDoubleClick={() => {
            if (game.waste.length === 0) return;
            const card = game.waste[game.waste.length - 1];
            const fIdx = SUITS.indexOf(card.suit);
            if (canPlaceOnFoundation(card, game.foundations[fIdx])) {
              setGame((g) => {
                const newFoundations = g.foundations.map((p) => [...p]);
                newFoundations[fIdx] = [...newFoundations[fIdx], card];
                const won = newFoundations.every((f) => f.length === 13);
                if (won) setWins((w) => w + 1);
                return { ...g, foundations: newFoundations, waste: g.waste.slice(0, -1) };
              });
            }
          }}>
            {game.waste.length > 0 ? `${game.waste[game.waste.length - 1].suit}${LABEL(game.waste[game.waste.length - 1].rank)}` : ""}
          </div>
        </div>
        <div style={s.topRight}>
          {game.foundations.map((pile, i) => (
            <div key={i} style={pile.length > 0 ? { ...s.foundation, color: pile[pile.length - 1].suit === "♥" || pile[pile.length - 1].suit === "♦" ? "#c00" : "#000" } : s.foundationEmpty} onClick={() => handleFoundationClick(i)}>
              {pile.length > 0 ? `${pile[pile.length - 1].suit}${LABEL(pile[pile.length - 1].rank)}` : SUITS[i]}
            </div>
          ))}
        </div>
      </div>
      <div style={s.tableau}>
        {game.tableau.map((pile, col) => (
          <div key={col} style={s.col}>
            {pile.length === 0 ? (
              <div style={s.cardEmpty} onClick={() => {
                if (selected) {
                  if (selected.type === "waste") {
                    const card = game.waste[game.waste.length - 1];
                    if (canPlaceOnTableau(card, [])) {
                      setGame((g) => {
                        const newTableau = g.tableau.map((p) => [...p]);
                        newTableau[col] = [card];
                        return { ...g, tableau: newTableau, waste: g.waste.slice(0, -1) };
                      });
                      setSelected(null);
                    }
                  }
                }
              }} />
            ) : pile.map((card, idx) => (
              <CardView key={idx} card={card} selected={selected?.type === "tableau" && selected.col === col && selected.cardIndex === idx} onClick={() => handleTableauClick(col, idx)} offset={idx} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
