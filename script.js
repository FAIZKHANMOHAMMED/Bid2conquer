// ==================== Global State ====================
let participants = [];
let currentQuestionIndex = 0;
let bidWinner = null;
let bidAmount = 0;
let selectedAnswer = null;
let totalQuestionsAnswered = 0;
let globalPurseAmount = 0;
let rewardRevealed = false;

// Sample quiz questions with secret rewards
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        reward: 500,
        visible: false  // Show options on screen
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        reward: 750,
        visible: true
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2,
        reward: 1000,
        visible: false  // Don't show options - harder question
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3,
        reward: 600,
        visible: true
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2,
        reward: 800,
        visible: false  // Don't show options
    },
    {
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correct: 2,
        reward: 400,
        visible: true
    },
    {
        question: "Which element has the chemical symbol 'Au'?",
        options: ["Silver", "Gold", "Copper", "Aluminum"],
        correct: 1,
        reward: 900,
        visible: true
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1,
        reward: 700,
        visible: false  // Don't show options
    },
    {
        question: "What is the speed of light in vacuum?",
        options: ["299,792 km/s", "150,000 km/s", "450,000 km/s", "500,000 km/s"],
        correct: 0,
        reward: 1200,
        visible: true
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correct: 2,
        reward: 550,
        visible: true
    }
];

// ==================== Utility Functions ====================
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatCurrency(amount) {
    return `Rs.${amount.toLocaleString('en-IN')}`;
}

// ==================== Purse Amount Setup ====================
function setPurseAmount() {
    const purseInput = document.getElementById('globalPurseAmount');
    const purse = parseInt(purseInput.value);

    if (!purse || purse <= 0) {
        showToast('Invalid Amount', 'Please enter a valid purse amount', 'error');
        return;
    }

    globalPurseAmount = purse;

    // Show participant form and hide purse setup
    document.getElementById('purseSetup').style.display = 'none';
    document.getElementById('participantForm').style.display = 'block';
    document.getElementById('purseDisplay').textContent = formatCurrency(purse);

    // Focus on participant name input
    document.getElementById('participantName').focus();

    showToast('Purse Set!', `All participants will start with ${formatCurrency(purse)}`, 'success');
}

function changePurseAmount() {
    if (participants.length > 0) {
        if (!confirm('Changing the purse amount will remove all participants. Continue?')) {
            return;
        }
        participants = [];
        renderParticipantsList();
        updateStartButton();
    }

    globalPurseAmount = 0;
    document.getElementById('purseSetup').style.display = 'block';
    document.getElementById('participantForm').style.display = 'none';
    document.getElementById('globalPurseAmount').value = '';
    document.getElementById('globalPurseAmount').focus();
}

// ==================== Participant Management ====================
function addParticipant() {
    const nameInput = document.getElementById('participantName');
    const name = nameInput.value.trim();

    if (!name) {
        showToast('Invalid Input', 'Please enter a participant name', 'error');
        return;
    }

    // Check for duplicate names
    if (participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        showToast('Duplicate Name', 'This participant already exists', 'warning');
        return;
    }

    const participant = {
        id: Date.now(),
        name: name,
        purse: globalPurseAmount,
        rewards: 0
    };

    participants.push(participant);

    nameInput.value = '';
    nameInput.focus();

    renderParticipantsList();
    updateStartButton();
    showToast('Success', `${name} added successfully!`, 'success');
}

function removeParticipant(id) {
    const participant = participants.find(p => p.id === id);
    participants = participants.filter(p => p.id !== id);

    renderParticipantsList();
    updateStartButton();
    showToast('Removed', `${participant.name} has been removed`, 'info');
}

function renderParticipantsList() {
    const list = document.getElementById('participantsList');

    if (participants.length === 0) {
        list.innerHTML = '<p class="text-center text-muted">No participants added yet</p>';
        return;
    }

    list.innerHTML = participants.map(p => `
        <div class="participant-card">
            <div class="participant-info">
                <div class="participant-avatar">${getInitials(p.name)}</div>
                <div class="participant-details">
                    <h4>${p.name}</h4>
                    <div class="participant-purse">
                        Purse: <span class="amount">${formatCurrency(p.purse)}</span>
                    </div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeParticipant(${p.id})">Remove</button>
        </div>
    `).join('');
}

