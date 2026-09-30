const ingredientButtons = document.querySelectorAll(".ingredients button");
const selectedIngredientsBox = document.getElementById("selectedIngredients");
const cookButton = document.getElementById("cookButton");
const restartButton = document.getElementById("restartButton");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const correctIngredients = ["tomato", "lettuce", "carrot"];

let selectedIngredients = [];
let score = 0;
let timeLeft = 30;
let gameOver = false;
let timer;

// Select or remove ingredients
ingredientButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (gameOver) {
      return;
    }

    const ingredient = button.dataset.ingredient;

    if (selectedIngredients.includes(ingredient)) {
      selectedIngredients = selectedIngredients.filter(
        (item) => item !== ingredient
      );

      button.classList.remove("selected-button");
    } else {
      selectedIngredients.push(ingredient);
      button.classList.add("selected-button");
    }

    displaySelectedIngredients();
  });
});

// Show selected ingredients
function displaySelectedIngredients() {
  if (selectedIngredients.length === 0) {
    selectedIngredientsBox.textContent = "Nothing selected";
    return;
  }

  selectedIngredientsBox.textContent = selectedIngredients.join(", ");
}

// Cook the recipe
cookButton.addEventListener("click", () => {
  if (gameOver) {
    return;
  }

  const playerIngredients = [...selectedIngredients].sort();
  const recipeIngredients = [...correctIngredients].sort();

  const isCorrect =
    JSON.stringify(playerIngredients) === JSON.stringify(recipeIngredients);

  if (isCorrect) {
    score += 10;
    scoreDisplay.textContent = score;
    message.textContent = "✅ Delicious! You made a salad!";
    message.style.color = "green";
  } else {
    score = Math.max(0, score - 5);
    scoreDisplay.textContent = score;
    message.textContent =
      "❌ That recipe is incorrect. Try tomato, lettuce, and carrot.";
    message.style.color = "red";
  }

  clearSelectedIngredients();
});

// Clear ingredient selections
function clearSelectedIngredients() {
  selectedIngredients = [];

  ingredientButtons.forEach((button) => {
    button.classList.remove("selected-button");
  });

  displaySelectedIngredients();
}

// Countdown timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End the game
function endGame() {
  gameOver = true;
  clearInterval(timer);

  message.textContent = `⏰ Time's up! Final score: ${score}`;
  message.style.color = "#e74c3c";

  cookButton.disabled = true;

  ingredientButtons.forEach((button) => {
    button.disabled = true;
  });
}

// Restart the game
restartButton.addEventListener("click", () => {
  clearInterval(timer);

  selectedIngredients = [];
  score = 0;
  timeLeft = 30;
  gameOver = false;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  message.textContent = "";

  cookButton.disabled = false;

  ingredientButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("selected-button");
  });

  displaySelectedIngredients();
  startTimer();
});

// Start the game
displaySelectedIngredients();
startTimer();
