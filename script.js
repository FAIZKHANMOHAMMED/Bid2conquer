// ==================== Global State ====================
let participants = [];
let currentQuestionIndex = 0;
let bidWinner = null;
let bidAmount = 0;
let selectedAnswer = null;
let selectedOptionAnswer = null;  // For visible option questions (A, B, C, D)
let totalQuestionsAnswered = 0;
let globalPurseAmount = 0;
let rewardRevealed = false;
let currentView = 'setupView';  // Track current view for navigation
let cardFlipped = false;

// ==================== Local Storage Functions ====================
const STORAGE_KEY = 'bid2conquer_gamestate';

function saveGameState() {
    const gameState = {
        participants: participants,
        currentQuestionIndex: currentQuestionIndex,
        totalQuestionsAnswered: totalQuestionsAnswered,
        globalPurseAmount: globalPurseAmount,
        currentView: currentView,
        timestamp: Date.now()
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        console.log('Game state saved:', gameState);
    } catch (e) {
        console.error('Failed to save game state:', e);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const gameState = JSON.parse(saved);

            // Check if saved state is less than 24 hours old
            const hoursSinceSave = (Date.now() - gameState.timestamp) / (1000 * 60 * 60);
            if (hoursSinceSave > 24) {
                clearGameState();
                return null;
            }

            return gameState;
        }
    } catch (e) {
        console.error('Failed to load game state:', e);
    }
    return null;
}

function clearGameState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Game state cleared');
    } catch (e) {
        console.error('Failed to clear game state:', e);
    }
}

function restoreGameState(gameState) {
    if (!gameState) return false;

    participants = gameState.participants || [];
    currentQuestionIndex = gameState.currentQuestionIndex || 0;
    totalQuestionsAnswered = gameState.totalQuestionsAnswered || 0;
    globalPurseAmount = gameState.globalPurseAmount || 0;
    currentView = gameState.currentView || 'setupView';

    return true;
}

// ==================== Browser History Navigation ====================
function pushHistoryState(viewId, title = 'Bid2Conquer') {
    const stateData = { view: viewId };
    history.pushState(stateData, title, `#${viewId}`);
    currentView = viewId;
    saveGameState();
}

function handlePopState(event) {
    if (event.state && event.state.view) {
        navigateToView(event.state.view, false);
    } else {
        // No state, check hash or go to setup
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            navigateToView(hash, false);
        } else {
            navigateToView('setupView', false);
        }
    }
}

function navigateToView(viewId, addToHistory = true) {
    // Handle navigation logic based on current and target view
    currentView = viewId;

    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');

    if (addToHistory) {
        pushHistoryState(viewId);
    }

    // Update UI based on view
    if (viewId === 'setupView') {
        renderParticipantsList();
        updateStartButton();

        if (globalPurseAmount > 0) {
            document.getElementById('purseSetup').style.display = 'none';
            document.getElementById('participantForm').style.display = 'block';
            document.getElementById('purseDisplay').textContent = formatCurrency(globalPurseAmount);
        }
    } else if (viewId === 'quizView') {
        loadQuestion();
    } else if (viewId === 'leaderboardView') {
        updateLeaderboard();
    }

    saveGameState();
}