function updateStartButton() {
    const btn = document.getElementById('startQuizBtn');
    btn.disabled = participants.length < 2;
}

// ==================== Quiz Management ====================
function startQuiz() {
    if (participants.length < 2) {
        showToast('Not Enough Participants', 'Add at least 2 participants to start', 'warning');
        return;
    }

    switchView('quizView');
    loadQuestion();
    showToast('Quiz Started', 'Let the bidding begin!', 'success');
}

function loadQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];

    // Update question number on both sides
    document.getElementById('questionNumber').textContent = `Question ${currentQuestionIndex + 1}`;
    document.getElementById('questionNumberBack').textContent = `Question ${currentQuestionIndex + 1}`;
    document.getElementById('questionText').textContent = question.question;

    // Reset flip card to front
    document.getElementById('flipCard').classList.remove('flipped');

    // Reset front secret reward display
    const secretRewardFront = document.getElementById('secretRewardFront');
    secretRewardFront.innerHTML = `
        <span class="lock-icon">🔒</span>
        Secret Reward
    `;

    // Reset back secret reward display
    const secretReward = document.getElementById('secretReward');
    secretReward.innerHTML = `
        <span class="lock-icon">🔒</span>
        Secret Reward
    `;
    secretReward.classList.remove('revealed');

    // Reset answer reveal box
    document.getElementById('answerLocked').style.display = 'flex';
    document.getElementById('answerContent').style.display = 'none';
    document.getElementById('answerRevealBox').classList.remove('revealed');
    document.getElementById('resultIcon').textContent = '❓';
    document.getElementById('resultIcon').className = 'result-icon';
    document.getElementById('resultText').textContent = 'Checking...';
    document.getElementById('resultText').className = 'result-text';
    document.getElementById('correctAnswerDisplay').textContent = '';

    // Reset reward reveal box
    document.getElementById('rewardLocked').style.display = 'flex';
    document.getElementById('rewardContent').style.display = 'none';
    document.getElementById('rewardRevealBox').classList.remove('revealed');

    // Hide continue button on card
    document.getElementById('cardContinueBtn').style.display = 'none';

    // Display options based on visible property
    const optionsGrid = document.getElementById('optionsGrid');
    const noHints = document.getElementById('noHints');

    if (question.visible) {
        // Show options
        const letters = ['A', 'B', 'C', 'D'];
        optionsGrid.innerHTML = question.options.map((option, index) => `
            <div class="option-item">
                <span class="option-letter">${letters[index]}</span>
                <span class="option-text">${option}</span>
            </div>
        `).join('');
        optionsGrid.style.display = 'grid';
        noHints.style.display = 'none';
    } else {
        // Hide options, show "no hints" message
        optionsGrid.style.display = 'none';
        noHints.style.display = 'flex';
    }

    // Populate bid winner select
    const winnerSelect = document.getElementById('bidWinner');
    winnerSelect.innerHTML = '<option value="">Select winner...</option>' +
        participants.map(p => `
            <option value="${p.id}">${p.name} - ${formatCurrency(p.purse)} available</option>
        `).join('');

    // Reset state
    bidWinner = null;
    bidAmount = 0;
    selectedAnswer = null;
    rewardRevealed = false;
    answerRevealed = false;
    document.getElementById('answerInput').value = '';
    document.getElementById('winnerBidAmount').value = '';
    document.getElementById('winnerPurse').innerHTML = '';
}

function updateWinnerPurse() {
    const select = document.getElementById('bidWinner');
    const purseDisplay = document.getElementById('winnerPurse');

    if (!select.value) {
        purseDisplay.innerHTML = '';
        bidWinner = null;
        return;
    }

    const participant = participants.find(p => p.id === parseInt(select.value));
    bidWinner = participant;
    purseDisplay.innerHTML = `💰 Available Purse: <strong>${formatCurrency(participant.purse)}</strong>`;
}

