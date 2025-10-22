// ==========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ==========================================
let currentSlide = 0;
let autoplayInterval;
let currentQuestionIndex = 0;
let userAnswers = [];
let currentPlayer; // Spotify Player Instance
let currentDeviceId; // Spotify Web Playback SDK Device ID

// --- Pega tus variables 'fallbackImages', 'questions', 'inspirationalMessages' aquí ---
// Asegúrate de que sean las mismas que usabas antes
const fallbackImages = [
    "https://images.pexels.com/photos/1528660/pexels-photo-1528660.jpeg",
    "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg",
    "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg",
    "https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg",
    "https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg",
    "https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg",
    "https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg",
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
];

const questions = [
    { id: 1, category: "🎓 MI FUTURO", question: "¿Qué carrera o profesión te ves ejerciendo en el futuro? ¿Qué tipo de vida quieres tener?", helper: "No importa si aún no estás 100% seguro. Escribe lo que te emociona imaginar.", sceneTitle: "Mi Visión de Futuro", imageUrls: ["https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg", "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg", "https://images.pexels.com/photos/935756/pexels-photo-935756.jpeg", "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg", "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg"] },
    { id: 2, category: "🎯 METAS ACADÉMICAS", question: "¿Qué quieres lograr este año en tus estudios?", helper: "Sé específico. ¿Qué nota quieres? ¿Qué materias son prioridad?", sceneTitle: "Mis Metas Académicas", imageUrls: ["https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg", "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg", "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg", "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg", "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg"] },
    { id: 3, category: "💪 MIS FORTALEZAS", question: "¿En qué materias o actividades eres bueno? ¿Qué habilidades tienes?", helper: "Piensa en lo que te sale fácil o lo que otros reconocen en ti.", sceneTitle: "Mis Superpoderes", imageUrls: ["https://images.pexels.com/photos/914929/pexels-photo-914929.jpeg", "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg", "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg", "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg", "https://images.pexels.com/photos/3775120/pexels-photo-3775120.jpeg"] },
    { id: 4, category: "🚧 MIS OBSTÁCULOS", question: "¿Qué te impide estudiar mejor o alcanzar tus metas?", helper: "Sé honesto. Reconocer el problema es el primer paso para solucionarlo.", sceneTitle: "Mis Desafíos", imageUrls: ["https://images.pexels.com/photos/1194345/pexels-photo-1194345.jpeg", "https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg", "https://images.pexels.com/photos/289586/pexels-photo-289586.jpeg", "https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg", "https://images.pexels.com/photos/4034525/pexels-photo-4034525.jpeg"] },
    { id: 5, category: "📉 ÁREAS A MEJORAR", question: "¿Qué materias o hábitos necesitas mejorar?", helper: "Todos tenemos debilidades. Identifica las tuyas para trabajar en ellas.", sceneTitle: "Mi Crecimiento", imageUrls: ["https://images.pexels.com/photos/323951/pexels-photo-323951.jpeg", "https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg", "https://images.pexels.com/photos/1206101/pexels-photo-1206101.jpeg", "https://images.pexels.com/photos/5302820/pexels-photo-5302820.jpeg", "https://images.pexels.com/photos/669584/pexels-photo-669584.jpeg"] },
    { id: 6, category: "🔥 MI MOTIVACIÓN", question: "¿Por qué es importante para ti tener éxito en tus estudios?", helper: "Puede ser hacer sentir orgullosos a tus padres, conseguir una beca, etc.", sceneTitle: "Mi Motor Interior", imageUrls: ["https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg", "https://images.pexels.com/photos/1528660/pexels-photo-1528660.jpeg", "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg", "https://images.pexels.com/photos/1239162/pexels-photo-1239162.jpeg", "https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg"] },
    { id: 7, category: "🛤️ MI PLAN", question: "¿Qué 3 acciones concretas harás esta semana para acercarte a tus metas?", helper: "Ej: Estudiar 1 hora diaria, hacer un horario, pedir ayuda.", sceneTitle: "Mis Próximos Pasos", imageUrls: ["https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg", "https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg", "https://images.pexels.com/photos/8938927/pexels-photo-8938927.jpeg", "https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg", "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"] },
    { id: 8, category: "🌟 MIS RECURSOS", question: "¿Qué apoyo tienes? (Profesores, familia, amigos, etc.)", helper: "Identifica tus recursos. No estás solo en este viaje.", sceneTitle: "Mi Red de Apoyo", imageUrls: ["https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg", "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg", "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg", "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg", "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"] }
];

const inspirationalMessages = [
    "Visualiza tu éxito, el primer paso.",
    "Cada meta cumplida te acerca más.",
    "Tus dones son tus herramientas.",
    "Los obstáculos son solo desvíos.",
    "Crece fuera de tu zona de confort.",
    "Tu 'por qué' es tu motor.",
    "Pequeñas acciones, grandes futuros.",
    "Nunca estás solo en el camino."
];
// ---------------------------------------------------------------------------------


// ==========================================
// INICIALIZACIÓN DE LA APP
// ==========================================
// Se ejecuta cuando el HTML está completamente cargado
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    console.log("DOM Cargado. Inicializando la aplicación...");
    
    // 1. Configurar Listeners del Buscador de Spotify
    // Es importante hacerlo aquí para que los elementos existan
    setupSpotifySearchListeners(); 
    
    // 2. Intentar inicializar Spotify (esto carga el SDK si es necesario)
    // Usamos 'await' para asegurarnos de que termine antes de decidir qué pantalla mostrar
    await initializeSpotifyConnection(); 

    // 3. Comprobar si ya estamos logueados (usando la variable global de Flask)
    if (window.isSpotifyLoggedIn === true) {
        // Si hay token -> Saltar a preguntas
        console.log("Usuario ya logueado en Spotify, iniciando cuestionario.");
        startQuestionnaire(); // Va directo a las preguntas

        // Asegurarse de que el reproductor web esté visible y listo
        const playerElement = document.getElementById('spotify-web-player');
        if (playerElement) {
             playerElement.style.display = 'flex'; // Mostrarlo (como flexbox)
             
             // Intentar obtener el token y configurar el player (si aún no está listo)
             // Esto es útil si la página se recarga mientras está logueado
             if (!currentPlayer) {
                 console.log("Intentando obtener token para player existente...");
                 fetch('/api/token')
                     .then(res => res.ok ? res.json() : Promise.reject('No token disponible desde /api/token'))
                     .then(data => data.access_token ? initializeWebPlaybackSDK(data.access_token) : null)
                     .catch(err => {
                         console.error("Error al obtener token para player existente:", err);
                         // Podríamos forzar logout si el token falla
                         // window.location.href = '/logout';
                     });
             }
        }
    } else {
        // Si no hay token -> Mostrar pantalla de login/música
        console.log("Usuario no logueado en Spotify, mostrando pantalla de selección.");
        showScreen('musicSelectionScreen');
         // Asegurarse de que el reproductor esté oculto
        const playerElement = document.getElementById('spotify-web-player');
        if (playerElement) playerElement.style.display = 'none';
    }

    updateTotalSteps(); // Actualiza el total de pasos en la UI una vez al inicio
}

