document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        alert('No está permitido en esta página.');
    });

    document.addEventListener('keydown', function (e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            alert('No está permitido en esta página.');
        }
    });


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
    let starCountdown = false;
    async function startCountdown() {
        // Solo ejecuta la función si aún no se ha hecho
        if (starCountdown) return;
        starCountdown = true;

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
        initiateHyperspace(true, true);
    }

    let hyperspaceDone = false;
    function initiateHyperspace(activarSalto, activarDestello) {
        if (hyperspaceDone) return;
        hyperspaceDone = true;

        const hyperspaceContainer = document.getElementById('hyperspace');
        const deathStar = document.getElementById('death-star-anim');
        const flashOverlay = document.getElementById('flash-overlay');

        if (activarSalto) {
            const elementsToHide = ['.crawl-container', '.lucrehulk', '.caza-tie', '.x-wing1', '.x-wing2', '.x-wing3', '.main-logo'];
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            if (!hyperspaceContainer || !deathStar) return;
            const travelDuration = 2500; // duración estrellas
            hyperspaceContainer.style.display = 'block';
            deathStar.style.animation = `leave-death-star-behind ${travelDuration}ms ease-out forwards`;
            hyperspaceContainer.innerHTML = '';

            const starCount = 600;
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('hyperspace-star');
                const angle = Math.random() * 360;
                star.style.setProperty('--angle', `${angle}deg`);
                star.style.animation = `hyperspace-travel ${travelDuration}ms ease-out forwards`;
                star.style.animationDelay = `${Math.random() * 0.5}s`;
                hyperspaceContainer.appendChild(star);
            }

            // Destello ANTES de que acaben las estrellas (0.8s antes)
            setTimeout(() => {
                if (flashOverlay) {
                    flashOverlay.classList.add('active');
                    setTimeout(() => {
                        flashOverlay.classList.remove('active');
                    }, 500);
                }
            }, travelDuration - 1500);

            // Secuencia normal al terminar estrellas
            setTimeout(() => {
                hyperspaceContainer.style.display = 'none';
                hyperspaceContainer.innerHTML = '';

                // Secuencia intermedia (imagen + slider)
                const intermediateImageContainer = document.getElementById('intermediate-image-container');
                const sliderSection = document.getElementById('fotos-deslizantes');

                if (intermediateImageContainer && sliderSection) {
                    intermediateImageContainer.classList.add('visible', 'animate');
                    setTimeout(() => {
                        intermediateImageContainer.style.display = 'none';
                        sliderSection.classList.add('visible');
                    }, 4000);
                }
            }, travelDuration);
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


    // // Funcion de temporizador------------------------------------------------------------------
    function showDigitalTimer() {
        const daysDiv = document.getElementById('digital-timer-days');
        const hmsSpan = document.getElementById('digital-timer-hms');
        if (!daysDiv || !hmsSpan) return;

        // Fecha del evento: 10 de octubre, 16:30 (4:30pm)
        const eventDate = new Date('2025-10-11T19:00:00-06:00'); // Ajusta zona horaria si es necesario

        function updateDigitalTimer() {
            const now = new Date();
            const diff = eventDate - now;
            if (diff <= 0) {
                daysDiv.textContent = "¡Evento!";
                hmsSpan.textContent = "00:00:00";
                return;
            }
            const totalSeconds = Math.max(0, Math.floor(diff / 1000));
            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
            const minutes = Math.floor((totalSeconds / 60) % 60);
            const seconds = totalSeconds % 60;

            daysDiv.textContent = `DÍAS: ${days}`;
            hmsSpan.textContent =
                `${String(hours).padStart(2, '0')}:` +
                `${String(minutes).padStart(2, '0')}:` +
                `${String(seconds).padStart(2, '0')}`;
        }

        updateDigitalTimer();
        setInterval(updateDigitalTimer, 1000);
    }

    // Cuando el slider se muestre, espera 5 segundos y muestra el digital timer
    const sliderSection = document.getElementById('fotos-deslizantes');
    const digitalDiv = document.getElementById('event-timer-digital');

    if (sliderSection && digitalDiv) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (sliderSection.classList.contains('visible')) {
                    setTimeout(function () {
                        digitalDiv.classList.add('digital-timer-visible');
                        showDigitalTimer();
                        document.querySelector('.slider-buttons-container')//.style.display = 'flex';
                    }, 5000);
                    observer.disconnect();
                }
            });
        });
        observer.observe(sliderSection, { attributes: true, attributeFilter: ['class'] });
    }

    const planetEarth = document.getElementById('planet-earth');

    if (sliderSection && planetEarth) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (sliderSection.classList.contains('visible')) {
                    setTimeout(function () {
                        planetEarth.classList.add('planet-earth-visible');
                    }, 5000); // 5 segundos
                    observer.disconnect();
                }
            });
        });
        observer.observe(sliderSection, { attributes: true, attributeFilter: ['class'] });
    }

    // Mostrar flecha y botón tras animación del planeta
    const arrowContainer = document.getElementById('arrow-location-container');
    const btnUbicacion = document.getElementById('btn-ver-ubicacion');
    const btnArrow = document.getElementById('arrow-location');
    const btnConfirmar = document.getElementById('btn-confirmar-whatsapp');
    const btnInfoGeneral = document.getElementById('btn-info-general');
    const btnCarinito = document.getElementById('btn-carinito');

    // Detecta el final de la animación earth-slide-in
    if (planetEarth) {
        planetEarth.addEventListener('animationend', function (e) {
            if (e.animationName === 'earth-slide-in') {
                arrowContainer.style.display = 'block';
                btnUbicacion.style.display = '';

                setTimeout(() => {
                    document.querySelector('.ver-ubicacion-container');
                }, 100);
                setTimeout(() => {
                    document.querySelector('.confirmar-llegada-container');
                }, 100);
                setTimeout(() => {
                    btnUbicacion.classList.add('btn-animate-down');
                }, 100);
                setTimeout(() => {
                    btnConfirmar.classList.add('btn-animate-up');
                }, 100);
                setTimeout(() => {
                    btnInfoGeneral.classList.add('btn-animate-left');
                }, 100);
                setTimeout(() => {
                    btnCarinito.classList.add('btn-animate-right');
                }, 100);
            }
        });
    }

    //Animación de salto al hiperespacio y redirección
    if (btnUbicacion) {
        btnUbicacion.addEventListener('click', function () {
            // Oculta los elementos usando display
            sliderSection.style.display = 'none';
            btnCarinito.style.display = 'none';
            btnInfoGeneral.style.display = 'none';
            btnUbicacion.style.display = 'none';
            btnConfirmar.style.display = 'none';

            // 1. Conteo regresivo
            let countdownDiv = document.createElement('div');
            countdownDiv.style.position = 'fixed';
            countdownDiv.style.top = '50%';
            countdownDiv.style.left = '50%';
            countdownDiv.style.transform = 'translate(-50%, -50%)';
            countdownDiv.style.fontSize = '5em';
            countdownDiv.style.color = '#49daff';
            countdownDiv.style.zIndex = '9999';
            countdownDiv.style.fontFamily = "'Titillium Web', sans-serif";
            countdownDiv.style.textShadow = '0 0 40px #fff, 0 0 80px #ffc909';
            countdownDiv.style.fontWeight = 'bold';
            countdownDiv.style.letterSpacing = '0.1em';
            document.body.appendChild(countdownDiv);


            let count = 3;
            countdownDiv.textContent = count;
            let interval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownDiv.textContent = count;
                } else {
                    clearInterval(interval);
                    countdownDiv.textContent = "¡Salto!";
                    setTimeout(() => {
                        document.body.removeChild(countdownDiv);

                        // 2. Hiperespacio: estrellas estiradas radialmente desde el centro (duración aumentada)
                        let hyperspaceDiv = document.createElement('div');
                        hyperspaceDiv.style.position = 'fixed';
                        hyperspaceDiv.style.top = '0';
                        hyperspaceDiv.style.left = '0';
                        hyperspaceDiv.style.width = '100vw';
                        hyperspaceDiv.style.height = '100vh';
                        hyperspaceDiv.style.zIndex = '9998';
                        hyperspaceDiv.style.overflow = 'hidden';
                        hyperspaceDiv.style.background = 'transparent';
                        document.body.appendChild(hyperspaceDiv);

                        const centerX = window.innerWidth / 2;
                        const centerY = window.innerHeight / 2;
                        const starCount = 600;
                        for (let i = 0; i < starCount; i++) {
                            let star = document.createElement('div');
                            let size = Math.random() * 2 + 1;
                            let angle = Math.random() * 2 * Math.PI;
                            let distance = Math.random() * (window.innerWidth / 2);
                            let x = centerX + Math.cos(angle) * distance;
                            let y = centerY + Math.sin(angle) * distance;
                            star.style.position = 'absolute';
                            star.style.width = size + 'px';
                            star.style.height = size + 'px';
                            star.style.background = '#fff';
                            star.style.borderRadius = '50%';
                            star.style.left = centerX + 'px';
                            star.style.top = centerY + 'px';
                            star.style.opacity = Math.random() * 0.7 + 0.3;
                            star.style.boxShadow = '0 0 8px #fff';
                            // Animación radial: estira la estrella desde el centro hacia afuera
                            star.animate([
                                { transform: 'scaleY(1)', left: centerX + 'px', top: centerY + 'px', opacity: star.style.opacity },
                                { transform: 'scaleY(18)', left: x + 'px', top: y + 'px', opacity: 0 }
                            ], {
                                duration: 1800, // Duración aumentada para el efecto de velocidad
                                easing: 'cubic-bezier(.77,0,.18,1)'
                            });
                            hyperspaceDiv.appendChild(star);
                        }

                        // 3. Espera 1.5s antes de mostrar el destello (estrellas acelerando)
                        setTimeout(() => {
                            let flash = document.createElement('div');
                            flash.style.position = 'fixed';
                            flash.style.top = '0';
                            flash.style.left = '0';
                            flash.style.width = '100vw';
                            flash.style.height = '100vh';
                            flash.style.background = 'white';
                            flash.style.opacity = '0';
                            flash.style.zIndex = '9999';
                            flash.style.transition = 'opacity 0.3s';
                            document.body.appendChild(flash);
                            setTimeout(() => { flash.style.opacity = '1'; }, 300);

                            // Destello dura 1 segundo, redirige de inmediato
                            setTimeout(() => {
                                window.open('https://maps.app.goo.gl/2mCgSHZahjnBiMir7', '_blank');
                            }, 100); // Redirección casi instantánea tras el destello

                            // Quita el destello y las estrellas después de 1 segundo
                            setTimeout(() => {
                                flash.style.opacity = '0';
                                setTimeout(() => {
                                    document.body.removeChild(flash);
                                    document.body.removeChild(hyperspaceDiv);
                                    // Muestra los elementos nuevamente
                                    sliderSection.style.display = '';
                                    btnCarinito.style.display = '';
                                    btnInfoGeneral.style.display = '';
                                    btnUbicacion.style.display = '';
                                    btnConfirmar.style.display = '';
                                }, 400);
                            }, 1000); // destello visible 1s
                        }, 1000); // Espera 1s para que se vean las estrellas acelerando
                    }, 700);
                }
            }, 700);
            // ...ya no se usa opacity para mostrar
        });
    }

    //Animación de salto al hiperespacio y redirección
    if (btnArrow) {
        btnArrow.addEventListener('click', function () {
            // Oculta los elementos usando display
            sliderSection.style.display = 'none';
            btnCarinito.style.display = 'none';
            btnInfoGeneral.style.display = 'none';
            btnUbicacion.style.display = 'none';
            btnConfirmar.style.display = 'none';

            // 1. Conteo regresivo
            let countdownDiv = document.createElement('div');
            countdownDiv.style.position = 'fixed';
            countdownDiv.style.top = '50%';
            countdownDiv.style.left = '50%';
            countdownDiv.style.transform = 'translate(-50%, -50%)';
            countdownDiv.style.fontSize = '5em';
            countdownDiv.style.color = '#49daff';
            countdownDiv.style.zIndex = '9999';
            countdownDiv.style.fontFamily = "'Titillium Web', sans-serif";
            countdownDiv.style.textShadow = '0 0 40px #fff, 0 0 80px #ffc909';
            countdownDiv.style.fontWeight = 'bold';
            countdownDiv.style.letterSpacing = '0.1em';
            document.body.appendChild(countdownDiv);

            let count = 3;
            countdownDiv.textContent = count;
            let interval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownDiv.textContent = count;
                } else {
                    clearInterval(interval);
                    countdownDiv.textContent = "¡Salto!";
                    setTimeout(() => {
                        document.body.removeChild(countdownDiv);

                        // 2. Hiperespacio: estrellas estiradas radialmente desde el centro (duración aumentada)
                        let hyperspaceDiv = document.createElement('div');
                        hyperspaceDiv.style.position = 'fixed';
                        hyperspaceDiv.style.top = '0';
                        hyperspaceDiv.style.left = '0';
                        hyperspaceDiv.style.width = '100vw';
                        hyperspaceDiv.style.height = '100vh';
                        hyperspaceDiv.style.zIndex = '9998';
                        hyperspaceDiv.style.overflow = 'hidden';
                        hyperspaceDiv.style.background = 'transparent';
                        document.body.appendChild(hyperspaceDiv);

                        const centerX = window.innerWidth / 2;
                        const centerY = window.innerHeight / 2;
                        const starCount = 600;
                        for (let i = 0; i < starCount; i++) {
                            let star = document.createElement('div');
                            let size = Math.random() * 2 + 1;
                            let angle = Math.random() * 2 * Math.PI;
                            let distance = Math.random() * (window.innerWidth / 2);
                            let x = centerX + Math.cos(angle) * distance;
                            let y = centerY + Math.sin(angle) * distance;
                            star.style.position = 'absolute';
                            star.style.width = size + 'px';
                            star.style.height = size + 'px';
                            star.style.background = '#fff';
                            star.style.borderRadius = '50%';
                            star.style.left = centerX + 'px';
                            star.style.top = centerY + 'px';
                            star.style.opacity = Math.random() * 0.7 + 0.3;
                            star.style.boxShadow = '0 0 8px #fff';
                            // Animación radial: estira la estrella desde el centro hacia afuera
                            star.animate([
                                { transform: 'scaleY(1)', left: centerX + 'px', top: centerY + 'px', opacity: star.style.opacity },
                                { transform: 'scaleY(18)', left: x + 'px', top: y + 'px', opacity: 0 }
                            ], {
                                duration: 1800, // Duración aumentada para el efecto de velocidad
                                easing: 'cubic-bezier(.77,0,.18,1)'
                            });
                            hyperspaceDiv.appendChild(star);
                        }

                        // 3. Espera 1.5s antes de mostrar el destello (estrellas acelerando)
                        setTimeout(() => {
                            let flash = document.createElement('div');
                            flash.style.position = 'fixed';
                            flash.style.top = '0';
                            flash.style.left = '0';
                            flash.style.width = '100vw';
                            flash.style.height = '100vh';
                            flash.style.background = 'white';
                            flash.style.opacity = '0';
                            flash.style.zIndex = '9999';
                            flash.style.transition = 'opacity 0.3s';
                            document.body.appendChild(flash);
                            setTimeout(() => { flash.style.opacity = '1'; }, 300);

                            // Destello dura 1 segundo, redirige de inmediato
                            setTimeout(() => {
                                window.open('https://maps.app.goo.gl/2mCgSHZahjnBiMir7', '_blank');
                            }, 100); // Redirección casi instantánea tras el destello

                            // Quita el destello y las estrellas después de 1 segundo
                            setTimeout(() => {
                                flash.style.opacity = '0';
                                setTimeout(() => {
                                    document.body.removeChild(flash);
                                    document.body.removeChild(hyperspaceDiv);
                                    // Muestra los elementos nuevamente
                                    sliderSection.style.display = '';
                                    btnCarinito.style.display = '';
                                    btnInfoGeneral.style.display = '';
                                    btnUbicacion.style.display = '';
                                    btnConfirmar.style.display = '';
                                }, 400);
                            }, 1000); // destello visible 1s
                        }, 1000); // Espera 1s para que se vean las estrellas acelerando
                    }, 700);
                }
            }, 700);
            // ...ya no se usa opacity para mostrar
        });
    }

    const infoGeneralWindow = document.getElementById('info-general-window');
    const carinitoWindow = document.getElementById('carinito-window');

    // Función para mostrar la ventana justo debajo y alineada al botón
    function showFullScreenWindow(windowEl) {
        windowEl.style.position = 'fixed';
        windowEl.style.top = '0';
        windowEl.style.left = '0';
        windowEl.style.width = '100vw';
        windowEl.style.height = '100vh';
        windowEl.scrollTop = 0; // Siempre inicia el scroll en top
    }

    btnInfoGeneral.addEventListener('click', () => {
        infoGeneralWindow.classList.toggle('visible');
        carinitoWindow.classList.remove('visible');
        if (infoGeneralWindow.classList.contains('visible')) {
            showFullScreenWindow(infoGeneralWindow);
        }
    });

    btnCarinito.addEventListener('click', () => {
        carinitoWindow.classList.toggle('visible');
        infoGeneralWindow.classList.remove('visible');
        if (carinitoWindow.classList.contains('visible')) {
            showFullScreenWindow(carinitoWindow);
        }
    });

    // Opcional: cerrar ventana al hacer clic fuera infoGeneral
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.slider-action-btn') && !e.target.closest('.slider-infoGeneral-window')) {
            infoGeneralWindow.classList.remove('visible');
            carinitoWindow.classList.remove('visible');
        }
    });

    // Opcional: cerrar ventana al hacer clic fuera infoCarinito
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.slider-action-btn') && !e.target.closest('.slider-infoCarinito-window')) {
            infoGeneralWindow.classList.remove('visible');
            carinitoWindow.classList.remove('visible');
        }
    });

    document.getElementById('btn-confirmar-whatsapp').addEventListener('click', function () {
        window.open('https://wa.me/50687900909?text=¡Confirmo mi llegada al evento!', '_blank');
    });

    const customCornerBtn = document.getElementById('custom-corner-btn');
    if (customCornerBtn) {
        customCornerBtn.addEventListener('click', () => {
            startCountdown();
        });
    }
});



