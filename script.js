// --- SOS ULTIMATE ENGINE ---
let board = Array(9).fill(null);
let currentPlayer = 'S';
let scores = { S: 0, O: 0 };
let career = JSON.parse(localStorage.getItem('sos_pro_ultimate')) || { xp: 0, level: 1, wins: 0, rank: 'ACEMİ' };

const ranks = ["ACEMİ", "ÇAYLAK", "ASKER", "TEKNİSYEN", "USTA", "REİS", "EFSANE", "YIKILMAZ"];

function initGame() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    board.fill(null);
    scores = { S: 0, O: 0 };
    currentPlayer = 'S';
    
    for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.addEventListener('click', () => makeMove(i, slot));
        grid.appendChild(slot);
    }
    updateUI();
}

function makeMove(index, element) {
    if (board[index]) return;
    
    board[index] = currentPlayer;
    element.innerText = currentPlayer;
    element.classList.add(currentPlayer === 'S' ? 's-mark' : 'o-mark');
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    let gainedPoint = checkSOS();
    
    if (!gainedPoint) {
        currentPlayer = currentPlayer === 'S' ? 'O' : 'S';
    } else {
        addXP(20); // SOS yapan 20 XP kazanır
    }
    
    updateUI();
    checkDraw();
}

function checkSOS() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Yatay
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dikey
        [0, 4, 8], [2, 4, 6]             // Çapraz
    ];

    let found = false;
    winPatterns.forEach(pattern => {
        const [a, b, c] = pattern;
        if (board[a] === 'S' && board[b] === 'O' && board[c] === 'S') {
            // Burası puanlama mantığıdır, SOS bulan oyuncuya puan ekler
            scores[currentPlayer]++;
            found = true;
        }
    });
    return found;
}

function addXP(amount) {
    career.xp += amount;
    if (career.xp >= 100) {
        career.level++;
        career.xp = 0;
        career.rank = ranks[Math.min(career.level - 1, ranks.length - 1)];
        alert("SİSTEM GÜNCELLENDİ: RÜTBE " + career.rank);
    }
    saveData();
}

function saveData() {
    localStorage.setItem('sos_pro_ultimate', JSON.stringify(career));
}

function updateUI() {
    document.getElementById('xpBar').style.width = career.xp + '%';
    document.getElementById('xpText').innerText = career.xp;
    document.getElementById('lvl').innerText = career.level;
    document.getElementById('rankDisplay').innerText = career.rank;
    document.getElementById('scoreS').innerText = scores.S;
    document.getElementById('scoreO').innerText = scores.O;
    document.getElementById('turnDisplay').innerText = currentPlayer + " SIRASI";
}

function checkDraw() {
    if (!board.includes(null)) {
        setTimeout(() => {
            alert("OYUN BİTTİ! S: " + scores.S + " - O: " + scores.O);
            if(scores.S > scores.O) career.wins++;
            initGame();
        }, 500);
    }
}

function resetGame() {
    initGame();
}

initGame();
