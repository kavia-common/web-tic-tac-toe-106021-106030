import { render, screen, fireEvent } from '@testing-library/react';
import App, { calculateWinner } from './App';

test('renders header title', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
});

test('allows playing moves and detects a winner', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /Square/ });
  // X moves
  fireEvent.click(squares[0]); // X
  fireEvent.click(squares[3]); // O
  fireEvent.click(squares[1]); // X
  fireEvent.click(squares[4]); // O
  fireEvent.click(squares[2]); // X wins row 0
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
});

test('calculateWinner utility works', () => {
  expect(calculateWinner(['X','X','X', null, null, null, null, null, null])?.winner).toBe('X');
  expect(calculateWinner(['O',null,'O', null,'O',null, null,null,'O'])?.winner).toBe('O');
});