// Actualiza el número total de pasos en la barra de progreso
function updateTotalSteps() {
     const totalStepsEl = document.getElementById('totalSteps');
     if (totalStepsEl) {
         totalStepsEl.textContent = questions.length;
     }
}


// ==========================================
// NAVEGACIÓN Y CUESTIONARIO (Película Mental)
// ==========================================
function showScreen(screenId) {
    // Busca la pantalla activa actual
    const activeScreen = document.querySelector('.screen.active');
    // Busca la nueva pantalla a mostrar
    const newScreen = document.getElementById(screenId);

    // Si la nueva pantalla no existe, no hacer nada y loguear error
    if (!newScreen) {
        console.error("Error crítico: No se encontró la pantalla con ID:", screenId);
        return;
    }

    // Si hay una pantalla activa y es diferente a la nueva
    if (activeScreen && activeScreen !== newScreen) {
        console.log(`Transicionando de ${activeScreen.id} a ${newScreen.id}`);
        // Añadir clase para animación de salida
        activeScreen.classList.add('hiding');

        // Función para manejar el fin de la animación/transición
        const handleTransitionEnd = (event) => {
            // Asegurarse que el evento viene del elemento correcto y es de opacidad o transformación
            if (event.target === activeScreen && (event.propertyName === 'opacity' || event.propertyName === 'transform')) {
                activeScreen.classList.remove('active', 'hiding'); // Ocultar completamente
                newScreen.classList.add('active'); // Mostrar la nueva pantalla
                console.log(`Pantalla ${newScreen.id} activada.`);
                activeScreen.removeEventListener('transitionend', handleTransitionEnd); // Limpiar listener
                activeScreen.removeEventListener('animationend', handleTransitionEnd); // Limpiar listener alternativo
            }
        };

        // Escuchar por el final de la transición o animación
        activeScreen.addEventListener('transitionend', handleTransitionEnd);
        activeScreen.addEventListener('animationend', handleTransitionEnd); // Por si acaso usa animación

        // Fallback por si el evento no se dispara (raro pero posible)
        setTimeout(() => {
             if (activeScreen.classList.contains('hiding')) {
                 console.warn("Fallback: Forzando cambio de pantalla tras timeout.");
                 activeScreen.classList.remove('active', 'hiding');
                 newScreen.classList.add('active');
                 activeScreen.removeEventListener('transitionend', handleTransitionEnd);
                 activeScreen.removeEventListener('animationend', handleTransitionEnd);
             }
        }, 800); // Un poco más que la duración de la animación

    } else if (!activeScreen) {
        // Si no había pantalla activa, mostrar la nueva directamente
        console.log(`Activando pantalla inicial ${newScreen.id}`);
        newScreen.classList.add('active');
    }
    // Si activeScreen es igual a newScreen, no hacer nada (ya está visible)
}


function startQuestionnaireWithoutMusic() {
    console.log("Iniciando cuestionario sin música.");
    startQuestionnaire();
}
// Hacer global para que el HTML la encuentre
window.startQuestionnaireWithoutMusic = startQuestionnaireWithoutMusic;

function startQuestionnaire() {
    console.log("Mostrando pantalla de cuestionario...");
    showScreen('questionnaireScreen'); // Transiciona a la pantalla de preguntas
    const progressBar = document.getElementById('progressBar');
    if(progressBar) progressBar.classList.remove('hidden'); // Muestra la barra de progreso
    
    currentQuestionIndex = 0; // Reinicia el índice a la primera pregunta
    // Inicializa userAnswers como un array del tamaño correcto, lleno de null
    userAnswers = new Array(questions.length).fill(null); 
    displayQuestion(); // Muestra la primera pregunta
}
// Hacer global para que el HTML la encuentre
window.startQuestionnaire = startQuestionnaire;


function displayQuestion() {
    // Validaciones robustas al inicio
    if (!Array.isArray(questions) || questions.length === 0) {
        console.error("Error: El array 'questions' está vacío o no es un array.");
        // Considerar mostrar un mensaje de error al usuario
        return;
    }
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
        console.error("Error: 'currentQuestionIndex' fuera de rango:", currentQuestionIndex);
        // Podría ser que se haya completado, intentar generar película
        // generateMovie(); 
        return;
    }
    
    const question = questions[currentQuestionIndex];
    if (!question) {
        console.error("Error: No se encontró objeto de pregunta válido en el índice:", currentQuestionIndex);
        return;
    }

    // Obtener elementos de la UI (usando '?' para acceso seguro)
    const answerInput = document.getElementById('answerInput');
    const questionImage = document.getElementById('questionImage');
    const categoryEl = document.getElementById('questionCategory');
    const titleEl = document.getElementById('questionTitle');
    const helperEl = document.getElementById('helperText');

    // Actualizar textos (con valores por defecto)
    if (categoryEl) categoryEl.textContent = question.category || 'Categoría';
    if (titleEl) titleEl.textContent = question.question || 'Pregunta no disponible';
    if (helperEl) helperEl.textContent = question.helper || 'Piensa en tu respuesta.';

    // Rellenar respuesta anterior si existe
    if (answerInput) {
        // Busca la respuesta guardada para este índice
        const storedAnswerData = userAnswers[currentQuestionIndex];
        answerInput.value = storedAnswerData ? storedAnswerData.answer : ''; // Usa la respuesta guardada o vacío
        answerInput.classList.remove('error'); // Limpiar errores visuales previos
    }

    // Actualizar imagen (con validación de imageUrls)
    if (questionImage && Array.isArray(question.imageUrls) && question.imageUrls.length > 0) {
        questionImage.style.opacity = '0'; // Inicia transición fade-out
        setTimeout(() => {
            try {
                // Seleccionar imagen aleatoria
                const randomIndex = Math.floor(Math.random() * question.imageUrls.length);
                const newImageUrl = question.imageUrls[randomIndex];
                
                // Handlers para carga y error
                questionImage.onload = () => { questionImage.style.opacity = '1'; }; // Transición fade-in al cargar
                questionImage.onerror = () => {
                    console.warn(`Error cargando imagen ${newImageUrl}, usando fallback.`);
                    questionImage.src = fallbackImages[0]; // Usar primer fallback
                    questionImage.style.opacity = '1';
                };
                questionImage.src = newImageUrl; // Establecer la nueva imagen
            } catch (e) {
                console.error("Error al seleccionar o cargar imagen:", e);
                questionImage.src = fallbackImages[0]; // Fallback en caso de error inesperado
                questionImage.style.opacity = '1';
            }
        }, 300); // Tiempo para fade-out antes de cambiar src
    } else if (questionImage) {
        // Si no hay array de imágenes o está vacío, usar un fallback
        console.warn("No hay imágenes para la pregunta actual, usando fallback.");
        questionImage.src = fallbackImages[0];
        questionImage.style.opacity = '1';
    }

    updateProgress(); // Actualizar barra de progreso
    updateButtons(); // Actualizar estado de botones
    answerInput?.focus(); // Poner foco en el input si existe
}


