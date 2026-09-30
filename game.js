const recipes = {
  salad: {
    name: "Salad",
    ingredients: ["lettuce", "tomato", "carrot"],
    points: 10
  },
  pizza: {
    name: "Pizza",
    ingredients: ["dough", "tomato", "cheese"],
    points: 15
  },
  burger: {
    name: "Burger",
    ingredients: ["bun", "patty", "lettuce"],
    points: 15
  },
  soup: {
    name: "Soup",
    ingredients: ["water", "carrot", "onion"],
    points: 20
  },
  cake: {
    name: "Cake",
    ingredients: ["flour", "egg", "sugar"],
    points: 20
  }
};

const ingredientButtons = document.querySelectorAll(".ingredients button");
const selectedIngredientsBox = document.getElementById("selectedIngredients");
const recipeName = document.getElementById("recipe-name");
const recipeIngredientsBox = document.getElementById("recipe-ingredients");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const cookButton = document.getElementById("cookButton");
const restartButton = document.getElementById("restartButton");
const message = document.getElementById("message");

let selectedIngredients = [];
let score = 0;
let timeLeft = 45;
let gameOver = false;
let timer = null;
let currentRecipeKey = null;

function getRandomRecipeKey() {
  const keys = Object.keys(recipes);
  return keys[Math.floor(Math.random() * keys.length)];
}

function sortIngredients(list) {
  return [...list].sort();
}

function updateSelectedIngredients() {
  if (selectedIngredients.length === 0) {
    selectedIngredientsBox.textContent = "None selected";
    return;
  }

  selectedIngredientsBox.textContent = selectedIngredients.join(", ");
}

function clearSelectedIngredients() {
  selectedIngredients = [];
  ingredientButtons.forEach((button) => {
    button.classList.remove("selected-button");
  });
  updateSelectedIngredients();
}

function showRecipe(recipeKey) {
  currentRecipeKey = recipeKey;
  const recipe = recipes[recipeKey];

  recipeName.textContent = recipe.name;
  recipeIngredientsBox.innerHTML = "";

  recipe.ingredients.forEach((ingredient) => {
    const tag = document.createElement("span");
    tag.className = "recipe-ingredient";
    tag.textContent = ingredient;
    recipeIngredientsBox.appendChild(tag);
  });
}

function checkRecipe() {
  if (!currentRecipeKey || gameOver) return;

  const recipe = recipes[currentRecipeKey];
  const correct = sortIngredients(recipe.ingredients);
  const chosen = sortIngredients(selectedIngredients);

  if (JSON.stringify(chosen) === JSON.stringify(correct)) {
    score += recipe.points;
    scoreDisplay.textContent = score;
    message.textContent = `✅ Correct! You made ${recipe.name}!`;
    message.style.color = "green";

    setTimeout(() => {
      if (!gameOver) {
        nextRecipe();
      }
    }, 700);
  } else {
    score = Math.max(0, score - 5);
    scoreDisplay.textContent = score;
    message.textContent = `❌ Not quite. The recipe needs: ${recipe.ingredients.join(", ")}`;
    message.style.color = "red";
  }

  clearSelectedIngredients();
}

function nextRecipe() {
  const nextKey = getRandomRecipeKey();
  showRecipe(nextKey);
  message.textContent = "";
  message.style.color = "#2c3e50";
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameOver = true;
  clearInterval(timer);
  cookButton.disabled = true;

  ingredientButtons.forEach((button) => {
    button.disabled = true;
  });

  message.textContent = `⏰ Time's up! Final score: ${score}`;
  message.style.color = "#c0392b";
}

function restartGame() {
  clearInterval(timer);
  score = 0;
  timeLeft = 45;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  message.textContent = "";
  message.style.color = "#2c3e50";

  ingredientButtons.forEach((button) => {
    button.disabled = false;
  });

  cookButton.disabled = false;
  gameOver = false;

  clearSelectedIngredients();
  nextRecipe();
  startTimer();
}

ingredientButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (gameOver) return;

    const ingredient = button.dataset.ingredient;

    if (selectedIngredients.includes(ingredient)) {
      selectedIngredients = selectedIngredients.filter((item) => item !== ingredient);
      button.classList.remove("selected-button");
    } else {
      selectedIngredients.push(ingredient);
      button.classList.add("selected-button");
    }

    updateSelectedIngredients();
  });
});

cookButton.addEventListener("click", () => {
  checkRecipe();
});

restartButton.addEventListener("click", () => {
  restartGame();
});

nextRecipe();
startTimer();

