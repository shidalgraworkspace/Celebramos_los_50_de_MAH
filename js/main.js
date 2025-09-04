document.addEventListener('DOMContentLoaded', () => {
    // Función para ocultar los elementos de la intro que ya no se necesitan
    function hideIntroElements() {
        const elementsToHide = [
            '.crawl-container',
            '.lucrehulk',
            '.caza-tie',
            '.x-wing1',
            '.x-wing2',
            '.x-wing3'
        ];
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // Función para iniciar el efecto de hiperespacio
    function initiateHyperspace() {
        hideIntroElements();

        const hyperspaceContainer = document.getElementById('hyperspace');
        const deathStar = document.getElementById('death-star-anim');
        const flashOverlay = document.getElementById('flash-overlay');
        
        if (!hyperspaceContainer || !deathStar || !flashOverlay) return;

        const travelDuration = 2500;  // 2.5 segundos de aceleración
        const arrivalDuration = 2000; // 2 segundos de desaceleración

        // 1. Fase de Aceleración
        hyperspaceContainer.style.display = 'block';
        deathStar.style.animation = `leave-death-star-behind ${travelDuration}ms ease-out forwards`;

        hyperspaceContainer.innerHTML = '';
        const starCount = 400;
        const stars = [];
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('hyperspace-star');
            const angle = Math.random() * 360;
            star.style.setProperty('--angle', `${angle}deg`);
            star.style.animation = `hyperspace-travel ${travelDuration}ms ease-out forwards`;
            star.style.animationDelay = `${Math.random() * 0.5}s`;
            hyperspaceContainer.appendChild(star);
            stars.push(star);
        }

        // 2. Destello y Fase de Desaceleración
        setTimeout(() => {
            flashOverlay.classList.add('active');
            stars.forEach(star => {
                star.style.animation = `hyperspace-arrival ${arrivalDuration}ms ease-in forwards`;
            });
            setTimeout(() => {
                hyperspaceContainer.style.display = 'none';
                hyperspaceContainer.innerHTML = '';
                flashOverlay.classList.remove('active');
            }, arrivalDuration);
        }, travelDuration);
    }

    // Función para manejar la cuenta atrás
    async function startCountdown() {
        const countdownContainer = document.getElementById('countdown-container');
        if (!countdownContainer) {
            initiateHyperspace();
            return;
        }

        const showMessage = (text, duration) => {
            return new Promise(resolve => {
                countdownContainer.innerText = text;
                countdownContainer.style.opacity = '1';
                setTimeout(() => {
                    countdownContainer.style.opacity = '0';
                    setTimeout(resolve, 300);
                }, duration - 300);
            });
        };

        await showMessage('Preparándose para saltar al hiperespacio', 2000);
        await showMessage('3', 1000);
        await showMessage('2', 1000);
        await showMessage('1', 1000);

        initiateHyperspace(); // Iniciar el salto justo al terminar la cuenta atrás
    }

    // Función que configura el temporizador principal
    function setupTimer() {
        const rootStyles = getComputedStyle(document.documentElement);
        const delayValue = rootStyles.getPropertyValue('--hyperspace-delay').trim();
        let hyperspaceDelay = parseFloat(delayValue);

        if (delayValue.endsWith('s')) {
            hyperspaceDelay *= 1000;
        }

        // La cuenta atrás dura 5 segundos, así que la iniciamos 5 segundos antes del salto.
        const countdownStartTime = hyperspaceDelay - 5000;
        
        setTimeout(startCountdown, countdownStartTime > 0 ? countdownStartTime : 0);
    }

    // Usamos window.onload para asegurarnos de que todo (incluido el CSS) esté cargado
    window.onload = setupTimer;
});