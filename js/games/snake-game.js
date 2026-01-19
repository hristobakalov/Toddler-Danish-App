import { snakeConfig } from '../data/snake-data.js';

export class SnakeGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;

        this.snake = [];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.food = null;
        this.score = 0;
        this.isGameRunning = false;
        this.gameLoop = null;
        this.speed = snakeConfig.initialSpeed;
        this.snakeColor = null;

        this.gridSize = snakeConfig.gridSize;
        this.cellSize = snakeConfig.cellSize;

        this.audioElement = null;
    }

    init() {
        this.setupCanvas();
        this.setupControls();
        this.showStartScreen();
    }

    setupCanvas() {
        const canvasWrapper = this.container.querySelector('.snake-canvas-wrapper');
        if (!canvasWrapper) return;

        this.canvas = document.getElementById('snakeCanvas');
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

            const key = e.key;
            const direction = snakeConfig.controls[key];

            if (direction) {
                e.preventDefault();
                this.changeDirection(direction);
            }
        });

        // Touch controls for mobile
        this.setupTouchControls();

        // Button controls
        const startBtn = document.getElementById('startSnakeBtn');
        const restartBtn = document.getElementById('restartSnakeBtn');

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
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    this.changeDirection(deltaX > 0 ? 'right' : 'left');
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    this.changeDirection(deltaY > 0 ? 'down' : 'up');
                }
            }
        }, { passive: false });
    }

    showStartScreen() {
        document.getElementById('snakeStartScreen').style.display = 'flex';
        document.getElementById('snakeGameScreen').style.display = 'none';
        document.getElementById('snakeGameOver').style.display = 'none';
    }

    startGame() {
        // Hide screens
        document.getElementById('snakeStartScreen').style.display = 'none';
        document.getElementById('snakeGameOver').style.display = 'none';
        document.getElementById('snakeGameScreen').style.display = 'flex';

        // Reset game state
        this.score = 0;
        this.speed = snakeConfig.initialSpeed;
        this.direction = 'right';
        this.nextDirection = 'right';

        // Choose random snake color
        this.snakeColor = snakeConfig.snakeColors[Math.floor(Math.random() * snakeConfig.snakeColors.length)];

        // Initialize snake in the center
        const center = Math.floor(this.gridSize / 2);
        this.snake = [
            { x: center, y: center },
            { x: center - 1, y: center },
            { x: center - 2, y: center }
        ];

        // Spawn initial food
        this.spawnFood();

        // Update score display
        this.updateScore();

        // Start game loop
        this.isGameRunning = true;
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    changeDirection(newDirection) {
        // Prevent reversing into itself
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }

    update() {
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            // Increase score
            this.score += this.food.points;
            this.updateScore();

            // Play food sound
            this.playSound();

            // Spawn new food
            this.spawnFood();

            // Increase speed slightly
            if (this.speed > snakeConfig.minSpeed) {
                clearInterval(this.gameLoop);
                this.speed = Math.max(snakeConfig.minSpeed, this.speed - snakeConfig.speedIncrement);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }

        // Draw game
        this.draw();
    }

    spawnFood() {
        // 10% chance of special reward
        const isSpecial = Math.random() < 0.1;
        const rewardPool = isSpecial ? snakeConfig.specialRewards : snakeConfig.rewards;
        const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];

        let position;
        do {
            position = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === position.x && segment.y === position.y));

        this.food = {
            ...position,
            ...reward
        };
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

        // Draw snake
        this.snake.forEach((segment, index) => {
            const isHead = index === 0;
            this.ctx.fillStyle = isHead ? this.snakeColor.head : this.snakeColor.body;
            this.ctx.fillRect(
                segment.x * this.cellSize + 1,
                segment.y * this.cellSize + 1,
                this.cellSize - 2,
                this.cellSize - 2
            );

            // Draw eyes on head
            if (isHead) {
                this.ctx.fillStyle = 'white';
                const eyeSize = 4;
                const eyeOffset = 6;

                if (this.direction === 'right') {
                    this.ctx.fillRect(segment.x * this.cellSize + this.cellSize - eyeOffset - eyeSize, segment.y * this.cellSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.cellSize + this.cellSize - eyeOffset - eyeSize, segment.y * this.cellSize + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.direction === 'left') {
                    this.ctx.fillRect(segment.x * this.cellSize + eyeOffset, segment.y * this.cellSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.cellSize + eyeOffset, segment.y * this.cellSize + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.direction === 'up') {
                    this.ctx.fillRect(segment.x * this.cellSize + eyeOffset, segment.y * this.cellSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.cellSize + this.cellSize - eyeOffset - eyeSize, segment.y * this.cellSize + eyeOffset, eyeSize, eyeSize);
                } else {
                    this.ctx.fillRect(segment.x * this.cellSize + eyeOffset, segment.y * this.cellSize + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.cellSize + this.cellSize - eyeOffset - eyeSize, segment.y * this.cellSize + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                }
            }
        });

        // Draw food
        if (this.food) {
            this.ctx.font = `${this.cellSize - 4}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                this.food.emoji,
                this.food.x * this.cellSize + this.cellSize / 2,
                this.food.y * this.cellSize + this.cellSize / 2
            );
        }
    }

    updateScore() {
        const scoreEl = document.getElementById('snakeScore');
        const finalScoreEl = document.getElementById('snakeFinalScore');

        if (scoreEl) {
            scoreEl.textContent = this.score;
        }
        if (finalScoreEl) {
            finalScoreEl.textContent = this.score;
        }
    }

    playSound() {
        // Play a simple success sound (you can add a proper sound file later)
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        // For now, use a beep sound or add proper audio file
        // this.audioElement = new Audio('records/snake-eat.mp3');
        // this.audioElement.play().catch(err => console.log('Audio play failed:', err));
    }

    gameOver() {
        this.isGameRunning = false;
        clearInterval(this.gameLoop);

        // Show game over screen
        setTimeout(() => {
            document.getElementById('snakeGameScreen').style.display = 'none';
            document.getElementById('snakeGameOver').style.display = 'flex';
        }, 300);
    }

    destroy() {
        this.isGameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        // Remove event listeners
        if (this.canvas) {
            this.canvas.replaceWith(this.canvas.cloneNode(true));
        }
    }
}
