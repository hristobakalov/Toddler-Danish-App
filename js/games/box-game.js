import { danishNumbers } from '../data/numbers-data.js';
import { danishColors } from '../data/colors-data.js';
import { danishAnimals } from '../data/animals-data.js';
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';

export class BoxGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.speechManager = new SpeechManager();
        this.currentCombination = null;
        this.isBoxOpen = false;
        this.giftBox = null;
        this.itemDisplay = null;
        this.openedCount = 0;

        // Store separate arrays for random selection
        this.numbers = danishNumbers.filter(num => num.number >= 1 && num.number <= 9);
        this.colors = danishColors;
        this.animals = danishAnimals;
    }

    createRandomCombination() {
        // Select one random item from each category
        const randomNumber = this.numbers[Math.floor(Math.random() * this.numbers.length)];
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const randomAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];

        return {
            number: randomNumber,
            color: randomColor,
            animal: randomAnimal,
            // Create full sentence: e.g., "Tre pink hunde"
            sentence: `${randomNumber.name} ${randomColor.name.toLowerCase()} ${randomAnimal.name.toLowerCase()}${randomNumber.number > 1 ? 'e' : ''}`
        };
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        // Create main game area
        const gameArea = document.createElement('div');
        gameArea.className = 'box-game-area';

        // Create gift box
        this.giftBox = this.createGiftBox();
        gameArea.appendChild(this.giftBox);

        // Create item display area (hidden initially)
        this.itemDisplay = this.createItemDisplay();
        gameArea.appendChild(this.itemDisplay);

        // Create "New Gift" button
        const newGiftBtn = document.createElement('button');
        newGiftBtn.className = 'new-gift-btn';
        newGiftBtn.innerHTML = '🎁 Ny gave!';
        newGiftBtn.style.display = 'none';
        newGiftBtn.addEventListener('click', () => this.resetBox());
        gameArea.appendChild(newGiftBtn);

        // Create counter
        const counter = document.createElement('div');
        counter.className = 'gift-counter';
        counter.textContent = `Gaver åbnet: ${this.openedCount}`;
        gameArea.appendChild(counter);

        this.container.appendChild(gameArea);
    }

    createGiftBox() {
        const boxContainer = document.createElement('div');
        boxContainer.className = 'gift-box-container';

        const box = document.createElement('div');
        box.className = 'gift-box';

        // Box body
        const boxBody = document.createElement('div');
        boxBody.className = 'box-body';

        // Box lid
        const boxLid = document.createElement('div');
        boxLid.className = 'box-lid';

        // Ribbon and bow
        const ribbon = document.createElement('div');
        ribbon.className = 'box-ribbon';

        const bow = document.createElement('div');
        bow.className = 'box-bow';
        bow.textContent = '🎀';

        boxLid.appendChild(ribbon);
        boxLid.appendChild(bow);

        // Instruction text
        const instruction = document.createElement('p');
        instruction.className = 'box-instruction';
        instruction.textContent = 'Tryk for at åbne!';

        box.appendChild(boxLid);
        box.appendChild(boxBody);
        boxContainer.appendChild(box);
        boxContainer.appendChild(instruction);

        // Click handler
        boxContainer.addEventListener('click', () => {
            if (!this.isBoxOpen) {
                this.openBox();
            }
        });

        return boxContainer;
    }

    createItemDisplay() {
        const display = document.createElement('div');
        display.className = 'revealed-item';
        display.style.display = 'none';

        return display;
    }

    openBox() {
        if (this.isBoxOpen) return;

        this.isBoxOpen = true;
        this.openedCount++;

        // Add open class to box
        const box = this.giftBox.querySelector('.gift-box');
        const lid = this.giftBox.querySelector('.box-lid');
        const instruction = this.giftBox.querySelector('.box-instruction');

        box.classList.add('opening');
        lid.classList.add('open');
        instruction.style.display = 'none';

        // Create random combination of number + color + animal
        this.currentCombination = this.createRandomCombination();

        // Wait for animation, then reveal item
        setTimeout(() => {
            this.revealItem();
        }, 800);
    }

    revealItem() {
        // Hide gift box
        this.giftBox.style.display = 'none';

        // Show item display
        this.itemDisplay.style.display = 'flex';
        this.itemDisplay.innerHTML = '';
        this.itemDisplay.className = 'revealed-item item-combination';

        // Create combined display
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';

        // Number display
        const numberSection = document.createElement('div');
        numberSection.className = 'combination-section number-section';
        numberSection.innerHTML = `
            <div class="section-label">Antal:</div>
            <div class="item-emoji">${this.currentCombination.number.emoji}</div>
            <div class="item-name">${this.currentCombination.number.name}</div>
        `;
        numberSection.addEventListener('click', () => {
            AnimationManager.animateCard(numberSection, 'shake');
            this.speechManager.speak(this.currentCombination.number.name);
        });

        // Color display
        const colorSection = document.createElement('div');
        colorSection.className = 'combination-section color-section';
        const colorCircle = document.createElement('div');
        colorCircle.className = 'color-circle-small';
        colorCircle.style.backgroundColor = this.currentCombination.color.color;
        colorSection.innerHTML = `
            <div class="section-label">Farve:</div>
        `;
        colorSection.appendChild(colorCircle);
        colorSection.innerHTML += `
            <div class="item-name-small">${this.currentCombination.color.name}</div>
        `;
        colorSection.addEventListener('click', () => {
            AnimationManager.animateCard(colorSection, 'shake');
            this.speechManager.speak(this.currentCombination.color.name);
        });

        // Animal display
        const animalSection = document.createElement('div');
        animalSection.className = 'combination-section animal-section';
        const pluralAnimal = this.currentCombination.number.number > 1
            ? this.currentCombination.animal.name + 'e'
            : this.currentCombination.animal.name;
        animalSection.innerHTML = `
            <div class="section-label">Dyr:</div>
            <div class="item-emoji">${this.currentCombination.animal.emoji}</div>
            <div class="item-name">${pluralAnimal}</div>
        `;
        animalSection.addEventListener('click', () => {
            AnimationManager.animateCard(animalSection, 'shake');
            this.speechManager.speak(pluralAnimal);
        });

        itemContent.appendChild(numberSection);
        itemContent.appendChild(colorSection);
        itemContent.appendChild(animalSection);

        // Full sentence at bottom with sound emoji
        const sentenceContainer = document.createElement('div');
        sentenceContainer.className = 'sentence-container';

        const fullSentence = document.createElement('div');
        fullSentence.className = 'full-sentence';
        fullSentence.textContent = this.currentCombination.sentence;

        const soundEmoji = document.createElement('span');
        soundEmoji.className = 'sentence-sound-emoji';
        soundEmoji.textContent = '🔊';

        sentenceContainer.appendChild(fullSentence);
        sentenceContainer.appendChild(soundEmoji);

        sentenceContainer.addEventListener('click', () => {
            AnimationManager.animateCard(sentenceContainer, 'shake');
            this.speechManager.speak(this.currentCombination.sentence);
        });

        this.itemDisplay.appendChild(itemContent);
        this.itemDisplay.appendChild(sentenceContainer);

        // Show "New Gift" button
        const newGiftBtn = this.container.querySelector('.new-gift-btn');
        newGiftBtn.style.display = 'block';

        // Update counter
        const counter = this.container.querySelector('.gift-counter');
        counter.textContent = `Gaver åbnet: ${this.openedCount}`;
    }

    resetBox() {
        this.isBoxOpen = false;
        this.currentCombination = null;

        // Hide item display
        this.itemDisplay.style.display = 'none';

        // Show gift box
        this.giftBox.style.display = 'block';

        // Reset box classes
        const box = this.giftBox.querySelector('.gift-box');
        const lid = this.giftBox.querySelector('.box-lid');
        const instruction = this.giftBox.querySelector('.box-instruction');

        box.classList.remove('opening');
        lid.classList.remove('open');
        instruction.style.display = 'block';

        // Hide "New Gift" button
        const newGiftBtn = this.container.querySelector('.new-gift-btn');
        newGiftBtn.style.display = 'none';
    }

    destroy() {
        this.container.innerHTML = '';
        window.speechSynthesis.cancel();
    }
}
