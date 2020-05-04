import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type BlockState = "X" | "O" | null;

type SquareProps = {
  onClick: React.MouseEventHandler;
  value: BlockState;
}

/** 三目並べの1マス */
const Square: React.FC<SquareProps> = ({ onClick, value }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

type BoardProps = {
  squares: BlockState[];
  onClick: (i: number) => void;
}

/** 盤面 */
const Board: React.FC<BoardProps> = ({ squares, onClick }) => {
  function renderSquare(i: number) {
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
      />
    );
  }

  return (
    <div>
      <div className="board-row">
        {[0, 1, 2].map(i => renderSquare(i))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map(i => renderSquare(i))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map(i => renderSquare(i))}
      </div>
    </div>
  );
}

type GameState = {
  history: { squares: BlockState[] }[];
  stepNumber: number;
  xIsNext: boolean;
}

/** ゲーム全体 */
const Game: React.FC = () => {
  const [state, setState] = useState<GameState>({
    history: [{ squares: Array(9).fill(null) }],
    stepNumber: 0,
    xIsNext: true
  });

  function jumpTo(step: number) {
    setState({
      history: history.slice(0, step + 1),
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  function handleClick(i: number) {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = state.xIsNext ? 'X' : 'O';
    setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  }

  const history = state.history;
  const current = history[state.stepNumber];

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <GameInfo
        jumpTo={jumpTo}
        history={history}
        next={state.xIsNext ? 'X' : 'O'}
      />
    </div>
  );
}

type GameInfoProps = {
  history: { squares: BlockState[] }[];
  jumpTo: (step: number) => void;
  next: string;
}

/** 手番の情報とか */
const GameInfo: React.FC<GameInfoProps> = ({ history, jumpTo, next }) => {
  const current = history[history.length - 1];
  const winner = calculateWinner(current.squares);
  const status = winner ? `winner: ${winner}` : `next player: ${next}`;
  return (
    <div className="game-info">
      <div>{status}</div>
      <Steps
        history={history}
        jumpTo={jumpTo}
      />
    </div>
  );
}

type StepsProps = {
  history: { squares: BlockState[] }[];
  jumpTo: (step: number) => void;
}

/** 過去の手番へ飛ぶところ */
const Steps: React.FC<StepsProps> = ({ history, jumpTo }) => {
  const moves = history.map((step: { squares: BlockState[] }, move: number) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <ol>{moves}</ol>
  );
}

function calculateWinner(squares: BlockState[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

