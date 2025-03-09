document.addEventListener('DOMContentLoaded', function () {
    // Acceso a la cámara
    const videoElement = document.getElementById('video-feed');
    const thermalOverlay = document.getElementById('thermal-overlay');
    const mainText = document.getElementById('main-text');
    const secondaryText = document.getElementById('secondary-text');
    const targetInfo = document.getElementById('target-info');
    const buttons = document.querySelectorAll('.control-btn');
    const targetFrame = document.getElementById('target-frame');

    // Configuración inicial del zoom
    let zoomLevel = 1; // Nivel inicial de zoom
    const zoomStep = 0.2; // Incremento o decremento por paso

    // Control de Zoom: Usar rueda del mouse
    videoElement.addEventListener('wheel', (event) => {
        event.preventDefault(); // Prevenir el scroll de la página

        if (event.deltaY < 0) {
            zoomLevel = Math.min(zoomLevel + zoomStep, 3); // Limitar el zoom máximo a 3x
        } else {
            zoomLevel = Math.max(zoomLevel - zoomStep, 1); // Limitar el zoom mínimo a 1x
        }

        // Aplicar el zoom al elemento del video
        videoElement.style.transform = `scale(${zoomLevel})`;
        videoElement.style.transformOrigin = 'center center'; // Ajustar el punto de zoom
    });

    // Configuración del sonido
    const sound = new Audio('./Sonidos/778138__newlocknew__dsgnmisc_predators-vision-pov-1-1_em.mp3');
    sound.volume = 0.5; // Volumen inicial

    // Crear y agregar control de volumen dinámico
    const volumeControl = document.createElement('div');
    volumeControl.id = 'volume-control';
    volumeControl.innerHTML = `
      <label for="volume">Volumen:</label>
      <input type="range" id="volume" min="0" max="1" step="0.1" value="${sound.volume}">
    `;
    document.body.appendChild(volumeControl);

    // Asociar sonido a los botones
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            sound.currentTime = 0; // Reinicia el sonido
            sound.play(); // Reproduce el sonido
        });
    });

    // Control de volumen dinámico
    const volumeSlider = document.getElementById('volume');
    volumeSlider.addEventListener('input', function () {
        sound.volume = volumeSlider.value; // Ajustar volumen según el slider
    });

    // Iniciar webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function (stream) {
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.error("No se pudo acceder a la cámara: ", error);
                videoElement.style.backgroundColor = "#333";
            });
    } else {
        videoElement.style.backgroundColor = "#333";
        console.log("getUserMedia no está soportado en este navegador");
    }

    // Mensajes aleatorios
    const predatorMessages = [
        "ESCANEANDO AREA",
        "BUSQUEDA DE OBJETIVOS",
        "ANALIZANDO AMBIENTE",
        "DETECCION DE CALOR",
        "MODO CAZA ACTIVADO",
        "SISTEMA ARMADO",
        "CAMUFLAJE ACTIVO",
        "DETECCION DE MOVIMIENTO"
    ];

    function getRandomMessage() {
        return predatorMessages[Math.floor(Math.random() * predatorMessages.length)];
    }

    setInterval(function () {
        secondaryText.textContent = getRandomMessage();
    }, 3000);

    // Modos de visión
    document.getElementById('thermal-btn').addEventListener('click', function () {
        videoElement.style.filter = "contrast(150%) hue-rotate(180deg) saturate(2)";
        thermalOverlay.style.background = "radial-gradient(circle, rgba(255,0,0,0.2) 0%, rgba(0,255,255,0.2) 100%)";
        mainText.textContent = "MODO VISION TERMICA ACTIVADO";
    });

    document.getElementById('night-btn').addEventListener('click', function () {
        videoElement.style.filter = "brightness(150%) contrast(120%) hue-rotate(120deg) saturate(0.5)";
        thermalOverlay.style.background = "none";
        mainText.textContent = "MODO VISION NOCTURNA ACTIVADO";
    });

    document.getElementById('bio-btn').addEventListener('click', function () {
        videoElement.style.filter = "contrast(120%) saturate(0.7) hue-rotate(30deg)";
        thermalOverlay.style.background = "radial-gradient(circle, rgba(0,255,0,0.2) 0%, rgba(0,0,255,0.2) 100%)";
        mainText.textContent = "MODO ANALISIS BIOLOGICO ACTIVADO";
    });

    document.getElementById('target-btn').addEventListener('click', function () {
        targetInfo.classList.add('active');
        setTimeout(function () {
            targetInfo.classList.remove('active');
        }, 5000);
    });

    // Coordenadas aleatorias
    function updateCoordinates() {
        const coordElem = document.getElementById('coordinates');
        const lat = (Math.random() * 180 - 90).toFixed(1);
        const lon = (Math.random() * 360 - 180).toFixed(1);
        const latDir = lat >= 0 ? "N" : "S";
        const lonDir = lon >= 0 ? "E" : "W";
        coordElem.textContent = `LAT: ${Math.abs(lat)}°${latDir}  LON: ${Math.abs(lon)}°${lonDir}`;
    }

    setInterval(updateCoordinates, 10000);
    updateCoordinates();

    // Movimiento del cuadro objetivo siguiendo el cursor
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Ajustar la posición del cuadro objetivo
        targetFrame.style.left = `${mouseX - targetFrame.offsetWidth / 2}px`;
        targetFrame.style.top = `${mouseY - targetFrame.offsetHeight / 2}px`;
    });
});
