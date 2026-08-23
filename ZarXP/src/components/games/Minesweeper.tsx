import { useState, useCallback, useEffect, useRef } from "react";

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
  return board;
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

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none", background: "#d4d0c8" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", width: 220, padding: "6px 8px" },
  counter: { fontFamily: "Consolas, monospace", fontSize: 24, fontWeight: 700, color: "#c00", background: "#000", padding: "2px 6px", border: "2px inset #999" },
  faceBtn: { fontSize: 20, cursor: "pointer", background: "#d4d0c8", border: "2px outset #fff", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  grid: { display: "grid", gridTemplateColumns: `repeat(${COLS}, 24px)`, gap: 0, border: "3px outset #999" },
  cell: { width: 24, height: 24, border: "1px outset #999", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", boxSizing: "border-box" as const, background: "#d4d0c8" },
  cellRevealed: { background: "#fff", border: "1px solid #999" },
  mine: { background: "#c00" },
};

const NUM_COLORS: Record<number, string> = {
  1: "#00f", 2: "#080", 3: "#c00", 4: "#000080", 5: "#800000", 6: "#008080", 7: "#000", 8: "#808080",
};

export default function Minesweeper(_: { id: string }) {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);

  const flagCount = board.flat().filter((c) => c.flagged).length;
  const revealedCount = board.flat().filter((c) => c.revealed).length;
  const safeCells = ROWS * COLS - MINES;

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    if (!timerRef.current) {
      started.current = true;
      timerRef.current = setInterval(() => {
        setTimer((t) => Math.min(t + 1, 999));
      }, 1000);
    }
  }, [timer]);

  useEffect(() => {
    if (revealedCount === safeCells && !gameOver) {
      setWon(true);
      setGameOver(true);
      stopTimer();
    }
  }, [revealedCount, safeCells, gameOver, stopTimer]);

  const restart = useCallback(() => {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setTimer(0);
    started.current = false;
    stopTimer();
  }, [stopTimer]);

  const handleClick = (r: number, c: number) => {
    if (gameOver || won || board[r][c].flagged) return;
    if (board[r][c].mine) {
      const copy = board.map((row) => row.map((cell) => ({ ...cell })));
      copy[r][c].revealed = true;
      setBoard(copy);
      setGameOver(true);
      stopTimer();
      return;
    }
    if (!started.current) startTimer();
    const newBoard = reveal(board, r, c);
    setBoard(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    const copy = board.map((row) => row.map((cell) => ({ ...cell })));
    copy[r][c].flagged = !copy[r][c].flagged;
    setBoard(copy);
  };

  const remaining = MINES - flagCount;
  const face = gameOver ? (won ? ":-)" : ":-(") : ":-)";

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.counter}>{String(Math.max(0, remaining)).padStart(3, "0")}</div>
        <div style={s.faceBtn} onClick={restart}>{face}</div>
        <div style={s.counter}>{String(timer).padStart(3, "0")}</div>
      </div>
      <div style={s.grid}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isMineExploded = cell.mine && cell.revealed && gameOver;
            let content = "";
            if (cell.revealed) {
              if (cell.mine) content = "*";
              else if (cell.adjacent > 0) content = String(cell.adjacent);
            } else if (cell.flagged) {
              content = "!";
            }
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  ...s.cell,
                  ...(cell.revealed ? s.cellRevealed : {}),
                  ...(isMineExploded ? s.mine : {}),
                  ...(cell.revealed && cell.adjacent > 0 ? { color: NUM_COLORS[cell.adjacent] || "#000" } : {}),
                }}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
              >
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
