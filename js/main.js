document.addEventListener('DOMContentLoaded', () => {
    const playOverlay = document.getElementById('play-overlay');
    const body = document.body;
    const countdownContainer = document.getElementById('countdown-container');

    // --- LÓGICA DEL BOTÓN DE PLAY ---

    /**
     * Pausa las animaciones y muestra el botón de "Play".
     */
    function pauseAndShowButton() {
        body.classList.add('animations-paused');
        playOverlay.style.display = 'flex';
        void playOverlay.offsetWidth; // Forza reflow para la transición
        playOverlay.classList.add('visible');
    }

    /**
     * Reanuda las animaciones y la secuencia normal de la página.
     */
    function resumeAnimations() {
        playOverlay.classList.remove('visible');
        setTimeout(() => {
            playOverlay.style.display = 'none';
        }, 500); // Espera a que termine la transición de opacidad

        body.classList.remove('animations-paused');
    }

    // --- INICIO DE LA EJECUCIÓN ---

    // 1. Pausa la animación a los 2 segundos para mostrar el botón.
    // Este es el momento justo después de que aparece "Hace mucho tiempo..."
    // y antes de que aparezca el logo.
    setTimeout(pauseAndShowButton, 3500); // 2000ms = 2 segundos

    // 2. Asigna el evento de clic para reanudar todo.
    playOverlay.addEventListener('click', resumeAnimations, { once: true });


    // --- LÓGICA ORIGINAL DE LA CUENTA REGRESIVA (se mantiene igual) ---

    const rootStyles = getComputedStyle(document.documentElement);

    function parseCssTime(timeString) {
        if (!timeString) return 0;
        if (timeString.endsWith('s')) return parseFloat(timeString) * 1000;
        if (timeString.endsWith('ms')) return parseFloat(timeString);
        return parseFloat(timeString) * 1000;
    }

    const tiempoParaSalto = parseCssTime(rootStyles.getPropertyValue('--tiempo-salto').trim());
    const tiempoParaDestello = parseCssTime(rootStyles.getPropertyValue('--tiempo-destello').trim());
    const tiempoInicioCuentaRegresiva = tiempoParaSalto - 5000;

    setTimeout(startCountdown, tiempoInicioCuentaRegresiva > 0 ? tiempoInicioCuentaRegresiva : 0);
    setTimeout(() => {
        initiateHyperspace(false, true);
    }, tiempoParaDestello);


    // --- FUNCIONES ORIGINALES (se mantienen igual) ---

    async function startCountdown() {
        if (!countdownContainer) {
            initiateHyperspace(true, false);
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
        initiateHyperspace(true, false);
    }

    function initiateHyperspace(activarSalto, activarDestello) {
        const hyperspaceContainer = document.getElementById('hyperspace');
        const deathStar = document.getElementById('death-star-anim');
        const flashOverlay = document.getElementById('flash-overlay');

        if (activarSalto) {
            const elementsToHide = ['.crawl-container', '.lucrehulk', '.caza-tie', '.x-wing1', '.x-wing2', '.x-wing3'];
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            if (!hyperspaceContainer || !deathStar) return;
            const travelDuration = 2500;
            hyperspaceContainer.style.display = 'block';
            deathStar.style.animation = `leave-death-star-behind ${travelDuration}ms ease-out forwards`;
            hyperspaceContainer.innerHTML = '';
            const starCount = 400;
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('hyperspace-star');
                const angle = Math.random() * 360;
                star.style.setProperty('--angle', `${angle}deg`);
                star.style.animation = `hyperspace-travel ${travelDuration}ms ease-out forwards`;
                star.style.animationDelay = `${Math.random() * 0.5}s`;
                hyperspaceContainer.appendChild(star);
            }
            setTimeout(() => {
                hyperspaceContainer.style.display = 'none';
                hyperspaceContainer.innerHTML = '';
            }, travelDuration);
        }

        if (activarDestello) {
            if (!flashOverlay) return;
            flashOverlay.classList.add('active');
            setTimeout(() => {
                flashOverlay.classList.remove('active');
            }, 500);
        }
    }
});



