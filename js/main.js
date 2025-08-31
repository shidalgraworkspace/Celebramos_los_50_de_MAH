document.addEventListener('DOMContentLoaded', () => {
    // Función para ocultar todos los elementos de la intro que ya no se necesitan
    function hideIntroElements() {
        const elementsToHide = [
            '.lucrehulk-anim',
            '.lucrehulk-container',
            '.lucrehulk',
            '.intro-container',
            '.intro-text',
            '.crawl-container',
            '.crawl-text',
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
        // Ocultamos los elementos de la intro para que no interfieran
        hideIntroElements();

        const hyperspaceContainer = document.getElementById('hyperspace');
        const deathStar = document.getElementById('death-star-anim');
        
        if (!hyperspaceContainer || !deathStar) return;

        // Leemos la duración de la animación desde el CSS
        const rootStyles = getComputedStyle(document.documentElement);
        const durationValue = rootStyles.getPropertyValue('--hyperspace-duration').trim();
        let hyperspaceDuration = parseFloat(durationValue);
        if (durationValue.endsWith('s')) {
            hyperspaceDuration *= 1000; // Convertir segundos a milisegundos
        }

        // 1. Activar el contenedor del hiperespacio
        hyperspaceContainer.style.display = 'block';

        // 2. Aplicar la animación a la Estrella de la Muerte
        deathStar.style.animation = `leave-death-star-behind ${hyperspaceDuration}ms ease-out forwards`;

        // 3. Generar las estrellas del hiperespacio
        hyperspaceContainer.innerHTML = ''; // Limpiar estrellas anteriores
        const starCount = 400;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('hyperspace-star');

            const angle = Math.random() * 360;
            star.style.setProperty('--angle', `${angle}deg`);
            star.style.animationDelay = `${Math.random() * 0.5}s`;

            hyperspaceContainer.appendChild(star);
        }

        // Ocultar el efecto después de que termine para no interferir
        setTimeout(() => {
            hyperspaceContainer.style.display = 'none';
            hyperspaceContainer.innerHTML = '';
        }, hyperspaceDuration + 500); // Limpiamos un poco después de que termine la animación
    }

    // Nueva función para manejar la cuenta atrás
    async function startCountdown() {
        const countdownContainer = document.getElementById('countdown-container');
        if (!countdownContainer) {
            initiateHyperspace(); // Si no existe el contenedor, saltar directamente
            return;
        }

        // Función para mostrar un mensaje por una duración determinada
        const showMessage = (text, duration) => {
            return new Promise(resolve => {
                countdownContainer.innerText = text;
                countdownContainer.style.opacity = '1';
                setTimeout(() => {
                    countdownContainer.style.opacity = '0';
                    // Esperar a que termine la transición de fade-out antes de continuar
                    setTimeout(resolve, 300); 
                }, duration - 300);
            });
        };

        await showMessage('Preparándose para saltar al hiperespacio', 2000);
        await showMessage('3', 1000);
        await showMessage('2', 1000);
        await showMessage('1', 1000);

        initiateHyperspace();
    }

    // Usamos window.onload para asegurarnos de que todo esté cargado
    window.onload = () => {
        const rootStyles = getComputedStyle(document.documentElement);
        const delayValue = rootStyles.getPropertyValue('--hyperspace-delay').trim();
        let hyperspaceDelay = parseFloat(delayValue);

        if (delayValue.endsWith('s')) {
            hyperspaceDelay *= 1000;
        }

        // La cuenta atrás dura 5 segundos, así que la iniciamos 5 segundos antes del salto.
        const countdownStartTime = hyperspaceDelay - 5000;
        
        setTimeout(startCountdown, countdownStartTime > 0 ? countdownStartTime : 0);
    };
});