// Animation utilities
export class AnimationManager {
    static animateCard(element, animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 600);
    }

    static showFeedback(icon, color) {
        const overlay = document.getElementById('feedbackOverlay');
        if (!overlay) return;

        const iconEl = overlay.querySelector('.feedback-icon');

        iconEl.textContent = icon;
        iconEl.style.color = color;
        overlay.style.display = 'block';

        iconEl.style.animation = 'none';
        setTimeout(() => {
            iconEl.style.animation = 'feedbackPop 0.8s ease';
        }, 10);

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 800);
    }
}