// Sample quiz questions with secret rewards
const quizQuestions = [

  {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
{
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 70,
        visible: false // Don't show options - harder question
    },
    {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 0,
        visible: false // Don't show options - harder question
    },
    {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
    {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
    {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },
      {
        question: "1.Sample: Which car brand features a logo with a three-pointed star inside a circle??",
        options: ["Mercedes Benz", "False"],
        correct: 0,
        reward: 80,
        visible: false // Don't show options - harder question
    },




















    // {
    //     question: "2.Which company is known for its 'Just Do It' slogan?",
    //     options: ["Adidas", "Puma", "Nike", "Reebok"],
    //     correct: 2,
    //     reward: 0,
    //     visible: false
    // },
   
    // {
    //     question: "3.An electric train is moving north at 100 km/h. The wind is blowing west at 10 km/h. Which way does the smoke blow??",
    //     options: ["North", "South", "East", "There is no smoke"],
    //     correct: 3,
    //     reward: 20,
    //     visible: false
    // },
    // {
    //     question: "4.Full form of MVP?",
    //     options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Multi Variable Process"],
    //     correct: 1,
    //     reward: 50,
    //     visible: false  // Don't show options
    // },
    // {
    //     question: "5.YouTube was originally a dating website idea?",
    //     options: ["True", "False"],
    //     correct: 0,
    //     reward: 40,
    //     visible: false
    // },
    // {
    //     question: "6.What is something everyone agrees with but nobody reads??",
    //     options: ["Terms and Conditions", "Privacy Policy", "User Manual", "FAQs"],
    //     correct: 0,
    //     reward: 100,
    //     visible: false
    // },
    // {
    //     question: "7.Which company uses the tagline: “Think different”?",
    //     options: ["Apple", "Google", "Microsoft", "Amazon"],
    //     correct: 0,
    //     reward: 0,
    //     visible: false  // Show options on screen
    // },
    // {
    //     question: "8.If you have a bowl with six apples and you take away four, how many do you have?",
    //     options: ["2", "4", "6", "None"],
    //     correct: 1,
    //     reward: 90,
    //     visible: false // Don't show options
    // },
    // {
    //     question: "9.Which company owns the game Free Fire?",
    //     options: ["Tencent", "Garena", "Activision", "Electronic Arts"],
    //     correct: 1,
    //     reward: 110,
    //     visible: false
    // },
    // {
    //     question: "10.Which company owns Snapchat?",
    //     options: ["Meta", "Snap Inc.", "Google", "Apple"],
    //     correct: 1,
    //     reward: 70,
    //     visible: false
    // },
     
    
    // {
    //     question: "11.From selling pickles and books by train To building hotels again and again?",
    //     options: ["Taj Hotels","ITC Hotels", "OYO Rooms", "The Leela Palaces"],
    //     correct: 2,
    //     reward: 40,
    //     visible: false
    // },
    //  {
    //     question: "12.Guess the product that tagline belongs to: 'THE MINT WITH THE HOLE'?",
    //     options: ["polo","Happydent", "Center Fresh", "Big Babol"],
    //     correct: 0,
    //     reward: 40,
    //     visible: false
    // },
   

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

function switchView(viewId, addToHistory = true) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
    currentView = viewId;

    if (addToHistory) {
        pushHistoryState(viewId);
    }

    saveGameState();
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
    saveGameState();
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
    saveGameState();
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
    saveGameState();
}

function removeParticipant(id) {
    const participant = participants.find(p => p.id === id);
    participants = participants.filter(p => p.id !== id);

    renderParticipantsList();
    updateStartButton();
    showToast('Removed', `${participant.name} has been removed`, 'info');
    saveGameState();
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

    // Handle options display on the front of the card
    if (question.visible) {
        // Show options on card
        const letters = ['A', 'B', 'C', 'D'];
        optionsGrid.innerHTML = question.options.map((option, index) => `
            <div class="option-item">
                <span class="option-letter">${letters[index]}</span>
                <span class="option-text">${option}</span>
            </div>
        `).join('');
        optionsGrid.style.display = 'grid';
        noHints.style.display = 'none';

        // Option buttons for entering answers were removed in the new flow
        // (Options are shown on the front card for reference only)
    } else {
        // Hide options, show "no hints" message
        optionsGrid.style.display = 'none';
        noHints.style.display = 'flex';

    }

    // Hide reward entry row until reward is revealed
    const rewardRow = document.getElementById('rewardEntryRow');
    if (rewardRow) rewardRow.style.display = 'none';

    // Reset flip state for this question
    cardFlipped = false;
    const front = document.querySelector('#flipCard .flip-card-front');
    if (front) {
        front.style.cursor = 'pointer';
        front.onclick = () => { if (!cardFlipped) flipCardFrontClicked(); };
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
    selectedOptionAnswer = null;
    rewardRevealed = false;
    answerRevealed = false;
    const rewardGiven = document.getElementById('rewardGivenAmount');
    if (rewardGiven) rewardGiven.value = '';
    document.getElementById('winnerBidAmount').value = '';
    document.getElementById('winnerPurse').innerHTML = '';
}

// ==================== Option Answer Selection ====================
function selectOptionAnswer(option) {
    selectedOptionAnswer = option;

    // Update button styles
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.option === option) {
            btn.classList.add('selected');
        }
    });

    // Update display
    const question = quizQuestions[currentQuestionIndex];
    const optionIndex = ['A', 'B', 'C', 'D'].indexOf(option);
    const optionText = question.options[optionIndex];
    document.getElementById('selectedOptionDisplay').innerHTML =
        `Selected: <strong>${option}</strong> - ${optionText}`;

    showToast('Option Selected', `You selected option ${option}`, 'info');
}

function resetOptionButtons() {
    selectedOptionAnswer = null;
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    document.getElementById('selectedOptionDisplay').innerHTML = 'No option selected';
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
    // (OLD) submitAnswer removed. Use submitResult() after reveal to apply bid and reward.
}

function skipQuestion() {
    // Confirm skip action
    if (!confirm('Are you sure you want to skip this question? No bid will be placed.')) {
        return;
    }

    const question = quizQuestions[currentQuestionIndex];

    // Show toast notification
    showToast('Question Skipped! ⏭️', `Skipped: "${question.question.substring(0, 50)}..."`, 'warning');

    // Increment question index
    currentQuestionIndex++;

    // Reset controls for next question
    document.getElementById('bidWinner').disabled = false;
    document.getElementById('winnerBidAmount').disabled = false;
    // answer input and submit buttons were removed in new flow

    // Reset reveal states
    answerRevealed = false;
    rewardRevealed = false;

    // Check if there are more questions
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    // Load the next question
    loadQuestion();
}

// Track if answer has been revealed for this question
let answerRevealed = false;

function flipCardFrontClicked() {
    if (cardFlipped) return;
    document.getElementById('flipCard').classList.add('flipped');
    cardFlipped = true;
}

function revealAnswerOnCard() {
    if (answerRevealed) return;

    const question = quizQuestions[currentQuestionIndex];
    const correctAnswer = question.options[question.correct];

    // Hide locked state and show answer
    document.getElementById('answerLocked').style.display = 'none';
    document.getElementById('answerContent').style.display = 'flex';

    // Display the correct answer without judging (host decides outcome)
    const resultIcon = document.getElementById('resultIcon');
    resultIcon.textContent = '🎉';
    resultIcon.className = 'result-icon';

    const resultText = document.getElementById('resultText');
    resultText.textContent = 'Answer Revealed';
    resultText.className = 'result-text';

    const correctAnswerDisplay = document.getElementById('correctAnswerDisplay');
    correctAnswerDisplay.innerHTML = `Answer: <strong>${correctAnswer}</strong>`;

    document.getElementById('answerRevealBox').classList.add('revealed');
    answerRevealed = true;

    showToast('Answer Revealed', `The correct answer is now visible on the card`, 'info');

    // If reward already revealed, show submit controls
    if (rewardRevealed) {
        const rewardRow = document.getElementById('rewardEntryRow');
        if (rewardRow) rewardRow.style.display = 'flex';
    }
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

    // Show the reward entry controls (allow host to adjust the reward given)
    const rewardRow = document.getElementById('rewardEntryRow');
    if (rewardRow) {
        rewardRow.style.display = 'flex';
        const rewardGiven = document.getElementById('rewardGivenAmount');
        if (rewardGiven) rewardGiven.value = question.reward;
    }

    if (answerRevealed) checkBothRevealed();
}

function checkBothRevealed() {
    if (answerRevealed && rewardRevealed) {
        // Show continue button on the card
        document.getElementById('cardContinueBtn').style.display = 'block';
    }
}

function goToNextQuestion() {
    // For compatibility the card continue will submit the result
    submitResult();
}

function nextQuestion() {
    currentQuestionIndex++;

    // Re-enable controls
    document.getElementById('bidWinner').disabled = false;
    document.getElementById('winnerBidAmount').disabled = false;
    // answer input and old submit/skip buttons no longer exist

    // Re-enable option buttons
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => btn.disabled = false);

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

function submitResult() {
    // Validate bid winner
    if (!bidWinner) {
        showToast('No Winner', 'Please select the bid winner', 'error');
        return;
    }

    // Validate bid amount
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

    // Get reward given (host may adjust)
    const rewardGivenInput = document.getElementById('rewardGivenAmount');
    const rewardGiven = rewardGivenInput ? parseInt(rewardGivenInput.value) || 0 : 0;

    // Apply bid deduction
    bidWinner.purse -= bidAmount;

    if (rewardGiven > 0) {
        bidWinner.rewards += rewardGiven;
        showToast('Reward Added! 🎉', `${bidWinner.name} receives ${formatCurrency(rewardGiven)}`, 'success');
    } else {
        showToast('Bid Deducted! ❌', `${bidWinner.name} loses ${formatCurrency(bidAmount)}`, 'error');
    }

    totalQuestionsAnswered++;

    // Reset controls
    document.getElementById('bidWinner').disabled = false;
    document.getElementById('winnerBidAmount').disabled = false;
    const rewardRow = document.getElementById('rewardEntryRow');
    if (rewardRow) rewardRow.style.display = 'none';
    if (rewardGivenInput) rewardGivenInput.value = '';
    document.getElementById('winnerBidAmount').value = '';
    document.getElementById('winnerPurse').innerHTML = '';

    // Reset reveal/buttons
    answerRevealed = false;
    rewardRevealed = false;
    const card = document.getElementById('flipCard');
    if (card) card.classList.remove('flipped');
    cardFlipped = false;
    document.getElementById('cardContinueBtn').style.display = 'none';

    // Show leaderboard with updated scores; host can click Next Question to continue
    switchView('leaderboardView');
    updateLeaderboard();
    saveGameState();
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

        // Clear saved game state
        clearGameState();

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

    // Set up browser back/forward button handler
    window.addEventListener('popstate', handlePopState);

    // Try to restore saved game state
    const savedState = loadGameState();
    if (savedState && restoreGameState(savedState)) {
        // Restore the UI based on saved state
        renderParticipantsList();
        updateStartButton();

        // Restore purse amount display
        if (globalPurseAmount > 0) {
            document.getElementById('purseSetup').style.display = 'none';
            document.getElementById('participantForm').style.display = 'block';
            document.getElementById('purseDisplay').textContent = formatCurrency(globalPurseAmount);
        }

        // Navigate to the saved view
        switchView(currentView, false);

        // Set initial history state
        history.replaceState({ view: currentView }, 'Bid2Conquer', `#${currentView}`);

        showToast('Progress Restored! 📂', 'Your previous session has been loaded', 'success');
    } else {
        // Fresh start
        renderParticipantsList();
        updateStartButton();

        // Set initial history state
        history.replaceState({ view: 'setupView' }, 'Bid2Conquer', '#setupView');
    }
});
