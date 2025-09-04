// Limpia cualquier temporizador pendiente de una recarga anterior.
if (window.countdownTimeout) clearTimeout(window.countdownTimeout);
if (window.flashTimeout) clearTimeout(window.flashTimeout);

let countdownTimeout;
let flashTimeout;

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Calcula el tiempo total de las animaciones de introducción para saber cuándo deben terminar.
     * @returns {number} El tiempo en milisegundos en el que finaliza la última animación.
     */
    function obtenerTiempoFinalAnimaciones() {
        const elementosAnimados = document.querySelectorAll('.caza-tie, .x-wing1, .x-wing2, .x-wing3');
        let maxAnimationTime = 0;

        elementosAnimados.forEach(element => {
            const styles = getComputedStyle(element);
            const animationDelay = parseFloat(styles.animationDelay) * 1000;
            const animationDuration = parseFloat(styles.animationDuration) * 1000;
            const totalTime = animationDelay + animationDuration;

            if (totalTime > maxAnimationTime) {
                maxAnimationTime = totalTime;
            }
        });

        // Si no se encontraron animaciones, devuelve un valor por defecto (ej. 65s)
        return maxAnimationTime > 0 ? maxAnimationTime : 65000;
    }

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

            setTimeout(() => {
                hyperspaceContainer.style.display = 'none';
                hyperspaceContainer.innerHTML = '';
            }, travelDuration);
        }

        // --- LÓGICA PARA EL DESTELLO BLANCO ---
        if (activarDestello) {
            if (!flashOverlay) return;
            
            flashOverlay.classList.add('active');
            
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

    // --- CONTROL DE TIEMPO DINÁMICO ---
    const tiempoParaSalto = obtenerTiempoFinalAnimaciones();
    const tiempoParaDestello = tiempoParaSalto + 800; // 0.8s después del salto

    // La cuenta atrás dura 5 segundos, así que la iniciamos 5 segundos ANTES del salto.
    const tiempoInicioCuentaRegresiva = tiempoParaSalto - 5000;

    // Llama a la función para iniciar la cuenta regresiva.
    window.countdownTimeout = setTimeout(startCountdown, tiempoInicioCuentaRegresiva > 0 ? tiempoInicioCuentaRegresiva : 0);

    // Llama a la función para activar solo el destello en el tiempo definido.
    window.flashTimeout = setTimeout(() => {
        initiateHyperspace(false, true);
    }, tiempoParaDestello);
});

// Limpia los temporizadores si el usuario navega fuera de la página
window.addEventListener('beforeunload', () => {
    if (window.countdownTimeout) clearTimeout(window.countdownTimeout);
    if (window.flashTimeout) clearTimeout(window.flashTimeout);
});