document.addEventListener('DOMContentLoaded', () => {
    const animationContent = document.querySelector('.animation-content');
    const introText = document.querySelector('.intro-text');
    const startBtn = document.getElementById('start-music-btn');
    const audioPlayer = document.getElementById('player');

    if (!animationContent || !introText || !startBtn || !audioPlayer) {
        console.error("Elementos necesarios no encontrados.");
        return;
    }

    // 1️⃣ Mostrar el párrafo primero (sin animaciones)
    animationContent.style.visibility = 'visible';
    introText.style.opacity = 1;

    // 2️⃣ Esperar unos segundos y mostrar botón
    setTimeout(() => {
        startBtn.style.display = 'block';
    }, 2000); // 2 segundos después de aparecer el párrafo

    // 3️⃣ Al hacer click en el botón
    startBtn.addEventListener('click', () => {
        // Ocultar botón
        startBtn.style.display = 'none';

        // Reproducir audio al 40%
        audioPlayer.volume = 0.4;
        audioPlayer.play().catch(e => console.error("La reproducción de audio falló:", e));

        // Aquí se puede activar el resto de animaciones con clases o triggers
        animationContent.classList.add('start-animations');
    });
});