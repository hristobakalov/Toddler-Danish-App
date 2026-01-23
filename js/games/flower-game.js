import { flowerConfig } from '../data/flower-data.js';

export class FlowerGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;

        // Game state
        this.isGameRunning = false;
        this.score = 0;

        // Flower state
        this.flowerPos = { x: 8, y: 8 };  // Top-left corner
        this.direction = 'right';
        this.nextDirection = 'right';
        this.currentFrame = 0;  // For sprite animation (0-1)
        this.flowerImages = [];  // Preloaded images
        this.currentFlowerSize = flowerConfig.initialFlowerSize;  // Start small
        this.currentMoveSpeed = flowerConfig.initialMoveSpeed;  // Start slow

        // Game objects
        this.foodItems = [];  // [{x, y, emoji, points}]
        this.bombs = [];  // [{x, y, countdown, exploded, explosionTimer}]

        // Timers
        this.moveLoop = null;
        this.bombSpawnTimer = null;

        this.gridSize = flowerConfig.gridSize;
        this.cellSize = flowerConfig.cellSize;
    }

    async init() {
        await this.preloadImages();
        this.setupCanvas();
        this.setupControls();
        this.showStartScreen();
    }

    async preloadImages() {
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        this.flowerImages = await Promise.all(
            flowerConfig.flowerImages.map(src => loadImage(src))
        );
    }

    setupCanvas() {
        const canvasWrapper = this.container.querySelector('.flower-canvas-wrapper');
        if (!canvasWrapper) return;

        this.canvas = document.getElementById('flowerCanvas');
        if (!this.canvas) return;

        const canvasSize = this.gridSize * this.cellSize;
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        this.ctx = this.canvas.getContext('2d');
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isGameRunning) return;

            const direction = flowerConfig.controls[e.key];
            if (direction) {
                e.preventDefault();
                this.changeDirection(direction);
            }
        });

        // Touch controls
        this.setupTouchControls();

        // Button controls
        const startBtn = document.getElementById('startFlowerBtn');
        const restartBtn = document.getElementById('restartFlowerBtn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.startGame());
        }
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: false });

        this.canvas?.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        this.canvas?.addEventListener('touchend', (e) => {
            if (!this.isGameRunning) return;

            e.preventDefault();
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    this.changeDirection(deltaX > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    this.changeDirection(deltaY > 0 ? 'down' : 'up');
                }
            }
        }, { passive: false });
    }

    changeDirection(newDirection) {
        this.move(newDirection);
    }

    showStartScreen() {
        document.getElementById('flowerStartScreen').style.display = 'flex';
        document.getElementById('flowerGameScreen').style.display = 'none';
        document.getElementById('flowerGameOver').style.display = 'none';
    }

    startGame() {
        // Hide screens
        document.getElementById('flowerStartScreen').style.display = 'none';
        document.getElementById('flowerGameOver').style.display = 'none';
        document.getElementById('flowerGameScreen').style.display = 'flex';

        // Reset game state
        this.score = 0;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.currentFrame = 0;
        this.currentFlowerSize = flowerConfig.initialFlowerSize;
        this.currentMoveSpeed = flowerConfig.initialMoveSpeed;

        // Reset flower position to center
        this.flowerPos = {
            x: Math.floor(this.gridSize / 2) - Math.floor(this.currentFlowerSize / 2),
            y: Math.floor(this.gridSize / 2) - Math.floor(this.currentFlowerSize / 2)
        };

        // Reset game objects
        this.foodItems = [];
        this.bombs = [];

        // Spawn initial food
        for (let i = 0; i < 5; i++) {
            this.spawnFood();
        }

        // Update score display
        this.updateScore();

        // Start game loops
        this.isGameRunning = true;
        // Update bombs every 100ms
        this.moveLoop = setInterval(() => this.updateBombsOnly(), 100);
        this.scheduleBombSpawn();

        // Initial draw
        this.draw();
    }

    move(direction) {
        if (!this.isGameRunning) return;

        const newPos = { ...this.flowerPos };
        const flowerSize = Math.floor(this.currentFlowerSize);

        switch (direction) {
            case 'up':
                newPos.y -= 1;
                break;
            case 'down':
                newPos.y += 1;
                break;
            case 'left':
                newPos.x -= 1;
                break;
            case 'right':
                newPos.x += 1;
                break;
        }

        // Wrap around edges
        if (newPos.x < 0) {
            newPos.x = this.gridSize - flowerSize;
        } else if (newPos.x + flowerSize > this.gridSize) {
            newPos.x = 0;
        }

        if (newPos.y < 0) {
            newPos.y = this.gridSize - flowerSize;
        } else if (newPos.y + flowerSize > this.gridSize) {
            newPos.y = 0;
        }

        // Move flower
        this.flowerPos = newPos;

        // Animate sprite when moving (toggle between 0 and 1)
        this.currentFrame = (this.currentFrame + 1) % 2;

        // Check food collision
        this.checkFoodCollision();

        // Draw game
        this.draw();
    }

    updateBombsOnly() {
        if (!this.isGameRunning) return;

        this.updateBombs();
        this.draw();
    }

    checkFoodCollision() {
        const flowerSize = Math.floor(this.currentFlowerSize);

        for (let i = this.foodItems.length - 1; i >= 0; i--) {
            const food = this.foodItems[i];

            // Check if any part of flower overlaps with food
            for (let dx = 0; dx < flowerSize; dx++) {
                for (let dy = 0; dy < flowerSize; dy++) {
                    if (this.flowerPos.x + dx === food.x &&
                        this.flowerPos.y + dy === food.y) {
                        // Eat food
                        this.score += food.points;
                        this.updateScore();
                        this.foodItems.splice(i, 1);

                        // Grow flower
                        if (this.currentFlowerSize < flowerConfig.maxFlowerSize) {
                            this.currentFlowerSize += flowerConfig.flowerGrowthRate;
                            if (this.currentFlowerSize > flowerConfig.maxFlowerSize) {
                                this.currentFlowerSize = flowerConfig.maxFlowerSize;
                            }
                        }

                        // Increase speed (decrease delay)
                        if (this.currentMoveSpeed > flowerConfig.minMoveSpeed) {
                            this.currentMoveSpeed -= flowerConfig.speedIncreaseRate;
                            if (this.currentMoveSpeed < flowerConfig.minMoveSpeed) {
                                this.currentMoveSpeed = flowerConfig.minMoveSpeed;
                            }
                        }

                        // Spawn new food
                        this.spawnFood();
                        return;
                    }
                }
            }
        }
    }

    getExplosionRadius() {
        // Increase explosion radius based on score
        if (this.score >= 300) {
            return 4;  // 4x4 explosion at score 300+
        } else if (this.score >= 200) {
            return 3;  // 3x3 explosion at score 200+
        } else {
            return 2;  // 2x2 explosion at score < 200
        }
    }

    checkExplosionCollisionWithRadius(bombX, bombY, explosionRadius) {
        const flowerSize = Math.floor(this.currentFlowerSize);

        // Explosion covers variable area based on stored radius
        for (let dx = 0; dx < flowerSize; dx++) {
            for (let dy = 0; dy < flowerSize; dy++) {
                const flowerCellX = this.flowerPos.x + dx;
                const flowerCellY = this.flowerPos.y + dy;

                if (flowerCellX >= bombX && flowerCellX < bombX + explosionRadius &&
                    flowerCellY >= bombY && flowerCellY < bombY + explosionRadius) {
                    return true;
                }
            }
        }
        return false;
    }

    spawnFood() {
        if (this.foodItems.length >= flowerConfig.maxFoodItems) {
            return;
        }

        const foodType = flowerConfig.foodItems[Math.floor(Math.random() * flowerConfig.foodItems.length)];

        let position;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            position = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
            attempts++;
        } while (attempts < maxAttempts && !this.isValidFoodPosition(position.x, position.y));

        if (attempts < maxAttempts) {
            this.foodItems.push({
                x: position.x,
                y: position.y,
                emoji: foodType.emoji,
                points: foodType.points
            });
        }
    }

    isValidFoodPosition(x, y) {
        const flowerSize = Math.floor(this.currentFlowerSize);

        // Check flower overlap
        for (let dx = 0; dx < flowerSize; dx++) {
            for (let dy = 0; dy < flowerSize; dy++) {
                if (this.flowerPos.x + dx === x && this.flowerPos.y + dy === y) {
                    return false;
                }
            }
        }

        // Check existing food overlap
        if (this.foodItems.some(food => food.x === x && food.y === y)) {
            return false;
        }

        // Check bomb overlap
        if (this.bombs.some(bomb => bomb.x === x && bomb.y === y)) {
            return false;
        }

        return true;
    }

    scheduleBombSpawn() {
        if (!this.isGameRunning) return;

        const minInterval = flowerConfig.bombSpawnInterval[0];
        const maxInterval = flowerConfig.bombSpawnInterval[1];
        const interval = Math.random() * (maxInterval - minInterval) + minInterval;

        this.bombSpawnTimer = setTimeout(() => {
            this.spawnBomb();
            this.scheduleBombSpawn();
        }, interval);
    }

    spawnBomb() {
        if (!this.isGameRunning) return;

        const explosionRadius = this.getExplosionRadius();

        let position;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            position = {
                x: Math.floor(Math.random() * (this.gridSize - explosionRadius)),
                y: Math.floor(Math.random() * (this.gridSize - explosionRadius))
            };
            attempts++;
        } while (attempts < maxAttempts && !this.isValidBombPosition(position.x, position.y));

        if (attempts < maxAttempts) {
            this.bombs.push({
                x: position.x,
                y: position.y,
                countdown: flowerConfig.bombCountdown,
                exploded: false,
                explosionTimer: 0,
                explosionRadius: explosionRadius  // Store radius with bomb
            });
        }
    }

    isValidBombPosition(x, y) {
        const flowerSize = Math.floor(this.currentFlowerSize);
        const explosionRadius = this.getExplosionRadius();

        // Check flower overlap with safety margin (2 cells)
        const safetyMargin = 2;
        for (let dx = -safetyMargin; dx < flowerSize + safetyMargin; dx++) {
            for (let dy = -safetyMargin; dy < flowerSize + safetyMargin; dy++) {
                const checkX = this.flowerPos.x + dx;
                const checkY = this.flowerPos.y + dy;

                // Check if bomb area overlaps with flower safety zone
                for (let bx = 0; bx < explosionRadius; bx++) {
                    for (let by = 0; by < explosionRadius; by++) {
                        if (x + bx === checkX && y + by === checkY) {
                            return false;
                        }
                    }
                }
            }
        }

        // Check existing bomb overlap
        if (this.bombs.some(bomb =>
            Math.abs(bomb.x - x) < explosionRadius &&
            Math.abs(bomb.y - y) < explosionRadius)) {
            return false;
        }

        return true;
    }

    updateBombs() {
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];

            if (!bomb.exploded) {
                bomb.countdown -= 100;  // Decrease by 100ms each update

                if (bomb.countdown <= 0) {
                    // Explode
                    bomb.exploded = true;
                    bomb.explosionTimer = flowerConfig.explosionDuration;

                    // Check if flower is in blast radius (use stored explosion radius)
                    if (this.checkExplosionCollisionWithRadius(bomb.x, bomb.y, bomb.explosionRadius)) {
                        this.gameOver();
                    }
                }
            } else {
                // Update explosion timer
                bomb.explosionTimer -= 100;  // Decrease by 100ms each update

                if (bomb.explosionTimer <= 0) {
                    // Remove bomb
                    this.bombs.splice(i, 1);
                }
            }
        }
    }

    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }

        // Draw food
        this.ctx.font = `${this.cellSize - 4}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.foodItems.forEach(food => {
            this.ctx.fillText(
                food.emoji,
                food.x * this.cellSize + this.cellSize / 2,
                food.y * this.cellSize + this.cellSize / 2
            );
        });

        // Draw bombs
        this.bombs.forEach(bomb => {
            const radius = bomb.explosionRadius || 2;  // Use stored radius

            if (!bomb.exploded) {
                // Draw large red bomb (size based on explosion radius)
                this.ctx.font = `${this.cellSize * radius}px Arial`;
                this.ctx.fillText(
                    flowerConfig.bombEmoji,
                    bomb.x * this.cellSize + (this.cellSize * radius / 2),
                    bomb.y * this.cellSize + (this.cellSize * radius / 2)
                );

                // Draw countdown number in center
                const countdownNumber = Math.ceil(bomb.countdown / 1000);
                this.ctx.fillStyle = 'white';
                this.ctx.font = `bold ${this.cellSize * (radius / 2)}px Arial`;
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 4;
                this.ctx.strokeText(
                    countdownNumber.toString(),
                    bomb.x * this.cellSize + (this.cellSize * radius / 2),
                    bomb.y * this.cellSize + (this.cellSize * radius / 2)
                );
                this.ctx.fillText(
                    countdownNumber.toString(),
                    bomb.x * this.cellSize + (this.cellSize * radius / 2),
                    bomb.y * this.cellSize + (this.cellSize * radius / 2)
                );
                this.ctx.font = `${this.cellSize - 4}px Arial`;
            } else {
                // Draw explosion (variable size based on radius)
                for (let dx = 0; dx < radius; dx++) {
                    for (let dy = 0; dy < radius; dy++) {
                        this.ctx.fillText(
                            flowerConfig.explosionEmoji,
                            (bomb.x + dx) * this.cellSize + this.cellSize / 2,
                            (bomb.y + dy) * this.cellSize + this.cellSize / 2
                        );
                    }
                }
            }
        });

        // Draw flower (variable size sprite)
        const flowerImage = this.flowerImages[this.currentFrame];
        if (flowerImage) {
            const flowerSize = Math.floor(this.currentFlowerSize);
            this.ctx.drawImage(
                flowerImage,
                this.flowerPos.x * this.cellSize,
                this.flowerPos.y * this.cellSize,
                flowerSize * this.cellSize,
                flowerSize * this.cellSize
            );
        }
    }

    updateScore() {
        const scoreEl = document.getElementById('flowerScore');
        const finalScoreEl = document.getElementById('flowerFinalScore');

        if (scoreEl) {
            scoreEl.textContent = this.score;
        }
        if (finalScoreEl) {
            finalScoreEl.textContent = this.score;
        }
    }

    gameOver() {
        this.isGameRunning = false;

        // Clear all timers
        if (this.moveLoop) {
            clearInterval(this.moveLoop);
        }
        if (this.bombSpawnTimer) {
            clearTimeout(this.bombSpawnTimer);
        }

        // Show game over screen
        setTimeout(() => {
            document.getElementById('flowerGameScreen').style.display = 'none';
            document.getElementById('flowerGameOver').style.display = 'flex';
        }, 300);
    }

    destroy() {
        this.isGameRunning = false;

        if (this.moveLoop) {
            clearInterval(this.moveLoop);
        }
        if (this.bombSpawnTimer) {
            clearTimeout(this.bombSpawnTimer);
        }

        // Remove event listeners
        if (this.canvas) {
            this.canvas.replaceWith(this.canvas.cloneNode(true));
        }
    }
}
