// Effet de particules en arrière-plan
document.addEventListener('DOMContentLoaded', function() {
    // Créer l'élément de particules
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-bg';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    `;
    document.body.prepend(particlesContainer);
    
    // Créer les particules
    createParticles(50);
    
    // Détecter le mouvement de la souris pour réagir aux mouvements
    document.addEventListener('mousemove', throttle(handleMouseMove, 50));
});

function createParticles(count) {
    const container = document.getElementById('particles-bg');
    const containerRect = container.getBoundingClientRect();
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        
        // Taille aléatoire
        const size = Math.random() * 3 + 1;
        
        // Couleur avec opacité aléatoire
        const opacity = Math.random() * 0.3 + 0.1;
        const hue = Math.random() > 0.5 ? '271' : '250'; // Violet ou bleu
        
        // Style de base
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: hsla(${hue}, 70%, 60%, ${opacity});
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            box-shadow: 0 0 ${size * 3}px hsla(${hue}, 70%, 60%, ${opacity});
        `;
        
        // Position initiale aléatoire
        const x = Math.random() * containerRect.width;
        const y = Math.random() * containerRect.height;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Vitesse aléatoire
        particle.dataset.vx = (Math.random() - 0.5) * 0.3;
        particle.dataset.vy = (Math.random() - 0.5) * 0.3;
        
        // Ajouter la particule au conteneur
        container.appendChild(particle);
    }
    
    // Animer les particules
    animateParticles();
}

function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    const containerRect = document.getElementById('particles-bg').getBoundingClientRect();
    
    // Mettre à jour chaque particule
    particles.forEach(particle => {
        // Position actuelle
        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        
        // Vitesse actuelle
        let vx = parseFloat(particle.dataset.vx);
        let vy = parseFloat(particle.dataset.vy);
        
        // Mettre à jour la position
        x += vx;
        y += vy;
        
        // Rebonds sur les bords
        if (x <= 0 || x >= containerRect.width) {
            particle.dataset.vx = -vx;
            x = Math.max(0, Math.min(x, containerRect.width));
        }
        
        if (y <= 0 || y >= containerRect.height) {
            particle.dataset.vy = -vy;
            y = Math.max(0, Math.min(y, containerRect.height));
        }
        
        // Appliquer la nouvelle position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
    });
    
    // Continuer l'animation
    requestAnimationFrame(animateParticles);
}

// Réagir au mouvement de la souris
function handleMouseMove(e) {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    particles.forEach(particle => {
        // Position de la particule
        const particleX = parseFloat(particle.style.left);
        const particleY = parseFloat(particle.style.top);
        
        // Calculer la distance
        const dx = mouseX - particleX;
        const dy = mouseY - particleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Influencer les particules proches
        if (distance < 150) {
            // Calculer un facteur d'influence inversement proportionnel à la distance
            const factor = 0.5 * (1 - distance / 150);
            
            // Mettre à jour les vitesses
            const vx = parseFloat(particle.dataset.vx) - dx * factor * 0.01;
            const vy = parseFloat(particle.dataset.vy) - dy * factor * 0.01;
            
            // Limiter la vitesse maximale
            const maxSpeed = 2;
            const speed = Math.sqrt(vx * vx + vy * vy);
            
            if (speed > maxSpeed) {
                const ratio = maxSpeed / speed;
                particle.dataset.vx = vx * ratio;
                particle.dataset.vy = vy * ratio;
            } else {
                particle.dataset.vx = vx;
                particle.dataset.vy = vy;
            }
        }
    });
}

// Fonction pour limiter le nombre d'appels (throttle)
function throttle(callback, delay) {
    let previousCall = new Date().getTime();
    return function() {
        const time = new Date().getTime();
        
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}