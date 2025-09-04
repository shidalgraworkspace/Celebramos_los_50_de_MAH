let countdownTimeout;
let flashTimeout;

document.addEventListener('DOMContentLoaded', () => {
    // Limpiar cualquier temporizador pendiente al cargar la página
    if (window.countdownTimeout) clearTimeout(window.countdownTimeout);
    if (window.flashTimeout) clearTimeout(window.flashTimeout);

    /**
     * Gestiona los efectos de hiperespacio (salto de estrellas y destello).
     * @param {boolean} activarSalto - Si es true, inicia la animación de las estrellas.
     * @param {boolean} activarDestello - Si es true, activa el destello blanco.
     */
    function initiateHyperspace(activarSalto, activarDestello) {
        const hyperspaceContainer = document.getElementById('hyperspace');
        const deathStar = document.getElementById('death-star-anim');
        const flashOverlay = document.getElementById('flash-overlay');

        // --- LÓGICA PARA EL SALTO DE ESTRELLAS ---
        if (activarSalto) {
            // Oculta elementos de la intro que ya no se necesitan
            const elementsToHide = ['.crawl-container', '.lucrehulk', '.caza-tie', '.x-wing1', '.x-wing2', '.x-wing3'];
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });

            if (!hyperspaceContainer || !deathStar) return;

            const travelDuration = 2500; // 2.5 segundos

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

            // Limpia el contenedor después de la animación
            setTimeout(() => {
                hyperspaceContainer.style.display = 'none';
                hyperspaceContainer.innerHTML = '';
            }, travelDuration);
        }

        // --- LÓGICA PARA EL DESTELLO BLANCO ---
        if (activarDestello) {
            if (!flashOverlay) return;
            
            flashOverlay.classList.add('active');
            
            // La animación CSS dura 0.5s. Tras ese tiempo, quitamos la clase.
            setTimeout(() => {
                flashOverlay.classList.remove('active');
            }, 500);
        }
    }

    /**
     * Muestra los mensajes de cuenta regresiva en pantalla.
     */
    async function startCountdown() {
        const countdownContainer = document.getElementById('countdown-container');
        if (!countdownContainer) {
            initiateHyperspace(true, false); // Si no hay contenedor, salta directamente
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

        initiateHyperspace(true, false); // Inicia el salto al terminar la cuenta atrás
    }

    // --- CONTROL DE TIEMPO DESDE CSS ---
    // Lee las variables de tiempo desde el archivo CSS.
    const rootStyles = getComputedStyle(document.documentElement);

    function parseCssTime(timeString) {
        if (!timeString) return 0;
        if (timeString.endsWith('s')) {
            return parseFloat(timeString) * 1000;
        }
        if (timeString.endsWith('ms')) {
            return parseFloat(timeString);
        }
        return parseFloat(timeString) * 1000; // Asumir segundos si no hay unidad
    }

    const tiempoParaSalto = parseCssTime(rootStyles.getPropertyValue('--tiempo-salto').trim());
    const tiempoParaDestello = parseCssTime(rootStyles.getPropertyValue('--tiempo-destello').trim());

    // La cuenta atrás dura 5 segundos. La iniciamos 5 segundos ANTES del tiempo del salto.
    const tiempoInicioCuentaRegresiva = tiempoParaSalto - 5000;

    // Llama a la función para iniciar la cuenta regresiva.
    countdownTimeout = setTimeout(startCountdown, tiempoInicioCuentaRegresiva > 0 ? tiempoInicioCuentaRegresiva : 0);

    // Llama a la función para activar solo el destello en el tiempo definido.
    flashTimeout = setTimeout(() => {
        initiateHyperspace(false, true);
    }, tiempoParaDestello);
});

// Limpia los temporizadores si el usuario navega fuera de la página
window.addEventListener('beforeunload', () => {
    if (countdownTimeout) clearTimeout(countdownTimeout);
    if (flashTimeout) clearTimeout(flashTimeout);
});