function submitAnswer() {
    // Validate bid winner
    if (!bidWinner) {
        showToast('No Winner', 'Please select the bid winner', 'error');
        return;
    }

    // Get and validate bid amount
    const bidAmountInput = document.getElementById('winnerBidAmount');
    bidAmount = parseInt(bidAmountInput.value);

    if (!bidAmount || bidAmount <= 0) {
        showToast('Invalid Bid', 'Please enter a valid bid amount', 'error');
        return;
    }

    if (bidAmount > bidWinner.purse) {
        showToast('Insufficient Funds', `${bidWinner.name} only has ${formatCurrency(bidWinner.purse)}`, 'error');
        return;
    }

    // Get and validate answer
    const answerInput = document.getElementById('answerInput');
    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
        showToast('No Answer', 'Please enter an answer', 'warning');
        return;
    }

    // Disable further interactions
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitAnswerBtn').style.display = 'none';
    document.getElementById('bidWinner').disabled = true;
    document.getElementById('winnerBidAmount').disabled = true;

    // Reset reveal states
    answerRevealed = false;
    rewardRevealed = false;

    // Flip the card to show the reveal boxes
    document.getElementById('flipCard').classList.add('flipped');

    showToast('Answer Submitted!', 'Tap the boxes on the card to reveal', 'info');
}

// Track if answer has been revealed for this question
let answerRevealed = false;

function revealAnswerOnCard() {
    if (answerRevealed) return;

    const question = quizQuestions[currentQuestionIndex];
    const correctAnswer = question.options[question.correct];
    const answerInput = document.getElementById('answerInput');
    const userAnswer = answerInput.value.trim();

    // Check if answer is correct (case-insensitive)
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

    // Hide the locked state, show the content
    document.getElementById('answerLocked').style.display = 'none';
    document.getElementById('answerContent').style.display = 'flex';

    // Update result icon
    const resultIcon = document.getElementById('resultIcon');
    resultIcon.textContent = isCorrect ? '✓' : '✗';
    resultIcon.className = `result-icon ${isCorrect ? 'correct' : 'incorrect'}`;

    // Update result text
    const resultText = document.getElementById('resultText');
    resultText.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    resultText.className = `result-text ${isCorrect ? 'correct' : 'incorrect'}`;

    // Show the correct answer
    const correctAnswerDisplay = document.getElementById('correctAnswerDisplay');
    correctAnswerDisplay.innerHTML = `Answer: <strong>${correctAnswer}</strong>`;

    // Mark box as revealed
    document.getElementById('answerRevealBox').classList.add('revealed');
    answerRevealed = true;

    if (isCorrect) {
        showToast('Correct!', 'Great answer!', 'success');
    } else {
        showToast('Incorrect!', `The correct answer was: ${correctAnswer}`, 'error');
    }

    // Check if both are revealed
    checkBothRevealed();
}

function revealRewardOnCard() {
    if (rewardRevealed) return;

    const question = quizQuestions[currentQuestionIndex];

    // Hide the locked state, show the content
    document.getElementById('rewardLocked').style.display = 'none';
    document.getElementById('rewardContent').style.display = 'flex';

    // Update the reward amount
    document.getElementById('rewardAmount').textContent = formatCurrency(question.reward);

    // Update the header badge on the back of the card
    const rewardEl = document.getElementById('secretReward');
    rewardEl.innerHTML = `
        <span class="lock-icon">🔓</span>
        ${formatCurrency(question.reward)}
    `;
    rewardEl.classList.add('revealed');

    // Mark box as revealed
    document.getElementById('rewardRevealBox').classList.add('revealed');
    rewardRevealed = true;

    showToast('Reward Revealed!', `Secret reward is ${formatCurrency(question.reward)}`, 'info');

    // Check if both are revealed
    checkBothRevealed();
}

function checkBothRevealed() {
    if (answerRevealed && rewardRevealed) {
        // Show continue button on the card
        document.getElementById('cardContinueBtn').style.display = 'block';
    }
}

function goToNextQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const correctAnswer = question.options[question.correct];
    const answerInput = document.getElementById('answerInput');
    const userAnswer = answerInput.value.trim();

    // Check if answer is correct (case-insensitive)
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

    // Deduct bid from participant's purse
    bidWinner.purse -= bidAmount;

    if (isCorrect) {
        bidWinner.rewards += question.reward;
        showToast('Reward Added! 🎉',
            `${bidWinner.name} wins ${formatCurrency(question.reward)}!`,
            'success');
    } else {
        showToast('Bid Deducted! ❌',
            `${bidWinner.name} loses ${formatCurrency(bidAmount)}`,
            'error');
    }

    totalQuestionsAnswered++;

    // Re-enable controls for next question
    document.getElementById('bidWinner').disabled = false;
    document.getElementById('winnerBidAmount').disabled = false;
    document.getElementById('answerInput').disabled = false;
    document.getElementById('submitAnswerBtn').style.display = 'flex';

    // Reset reveal states
    answerRevealed = false;
    rewardRevealed = false;

    // Show leaderboard after every question
    switchView('leaderboardView');
    updateLeaderboard();
}

