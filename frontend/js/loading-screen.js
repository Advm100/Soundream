// Écran de chargement stylisé
document.addEventListener('DOMContentLoaded', function() {
    // Créer l'écran de chargement
    createLoadingScreen();
    
    // Ajouter les styles
    addLoadingStyles();
    
    // Exposer les fonctions au scope global
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.simulateLoading = simulateLoading;
    
    // Déclencher l'écran de chargement au démarrage de l'application
    simulateInitialLoading();
});

function createLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <i class="fas fa-music"></i>
                <span>NightFlow</span>
            </div>
            <div class="loading-spinner">
                <div class="spinner-circle"></div>
                <div class="spinner-line-mask">
                    <div class="spinner-line"></div>
                </div>
            </div>
            <div class="loading-message">Chargement de votre musique...</div>
            <div class="loading-progress-container">
                <div class="loading-progress-bar">
                    <div class="loading-progress"></div>
                </div>
                <div class="loading-percentage">0%</div>
            </div>
            <div class="loading-facts">
                <div class="loading-fact">Saviez-vous que...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Ajouter des infobulles aléatoires
    setupRandomFacts();
}

function addLoadingStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Écran de chargement */
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background-dark);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
        
        .loading-screen.active {
            opacity: 1;
            pointer-events: all;
        }
        
        .loading-content {
            text-align: center;
            max-width: 400px;
            padding: 20px;
        }
        
        .loading-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }
        
        .loading-logo i {
            margin-right: 15px;
            font-size: 3rem;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .loading-spinner {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
        }
        
        .spinner-circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 4px solid rgba(157, 78, 221, 0.2);
        }
        
        .spinner-line-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            overflow: hidden;
            transform-origin: 100% 50%;
            animation: spinner-rotate 1.5s infinite ease-in-out;
        }
        
        .spinner-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            border-radius: 50%;
            border-width: 4px;
            border-style: solid;
            border-color: transparent;
            border-top-color: var(--accent-color);
            border-left-color: var(--accent-color);
            animation: spinner-grow 1.5s infinite ease-in-out;
        }
        
        @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes spinner-grow {
            0% { transform: rotate(-180deg); }
            100% { transform: rotate(180deg); }
        }
        
        .loading-message {
            font-size: 1.2rem;
            margin-bottom: 20px;
            color: var(--text-primary);
            animation: pulse-text 2s infinite;
        }
        
        @keyframes pulse-text {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .loading-progress-container {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .loading-progress-bar {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-right: 10px;
        }
        
        .loading-progress {
            height: 100%;
            width: 0%;
            background: var(--accent-gradient);
            border-radius: 3px;
            transition: width 0.3s ease;
        }
        
        .loading-percentage {
            font-size: 0.9rem;
            color: var(--text-secondary);
            min-width: 40px;
            text-align: right;
        }
        
        .loading-facts {
            color: var(--text-secondary);
            font-style: italic;
            font-size: 0.9rem;
            margin-top: 30px;
            min-height: 40px;
        }
        
        .loading-fact {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .loading-fact.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Animation d'arrière-plan */
        .loading-screen::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 50%, rgba(157, 78, 221, 0.1), transparent 70%);
            animation: glow 4s infinite alternate;
        }
        
        @keyframes glow {
            0% { opacity: 0.5; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.1); }
        }
        
        /* Adaptation pour le thème clair */
        body.light-theme .loading-screen {
            background: var(--background-light);
        }
        
        body.light-theme .spinner-circle {
            border-color: rgba(138, 43, 226, 0.1);
        }
    `;
    
    document.head.appendChild(styleElement);
}

function showLoading(message = 'Chargement en cours...') {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingMessage = loadingScreen.querySelector('.loading-message');
    
    // Mettre à jour le message
    loadingMessage.textContent = message;
    
    // Réinitialiser la progression
    updateLoadingProgress(0);
    
    // Afficher l'écran
    loadingScreen.classList.add('active');
}

function hideLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Masquer progressivement
    loadingScreen.style.opacity = '0';
    
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        loadingScreen.style.opacity = '';
    }, 500);
}

function updateLoadingProgress(percentage) {
    const progressBar = document.querySelector('.loading-progress');
    const percentageElement = document.querySelector('.loading-percentage');
    
    // Limiter entre 0 et 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    
    // Mettre à jour la barre de progression
    progressBar.style.width = `${clampedPercentage}%`;
    
    // Mettre à jour le texte
    percentageElement.textContent = `${Math.round(clampedPercentage)}%`;
}

function simulateLoading(options = {}) {
    const defaults = {
        duration: 3000, // Durée totale en millisecondes
        message: 'Chargement en cours...',
        onComplete: () => {}
    };
    
    const settings = { ...defaults, ...options };
    
    // Afficher l'écran de chargement
    showLoading(settings.message);
    
    // Simuler une progression
    let progress = 0;
    const increment = 100 / (settings.duration / 50); // Mettre à jour toutes les 50ms
    
    const interval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            clearInterval(interval);
            updateLoadingProgress(100);
            
            // Masquer après un court délai
            setTimeout(() => {
                hideLoading();
                settings.onComplete();
            }, 300);
        } else {
            updateLoadingProgress(progress);
        }
    }, 50);
}

function setupRandomFacts() {
    // Liste de faits intéressants sur la musique
    const facts = [
        "La musique peut activer toutes les régions du cerveau, y compris celles impliquées dans les émotions.",
        "Écouter de la musique libère de la dopamine, l'hormone du bonheur.",
        "Les gens sont généralement plus productifs lorsqu'ils écoutent de la musique.",
        "La plus longue chanson enregistrée dure 13 heures et 23 minutes.",
        "Le cerveau humain traite le rythme même quand on n'entend pas de musique.",
        "Le vinyle connaît un regain de popularité avec une hausse des ventes de plus de 1000% depuis 2007.",
        "Spotify compte plus de 70 millions de chansons dans sa bibliothèque.",
        "Le genre musical que vous préférez à 14 ans tend à rester votre favori toute votre vie.",
        "La première musique jouée dans l'espace était 'Jingle Bells' en 1965.",
        "Jouer d'un instrument améliore les capacités cognitives et la mémoire.",
        "Les chats préfèrent la musique spécialement composée pour eux à la musique humaine.",
        "La 'chair de poule' que vous ressentez en écoutant de la musique est due à la libération de dopamine."
    ];
    
    const factElement = document.querySelector('.loading-fact');
    let currentFactIndex = 0;
    
    // Afficher le premier fait
    factElement.textContent = facts[0];
    factElement.classList.add('active');
    
    // Changer de fait toutes les quelques secondes
    setInterval(() => {
        // Masquer le fait actuel
        factElement.classList.remove('active');
        
        setTimeout(() => {
            // Passer au fait suivant
            currentFactIndex = (currentFactIndex + 1) % facts.length;
            factElement.textContent = facts[currentFactIndex];
            
            // Afficher le nouveau fait
            factElement.classList.add('active');
        }, 500);
    }, 5000);
}

function simulateInitialLoading() {
    // Simuler le chargement initial de l'application
    simulateLoading({
        duration: 3000,
        message: 'Chargement de votre expérience musicale...',
        onComplete: () => {
            // Afficher une notification de bienvenue après le chargement
            if (window.showNotification) {
                window.showNotification({
                    title: 'Prêt à écouter',
                    message: 'Votre plateforme musicale est prête !',
                    type: 'success'
                });
            }
        }
    });
}