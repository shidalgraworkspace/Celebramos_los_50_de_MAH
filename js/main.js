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

    // Usamos window.onload para asegurarnos de que todo (incluido el CSS) esté cargado
    window.onload = () => {
        const rootStyles = getComputedStyle(document.documentElement);
        const delayValue = rootStyles.getPropertyValue('--hyperspace-delay').trim();
        let hyperspaceDelay = parseFloat(delayValue);

        // Convertir el valor de delay a milisegundos
        if (delayValue.endsWith('s')) {
            hyperspaceDelay *= 1000; // Si son segundos, multiplicar por 1000
        }
        
        setTimeout(initiateHyperspace, hyperspaceDelay);
    };
});