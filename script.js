let angle = 0;
let swinging = true;
let direction = 1;
let gameMode = 'single';
let currentPlayer = 1;
let p1Score = 0;
let p2Score = 0;

const needle = document.getElementById('needle');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');
const hitBtn = document.getElementById('hitBtn');

function startSwing() {
    if (!swinging) return;
    
    // Simple back and forth motion
    angle += direction * 2;
    
    if (angle >= 90) {
        angle = 90;
        direction = -1;
    } else if (angle <= -90) {
        angle = -90;
        direction = 1;
    }
    
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    requestAnimationFrame(startSwing);
}

function hit() {
    if (!swinging) return;
    
    swinging = false;
    hitBtn.disabled = true;
    
    // Calculate score - closer to 0 degrees (center) = higher score
    const distance = Math.abs(angle);
    let score = Math.max(0, Math.round(100 - (distance / 90) * 100));
    
    if (gameMode === 'single') {
        showScore(score);
    } else {
        handleTwoPlayer(score);
    }
    
    setTimeout(reset, 3000);
}

function showScore(score) {
    scoreEl.textContent = score;
    
    if (score === 100) {
        messageEl.textContent = "🎯 PERFECT! Amazing!";
        messageEl.style.color = "#00ff00";
    } else if (score >= 80) {
        messageEl.textContent = "💪 Great job!";
        messageEl.style.color = "#32cd32";
    } else if (score >= 60) {
        messageEl.textContent = "👍 Not bad!";
        messageEl.style.color = "#ffd700";
    } else if (score >= 40) {
        messageEl.textContent = "😐 Keep trying!";
        messageEl.style.color = "#ffa500";
    } else {
        messageEl.textContent = "😅 Oops! Try again!";
        messageEl.style.color = "#ff4444";
    }
}

function handleTwoPlayer(score) {
    if (currentPlayer === 1) {
        p1Score = score;
        document.getElementById('p1score').textContent = score;
        document.getElementById('p1').classList.remove('active');
        document.getElementById('p2').classList.add('active');
        
        showScore(score);
        messageEl.textContent += " - Player 2's turn!";
        currentPlayer = 2;
    } else {
        p2Score = score;
        document.getElementById('p2score').textContent = score;
        
        showScore(score);
        
        // Declare winner
        setTimeout(() => {
            if (p1Score > p2Score) {
                messageEl.textContent = "🏆 Player 1 wins!";
            } else if (p2Score > p1Score) {
                messageEl.textContent = "🏆 Player 2 wins!";
            } else {
                messageEl.textContent = "🤝 It's a tie!";
            }
            messageEl.style.color = "#ffd700";
        }, 1500);
        
        currentPlayer = 1;
    }
}

function reset() {
    angle = 0;
    swinging = true;
    direction = 1;
    hitBtn.disabled = false;
    
    if (gameMode === 'single') {
        scoreEl.textContent = "Ready?";
        messageEl.textContent = "Hit the button when the needle is in the center!";
        messageEl.style.color = "#ffd700";
    } else if (currentPlayer === 2) {
        scoreEl.textContent = "Player 2";
        messageEl.textContent = "Your turn! Get that center!";
        messageEl.style.color = "#ffd700";
    } else {
        scoreEl.textContent = "New Game";
        messageEl.textContent = "Player 1 goes first!";
        messageEl.style.color = "#ffd700";
        document.getElementById('p1').classList.add('active');
        document.getElementById('p2').classList.remove('active');
    }
    
    startSwing();
}

function setMode(mode) {
    gameMode = mode;
    
    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (mode === 'two') {
        document.getElementById('players').style.display = 'block';
        scoreEl.textContent = "Player 1";
        messageEl.textContent = "Player 1 goes first!";
        document.getElementById('p1').classList.add('active');
        document.getElementById('p2').classList.remove('active');
        document.getElementById('p1score').textContent = '0';
        document.getElementById('p2score').textContent = '0';
    } else {
        document.getElementById('players').style.display = 'none';
        scoreEl.textContent = "Ready?";
        messageEl.textContent = "Hit the button when the needle is in the center!";
    }
    
    messageEl.style.color = "#ffd700";
    currentPlayer = 1;
    p1Score = 0;
    p2Score = 0;
    reset();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        hit();
    }
});

// Start the game
startSwing();