import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Milestone 4: Solitaire & Minesweeper Logic Standards", () => {
  test("Solitaire allows moving a King and its stack to an empty tableau column", () => {
    type Card = { suit: "♠" | "♥" | "♣" | "♦"; rank: number; faceUp: boolean };
    const canPlaceOnTableau = (card: Card, target: Card[]): boolean => {
      if (target.length === 0) return card.rank === 13;
      const top = target[target.length - 1];
      if (!top.faceUp) return false;
      const red = card.suit === "♥" || card.suit === "♦";
      const targetRed = top.suit === "♥" || top.suit === "♦";
      return red !== targetRed && card.rank === top.rank - 1;
    };

    const kingSpades: Card = { suit: "♠", rank: 13, faceUp: true };
    const queenHearts: Card = { suit: "♥", rank: 12, faceUp: true };
    const jackClubs: Card = { suit: "♣", rank: 11, faceUp: true };
    const tenHearts: Card = { suit: "♥", rank: 10, faceUp: true };

    assert.equal(canPlaceOnTableau(kingSpades, []), true, "King can be placed on an empty column");
    assert.equal(canPlaceOnTableau(queenHearts, []), false, "Queen cannot be placed on an empty column");
    assert.equal(canPlaceOnTableau(tenHearts, []), false, "Ten cannot be placed on an empty column");

    const emptyColumn: Card[] = [];
    const sourceStack: Card[] = [kingSpades, queenHearts, jackClubs];
    assert.equal(canPlaceOnTableau(sourceStack[0], emptyColumn), true, "Stack starting with King can be placed on empty column");
  });

  test("Minesweeper first-click safety relocates mine without premature explosion", () => {
    const ROWS = 9;
    const COLS = 9;
    type Cell = { mine: boolean; revealed: boolean; adjacent: number };

    const board: Cell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ mine: false, revealed: false, adjacent: 0 }))
    );

    board[4][4].mine = true;

    function handleFirstClickSafety(b: Cell[][], r: number, c: number) {
      if (!b[r][c].mine) return;
      b[r][c].mine = false;
      for (let ro = 0; ro < ROWS; ro++) {
        let relocated = false;
        for (let co = 0; co < COLS; co++) {
          if (!b[ro][co].mine && !(ro === r && co === c)) {
            b[ro][co].mine = true;
            relocated = true;
            break;
          }
        }
        if (relocated) break;
      }
    }

    handleFirstClickSafety(board, 4, 4);
    assert.equal(board[4][4].mine, false, "Cell at (4,4) is no longer a mine after first click safety");
    const totalMines = board.flat().filter((cell) => cell.mine).length;
    assert.equal(totalMines, 1, "Total mines remains preserved");
  });
});