function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    // Asegurarse de que los elementos existan y questions tenga longitud
    if (progressFill && currentStepEl && questions && questions.length > 0) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        // Limitar progreso a 100%
        progressFill.style.width = `${Math.min(progress, 100)}%`; 
        currentStepEl.textContent = currentQuestionIndex + 1;
    } else if (questions && questions.length === 0) {
        // Caso borde: si no hay preguntas
         if (progressFill) progressFill.style.width = `0%`;
         if (currentStepEl) currentStepEl.textContent = 0;
    }
}


function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Habilitar/deshabilitar botón Anterior
    if (prevBtn) {
        prevBtn.disabled = (currentQuestionIndex === 0);
    }
    
    // Cambiar texto y estado del botón Siguiente/Finalizar
    if (nextBtn) {
        nextBtn.textContent = (currentQuestionIndex === questions.length - 1) 
                                ? 'Crear mi Película 🎬' 
                                : 'Siguiente →';
        // Podrías añadir lógica para deshabilitarlo si la respuesta es inválida
        // const answerInput = document.getElementById('answerInput');
        // nextBtn.disabled = answerInput ? answerInput.value.trim().length < 10 : true;
    }
}


function nextQuestion() {
    const answerInput = document.getElementById('answerInput');
    if (!answerInput) {
        console.error("No se encontró el input de respuesta.");
        return;
    }

    const answer = answerInput.value.trim();
    const minLength = 10; // Longitud mínima requerida

    // Validación de longitud
    if (answer.length < minLength) {
        answerInput.classList.add('error'); // Resaltar error
        const helper = document.getElementById('helperText');
        const originalHelperText = questions[currentQuestionIndex]?.helper || 'Piensa en tu respuesta.';
        
        // Mostrar mensaje de error temporalmente
        if (helper) {
            helper.textContent = `Respuesta muy corta (mín. ${minLength} caracteres).`;
            helper.style.color = 'var(--error-color)';
            helper.style.fontWeight = 'bold';
        }
        
        // Quitar el error después de un tiempo
        setTimeout(() => {
            answerInput.classList.remove('error');
            if (helper) {
                helper.textContent = originalHelperText; // Restaurar texto original
                helper.style.color = 'var(--text-muted)'; // Restaurar color
                helper.style.fontWeight = 'normal';
            }
        }, 2000); // 2 segundos para ver el mensaje
        return; // Detener la función aquí
    }

    // Guardar la respuesta (asegurándose que la pregunta existe)
    if (questions[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex] = {
            question: questions[currentQuestionIndex].question,
            answer: answer
        };
        console.log(`Respuesta ${currentQuestionIndex + 1} guardada:`, answer);
    } else {
        console.error("Intentando guardar respuesta para una pregunta inexistente:", currentQuestionIndex);
    }

    // Avanzar a la siguiente pregunta o generar la película
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(); // Mostrar la siguiente pregunta
    } else {
        console.log("Cuestionario completado. Iniciando generación...");
        generateMovie(); // Generar la película si es la última pregunta
    }
}
// Hacer global para el botón HTML
window.nextQuestion = nextQuestion;


function previousQuestion() {
    if (currentQuestionIndex > 0) {
        // Opcional: Guardar la respuesta actual antes de retroceder
        // const answerInput = document.getElementById('answerInput');
        // if (answerInput && questions[currentQuestionIndex]) {
        //     userAnswers[currentQuestionIndex] = {
        //         question: questions[currentQuestionIndex].question,
        //         answer: answerInput.value.trim()
        //     };
        // }
        currentQuestionIndex--; // Retroceder índice
        displayQuestion(); // Mostrar pregunta anterior
    }
}
// Hacer global para el botón HTML
window.previousQuestion = previousQuestion;


// ==========================================
// GENERACIÓN DE IMÁGENES Y TEXTO (IA)
// ==========================================
async function generateMovie() {
    console.log("Iniciando generación de película...");
    showScreen('generationScreen'); // Mostrar pantalla de carga
    const statusElement = document.getElementById('generationStatus');
    const generatedImages = [];

    // Ocultar elementos de resultado mientras se genera
    document.getElementById('revealContainer')?.classList.add('hidden');
    document.getElementById('resultCarousel')?.classList.add('hidden');
    document.getElementById('finalLayout')?.classList.add('hidden');

    // Bucle para generar cada imagen
    for (let i = 0; i < questions.length; i++) {
        if (statusElement) statusElement.textContent = `Generando escena ${i + 1} de ${questions.length}...`;

        const userAnswer = userAnswers[i]?.answer; // Respuesta guardada
        let prompt = "";
        const sceneTitle = questions[i]?.sceneTitle || `Escena ${i+1}`; // Título de fallback
        const basePrompt = `Una imagen evocadora y visualmente impactante que represente: "${userAnswer || sceneTitle}".`;
        const style = "Estilo cinematográfico hiperrealista, iluminación dramática, colores vibrantes, alta definición."; // Estilo detallado

        // Lógica de prompts específicos (ejemplos)
        if (userAnswer) {
            const lowerAnswer = userAnswer.toLowerCase();
            if (lowerAnswer.includes('programación') || lowerAnswer.includes('código') || lowerAnswer.includes('software')) {
                prompt = `Primer plano de manos tecleando en un teclado iluminado con código abstracto brillante reflejado en gafas o pantalla. ${style}`;
            } else if (lowerAnswer.includes('familia') || lowerAnswer.includes('amigos') || lowerAnswer.includes('apoyo')) {
                prompt = `Un grupo diverso de manos entrelazadas formando un círculo de unidad, con una luz cálida emanando del centro. ${style}`;
            } else if (lowerAnswer.includes('meta') || lowerAnswer.includes('logro') || lowerAnswer.includes('éxito')) {
                prompt = `Silueta de una persona alcanzando la cima de una montaña al amanecer, con rayos de sol atravesando las nubes. ${style}`;
            } else if (lowerAnswer.includes('estudiar') || lowerAnswer.includes('aprender') || lowerAnswer.includes('libro')) {
                 prompt = `Un libro antiguo abierto sobre un escritorio de madera iluminado por la luz de una vela, con símbolos mágicos flotando de las páginas. ${style}`;
            } else {
                prompt = `${basePrompt} ${style}`; // Prompt genérico si no hay coincidencia
            }
        } else {
             // Prompt si no hubo respuesta
             prompt = `Imagen conceptual artística y abstracta sobre "${sceneTitle}". ${style}`;
        }
        console.log(`[Img ${i+1}] Prompt: ${prompt}`);

        // Llamada a la API para generar imagen
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt }),
            });

            // Manejo de errores de red o del servidor
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
                 throw new Error(errorData.error || `HTTP error ${response.status}`);
            }

            const result = await response.json();
            // Validar que la respuesta contenga la URL de la imagen
            if (!result || !result.imageUrl) {
                 throw new Error("Respuesta inválida de la API (falta imageUrl).");
            }

            generatedImages.push(result.imageUrl); // Guardar imagen generada
            console.log(`[Img ${i+1}] Imagen generada OK.`);

        } catch (error) {
            console.error(`[Img ${i+1}] Error al generar: ${error.message}`);
            // Usar una imagen de fallback si falla la generación
            const fallbackIndex = i % fallbackImages.length; // Ciclar por las imágenes de fallback
            generatedImages.push(fallbackImages[fallbackIndex]);
            console.log(`[Img ${i+1}] Usando fallback: ${fallbackImages[fallbackIndex]}`);
        }
    } // Fin del bucle for

    console.log("Generación de todas las imágenes completada.");
    createCarousel(generatedImages); // Crear el carrusel con las imágenes
    showScreen('resultScreen'); // Cambiar a la pantalla de resultados
    // Mostrar el botón de revelar AHORA que las imágenes están listas
    const revealContainer = document.getElementById('revealContainer');
    if(revealContainer) revealContainer.classList.remove('hidden');

} // Fin de generateMovie


