(function temporizador() {

    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    const
        $finalMessage = document.querySelector('.conteo-final');
    //I'm adding this section so I don't have to keep updating this pen every year :-)
    //remove this if you don't need it

    // Tomemos los segundos, minutos, horas, dia, mes, año de la fecha actual,
    let today = new Date(),
        sec = String(today.getSeconds()).padStart(2, "0"),
        min = String(today.getMinutes()).padStart(2, "0"),
        hh = String(today.getHours()).padStart(2, "0"),
        dd = String(today.getDate()).padStart(2, "0"),
        mm = String(today.getMonth() + 1).padStart(2, "0"),
        yyyy = today.getFullYear(),

        // Fecha y hora de evento calculemos
        nextYear = yyyy + 1,
        dayMonth = "10/11/",
        nextHour = " 18:",
        nextMin = "00:",
        nextSec = "00",
        evento = dayMonth + yyyy + nextHour + nextMin + nextSec;

    today = mm + "/" + dd + "/" + yyyy + " " + hh + ":" + min + ":" + sec;
    if (today > evento) {
        evento = dayMonth + nextYear + nextHour + nextMin + nextSec
    }
    //end '03 29, 2025 14:00:00'
    const countDown = new Date(evento).getTime(),
        x = setInterval(function () {
            const now = new Date().getTime(),
                distance = countDown - now;
            document.getElementById("days").innerText = Math.floor(distance / (day)),
                document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
                document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
                document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
            //do something later when date is reached
            if (distance < 0) {
                document.getElementById("texto_tiempoRestante").innerText = "Estamos en nuestro evento";
                document.getElementById("temporizador").style.display = "none";
                document.getElementById("Contenedor-Felicidades").style.display = "block";
                document.getElementById("Felicidades").style.display = "block";
                clearInterval(x);
            }
            //seconds
        }, 0)
}());

(function terminaTemporizador() {

});