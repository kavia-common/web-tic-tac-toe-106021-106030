import React, { useMemo, useState } from 'react';
import './App.css';
import './index.css';

/**
 * Ocean Professional Theme Tokens
 * Primary: #2563EB (blue-600)
 * Secondary/Success: #F59E0B (amber-500)
 * Error: #EF4444 (red-500)
 * Background: #f9fafb
 * Surface: #ffffff
 * Text: #111827
 */

// Utilities

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine the winner of a 3x3 tic tac toe board.
   * Returns:
   *  - { winner: 'X' | 'O', line: number[] } if a winner exists
   *  - { winner: 'Draw', line: [] } if board full and no winner
   *  - null if game is ongoing
   */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }

  const isFull = squares.every((s) => s !== null);
  if (isFull) return { winner: 'Draw', line: [] };
  return null;
}

// Components

function Header() {
  return (
    <header className="ttt-header" role="banner" aria-label="Tic Tac Toe Header">
      <div className="brand">
        <div className="brand-symbol" aria-hidden="true">◎</div>
        <div className="brand-text">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Ocean Professional</p>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ status, next, winner }) {
  let label = status;
  let tone = 'info';
  if (winner && winner !== 'Draw') {
    label = `Winner: ${winner}`;
    tone = 'success';
  } else if (winner === 'Draw') {
    label = 'Game ended in a draw';
    tone = 'warning';
  } else if (status === 'Playing') {
    label = `Turn: ${next}`;
    tone = 'info';
  } else if (status === 'Idle') {
    label = 'Ready to start';
    tone = 'muted';
  }

  return (
    <div className={`status-badge tone-${tone}`} role="status" aria-live="polite">
      {label}
    </div>
  );
}

function Square({ value, onClick, highlight, index }) {
  return (
    <button
      className={`square ${highlight ? 'square-highlight' : ''} ${value === 'X' ? 'sq-x' : value === 'O' ? 'sq-o' : ''}`}
      onClick={onClick}
      aria-label={`Square ${index + 1}${value ? `, ${value}` : ''}`}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay, winningLine, gameOver }) {
  const renderSquare = (i) => {
    const highlight = winningLine?.includes(i);
    return (
      <Square
        key={i}
        index={i}
        value={squares[i]}
        highlight={highlight}
        onClick={() => {
          if (gameOver || squares[i]) return;
          onPlay(i);
        }}
      />
    );
  };

  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row" role="row">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            return (
              <div key={i} className="board-cell" role="gridcell" aria-selected={!!squares[i]}>
                {renderSquare(i)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Controls({ onReset, canUndo, onUndo, xIsNext, movesCount }) {
  return (
    <div className="controls" role="group" aria-label="Game Controls">
      <button className="btn primary" onClick={onReset} aria-label="Reset game">
        ⟳ Reset
      </button>
      <button className="btn secondary" onClick={onUndo} disabled={!canUndo} aria-label="Undo last move">
        ↶ Undo
      </button>
      <div className="hint">
        <span className="dot next" aria-hidden="true" />
        Next: <strong>{xIsNext ? 'X' : 'O'}</strong>
        <span className="sep">•</span>
        Moves: <strong>{movesCount}</strong>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <p>
        Built with <span className="accent">Blue</span> & <span className="accent-amber">Amber</span> accents.
      </p>
    </footer>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * A modern, responsive Tic Tac Toe game UI following the Ocean Professional theme.
   * - Two-player local mode (X and O alternate)
   * - Status with next player, winner, or draw
   * - Undo and Reset controls
   * - Responsive grid (mobile and desktop)
   */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const result = useMemo(() => calculateWinner(currentSquares), [currentSquares]);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? [];
  const gameOver = winner === 'Draw' || winner === 'X' || winner === 'O';

  const status = gameOver ? 'Finished' : currentMove === 0 ? 'Idle' : 'Playing';

  const handlePlay = (i) => {
    if (gameOver || currentSquares[i]) return;
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const handleReset = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  const handleUndo = () => {
    if (currentMove > 0) setCurrentMove(currentMove - 1);
  };

  return (
    <div className="ttt-app" style={{ background: 'var(--bg, #f9fafb)' }}>
      <Header />

      <main className="container" role="main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Play</h2>
            <StatusBadge status={status} next={xIsNext ? 'X' : 'O'} winner={winner} />
          </div>

          <div className="board-wrap">
            <Board
              squares={currentSquares}
              onPlay={handlePlay}
              winningLine={winningLine}
              gameOver={gameOver}
            />
          </div>

          <Controls
            onReset={handleReset}
            canUndo={currentMove > 0 && !gameOver}
            onUndo={handleUndo}
            xIsNext={xIsNext}
            movesCount={currentMove}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
