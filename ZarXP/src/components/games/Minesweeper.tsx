import { useState, useCallback, useEffect, useRef } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adjacent: number };

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
  recomputeAdjacencies(board);
  return board;
}

function recomputeAdjacencies(board: Cell[][]) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
        }
      }
      board[r][c].adjacent = count;
    }
  }
}

function reveal(board: Cell[][], r: number, c: number): Cell[][] {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return board;
  if (board[r][c].revealed || board[r][c].flagged) return board;
  const copy = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack = [[r, c]];
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    if (copy[cr][cc].revealed || copy[cr][cc].flagged) continue;
    copy[cr][cc].revealed = true;
    if (copy[cr][cc].adjacent === 0 && !copy[cr][cc].mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !copy[nr][nc].revealed) {
            stack.push([nr, nc]);
          }
        }
      }
    }
  }
  return copy;
}

const NUM_COLORS: Record<number, string> = {
  1: "#0000FF",
  2: "#008000",
  3: "#FF0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000000",
  8: "#808080",
};

function playBeep(freq: number, duration: number, type: OscillatorType = "sine") {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export default function Minesweeper({ id }: { id: string }) {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [explodedCoord, setExplodedCoord] = useState<{ r: number; c: number } | null>(null);
  const [mouseDownOverCell, setMouseDownOverCell] = useState(false);
  const [facePressed, setFacePressed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);

  const closeWindow = useWindowStore((s) => s.closeWindow);
  const t = useLangStore((s) => s.t);

  const flagCount = board.flat().filter((c) => c.flagged).length;
  const revealedCount = board.flat().filter((c) => c.revealed).length;
  const safeCells = ROWS * COLS - MINES;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (!timerRef.current) {
      started.current = true;
      timerRef.current = setInterval(() => {
        setTimer((t) => Math.min(t + 1, 999));
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (revealedCount === safeCells && !gameOver && !won) {
      setWon(true);
      setGameOver(true);
      stopTimer();
      playBeep(523.25, 0.15);
      setTimeout(() => playBeep(659.25, 0.15), 150);
      setTimeout(() => playBeep(783.99, 0.35), 300);
    }
  }, [revealedCount, safeCells, gameOver, won, stopTimer]);

  const restart = useCallback(() => {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setExplodedCoord(null);
    setTimer(0);
    started.current = false;
    stopTimer();
  }, [stopTimer]);

  const handleClick = (r: number, c: number) => {
    if (gameOver || won || board[r][c].flagged || board[r][c].revealed) return;

    let activeBoard = board;
    if (!started.current) {
      startTimer();
      if (activeBoard[r][c].mine) {
        const copy = activeBoard.map((row) => row.map((cell) => ({ ...cell })));
        copy[r][c].mine = false;
        let relocated = false;
        for (let ro = 0; ro < ROWS; ro++) {
          for (let co = 0; co < COLS; co++) {
            if (!copy[ro][co].mine && !(ro === r && co === c)) {
              copy[ro][co].mine = true;
              relocated = true;
              break;
            }
          }
          if (relocated) break;
        }
        recomputeAdjacencies(copy);
        activeBoard = copy;
      }
    }

    if (activeBoard[r][c].mine) {
      const copy = activeBoard.map((row) => row.map((cell) => ({ ...cell })));
      copy[r][c].revealed = true;
      setBoard(copy);
      setExplodedCoord({ r, c });
      setGameOver(true);
      stopTimer();
      playBeep(110, 0.4, "sawtooth");
      return;
    }

    playBeep(880, 0.04);
    const newBoard = reveal(activeBoard, r, c);
    setBoard(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    const copy = board.map((row) => row.map((cell) => ({ ...cell })));
    copy[r][c].flagged = !copy[r][c].flagged;
    setBoard(copy);
    playBeep(440, 0.03);
  };

  const remainingMines = MINES - flagCount;
  let faceState: "happy" | "caution" | "dead" | "win" = "happy";
  if (won) faceState = "win";
  else if (gameOver) faceState = "dead";
  else if (mouseDownOverCell) faceState = "caution";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        fontFamily: "Tahoma, Arial, sans-serif",
        userSelect: "none",
        background: "#C0C0C0",
        padding: 6,
        boxSizing: "border-box",
      }}
      onMouseUp={() => setMouseDownOverCell(false)}
    >
      <div style={{ alignSelf: "stretch", marginBottom: 6 }}>
        <MenuBar
          menus={[
            {
              label: `&${t("game")}`,
              entries: [
                cmd(t("newGame"), restart),
                sep,
                cmd(t("exit"), () => closeWindow(id)),
              ],
            },
            {
              label: `&${t("help")}`,
              entries: [cmd(t("helpTopics")), sep, cmd(t("aboutMinesweeper"))],
            },
          ]}
        />
      </div>

      <div
        style={{
          border: "3px solid",
          borderColor: "#808080 #FFFFFF #FFFFFF #808080",
          padding: 6,
          background: "#C0C0C0",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            border: "2px solid",
            borderColor: "#808080 #FFFFFF #FFFFFF #808080",
            padding: "4px 6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#C0C0C0",
          }}
        >
          <LedDisplay value={remainingMines} />
          <FaceButton
            state={faceState}
            pressed={facePressed}
            onMouseDown={() => setFacePressed(true)}
            onMouseUp={() => setFacePressed(false)}
            onClick={restart}
          />
          <LedDisplay value={timer} />
        </div>

        <div
          style={{
            border: "3px solid",
            borderColor: "#808080 #FFFFFF #FFFFFF #808080",
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 18px)`,
            gridTemplateRows: `repeat(${ROWS}, 18px)`,
            gap: 0,
            background: "#808080",
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isExploded = explodedCoord?.r === r && explodedCoord?.c === c;
              const isRevealed = cell.revealed || (gameOver && cell.mine);
              const isMisflagged = gameOver && !cell.mine && cell.flagged;

              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: 18,
                    height: 18,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: "bold",
                    cursor: gameOver || won ? "default" : "pointer",
                    background: isExploded ? "#FF0000" : isRevealed ? "#C0C0C0" : "#C0C0C0",
                    border: isRevealed
                      ? "1px solid #808080"
                      : "2px solid",
                    borderColor: isRevealed
                      ? "#808080"
                      : "#FFFFFF #808080 #808080 #FFFFFF",
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0 && !cell.revealed && !cell.flagged && !gameOver && !won) {
                      setMouseDownOverCell(true);
                    }
                  }}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                >
                  {isRevealed && cell.mine ? (
                    <MineIcon />
                  ) : isMisflagged ? (
                    <MisflaggedIcon />
                  ) : cell.flagged ? (
                    <FlagIcon />
                  ) : cell.revealed && cell.adjacent > 0 ? (
                    <span style={{ color: NUM_COLORS[cell.adjacent] }}>{cell.adjacent}</span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function LedDisplay({ value }: { value: number }) {
  const clamped = Math.max(-99, Math.min(999, value));
  const text = clamped < 0 ? `-${String(Math.abs(clamped)).padStart(2, "0")}` : String(clamped).padStart(3, "0");

  return (
    <div
      style={{
        background: "#000000",
        border: "1px solid #808080",
        padding: "1px 2px",
        display: "flex",
        gap: 1,
      }}
    >
      {text.split("").map((ch, i) => (
        <LedDigit key={i} char={ch} />
      ))}
    </div>
  );
}

function LedDigit({ char }: { char: string }) {
  return (
    <div
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF0000",
        lineHeight: 1,
        width: 13,
        textAlign: "center",
        textShadow: "0 0 3px rgba(255,0,0,0.8)",
        letterSpacing: -1,
      }}
    >
      {char}
    </div>
  );
}

function FaceButton({
  state,
  pressed,
  onMouseDown,
  onMouseUp,
  onClick,
}: {
  state: "happy" | "caution" | "dead" | "win";
  pressed: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onClick: () => void;
}) {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      style={{
        width: 26,
        height: 26,
        background: "#C0C0C0",
        border: pressed ? "2px solid #808080" : "2px solid",
        borderColor: pressed ? "#808080 #FFFFFF #FFFFFF #808080" : "#FFFFFF #808080 #808080 #FFFFFF",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#FFFF00" stroke="#000000" strokeWidth="1" />
        {state === "happy" && (
          <>
            <circle cx="6.5" cy="7.5" r="1.2" fill="#000000" />
            <circle cx="13.5" cy="7.5" r="1.2" fill="#000000" />
            <path d="M 5.5 12 Q 10 16 14.5 12" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </>
        )}
        {state === "caution" && (
          <>
            <circle cx="6.5" cy="7.5" r="1.2" fill="#000000" />
            <circle cx="13.5" cy="7.5" r="1.2" fill="#000000" />
            <ellipse cx="10" cy="13.5" rx="2.5" ry="3" fill="#000000" />
          </>
        )}
        {state === "dead" && (
          <>
            <line x1="5" y1="6" x2="8" y2="9" stroke="#000000" strokeWidth="1.2" />
            <line x1="8" y1="6" x2="5" y2="9" stroke="#000000" strokeWidth="1.2" />
            <line x1="12" y1="6" x2="15" y2="9" stroke="#000000" strokeWidth="1.2" />
            <line x1="15" y1="6" x2="12" y2="9" stroke="#000000" strokeWidth="1.2" />
            <path d="M 6 14 Q 10 11 14 14" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </>
        )}
        {state === "win" && (
          <>
            <path d="M 4 7 Q 10 9 16 7 L 15 10 Q 10 11 5 10 Z" fill="#000000" />
            <path d="M 6 13 Q 10 16.5 14 13" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}

function MineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="4.5" fill="#000000" />
      <line x1="8" y1="1" x2="8" y2="15" stroke="#000000" strokeWidth="1.5" />
      <line x1="1" y1="8" x2="15" y2="8" stroke="#000000" strokeWidth="1.5" />
      <line x1="3" y1="3" x2="13" y2="13" stroke="#000000" strokeWidth="1.5" />
      <line x1="13" y1="3" x2="3" y2="13" stroke="#000000" strokeWidth="1.5" />
      <rect x="6.5" y="6.5" width="1.5" height="1.5" fill="#FFFFFF" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16">
      <line x1="5" y1="2" x2="5" y2="14" stroke="#000000" strokeWidth="1.5" />
      <polygon points="5,3 12,5.5 5,8" fill="#FF0000" />
      <line x1="3" y1="14" x2="10" y2="14" stroke="#000000" strokeWidth="2" />
    </svg>
  );
}

function MisflaggedIcon() {
  return (
    <div style={{ position: "relative", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <MineIcon />
      <svg width="14" height="14" viewBox="0 0 16 16" style={{ position: "absolute", inset: 0 }}>
        <line x1="2" y1="2" x2="14" y2="14" stroke="#FF0000" strokeWidth="2" />
        <line x1="14" y1="2" x2="2" y2="14" stroke="#FF0000" strokeWidth="2" />
      </svg>
    </div>
  );
}
