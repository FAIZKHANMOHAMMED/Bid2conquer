# Bid 2 Conquer Quiz 💎

An interactive auction-style quiz game where participants bid offline to answer questions and win secret rewards!

## 🎯 Features

### Setup Phase
- Set a starting purse amount (applies to all participants)
- Add multiple participants by name
- All participants start with the same purse amount
- Remove participants if needed
- Minimum 2 participants required to start

### Quiz Flow
1. **Display Question**: Question is displayed prominently (no options shown)
2. **Offline Bidding**: Conduct bidding outside the app
3. **Enter Winner**: Input the bid winner and their bid amount
4. **Enter Answer**: Winner types their answer
5. **Submit**: Check if correct and award/deduct accordingly

### Scoring System
- ✅ **Correct Answer**: Bid amount deducted from purse + secret reward added to rewards
- ❌ **Wrong Answer**: Bid amount deducted from purse (no reward)

### Leaderboard
- Real-time rankings by total value (purse + rewards)
- Search functionality to find participants
- Statistics dashboard showing total participants, questions answered, and rewards

### Customization
- **Question Editor**: Use `editor.html` to customize all questions, answers, and rewards
- **Clickable Rewards**: Click the "Secret Reward" badge to reveal it early
- Export feature to generate code for your custom questions

## 🚀 How to Use

1. **Open** `index.html` in your web browser
2. **Set Purse Amount**: Enter the starting amount for all participants (e.g., 1000)
3. **Add Participants**: Enter participant names one by one
   - All participants will automatically get the purse amount you set
   - You can change the purse amount (will remove all participants)
4. **Start Quiz**: Click "Start Quiz" when ready (need at least 2 participants)
5. For each question:
   - Question is displayed (no options visible)
   - Conduct bidding offline
   - Select the bid winner from dropdown
   - Enter the winning bid amount
   - Winner types their answer
   - Click "Submit Answer"
6. **View Results**: Check leaderboard after each question
7. **Continue**: Click "Next Question" or restart when finished

## 🎨 Design Features

- Modern dark theme with glassmorphism effects
- Vibrant gradient color scheme
- Smooth animations and transitions
- Fully responsive design
- Toast notifications for user feedback

## 📋 Quiz Questions

The app includes 10 pre-loaded questions on various topics with secret rewards ranging from $400 to $1200.

## 🛠️ Technical Stack

- **HTML5**: Semantic structure
- **CSS3**: Custom properties, animations, responsive design
- **JavaScript**: Vanilla JS with no dependencies

## 💡 Tips

- Set realistic starting purse amounts for your group
- Keep track of offline bids carefully
- Use the search feature on leaderboard for large groups
- Secret rewards are revealed automatically on answer submission (or click to reveal early)
- **Click the 🔒 Secret Reward badge** to reveal it before submitting

## ✏️ Customizing Questions

1. **Open** `editor.html` in your browser
2. **Edit existing questions** or add new ones
3. Set the correct answer by clicking the radio button
4. Customize the secret reward amount
5. Click **"Export Code"**
6. Copy the generated code
7. Replace the `quizQuestions` array in `script.js` (around line 10)

The editor provides a user-friendly interface to create your own quiz without touching code!

---

Enjoy your Bid 2 Conquer Quiz! 🎉
