import { useState, useEffect, useRef, useCallback } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

type Suit = "♠" | "♥" | "♣" | "♦";
type Card = { suit: Suit; rank: number; faceUp: boolean; id: string };
type Pile = Card[];

const SUITS: Suit[] = ["♠", "♥", "♣", "♦"];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, faceUp: false, id: `card-${++id}` });
    }
  }
  return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initGame() {
  const deck = createDeck();
  const tableau: Pile[] = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let row = 0; row < 7; row++) {
    for (let col = row; col < 7; col++) {
      const card = { ...deck[idx++] };
      if (row === col) card.faceUp = true;
      tableau[col].push(card);
    }
  }
  const stock: Pile = deck.slice(idx);
  return { stock, waste: [] as Pile, tableau, foundations: [[], [], [], []] as Pile[] };
}

function flipTop(pile: Pile): Pile {
  if (pile.length === 0) return pile;
  const last = { ...pile[pile.length - 1], faceUp: true };
  return [...pile.slice(0, -1), last];
}

const RANK_LABELS: Record<number, string> = {
  1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "J", 12: "Q", 13: "K",
};

export default function Solitaire({ id }: { id: string }) {
  const [game, setGame] = useState(initGame);
  const [selected, setSelected] = useState<{
    type: "tableau" | "waste" | "foundation";
    col: number;
    cardIndex: number;
  } | null>(null);
  const [drawThree, setDrawThree] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const closeWindow = useWindowStore((s) => s.closeWindow);
  const t = useLangStore((s) => s.t);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((time) => Math.min(9999, time + 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const newGame = useCallback(() => {
    setGame(initGame());
    setSelected(null);
    setScore(0);
    setTimer(0);
    setIsWon(false);
  }, []);

  const canPlaceOnTableau = (card: Card, target: Pile): boolean => {
    if (target.length === 0) return card.rank === 13;
    const top = target[target.length - 1];
    if (!top.faceUp) return false;
    const isRed = card.suit === "♥" || card.suit === "♦";
    const targetRed = top.suit === "♥" || top.suit === "♦";
    return isRed !== targetRed && card.rank === top.rank - 1;
  };

  const canPlaceOnFoundation = (card: Card, target: Pile): boolean => {
    if (target.length === 0) return card.rank === 1;
    const top = target[target.length - 1];
    return top.suit === card.suit && card.rank === top.rank + 1;
  };

  const checkWin = (foundations: Pile[]) => {
    const won = foundations.every((f) => f.length === 13);
    if (won && !isWon) {
      setIsWon(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleStockClick = () => {
    if (isWon) return;
    if (game.stock.length === 0) {
      if (game.waste.length === 0) return;
      const newStock = game.waste.map((c) => ({ ...c, faceUp: false })).reverse();
      setGame((g) => ({ ...g, stock: newStock, waste: [] }));
      setScore((s) => Math.max(0, s - 20));
      return;
    }
    const count = drawThree ? Math.min(3, game.stock.length) : 1;
    const drawn = game.stock.slice(-count).map((c) => ({ ...c, faceUp: true }));
    const newStock = game.stock.slice(0, -count);
    setGame((g) => ({ ...g, stock: newStock, waste: [...g.waste, ...drawn] }));
    setSelected(null);
  };

  const autoMoveToFoundation = (card: Card, fromTableauCol?: number) => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      if (canPlaceOnFoundation(card, game.foundations[fIdx])) {
        setGame((g) => {
          const newFoundations = g.foundations.map((p) => [...p]);
          newFoundations[fIdx] = [...newFoundations[fIdx], card];
          let newTableau = g.tableau;
          let newWaste = g.waste;
          if (fromTableauCol !== undefined) {
            newTableau = g.tableau.map((p) => [...p]);
            newTableau[fromTableauCol] = flipTop(g.tableau[fromTableauCol].slice(0, -1));
          } else {
            newWaste = g.waste.slice(0, -1);
          }
          checkWin(newFoundations);
          return { ...g, foundations: newFoundations, tableau: newTableau, waste: newWaste };
        });
        setScore((s) => s + 10);
        setSelected(null);
        return true;
      }
    }
    return false;
  };

  const handleTableauClick = (col: number, idx: number) => {
    if (isWon) return;
    const pile = game.tableau[col];
    if (idx < 0 || idx >= pile.length) return;
    const clickedCard = pile[idx];

    if (!clickedCard.faceUp) {
      if (idx === pile.length - 1) {
        setGame((g) => {
          const newTableau = g.tableau.map((p) => [...p]);
          newTableau[col] = flipTop(newTableau[col]);
          return { ...g, tableau: newTableau };
        });
        setScore((s) => s + 5);
      }
      return;
    }

    if (selected) {
      if (selected.type === "tableau" && selected.col === col) {
        setSelected(null);
        return;
      }

      let movingCards: Card[] = [];
      if (selected.type === "tableau") {
        movingCards = game.tableau[selected.col].slice(selected.cardIndex);
      } else if (selected.type === "waste") {
        movingCards = [game.waste[game.waste.length - 1]];
      } else if (selected.type === "foundation") {
        movingCards = [game.foundations[selected.col][game.foundations[selected.col].length - 1]];
      }

      if (movingCards.length > 0 && canPlaceOnTableau(movingCards[0], pile)) {
        setGame((g) => {
          const newTableau = g.tableau.map((p) => [...p]);
          let newWaste = g.waste;
          let newFoundations = g.foundations;

          if (selected.type === "tableau") {
            newTableau[selected.col] = flipTop(g.tableau[selected.col].slice(0, selected.cardIndex));
          } else if (selected.type === "waste") {
            newWaste = g.waste.slice(0, -1);
            setScore((s) => s + 5);
          } else if (selected.type === "foundation") {
            newFoundations = g.foundations.map((p) => [...p]);
            newFoundations[selected.col].pop();
            setScore((s) => Math.max(0, s - 15));
          }

          newTableau[col] = [...newTableau[col], ...movingCards];
          return { ...g, tableau: newTableau, waste: newWaste, foundations: newFoundations };
        });
        setSelected(null);
        return;
      }
    }

    setSelected({ type: "tableau", col, cardIndex: idx });
  };

  const handleEmptyColumnClick = (col: number) => {
    if (!selected || isWon) return;
    let movingCards: Card[] = [];
    if (selected.type === "tableau") {
      movingCards = game.tableau[selected.col].slice(selected.cardIndex);
    } else if (selected.type === "waste") {
      movingCards = [game.waste[game.waste.length - 1]];
    } else if (selected.type === "foundation") {
      movingCards = [game.foundations[selected.col][game.foundations[selected.col].length - 1]];
    }

    if (movingCards.length > 0 && canPlaceOnTableau(movingCards[0], [])) {
      setGame((g) => {
        const newTableau = g.tableau.map((p) => [...p]);
        let newWaste = g.waste;
        let newFoundations = g.foundations;

        if (selected.type === "tableau") {
          newTableau[selected.col] = flipTop(g.tableau[selected.col].slice(0, selected.cardIndex));
        } else if (selected.type === "waste") {
          newWaste = g.waste.slice(0, -1);
          setScore((s) => s + 5);
        } else if (selected.type === "foundation") {
          newFoundations = g.foundations.map((p) => [...p]);
          newFoundations[selected.col].pop();
        }

        newTableau[col] = movingCards;
        return { ...g, tableau: newTableau, waste: newWaste, foundations: newFoundations };
      });
      setSelected(null);
    }
  };

  const handleFoundationClick = (fIdx: number) => {
    if (!selected || isWon) return;
    let card: Card | undefined;
    if (selected.type === "tableau") {
      const pile = game.tableau[selected.col];
      if (selected.cardIndex === pile.length - 1) card = pile[pile.length - 1];
    } else if (selected.type === "waste") {
      card = game.waste[game.waste.length - 1];
    }

    if (card && canPlaceOnFoundation(card, game.foundations[fIdx])) {
      setGame((g) => {
        const newFoundations = g.foundations.map((p) => [...p]);
        newFoundations[fIdx] = [...newFoundations[fIdx], card!];
        let newTableau = g.tableau;
        let newWaste = g.waste;

        if (selected.type === "tableau") {
          newTableau = g.tableau.map((p) => [...p]);
          newTableau[selected.col] = flipTop(g.tableau[selected.col].slice(0, -1));
        } else {
          newWaste = g.waste.slice(0, -1);
        }

        checkWin(newFoundations);
        return { ...g, foundations: newFoundations, tableau: newTableau, waste: newWaste };
      });
      setScore((s) => s + 10);
      setSelected(null);
    }
  };

  useEffect(() => {
    if (!isWon) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    interface BouncingCard {
      x: number;
      y: number;
      vx: number;
      vy: number;
      suit: Suit;
      rank: number;
    }

    const cardsToBounce: BouncingCard[] = [];
    game.foundations.forEach((f, fIdx) => {
      f.forEach((c) => {
        cardsToBounce.push({
          x: 240 + fIdx * 65,
          y: 40,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * -4 - 2,
          suit: c.suit,
          rank: c.rank,
        });
      });
    });

    let activeCardIndex = 0;
    const activeCards: BouncingCard[] = [];

    const interval = setInterval(() => {
      if (activeCardIndex < cardsToBounce.length) {
        activeCards.push(cardsToBounce[activeCardIndex++]);
      } else {
        clearInterval(interval);
      }
    }, 150);

    const render = () => {
      activeCards.forEach((c) => {
        c.vy += 0.4;
        c.x += c.vx;
        c.y += c.vy;

        if (c.y + 70 > canvas.height) {
          c.y = canvas.height - 70;
          c.vy = -c.vy * 0.85;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.fillRect(c.x, c.y, 48, 70);
        ctx.strokeRect(c.x, c.y, 48, 70);

        ctx.fillStyle = c.suit === "♥" || c.suit === "♦" ? "#CC0000" : "#000000";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`${RANK_LABELS[c.rank]}${c.suit}`, c.x + 4, c.y + 14);
      });
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [isWon, game.foundations]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#008000", fontFamily: "Tahoma, Arial, sans-serif", userSelect: "none", position: "relative", overflow: "hidden" }}>
      <MenuBar
        menus={[
          {
            label: `&${t("game")}`,
            entries: [
              cmd(t("newGame"), newGame),
              cmd(t("deal"), handleStockClick),
              sep,
              cmd(`Draw 3: ${drawThree ? "✓" : ""}`, () => setDrawThree(!drawThree)),
              sep,
              cmd(t("exit"), () => closeWindow(id)),
            ],
          },
          {
            label: `&${t("help")}`,
            entries: [cmd(t("helpTopics")), sep, cmd(t("aboutSolitaire"))],
          },
        ]}
      />

      <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div
              onClick={handleStockClick}
              style={{
                width: 58,
                height: 84,
                borderRadius: 4,
                border: "1px solid #005000",
                background: game.stock.length > 0 ? "repeating-linear-gradient(45deg, #0A4FA8, #0A4FA8 4px, #1060C0 4px, #1060C0 8px)" : "transparent",
                boxShadow: game.stock.length > 0 ? "1px 2px 4px rgba(0,0,0,0.4)" : "inset 0 0 4px rgba(0,0,0,0.3)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 16,
              }}
            >
              {game.stock.length === 0 && <span style={{ opacity: 0.3 }}>↺</span>}
            </div>

            <div
              style={{ width: 58, height: 84, position: "relative" }}
              onDoubleClick={() => {
                if (game.waste.length > 0) autoMoveToFoundation(game.waste[game.waste.length - 1]);
              }}
              onClick={() => {
                if (game.waste.length > 0) setSelected({ type: "waste", col: 0, cardIndex: game.waste.length - 1 });
              }}
            >
              {game.waste.length === 0 ? (
                <div style={{ width: "100%", height: "100%", borderRadius: 4, border: "1px dashed rgba(255,255,255,0.4)" }} />
              ) : (
                <CardView
                  card={game.waste[game.waste.length - 1]}
                  selected={selected?.type === "waste"}
                />
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {game.foundations.map((f, fIdx) => (
              <div
                key={fIdx}
                onClick={() => handleFoundationClick(fIdx)}
                style={{ width: 58, height: 84, position: "relative", cursor: "pointer" }}
              >
                {f.length === 0 ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 4,
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.25)",
                      fontSize: 24,
                    }}
                  >
                    {SUITS[fIdx]}
                  </div>
                ) : (
                  <CardView
                    card={f[f.length - 1]}
                    selected={selected?.type === "foundation" && selected.col === fIdx}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 10 }}>
          {game.tableau.map((pile, col) => (
            <div
              key={col}
              style={{ flex: 1, position: "relative", minHeight: 120 }}
            >
              {pile.length === 0 ? (
                <div
                  onClick={() => handleEmptyColumnClick(col)}
                  style={{
                    width: 58,
                    height: 84,
                    borderRadius: 4,
                    border: "1px dashed rgba(255,255,255,0.4)",
                    cursor: "pointer",
                  }}
                />
              ) : (
                pile.map((card, idx) => (
                  <div
                    key={card.id}
                    style={{
                      position: "absolute",
                      top: idx * 18,
                      left: 0,
                      zIndex: idx + 1,
                      cursor: card.faceUp ? "pointer" : "default",
                    }}
                    onClick={() => handleTableauClick(col, idx)}
                    onDoubleClick={() => {
                      if (card.faceUp && idx === pile.length - 1) autoMoveToFoundation(card, col);
                    }}
                  >
                    <CardView
                      card={card}
                      selected={selected?.type === "tableau" && selected.col === col && idx >= selected.cardIndex}
                    />
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="xp-status-strip"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "2px 8px",
          background: "#ECE9D8",
          borderTop: "1px solid #ACA899",
          fontSize: 11,
        }}
      >
        <span>Score: {score}</span>
        <span>Time: {timer}s</span>
      </div>

      {isWon && (
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          style={{ position: "absolute", inset: 0, zIndex: 99, pointerEvents: "none", width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

function CardView({ card, selected }: { card: Card; selected?: boolean }) {
  if (!card.faceUp) {
    return (
      <div
        style={{
          width: 58,
          height: 84,
          borderRadius: 4,
          border: "1px solid #005000",
          background: "repeating-linear-gradient(45deg, #0A4FA8, #0A4FA8 4px, #1060C0 4px, #1060C0 8px)",
          boxShadow: "1px 2px 4px rgba(0,0,0,0.35)",
        }}
      />
    );
  }

  const isRed = card.suit === "♥" || card.suit === "♦";
  const color = isRed ? "#CC0000" : "#000000";

  return (
    <div
      style={{
        width: 58,
        height: 84,
        borderRadius: 4,
        background: "#FFFFFF",
        border: selected ? "2px solid #FFCC00" : "1px solid #444444",
        boxShadow: selected ? "0 0 6px #FFEE00" : "1px 2px 3px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3px 4px",
        boxSizing: "border-box",
        color,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: 11, fontWeight: "bold" }}>{RANK_LABELS[card.rank]}</span>
        <span style={{ fontSize: 11 }}>{card.suit}</span>
      </div>
      <div style={{ textAlign: "center", fontSize: 20, lineHeight: 1 }}>
        {card.suit}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1, transform: "rotate(180deg)" }}>
        <span style={{ fontSize: 11, fontWeight: "bold" }}>{RANK_LABELS[card.rank]}</span>
        <span style={{ fontSize: 11 }}>{card.suit}</span>
      </div>
    </div>
  );
}
