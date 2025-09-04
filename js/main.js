document.addEventListener('DOMContentLoaded', () => {
    // --- AÑADE ESTAS LÍNEAS AQUÍ ---
    const audioPlayer = document.getElementById('player');
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    // ---------------------------------

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
     * Reanuda las animaciones y activa los temporizadores para la secuencia final.
     */
    function resumeAnimations() {
        // Oculta el overlay
        playOverlay.classList.remove('visible');
        setTimeout(() => {
            playOverlay.style.display = 'none';
        }, 500);

        // Reanuda las animaciones CSS
        body.classList.remove('animations-paused');

        // Inicia la reproducción del audio
        const audioPlayer = document.getElementById('player'); // O usa la constante global
        if (audioPlayer) {
            audioPlayer.play();
        }

        // Inicia los temporizadores de la cuenta regresiva
        startCountdownTimers();
    }

    /**
     * Esta función contiene los temporizadores que antes se iniciaban al cargar la página.
     * Ahora solo se ejecutan después de pulsar "Play".
     */
    function startCountdownTimers() {
        const rootStyles = getComputedStyle(document.documentElement);

        function parseCssTime(timeString) {
            if (!timeString) return 0;
            if (timeString.endsWith('s')) return parseFloat(timeString) * 1000;
            if (timeString.endsWith('ms')) return parseFloat(timeString);
            return parseFloat(timeString) * 1000;
        }

        // Leemos los tiempos desde el CSS
        const tiempoParaSalto = parseCssTime(rootStyles.getPropertyValue('--tiempo-salto').trim());
        const tiempoParaDestello = parseCssTime(rootStyles.getPropertyValue('--tiempo-destello').trim());

        // Calculamos cuánto tiempo falta para la cuenta regresiva desde que se pulsó "Play".
        // Restamos los 2 segundos que ya pasaron antes de la pausa.
        const tiempoRestanteParaSalto = tiempoParaSalto - 2000;
        const tiempoInicioCuentaRegresiva = tiempoRestanteParaSalto - 5000;

        // Programamos la cuenta regresiva y el destello
        setTimeout(startCountdown, tiempoInicioCuentaRegresiva > 0 ? tiempoInicioCuentaRegresiva : 0);
        setTimeout(() => {
            initiateHyperspace(false, true);
        }, tiempoParaDestello - 2000); // También ajustamos el tiempo del destello
    }


    // --- INICIO DE LA EJECUCIÓN ---

    // 1. Pausa la animación a los 2 segundos para mostrar el botón.
    setTimeout(pauseAndShowButton, 3500);

    // 2. Asigna el evento de clic para reanudar todo.
    playOverlay.addEventListener('click', resumeAnimations, { once: true });


    // --- FUNCIONES ORIGINALES (sin cambios en su lógica interna) ---

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

            // Este es el bloque que vamos a corregir
            setTimeout(() => {
                hyperspaceContainer.style.display = 'none';
                hyperspaceContainer.innerHTML = '';

                // --- SECUENCIA DE ANIMACIÓN CORREGIDA Y SECUENCIAL ---
                const intermediateImageContainer = document.getElementById('intermediate-image-container');
                const sliderSection = document.getElementById('fotos-deslizantes');

                if (intermediateImageContainer && sliderSection) {

                    // --- PRIMERA PARTE: La imagen que crece (Duración: 4 segundos) ---

                    // 1. Muestra el contenedor de la imagen y activa su animación.
                    intermediateImageContainer.classList.add('visible');
                    intermediateImageContainer.classList.add('animate');

                    // --- SEGUNDA PARTE: La galería que aparece DESPUÉS ---

                    // 2. Espera 4 segundos, que es la duración COMPLETA de la animación de la imagen.
                    setTimeout(() => {
                        // 3. Oculta el contenedor de la imagen para que no moleste.
                        intermediateImageContainer.style.display = 'none';

                        // 4. Muestra la galería de fotos. Ahora sí aparecerá sin nada que la tape.
                        sliderSection.classList.add('visible');
                    }, 4000); // 4000ms = 4 segundos
                }
                // --- FIN DE LA SECUENCIA ---

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

    // Pausar la canción en caso de que esté reproduciendo
    const musicBtn = document.getElementById('play-music-btn');
    const music = document.getElementById('player');
    let isPlaying = false;

    if (musicBtn && music) {
        musicBtn.addEventListener('click', function () {
            if (isPlaying) {
                music.pause();
                musicBtn.innerHTML = '&#x1F507;'; // icono mute
            } else {
                music.play();
                musicBtn.innerHTML = '&#x1F50A;'; // icono sonido
            }
            isPlaying = !isPlaying;
        });
    }
});



