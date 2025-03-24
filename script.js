document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const spaceship = document.getElementById("spaceship");
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("high-score");
    const menu = document.getElementById("menu");
    const gameOverScreen = document.getElementById("game-over");
    const finalScoreDisplay = document.getElementById("final-score");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const leftButton = document.getElementById("left-button");
    const rightButton = document.getElementById("right-button");

    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let isGameOver = false;
    let spaceshipX = window.innerWidth / 2;
    let gameInterval, scoreInterval;

    highScoreDisplay.innerText = highScore;

    function moveSpaceship(direction) {
        if (isGameOver) return;
        if (direction === "left" && spaceshipX > 20) {
            spaceshipX -= 20;
        } else if (direction === "right" && spaceshipX < window.innerWidth - 70) {
            spaceshipX += 20;
        }
        spaceship.style.left = spaceshipX + "px";
    }

    // Keyboard controls
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") moveSpaceship("left");
        if (event.key === "ArrowRight") moveSpaceship("right");
    });

    // Touchscreen button controls
    leftButton.addEventListener("click", () => moveSpaceship("left"));
    rightButton.addEventListener("click", () => moveSpaceship("right"));

    function createMeteor() {
        if (isGameOver) return;
        let meteor = document.createElement("div");
        meteor.classList.add("meteor");
        meteor.style.left = Math.random() * window.innerWidth + "px";
        meteor.style.top = "0px";
        gameContainer.appendChild(meteor);

        let fallInterval = setInterval(() => {
            if (isGameOver) {
                clearInterval(fallInterval);
                return;
            }
            let meteorTop = parseInt(meteor.style.top);
            if (meteorTop > window.innerHeight - 60 && Math.abs(parseInt(meteor.style.left) - spaceshipX) < 40) {
                endGame();
            }
            if (meteorTop > window.innerHeight) {
                clearInterval(fallInterval);
                meteor.remove();
            } else {
                meteor.style.top = meteorTop + 5 + "px";
            }
        }, 30);
    }

    function updateScore() {
        if (isGameOver) return;
        score++;
        scoreDisplay.innerText = score;
    }

    function endGame() {
        isGameOver = true;
        clearInterval(gameInterval);
        clearInterval(scoreInterval);
        finalScoreDisplay.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.innerText = highScore;
        }

        gameOverScreen.style.display = "block";
    }

    function startGame() {
        isGameOver = false;
        score = 0;
        scoreDisplay.innerText = "0";
        gameOverScreen.style.display = "none";
        menu.style.display = "none";
        spaceshipX = window.innerWidth / 2;
        spaceship.style.left = spaceshipX + "px";
        document.querySelectorAll(".meteor").forEach(m => m.remove());

        gameInterval = setInterval(createMeteor, 1000);
        scoreInterval = setInterval(updateScore, 100);
    }

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);
});