function nextQuestion() {
    currentQuestionIndex++;

    // Re-enable controls
    document.getElementById('bidWinner').disabled = false;
    document.getElementById('winnerBidAmount').disabled = false;
    document.getElementById('answerInput').disabled = false;

    // Reset button states
    document.getElementById('submitAnswerBtn').style.display = 'flex';

    // Reset reveal states
    answerRevealed = false;
    rewardRevealed = false;

    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    switchView('quizView');
    loadQuestion();
}

function endQuiz() {
    showToast('Quiz Complete!', 'All questions have been answered', 'success');
    switchView('leaderboardView');
    updateLeaderboard();

    // Change next button to restart
    const nextBtn = document.querySelector('#leaderboardView .btn-primary');
    nextBtn.textContent = '🔄 Restart Quiz';
    nextBtn.onclick = restartQuiz;
}

function restartQuiz() {
    if (confirm('Are you sure you want to restart? This will reset all scores.')) {
        currentQuestionIndex = 0;
        totalQuestionsAnswered = 0;
        participants = [];
        globalPurseAmount = 0;
        switchView('setupView');
        renderParticipantsList();
        updateStartButton();

        // Reset to purse setup
        document.getElementById('purseSetup').style.display = 'block';
        document.getElementById('participantForm').style.display = 'none';
        document.getElementById('globalPurseAmount').value = '';

        showToast('Quiz Reset', 'Set purse amount to start a new quiz', 'info');
    }
}

// ==================== Leaderboard ====================
function updateLeaderboard() {
    // Update stats
    document.getElementById('totalParticipants').textContent = participants.length;
    document.getElementById('questionsAnswered').textContent = totalQuestionsAnswered;
    document.getElementById('totalRewards').textContent =
        formatCurrency(participants.reduce((sum, p) => sum + p.rewards, 0));

    // Restore the Next Question button (in case it was changed to Restart)
    const nextBtn = document.querySelector('#leaderboardView .btn-primary');
    if (currentQuestionIndex < quizQuestions.length - 1) {
        nextBtn.innerHTML = '<span class="btn-icon">➡️</span> Next Question';
        nextBtn.onclick = nextQuestion;
    }

    renderLeaderboard();
}

function renderLeaderboard() {
    const table = document.getElementById('leaderboardTable');

    // Sort by total value (purse + rewards)
    const sorted = [...participants].sort((a, b) =>
        (b.purse + b.rewards) - (a.purse + a.rewards)
    );

    const headerRow = `
        <div class="leaderboard-row header">
            <div>Rank</div>
            <div>Player</div>
            <div>Purse</div>
            <div>Rewards</div>
        </div>
    `;

    const participantRows = sorted.map((p, index) => `
        <div class="leaderboard-row" data-participant="${p.name.toLowerCase()}">
            <div class="rank rank-${index + 1}">${getRankEmoji(index + 1)}</div>
            <div class="player-info">
                <div class="player-avatar">${getInitials(p.name)}</div>
                <span class="player-name">${p.name}</span>
            </div>
            <div class="purse-amount">${formatCurrency(p.purse)}</div>
            <div class="reward-amount">${formatCurrency(p.rewards)}</div>
        </div>
    `).join('');

    table.innerHTML = headerRow + participantRows;
}

function getRankEmoji(rank) {
    switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return `#${rank} `;
    }
}

function filterLeaderboard() {
    const searchTerm = document.getElementById('searchParticipant').value.toLowerCase();
    const rows = document.querySelectorAll('#leaderboardTable .leaderboard-row:not(.header)');

    rows.forEach(row => {
        const participantName = row.getAttribute('data-participant');
        if (participantName.includes(searchTerm)) {
            row.style.display = 'grid';
        } else {
            row.style.display = 'none';
        }
    });
}

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    // Enable Enter key for purse amount
    document.getElementById('globalPurseAmount').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            setPurseAmount();
        }
    });

    // Enable Enter key for adding participants
    document.getElementById('participantName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addParticipant();
        }
    });

    // Initialize
    renderParticipantsList();
    updateStartButton();
});