// ==========================================
// CARRUSEL Y RESULTADOS FINALES
// ==========================================
function createCarousel(generatedImages) {
    const slidesContainer = document.querySelector('.carousel-slides');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    // Validar que el contenedor exista
    if (!slidesContainer) {
        console.error("Error: No se encontró el contenedor '.carousel-slides'.");
        return;
    }

    slidesContainer.innerHTML = ''; // Limpiar contenido previo
    currentSlide = 0; // Reiniciar índice

    // Manejar caso sin imágenes
    if (!generatedImages || generatedImages.length === 0) {
        slidesContainer.innerHTML = '<p style="color: white; text-align: center; padding: 50px; font-style: italic;">No se pudieron generar las escenas.</p>';
        // Ocultar botones si no hay slides
        if (prevBtn) prevBtn.classList.add('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
        return;
    }

    // Crear cada slide
    generatedImages.forEach((imageUrl, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        // Obtener mensaje inspirador (asegurando índice válido)
        const msgIndex = index % inspirationalMessages.length;
        const inspirationalText = inspirationalMessages[msgIndex];

        // Crear contenido del slide
        slide.innerHTML = `
            <div class="scene-card">
                <img src="${imageUrl}" alt="Escena ${index + 1} de la película mental" class="scene-image" loading="lazy">
                <p>${escapeHtml(inspirationalText)}</p>
            </div>
        `;
        slidesContainer.appendChild(slide);
    });

    // Mostrar/ocultar botones de navegación según número de slides
    if (generatedImages.length > 1) {
        if (prevBtn) prevBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.remove('hidden');
    } else {
         if (prevBtn) prevBtn.classList.add('hidden');
         if (nextBtn) nextBtn.classList.add('hidden');
    }

    // Mostrar la primera diapositiva inmediatamente
    showSlide(0);
}


function revealCarousel() {
    const revealContainer = document.getElementById('revealContainer');
    const carousel = document.getElementById('resultCarousel');
    
    if (revealContainer) revealContainer.classList.add('hidden'); // Ocultar botón
    
    if (carousel) {
        carousel.classList.remove('hidden'); // Mostrar carrusel
        // Forzar reflow para que la animación funcione al quitar 'hidden'
        void carousel.offsetWidth; 
        carousel.style.animation = 'fadeIn 0.6s ease-out'; // Aplicar animación
    }
    
    startAutoplay(); // Iniciar autoplay al revelar
}
// Hacer global para el botón HTML
window.revealCarousel = revealCarousel;


async function startAutoplay() {
    // Detener cualquier autoplay anterior
    if (autoplayInterval) clearInterval(autoplayInterval);

    // Asegurarse de empezar desde la primera slide
    showSlide(0);
    console.log("Iniciando autoplay del carrusel...");

    autoplayInterval = setInterval(async () => {
        const slidesContainer = document.querySelector('.carousel-slides');
        const totalSlides = slidesContainer ? slidesContainer.children.length : 0;

        // Si no hay slides (error?), detener intervalo
        if (totalSlides === 0) {
             console.warn("Autoplay detenido: no hay slides en el carrusel.");
             clearInterval(autoplayInterval);
             // Podrías mostrar el layout final aquí también como fallback
             showFinalLayout();
             return;
        }

        // Si estamos en la última slide
        if (currentSlide >= totalSlides - 1) {
            clearInterval(autoplayInterval); // Detener el intervalo
            console.log("Autoplay finalizado. Mostrando layout final.");
            // Ocultar carrusel y mostrar sección final
            const carousel = document.getElementById('resultCarousel');
            if(carousel) carousel.classList.add('hidden');
            showFinalLayout(); // Función separada para mostrar el final
        } else {
            // Avanzar a la siguiente slide
            nextSlide();
        }
    }, 5000); // Cambiar slide cada 5 segundos
}
// Hacer global para control externo si es necesario
window.startAutoplay = startAutoplay;

// Función para mostrar el layout final (Timeline + Frase + Botones)
async function showFinalLayout() {
     console.log("Construyendo timeline y generando frase...");
     buildTimeline(); // Construir el guión con las respuestas
     await fetchMotivationalPhrase(); // Esperar a que la IA genere la frase
     
     const finalLayout = document.getElementById('finalLayout');
     if (finalLayout) {
         finalLayout.classList.remove('hidden'); // Mostrar sección final
         // Forzar reflow para animación
         void finalLayout.offsetWidth;
         finalLayout.style.animation = 'fadeIn 0.8s ease-out';
         console.log("Layout final mostrado.");
     } else {
         console.error("Error: No se encontró el elemento 'finalLayout'.");
     }
}


function showSlide(index) {
    const slidesContainer = document.querySelector('.carousel-slides');
    const allSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    // Validar elementos
    if (!slidesContainer || allSlides.length === 0) {
        // console.warn("showSlide: No hay slides para mostrar.");
        return;
    }
    const totalSlides = allSlides.length;

    // Ajustar índice si está fuera de rango
    if (index >= totalSlides) index = totalSlides - 1;
    if (index < 0) index = 0;
    currentSlide = index; // Actualizar índice global

    // Actualizar clase 'active-slide' para efectos visuales (e.g., opacidad)
    allSlides.forEach((slide, idx) => {
        slide.classList.toggle('active-slide', idx === currentSlide);
    });

    // Mover el contenedor usando transform para el efecto de deslizamiento
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar estado de los botones de navegación
    if (prevBtn) prevBtn.disabled = (currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides - 1);
}

// Funciones globales para los botones HTML
function nextSlide() { showSlide(currentSlide + 1); } window.nextSlide = nextSlide;
function prevSlide() { showSlide(currentSlide - 1); } window.prevSlide = prevSlide;


function buildTimeline() {
    const container = document.getElementById('textTimelineContainer');
    if (!container) {
        console.error("Error: Contenedor del timeline no encontrado.");
        return;
    }
    container.innerHTML = '<h2>Tu Guión de Vida</h2>'; // Limpiar y poner título

    // Iterar sobre las preguntas originales para asegurar el orden
    questions.forEach((q, index) => {
        // Obtener la respuesta guardada (puede ser null)
        const userAnswerData = userAnswers[index];
        const answerText = (userAnswerData && userAnswerData.answer) ? userAnswerData.answer : "No se proporcionó respuesta."; // Mensaje claro si no hay respuesta

        // Crear elemento del timeline
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <strong>${escapeHtml(q.sceneTitle || `Escena ${index + 1}`)}: ${escapeHtml(q.question || '')}</strong>
            <span>${escapeHtml(answerText)}</span>
        `;
        container.appendChild(item);
    });
    console.log("Timeline construido.");
}


async function fetchMotivationalPhrase() {
    const phraseElement = document.getElementById('motivationalPhrase');
    if (!phraseElement) {
        console.error("Error: Elemento para frase motivacional no encontrado.");
        return;
    }
    phraseElement.textContent = "Generando inspiración..."; // Mensaje de carga

    try {
        // Filtrar respuestas válidas (no nulas y con longitud suficiente)
        const validAnswers = userAnswers.filter(a => a && a.answer && a.answer.trim().length >= 10);

        // Si no hay respuestas válidas, usar una frase por defecto
        if (validAnswers.length === 0) {
            console.log("No hay respuestas válidas para generar frase, usando default.");
            phraseElement.textContent = '"El viaje de mil millas comienza con un solo paso."';
            return;
        }

        // Llamar a la API de IA
        const response = await fetch('/api/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: validAnswers }) // Enviar solo las válidas
        });

        // Manejar errores de la API
        if (!response.ok) {
            const errorData = await response.json().catch(()=> ({error:'Error desconocido del servidor'}));
            throw new Error(errorData.error || `Error ${response.status} al llamar a la API de texto`);
        }

        const data = await response.json();
        // Mostrar la frase generada o un fallback si viene vacía
        const generatedText = data.generatedText;
        phraseElement.textContent = generatedText ? `"${generatedText}"` : '"Vive la vida que has imaginado."';
        console.log("Frase motivacional generada:", phraseElement.textContent);

    } catch (error) {
        console.error('Error al obtener frase de IA:', error.message);
        // Usar frase de respaldo genérica en caso de cualquier error
        phraseElement.textContent = '"La mejor manera de predecir el futuro es crearlo."';
    }
}


// ==========================================
// OTRAS FUNCIONES (PDF, Reinicio)
// ==========================================
function escapeHtml(unsafe) {
    // Función simple para escapar HTML y prevenir XSS básico
    if (typeof unsafe !== 'string') return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


async function downloadPDF() {
    const downloadBtn = event.currentTarget; // Usar currentTarget para asegurar que es el botón
    if (!downloadBtn) return;
    
    downloadBtn.textContent = 'Generando PDF...';
    downloadBtn.disabled = true;

    const finalLayout = document.getElementById('finalLayout');
    if (!finalLayout) {
         alert("Error crítico: No se encontró el contenido (#finalLayout) para generar el PDF.");
         downloadBtn.textContent = 'Descargar PDF 📥';
         downloadBtn.disabled = false;
         return;
    }

    // Asegurarse de que el layout esté visible para html2canvas
    const wasHidden = finalLayout.classList.contains('hidden');
    if (wasHidden) finalLayout.classList.remove('hidden');

    console.log("Iniciando generación de PDF...");
    try {
        // Esperar brevemente para asegurar el renderizado completo
        await new Promise(resolve => setTimeout(resolve, 600));

        // Capturar el contenido con html2canvas
        const canvas = await html2canvas(finalLayout, {
            backgroundColor: '#0a0a0a', // Fondo oscuro consistente
            scale: window.devicePixelRatio || 1.5, // Usar escala del dispositivo o 1.5x
            useCORS: true, // Permitir imágenes externas si las hubiera
            logging: false, // Desactivar logs de html2canvas en consola
            // Capturar desde la parte superior, ignorando scroll de la página
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: finalLayout.scrollWidth,
            windowHeight: finalLayout.scrollHeight
        });
        console.log("Canvas generado.");

        // Volver a ocultar el layout si estaba oculto originalmente
        if (wasHidden) finalLayout.classList.add('hidden');

        // Inicializar jsPDF
        const { jsPDF } = window.jspdf;
        // Configuración para A4: 210mm x 297mm
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(canvas);
        const margin = 15; // Margen más generoso
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfPageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
        // Calcular altura proporcional de la imagen en el PDF
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = imgHeight; // Altura restante por añadir
        let position = margin; // Posición Y inicial

        // Añadir la primera (o única) parte de la imagen
        pdf.addImage(canvas.toDataURL('image/png', 0.95), // Calidad PNG alta
                     'PNG', margin, position, pdfWidth, imgHeight,
                     undefined, 'FAST'); // Compresión rápida
        heightLeft -= pdfPageHeight; // Restar la altura de la primera página

        // Añadir páginas adicionales si la imagen es más alta que una página
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + margin; // Calcular nueva posición Y negativa
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png', 0.95), 'PNG', margin, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfPageHeight; // Restar altura de la página añadida
        }

        // Guardar el archivo PDF
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        pdf.save(`mi-pelicula-mental-${timestamp}.pdf`);
        console.log("PDF guardado.");
        alert('¡Tu Película Mental ha sido guardada como PDF!');

    } catch (error) {
        console.error('Error detallado al generar PDF:', error);
        alert('Hubo un problema al generar el PDF. Por favor, revisa la consola (F12) para más detalles técnicos.');
        // Asegurarse de ocultar si hubo error
        if (wasHidden) finalLayout.classList.add('hidden');
    } finally {
        // Restaurar estado del botón
        downloadBtn.textContent = 'Descargar PDF 📥';
        downloadBtn.disabled = false;
    }
}
// Hacer global para el botón HTML
window.downloadPDF = downloadPDF;


function restartJourney() {
    if (confirm('¿Estás seguro de querer empezar de nuevo? Se borrarán tus respuestas actuales.')) {
        console.log("Reiniciando el cuestionario...");
        userAnswers = []; // Borrar respuestas
        currentQuestionIndex = 0; // Resetear índice
        if (autoplayInterval) clearInterval(autoplayInterval); // Detener carrusel

        // Ocultar todas las pantallas y luego mostrar la inicial correcta
        document.querySelectorAll('.screen').forEach(s => {
             s.classList.remove('active', 'hiding');
             s.style.animation = 'none'; // Prevenir animaciones residuales
        });

        // Decidir qué pantalla mostrar basado en el login de Spotify
        if (window.isSpotifyLoggedIn === true) {
             console.log("Usuario logueado, reiniciando a preguntas.");
             startQuestionnaire(); // Ir directo a las preguntas
        } else {
             console.log("Usuario no logueado, reiniciando a pantalla de login.");
             showScreen('musicSelectionScreen'); // Ir a la pantalla de login/música
        }

        // Asegurarse de ocultar elementos de UI de resultados
        document.getElementById('progressBar')?.classList.add('hidden');
        document.getElementById('revealContainer')?.classList.add('hidden');
        document.getElementById('resultCarousel')?.classList.add('hidden');
        document.getElementById('finalLayout')?.classList.add('hidden');

        // Opcional: Pausar Spotify
        currentPlayer?.pause().catch(console.error);
        console.log("Reinicio completado.");
    }
}
// Hacer global para el botón HTML
window.restartJourney = restartJourney;


// ==========================================
// LÓGICA DE SPOTIFY WEB PLAYBACK SDK
// ==========================================
async function initializeSpotifyConnection() {
    return new Promise((resolve) => {
        // Si el SDK ya está cargado y listo
        if (window.Spotify && typeof window.Spotify.Player === 'function') {
            console.log("SDK de Spotify ya disponible.");
            handleSdkReady().then(resolve); // Llama al handler y resuelve cuando termine
            return;
        }

        // Si no, asignar el callback global
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("Spotify SDK listo (callback disparado).");
            handleSdkReady().then(resolve); // Llama al handler y resuelve cuando termine
        };

        // Fallback por si el SDK no carga
        setTimeout(() => {
            // Verificar de nuevo si Spotify se cargó en este tiempo
            if (!window.Spotify || typeof window.Spotify.Player !== 'function') {
                console.error("Fallo crítico: El SDK de Spotify no se cargó después de 7 segundos.");
                // Ocultar player permanentemente si el SDK falla
                const playerElement = document.getElementById('spotify-web-player');
                if (playerElement) playerElement.style.display = 'none';
                // Indicar al usuario (opcional)
                // alert("No se pudo conectar con Spotify. Intenta recargar la página.");
                resolve(); // Resuelve para no bloquear la app
            }
        }, 7000); // Aumentar timeout a 7 segundos
    });
}

async function handleSdkReady() {
    // Se llama cuando el SDK está listo (ya sea al cargar o si ya estaba)
    console.log("Manejando SDK listo...");
    // Verificar si estamos logueados según la variable de Flask
    if (window.isSpotifyLoggedIn === true) {
        console.log("Usuario logueado, obteniendo token para SDK...");
        try {
            const response = await fetch('/api/token'); // Pedir el token real
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({error: `Error ${response.status}`}));
                 throw new Error(errorData.error || `Error ${response.status} al obtener token`);
            }
            const data = await response.json();
            if (data && data.access_token) {
                initializeWebPlaybackSDK(data.access_token); // Inicializar el player
            } else {
                console.warn('No se recibió token de acceso válido desde /api/token.');
                hidePlayer(); // Ocultar si no hay token
            }
        } catch (error) {
            console.error("Error al obtener token para inicializar SDK:", error.message);
            hidePlayer(); // Ocultar si hay error
            // Considerar forzar logout si el token falla consistentemente
            // window.location.href = '/logout';
        }
    } else {
        console.log("SDK listo, pero usuario no logueado.");
        hidePlayer(); // Asegurarse de ocultar si no está logueado
    }
}

function hidePlayer() {
     const playerElement = document.getElementById('spotify-web-player');
     if (playerElement) playerElement.style.display = 'none';
}


function initializeWebPlaybackSDK(accessToken) {
    if (!accessToken) {
        console.error("Error crítico: Intento de inicializar SDK sin accessToken.");
        return;
    }
    // Evitar reinicializar si ya existe una instancia
    if (currentPlayer) {
        console.log("El reproductor Spotify ya está inicializado.");
        // Podríamos verificar si el token es diferente y actualizarlo,
        // pero por ahora, simplemente retornamos.
        // currentPlayer.getOAuthToken(t => { if (t !== accessToken) { /* Lógica de update? */ }});
        return;
    }

    console.log("Inicializando instancia de Spotify.Player...");
    try {
        currentPlayer = new Spotify.Player({
            name: 'Mi Película Mental Player', // Nombre que aparecerá en Spotify Connect
            getOAuthToken: cb => {
                // El SDK llama a esto cuando necesita un token (inicialmente y para refrescar?)
                console.log("SDK solicita token...");
                // Idealmente, aquí deberíamos llamar a /api/token para obtener el más reciente
                // fetch('/api/token').then(r=>r.json()).then(d=>cb(d.access_token)).catch(e => { console.error("Fallo al refrescar token para SDK", e); cb(accessToken);});
                // Por simplicidad ahora, solo devolvemos el token inicial.
                // ¡OJO! Esto puede fallar si el token expira y no tenemos lógica de refresh aquí.
                 fetch('/api/token')
                    .then(response => {
                        if (!response.ok) throw new Error('No se pudo refrescar token para SDK');
                        return response.json();
                    })
                    .then(data => {
                        if (data.access_token) {
                             console.log("Token refrescado para SDK proporcionado.");
                             cb(data.access_token);
                             accessToken = data.access_token; // Actualizar token localmente?
                        } else {
                             throw new Error('Respuesta de /api/token inválida durante getOAuthToken');
                        }
                    })
                    .catch(error => {
                        console.error("Error crítico al obtener token para SDK:", error.message);
                        // Si falla el refresh, el player se desconectará. Forzar logout?
                        // window.location.href = '/logout';
                        cb(null); // Indicar fallo al SDK
                    });
            },
            volume: 0.6 // Volumen inicial (0 a 1)
        });
    } catch (e) {
        console.error("Error al crear la instancia de Spotify.Player:", e);
        alert("No se pudo inicializar el reproductor de Spotify. Asegúrate de estar usando un navegador compatible.");
        return;
    }


    // --- Listeners del Reproductor ---
    currentPlayer.addListener('ready', ({ device_id }) => {
        console.log('Reproductor LISTO y conectado con Device ID:', device_id);
        currentDeviceId = device_id;
        const playerElement = document.getElementById('spotify-web-player');
        if (playerElement) playerElement.style.display = 'flex'; // Mostrar player
        console.log("Intentando transferir playback al conectar...");
        transferPlayback(device_id); // Intentar transferir control
    });

    currentPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Reproductor NO LISTO. Device ID:', device_id, 'se desconectó.');
        hidePlayer(); // Ocultar el reproductor
        currentDeviceId = null;
    });

    currentPlayer.addListener('player_state_changed', (state) => {
        // Este es el listener más importante, actualiza la UI
        if (!state) {
             console.warn("Estado del reproductor nulo recibido. Posible desconexión o error.");
             // Resetear UI a estado 'desconectado' o placeholder
             updatePlayerUI(null);
             return;
        }
        console.debug("Nuevo estado del reproductor:", state);
        updatePlayerUI(state); // Llamar a función separada para actualizar UI
    });

    // --- Listeners de Errores Detallados ---
    currentPlayer.addListener('initialization_error', ({ message }) => { console.error('Error de INICIALIZACIÓN SDK:', message); showPlayerError(message); hidePlayer(); });
    currentPlayer.addListener('authentication_error', ({ message }) => { console.error('Error de AUTENTICACIÓN SDK:', message); showPlayerError(message + " Sesión inválida."); hidePlayer(); window.location.href = '/logout'; }); // Forzar logout
    currentPlayer.addListener('account_error', ({ message }) => { console.error('Error de CUENTA SDK:', message); showPlayerError(message + " Se requiere Spotify Premium."); hidePlayer(); }); // Premium requerido
    currentPlayer.addListener('playback_error', ({ message }) => { console.error('Error de REPRODUCCIÓN SDK:', message); showPlayerError("Error al reproducir: " + message); });


    // --- Conectar el Reproductor ---
    console.log("Conectando el reproductor del SDK...");
    currentPlayer.connect().then(success => {
        if (success) {
            console.log('SDK de Spotify conectado al backend exitosamente.');
        } else {
            console.error('FALLO: El SDK de Spotify no pudo conectarse.');
            hidePlayer();
        }
    }).catch(error => {
         console.error("Error durante currentPlayer.connect():", error);
         hidePlayer();
    });

    // --- Configurar Botones de Control (una sola vez) ---
    setupPlayerControls();

} // Fin de initializeWebPlaybackSDK

// Función separada para actualizar la UI del reproductor
function updatePlayerUI(state) {
    const trackNameEl = document.getElementById('spotify-track-name');
    const artistNameEl = document.getElementById('spotify-artist-name');
    const albumArtEl = document.getElementById('spotify-album-art');
    const playBtn = document.getElementById('spotify-play-btn');
    const pauseBtn = document.getElementById('spotify-pause-btn');
    const prevBtn = document.getElementById('spotify-prev-btn');
    const nextBtn = document.getElementById('spotify-next-btn');

    // Estado por defecto (sin canción o desconectado)
    let trackName = 'Spotify';
    let artistName = 'Web Player';
    let imageUrl = 'https://placehold.co/50x50/1c1c1c/333?text=+';
    let isPaused = true;
    let canSkipPrev = false;
    let canSkipNext = false;

    if (state) {
        const track = state.track_window?.current_track;
        if (track) {
            trackName = track.name || 'Canción Desconocida';
            artistName = track.artists?.map(a => a.name).join(', ') || 'Artista Desconocido';
            imageUrl = track.album?.images?.slice(-1)[0]?.url || imageUrl; // Imagen más pequeña
        }
        isPaused = state.paused;
        // Habilitar/deshabilitar botones según el estado
        canSkipPrev = state.restrictions?.can_skip_prev === false ? false : true; // Habilitado por defecto
        canSkipNext = state.restrictions?.can_skip_next === false ? false : true; // Habilitado por defecto
    }

    // Actualizar elementos del DOM
    if (trackNameEl) trackNameEl.textContent = trackName;
    if (artistNameEl) artistNameEl.textContent = artistName;
    if (albumArtEl) albumArtEl.src = imageUrl;
    if (playBtn) playBtn.style.display = isPaused ? 'inline-block' : 'none';
    if (pauseBtn) pauseBtn.style.display = isPaused ? 'none' : 'inline-block';
    if (prevBtn) prevBtn.disabled = !canSkipPrev;
    if (nextBtn) nextBtn.disabled = !canSkipNext;
}


// Función para configurar los listeners de los botones de control una sola vez
function setupPlayerControls() {
    const setupControl = (id, event, action) => {
        const btn = document.getElementById(id);
        // Verificar si el listener ya fue añadido antes de agregarlo
        if (btn && !btn.dataset.listenerAttached) {
            btn.addEventListener(event, (e) => {
                e.preventDefault(); // Prevenir comportamiento por defecto si es link/botón
                if (currentPlayer) { // Solo ejecutar si el player está listo
                    action(currentPlayer);
                } else {
                    console.warn(`Intento de usar control ${id} pero currentPlayer no está listo.`);
                }
            });
            btn.dataset.listenerAttached = 'true'; // Marcar como añadido
        }
    };

    // Asignar acciones a los botones
    setupControl('spotify-play-btn', 'click', (player) => player.resume().catch(e => console.error("Error al resumir:", e)));
    setupControl('spotify-pause-btn', 'click', (player) => player.pause().catch(e => console.error("Error al pausar:", e)));
    setupControl('spotify-prev-btn', 'click', (player) => player.previousTrack().catch(e => console.error("Error en previousTrack:", e)));
    setupControl('spotify-next-btn', 'click', (player) => player.nextTrack().catch(e => console.error("Error en nextTrack:", e)));

    console.log("Listeners de controles del reproductor configurados.");
}


// Función para mostrar errores del player en la UI (opcional)
function showPlayerError(message) {
    console.error("PLAYER ERROR:", message);
    // Podrías tener un div en el HTML para mostrar estos mensajes
    // const errorDiv = document.getElementById('spotify-error-message');
    // if (errorDiv) {
    //     errorDiv.textContent = message;
    //     errorDiv.style.display = 'block';
    //     setTimeout(() => errorDiv.style.display = 'none', 5000); // Ocultar después de 5s
    // }
}


async function transferPlayback(deviceId) {
    if (!deviceId) {
        console.warn("Intento de transferir playback sin deviceId válido.");
        return;
    }
    console.log("Enviando petición a /api/transfer_playback para device ID:", deviceId);
    try {
        const response = await fetch('/api/transfer_playback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: deviceId })
        });
        const data = await response.json(); // Intentar parsear JSON siempre

        if (response.ok && data.status === 'success') {
            console.log('Reproducción transferida exitosamente a este navegador.');
        } else {
            // Loguear error específico devuelto por el backend o estado HTTP
            const errorMsg = data.error || `Error ${response.status} al transferir reproducción.`;
            console.warn('No se pudo transferir la reproducción:', errorMsg);
            // Podrías mostrar un mensaje sutil al usuario si falla la transferencia
        }
    } catch (error) {
        // Error de red o al parsear JSON
        console.error('Error en fetch durante transferPlayback:', error);
    }
}


// ==================================================
// LÓGICA DEL BUSCADOR INTEGRADO EN EL REPRODUCTOR
// ==================================================
function setupSpotifySearchListeners() {
    const player = document.getElementById('spotify-web-player');
    const expandBtn = document.getElementById('spotify-expand-btn');
    const searchSection = document.getElementById('spotify-search-expansion');
    const searchInput = document.getElementById('spotify-player-search-input');
    const searchResultsContainer = document.getElementById('spotify-player-search-results');

    // Validar que todos los elementos necesarios existan
    if (!player || !expandBtn || !searchSection || !searchInput || !searchResultsContainer) {
        console.error("Error: No se encontraron todos los elementos para el buscador del player.");
        return;
    }

    // 1. Botón para Expandir/Cerrar la sección de búsqueda
    expandBtn.addEventListener('click', () => {
        const isCurrentlyHidden = searchSection.classList.contains('hidden');
        searchSection.classList.toggle('hidden', !isCurrentlyHidden); // Muestra si estaba oculto, oculta si estaba visible
        player.classList.toggle('spotify-player-expanded', isCurrentlyHidden); // Añade clase si se va a mostrar
        expandBtn.textContent = isCurrentlyHidden ? '✖️' : '🔎'; // Cambia el ícono
        expandBtn.setAttribute('aria-expanded', isCurrentlyHidden ? 'true' : 'false'); // Accesibilidad

        if (isCurrentlyHidden) {
             searchInput.focus(); // Poner foco en el input al expandir
        } else {
             // Limpiar búsqueda al cerrar
             searchInput.value = '';
             searchResultsContainer.innerHTML = '<p>Escribe para buscar...</p>';
        }
    });

    // 2. Input de Búsqueda (con debounce para eficiencia)
    let searchTimeout;
    searchInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout); // Cancelar timeout anterior
        const query = event.target.value.trim();

        // Actualizar UI de resultados inmediatamente
        if (query.length === 0) {
            searchResultsContainer.innerHTML = '<p>Escribe para buscar...</p>';
            return; // No buscar si está vacío
        }
        if (query.length <= 2) {
            searchResultsContainer.innerHTML = '<p>Sigue escribiendo...</p>';
            return; // No buscar si es muy corto
        }

        // Mostrar 'Buscando...' mientras espera el debounce
        searchResultsContainer.innerHTML = '<p>Buscando...</p>';

        // Establecer nuevo timeout para buscar después de 350ms
        searchTimeout = setTimeout(() => {
            searchSpotifyInPlayer(query); // Llamar a la función de búsqueda
        }, 350);
    });

    // 3. Listener de Clic en los Resultados de Búsqueda (delegación de eventos)
    searchResultsContainer.addEventListener('click', (event) => {
        // Encontrar el elemento 'search-result-item' más cercano al clic
        const trackItem = event.target.closest('.search-result-item');
        if (trackItem) {
            const trackUri = trackItem.getAttribute('data-track-uri');
            if (trackUri) {
                console.log("Clic en resultado, intentando reproducir URI:", trackUri);
                playSpotifyTrack(trackUri); // Reproducir la canción

                // Cerrar el buscador después de seleccionar
                searchSection.classList.add('hidden');
                player.classList.remove('spotify-player-expanded');
                expandBtn.textContent = '🔎';
                expandBtn.setAttribute('aria-expanded', 'false');
                searchInput.value = ''; // Limpiar input
                searchResultsContainer.innerHTML = '<p>Escribe para buscar...</p>'; // Resetear resultados
            } else {
                console.warn("El item de resultado no tenía 'data-track-uri'.");
            }
        }
    });

    console.log("Listeners del buscador del reproductor configurados.");

} // Fin de setupSpotifySearchListeners


// 4. Función para llamar a /api/search (Backend)
async function searchSpotifyInPlayer(query) {
    const searchResultsContainer = document.getElementById('spotify-player-search-results');
    if (!query || !searchResultsContainer) return;

    console.log("Buscando en Spotify (desde player):", query);
    // Mantener mensaje de "Buscando..."
    // searchResultsContainer.innerHTML = '<p>Buscando...</p>';

    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });

        // Manejo de errores de respuesta
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({error:'Error desconocido'}));
            throw new Error(errorData.error || `Error ${response.status} en la búsqueda`);
        }

        const tracks = await response.json();
        renderSearchResultsInPlayer(tracks); // Renderizar resultados

    } catch (error) {
        console.error("Error en searchSpotifyInPlayer:", error);
        if (searchResultsContainer) {
             searchResultsContainer.innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
        }
    }
}


// 5. Función para Renderizar Resultados en el Contenedor del Player
function renderSearchResultsInPlayer(tracks) {
    const searchResultsContainer = document.getElementById('spotify-player-search-results');
    if (!searchResultsContainer) return;

    searchResultsContainer.innerHTML = ''; // Limpiar contenedor

    if (!Array.isArray(tracks) || tracks.length === 0) {
        searchResultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    // Crear y añadir cada item de resultado
    tracks.forEach(track => {
        // Extraer datos de forma segura
        const imageUrl = track.album?.images?.slice(-1)[0]?.url || 'https://placehold.co/40x40/1c1c1c/333?text=+';
        const trackName = track.name || 'Título desconocido';
        const artistName = track.artists?.map(a => a.name).join(', ') || 'Artista desconocido';
        const trackUri = track.uri;

        // Saltar si no hay URI (improbable pero posible)
        if (!trackUri) return;

        // Crear elemento HTML
        const trackElement = document.createElement('div');
        trackElement.className = 'search-result-item';
        trackElement.setAttribute('data-track-uri', trackUri); // Guardar URI para reproducir
        trackElement.setAttribute('role', 'option'); // Accesibilidad
        trackElement.setAttribute('tabindex', '0'); // Hacer focusable
        trackElement.innerHTML = `
            <img src="${imageUrl}" alt="Carátula de ${escapeHtml(track.album?.name || '')}" loading="lazy">
            <div class="search-result-info">
                <strong>${escapeHtml(trackName)}</strong>
                <span>${escapeHtml(artistName)}</span>
            </div>
        `;
        // Añadir listener de teclado para accesibilidad (opcional pero bueno)
        trackElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playSpotifyTrack(trackUri);
                // Cerrar buscador
                 document.getElementById('spotify-search-expansion')?.classList.add('hidden');
                 document.getElementById('spotify-web-player')?.classList.remove('spotify-player-expanded');
                 document.getElementById('spotify-expand-btn').textContent = '🔎';
            }
        });

        searchResultsContainer.appendChild(trackElement);
    });
    console.log(`Renderizados ${tracks.length} resultados.`);
}


// 6. Función para llamar a /api/play (Backend) - ¡Esta ya existe y es correcta!
async function playSpotifyTrack(trackUri) {
    if (!trackUri) {
        console.error("playSpotifyTrack: No se proporcionó track URI.");
        return;
    }
    // Asegurarse de que el reproductor web esté activo
    if (!currentDeviceId) {
         alert("El reproductor de Spotify no está listo. Intenta de nuevo en un momento.");
         console.warn("Intento de reproducir sin device ID activo.");
         // Podríamos intentar forzar la transferencia aquí, pero es mejor esperar al 'ready'
         // await transferPlayback(currentDeviceId); // Esto probablemente fallaría
         return;
    }

    console.log("Enviando petición a /api/play con URI:", trackUri);
    try {
        const response = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ track_uri: trackUri }) // Enviar el URI correcto
        });
        const data = await response.json(); // Intentar parsear JSON siempre

        if (response.ok && data.status === 'success') {
            console.log('Petición de reproducción enviada exitosamente.');
            // No necesitamos hacer nada más aquí, el listener 'player_state_changed'
            // debería recibir el nuevo estado y actualizar la UI.
        } else {
             // Mostrar error específico devuelto por el backend
             const errorMsg = data.error || `Error ${response.status} al intentar reproducir.`;
             throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error en playSpotifyTrack (fetch):', error);
        // Mostrar error al usuario de forma más clara
        alert(`Error al reproducir: ${error.message}\nAsegúrate de tener Spotify Premium y que el reproductor web esté activo en este navegador.`);
    }
}
// Fin del archivo app.js