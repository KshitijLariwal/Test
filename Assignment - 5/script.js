document.addEventListener('DOMContentLoaded', () => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const resetButton = document.getElementById('resetButton');

  const WIN_COMBOS = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;

  function updateStatus(text){ statusEl.textContent = text; }

  function checkWin(){
    for (const combo of WIN_COMBOS){
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return combo;
    }
    return null;
  }

  function handleClick(e){
    const index = Number(e.target.dataset.index);
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('played', currentPlayer.toLowerCase());

    const winCombo = checkWin();
    if (winCombo){
      gameActive = false;
      winCombo.forEach(i => cells[i].classList.add('win'));
      updateStatus(`${currentPlayer} wins!`);
      return;
    }

    if (board.every(Boolean)){
      gameActive = false;
      updateStatus("It's a draw!");
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Turn: ${currentPlayer}`);
  }

  function resetGame(){
    board.fill('');
    cells.forEach(c => { c.textContent = ''; c.classList.remove('win','played','x','o'); });
    currentPlayer = 'X';
    gameActive = true;
    updateStatus(`Turn: ${currentPlayer}`);
  }

  cells.forEach(cell => cell.addEventListener('click', handleClick));
  resetButton.addEventListener('click', resetGame);

  // keyboard shortcut
  document.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') resetGame(); });

  updateStatus(`Turn: ${currentPlayer}`);
});