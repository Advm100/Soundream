// Initialisation des animations
function initAnimations() {
    console.log('Initialisation des animations');
    
    // Animation du titre de la page d'accueil
    animateHeroTitle();
    
    // Animation des ondes audio
    animateAudioWaves();
    
    // Animation des cartes lors du chargement
    animateCardsOnLoad();
    
    // Observer les éléments qui doivent être animés au défilement
    initScrollAnimations();
}

// Animation du titre de la page d'accueil
function animateHeroTitle() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    // Animation déjà gérée par CSS, mais on peut ajouter des effets supplémentaires
    setTimeout(() => {
        const span = heroTitle.querySelector('span');
        if (span) {
            span.classList.add('floating');
        }
    }, 1500); // Attendre que l'animation de révélation soit terminée
}

// Animation des ondes audio
function animateAudioWaves() {
    const waves = document.querySelectorAll('.audio-waves span');
    if (waves.length === 0) return;
    
    // Animation déjà gérée par CSS
}

// Animation des cartes lors du chargement
function animateCardsOnLoad() {
    // Cette fonction sera appelée une fois que les données seront chargées
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const cards = document.querySelectorAll('.music-card, .category-card');
            
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100); // Délai progressif pour chaque carte
            });
        }, 300);
    });
}

// Initialisation des animations au défilement
function initScrollAnimations() {
    // Créer un observateur d'intersection pour détecter quand les éléments entrent dans la vue
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Arrêter d'observer une fois animé
            }
        });
    }, {
        root: null, // Viewport
        threshold: 0.1, // Déclencher quand 10% de l'élément est visible
        rootMargin: '0px 0px -50px 0px' // Déclencher un peu avant que l'élément soit visible
    });
    
    // Observer les sections et leurs titres
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const title = section.querySelector('h2');
        if (title) {
            observer.observe(title);
        }
    });
}

// Animation de changement de couleur en fonction du temps
function pulseBackgroundColor() {
    const body = document.body;
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const baseColor = computedStyle.getPropertyValue('--background-dark').trim();
    
    // Convertir la couleur hexadécimale en valeurs RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Créer une légère variation de la couleur
    const pulseAmount = 10; // Intensité de la pulsation
    
    let direction = 1;
    let currentPulse = 0;
    
    setInterval(() => {
        currentPulse += direction;
        
        if (currentPulse >= pulseAmount || currentPulse <= 0) {
            direction *= -1;
        }
        
        const newR = Math.max(0, Math.min(255, r + currentPulse));
        const newG = Math.max(0, Math.min(255, g + currentPulse));
        const newB = Math.max(0, Math.min(255, b + currentPulse));
        
        body.style.backgroundColor = `rgb(${newR}, ${newG}, ${newB})`;
    }, 100);
}

// Effet de particules flottantes (à activer si désiré)
function createParticleEffect() {
    const container = document.querySelector('.hero');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Style de base des particules
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.backgroundColor = 'var(--accent-color)';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0.6';
        particle.style.pointerEvents = 'none';
        
        // Position aléatoire
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animation
        particle.style.animation = `float ${3 + Math.random() * 4}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

export { initAnimations };