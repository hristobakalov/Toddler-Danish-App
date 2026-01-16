import { levels, carColors } from '../data/parking-data.js';

export class ParkingGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentLevel = 0;
        this.currentCarIndex = 0;
        this.cars = [];
        this.grid = [];
        this.parkedCars = new Set();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.keyboardListener = null;
    }

    init() {
        this.showLevelSelector();
    }

    showLevelSelector() {
        this.container.innerHTML = `
            <div class="parking-level-selector">
                <h2 class="parking-title">Vælg Niveau</h2>
                <div class="parking-level-buttons">
                    ${levels.map((level, index) => `
                        <button class="parking-level-btn" data-level="${index}">
                            <span class="level-icon">🚗</span>
                            <span class="level-name">Niveau ${level.level}</span>
                            <span class="level-detail">${level.cars} biler</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const levelButtons = this.container.querySelectorAll('.parking-level-btn');
        levelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentLevel = parseInt(btn.dataset.level);
                this.startLevel();
            });
        });
    }

    startLevel() {
        const level = levels[this.currentLevel];
        this.parkedCars = new Set();

        this.container.innerHTML = `
            <div class="parking-game-wrapper">
                <div class="parking-header">
                    <button class="parking-back-btn" id="parkingBackBtn">
                        ← Niveauer
                    </button>
                    <h3 class="parking-level-title">Niveau ${level.level} - ${level.name}</h3>
                    <button class="parking-reset-btn" id="parkingResetBtn">
                        🔄 Nulstil
                    </button>
                </div>

                <div class="parking-info">
                    <div class="parking-current-car">
                        <span class="car-indicator">Bil <span id="currentCarNum">1</span>/${level.cars}</span>
                        <span class="car-color-name" id="carColorName">Grøn</span>
                    </div>
                    <div class="parking-progress">
                        Parkeret: <span id="parkedCount">0</span>/${level.cars}
                    </div>
                </div>

                <div class="parking-grid-container" id="parkingGridContainer">
                    <div class="parking-grid" id="parkingGrid"></div>
                </div>

                <div class="parking-instructions">
                    <div class="desktop-instructions">💻 Brug piletaster for at flytte bilen</div>
                    <div class="mobile-instructions">📱 Swipe for at flytte bilen</div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.createGrid(level);
        this.placeParkingSpots(level);
        this.placeCars(level);
    }

    setupEventListeners() {
        document.getElementById('parkingBackBtn').addEventListener('click', () => {
            this.removeKeyboardListener();
            this.showLevelSelector();
        });

        document.getElementById('parkingResetBtn').addEventListener('click', () => {
            this.removeKeyboardListener();
            this.startLevel();
        });

        // Keyboard controls for desktop
        this.keyboardListener = (e) => {
            if (this.getCurrentCar()?.isParked) return;

            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveCar('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveCar('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveCar('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveCar('right');
                    break;
            }
        };
        document.addEventListener('keydown', this.keyboardListener);

        // Touch controls for mobile
        const gridContainer = document.getElementById('parkingGridContainer');

        gridContainer.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent page scrolling
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: false });

        gridContainer.addEventListener('touchend', (e) => {
            e.preventDefault(); // Prevent page scrolling
            if (this.getCurrentCar()?.isParked) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;

            const minSwipeDistance = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.moveCar('right');
                    } else {
                        this.moveCar('left');
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        this.moveCar('down');
                    } else {
                        this.moveCar('up');
                    }
                }
            }
        }, { passive: false });
    }

    removeKeyboardListener() {
        if (this.keyboardListener) {
            document.removeEventListener('keydown', this.keyboardListener);
            this.keyboardListener = null;
        }
    }

    createGrid(level) {
        const gridElement = document.getElementById('parkingGrid');
        gridElement.style.gridTemplateColumns = `repeat(${level.gridSize.cols}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${level.gridSize.rows}, 1fr)`;

        this.grid = [];
        for (let row = 0; row < level.gridSize.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < level.gridSize.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'parking-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gridElement.appendChild(cell);
                this.grid[row][col] = { element: cell, occupied: false, parkingSpot: null };
            }
        }
    }

    placeParkingSpots(level) {
        level.parkingSpots.forEach(spot => {
            const cell = this.grid[spot.row][spot.col];
            cell.element.classList.add('parking-spot', `parking-spot-${spot.color}`);
            cell.parkingSpot = spot.color;
        });
    }

    placeCars(level) {
        this.cars = [];
        this.currentCarIndex = 0;

        level.startPositions.forEach((pos, index) => {
            const car = {
                id: index,
                color: pos.color,
                row: pos.row,
                col: pos.col,
                rotation: pos.rotation,
                element: null,
                isParked: false
            };

            const carElement = document.createElement('div');
            carElement.className = 'parking-car';
            carElement.dataset.carId = index;
            carElement.style.backgroundImage = `url(${carColors.find(c => c.name === pos.color).image})`;
            carElement.style.transform = `rotate(${pos.rotation}deg)`;

            const cell = this.grid[pos.row][pos.col];
            cell.element.appendChild(carElement);
            cell.occupied = true;

            car.element = carElement;
            this.cars.push(car);

            // Only show first car initially
            if (index !== 0) {
                carElement.style.display = 'none';
            }
        });

        this.updateCurrentCarDisplay();
    }

    getCurrentCar() {
        return this.cars[this.currentCarIndex];
    }

    updateCurrentCarDisplay() {
        const currentCar = this.getCurrentCar();
        if (!currentCar) return;

        // Update car indicator
        document.getElementById('currentCarNum').textContent = this.currentCarIndex + 1;

        // Update color name
        const colorNames = {
            'green': 'Grøn',
            'yellow': 'Gul',
            'red': 'Rød',
            'blue': 'Blå'
        };
        document.getElementById('carColorName').textContent = colorNames[currentCar.color] || currentCar.color;

        // Show current car, hide others
        this.cars.forEach((car, index) => {
            if (car.isParked) {
                car.element.style.display = 'block';
                car.element.classList.add('parked');
            } else if (index === this.currentCarIndex) {
                car.element.style.display = 'block';
                car.element.classList.add('active-car');
            } else {
                car.element.style.display = 'none';
                car.element.classList.remove('active-car');
            }
        });
    }

    switchToNextUnparkedCar() {
        // Find next unparked car
        for (let i = 0; i < this.cars.length; i++) {
            const nextIndex = (this.currentCarIndex + i + 1) % this.cars.length;
            if (!this.cars[nextIndex].isParked) {
                this.currentCarIndex = nextIndex;
                this.updateCurrentCarDisplay();
                return;
            }
        }
    }

    moveCar(direction) {
        const car = this.getCurrentCar();
        if (!car || car.isParked) return;

        let newRow = car.row;
        let newCol = car.col;
        let newRotation = car.rotation;

        // Update position and rotation based on direction
        if (direction === 'up') {
            newRow--;
            newRotation = 0;
        } else if (direction === 'down') {
            newRow++;
            newRotation = 180;
        } else if (direction === 'left') {
            newCol--;
            newRotation = 270;
        } else if (direction === 'right') {
            newCol++;
            newRotation = 90;
        }

        // Check if move is valid
        const level = levels[this.currentLevel];
        if (newRow < 0 || newRow >= level.gridSize.rows ||
            newCol < 0 || newCol >= level.gridSize.cols) {
            return; // Out of bounds
        }

        if (this.grid[newRow][newCol].occupied) {
            return; // Cell occupied by another car
        }

        // Move the car
        const oldCell = this.grid[car.row][car.col];
        const newCell = this.grid[newRow][newCol];

        oldCell.occupied = false;
        oldCell.element.removeChild(car.element);

        newCell.occupied = true;
        newCell.element.appendChild(car.element);

        car.row = newRow;
        car.col = newCol;
        car.rotation = newRotation;
        car.element.style.transform = `rotate(${newRotation}deg)`;

        // Check if parked correctly
        this.checkParking(car);
    }

    checkParking(car) {
        const cell = this.grid[car.row][car.col];

        if (cell.parkingSpot === car.color && !car.isParked) {
            // Successfully parked!
            car.isParked = true;
            car.element.classList.remove('active-car');
            this.parkedCars.add(car.id);

            // Update progress
            document.getElementById('parkedCount').textContent = this.parkedCars.size;

            // Play success sound
            const audio = new Audio('/records/rigtigt.mp3');
            audio.play().catch(err => console.log('Audio play failed:', err));

            // Check if level complete
            const level = levels[this.currentLevel];
            if (this.parkedCars.size === level.cars) {
                setTimeout(() => this.levelComplete(), 500);
            } else {
                // Switch to next unparked car
                setTimeout(() => this.switchToNextUnparkedCar(), 300);
            }
        } else if (cell.parkingSpot && cell.parkingSpot !== car.color) {
            // Wrong parking spot - visual feedback
            car.element.classList.add('wrong-spot');
            setTimeout(() => car.element.classList.remove('wrong-spot'), 500);
        }
    }

    levelComplete() {
        const audio = new Audio('/records/goodjob.mp3');
        audio.play().catch(err => console.log('Audio play failed:', err));

        const overlay = document.createElement('div');
        overlay.className = 'parking-complete-overlay';
        overlay.innerHTML = `
            <div class="parking-complete-content">
                <div class="complete-icon">🎉</div>
                <h2>Godt klaret!</h2>
                <p>Du parkerede alle bilerne!</p>
                <div class="complete-buttons">
                    ${this.currentLevel < levels.length - 1 ?
                        '<button class="parking-next-btn" id="nextLevelBtn">Næste Niveau →</button>' :
                        ''
                    }
                    <button class="parking-retry-btn" id="retryLevelBtn">Prøv Igen</button>
                    <button class="parking-menu-btn" id="menuBtn">Niveauer</button>
                </div>
            </div>
        `;

        this.container.appendChild(overlay);

        document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
            this.currentLevel++;
            this.startLevel();
        });

        document.getElementById('retryLevelBtn')?.addEventListener('click', () => {
            this.startLevel();
        });

        document.getElementById('menuBtn')?.addEventListener('click', () => {
            this.showLevelSelector();
        });
    }

    cleanup() {
        this.removeKeyboardListener();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
