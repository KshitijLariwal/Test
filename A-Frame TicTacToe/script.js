document.addEventListener('DOMContentLoaded', () => {
  // 1. Handle Loading Screen Removal Robustly
  const scene = document.querySelector('a-scene');
  const loading = document.getElementById('loading');
  
  if (scene.hasLoaded) {
    loading.style.opacity = '0';
    setTimeout(() => loading.style.display = 'none', 300);
  } else {
    scene.addEventListener('loaded', () => {
      loading.style.opacity = '0';
      setTimeout(() => loading.style.display = 'none', 300);
    });
  }

  // 2. Game Logic Setup
  const cellsContainer = document.getElementById('cells-container');
  const tokensContainer = document.getElementById('tokens-container');
  const statusText = document.getElementById('status-text');
  const resetButton = document.getElementById('reset-button');

  let boardState = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;

  const WIN_COMBOS = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  const positions = [
    { x: -3, y: 6 }, { x: 0, y: 6 }, { x: 3, y: 6 }, 
    { x: -3, y: 3 }, { x: 0, y: 3 }, { x: 3, y: 3 }, 
    { x: -3, y: 0 }, { x: 0, y: 0 }, { x: 3, y: 0 }  
  ];

  // 3. Generate Clickable Hitboxes
  positions.forEach((pos, index) => {
    const cell = document.createElement('a-plane');
    cell.setAttribute('position', `${pos.x} ${pos.y} 0.3`);
    cell.setAttribute('width', '2.8');
    cell.setAttribute('height', '2.8');
    cell.setAttribute('material', 'opacity: 0.0; transparent: true; color: #06b6d4');
    cell.classList.add('clickable');
    cell.dataset.index = index;
    
    cell.addEventListener('mouseenter', () => {
      if (!boardState[index] && gameActive) cell.setAttribute('material', 'opacity: 0.2');
    });
    cell.addEventListener('mouseleave', () => {
      cell.setAttribute('material', 'opacity: 0.0');
    });
    
    cell.addEventListener('click', () => handleMove(index, pos));
    cellsContainer.appendChild(cell);
  });

  function updateStatus(text, color = "#e6eef6") {
    statusText.setAttribute('value', text);
    statusText.setAttribute('color', color);
  }

  function createToken(player, pos) {
    const tokenGroup = document.createElement('a-entity');
    tokenGroup.setAttribute('position', `${pos.x} ${pos.y} 5`);
    tokenGroup.classList.add('token');

    tokenGroup.setAttribute('animation__fly', `property: position; to: ${pos.x} ${pos.y} 0; dur: 800; easing: easeOutElastic`);
    tokenGroup.setAttribute('animation__spin', `property: rotation; from: 0 0 180; to: 0 0 0; dur: 800; easing: easeOutQuad`);

    if (player === 'X') {
      const material = "color: #ef4444; metalness: 0.8; roughness: 0.2";
      
      const bar1 = document.createElement('a-box');
      bar1.setAttribute('width', '0.4');
      bar1.setAttribute('height', '2.2');
      bar1.setAttribute('depth', '0.4');
      bar1.setAttribute('rotation', '0 0 45');
      bar1.setAttribute('material', material);
      bar1.setAttribute('shadow', 'cast: true; receive: true');

      const bar2 = document.createElement('a-box');
      bar2.setAttribute('width', '0.4');
      bar2.setAttribute('height', '2.2');
      bar2.setAttribute('depth', '0.4');
      bar2.setAttribute('rotation', '0 0 -45');
      bar2.setAttribute('material', material);
      bar2.setAttribute('shadow', 'cast: true; receive: true');

      tokenGroup.appendChild(bar1);
      tokenGroup.appendChild(bar2);

    } else {
      const ring = document.createElement('a-torus');
      ring.setAttribute('radius', '0.8');
      ring.setAttribute('radius-tubular', '0.2');
      ring.setAttribute('material', "color: #06b6d4; metalness: 0.8; roughness: 0.2");
      ring.setAttribute('shadow', 'cast: true; receive: true');
      
      tokenGroup.appendChild(ring);
    }

    tokensContainer.appendChild(tokenGroup);
    return tokenGroup;
  }

  function checkWin() {
    for (const combo of WIN_COMBOS) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return combo;
      }
    }
    return null;
  }

  function handleMove(index, pos) {
    if (!gameActive || boardState[index]) return;

    const cellPlane = cellsContainer.children[index];
    cellPlane.setAttribute('material', 'opacity: 0.0');

    boardState[index] = currentPlayer;
    createToken(currentPlayer, pos);

    const winCombo = checkWin();
    if (winCombo) {
      gameActive = false;
      updateStatus(`${currentPlayer} WINS!`, currentPlayer === 'X' ? '#ef4444' : '#06b6d4');
      
      const tokens = tokensContainer.querySelectorAll('.token');
      winCombo.forEach(i => {
         const winningToken = tokens[i];
         winningToken.setAttribute('animation__float', 'property: position; dir: alternate; to: ' + positions[i].x + ' ' + positions[i].y + ' 0.5; dur: 1000; loop: true; easing: easeInOutSine');
         winningToken.setAttribute('animation__spin_win', 'property: rotation; to: 0 360 0; dur: 2000; loop: true; easing: linear');
      });
      return;
    }

    if (boardState.every(Boolean)) {
      gameActive = false;
      updateStatus("IT'S A DRAW!", "#9ca3af");
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Turn: ${currentPlayer}`);
  }

  // 4. Fully Restored Reset Logic
  function resetGame() {
    // Add a visual click animation only if the 3D button was clicked
    if (resetButton && resetButton.querySelector('a-box')) {
      const btnBox = resetButton.querySelector('a-box');
      btnBox.setAttribute('animation__click', 'property: scale; to: 0.9 0.9 0.9; dur: 100; dir: alternate; loop: 1');
    }

    // Reset standard game states
    boardState.fill('');
    currentPlayer = 'X';
    gameActive = true;
    updateStatus(`Turn: ${currentPlayer}`);
    
    // Clear 3D tokens (Equivalent to removing text and classes in 2D)
    while (tokensContainer.firstChild) {
      tokensContainer.removeChild(tokensContainer.firstChild);
    }
  }

  // Mouse Click Trigger
  resetButton.addEventListener('click', resetGame);

  // Keyboard 'R' Trigger (Restored from your 2D code)
  document.addEventListener('keydown', e => { 
    if (e.key.toLowerCase() === 'r') resetGame(); 
  });

  // Ensure initial status is set when the script loads
  updateStatus(`Turn: ${currentPlayer}`);
});