// Animations au défilement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Créer l'observateur d'intersection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si l'élément est visible
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Décharger l'observateur après l'animation (optionnel)
                if (!entry.target.classList.contains('keep-observing')) {
                    observer.unobserve(entry.target);
                }
            } else {
                // Si l'élément n'est plus visible et a besoin d'être réanimé
                if (entry.target.classList.contains('keep-observing')) {
                    entry.target.classList.remove('animate-in');
                }
            }
        });
    }, {
        root: null, // Utiliser la viewport comme conteneur
        threshold: 0.15, // Déclencher quand 15% de l'élément est visible
        rootMargin: '0px 0px -50px 0px' // Déclencher légèrement avant que l'élément soit visible
    });
    
    // Sélectionner tous les éléments à animer
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        observer.observe(element);
        
        // Ajouter une classe initiale pour l'état avant animation
        element.classList.add('animate-init');
    });
    
    // Animer les sections au défilement
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
        
        // Ajouter une classe initiale pour l'état avant animation
        section.classList.add('section-init');
    });
    
    // Animer les cartes individuellement
    const cards = document.querySelectorAll('.music-card, .category-card, .playlist-card, .artist-card');
    cards.forEach((card, index) => {
        // Ajouter un délai progressif pour l'effet en cascade
        card.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(card);
        
        // Ajouter une classe initiale pour l'état avant animation
        card.classList.add('card-init');
    });
});

// Ajouter les styles CSS nécessaires
const scrollAnimationsStyle = document.createElement('style');
scrollAnimationsStyle.textContent = `
    /* États initiaux des animations */
    .animate-init {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-init {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.7s ease, transform 0.7s ease;
    }
    
    .card-init {
        opacity: 0;
        transform: translateY(25px);
        transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    /* États finaux après animation */
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Animation d'entrée de gauche */
    .from-left {
        transform: translateX(-50px) !important;
    }
    
    /* Animation d'entrée de droite */
    .from-right {
        transform: translateX(50px) !important;
    }
    
    /* Animation de zoom */
    .zoom-in {
        transform: scale(0.8) !important;
    }
    
    /* Animation de rotation */
    .rotate-in {
        transform: rotate(-5deg) scale(0.9) !important;
    }
`;
document.head.appendChild(scrollAnimationsStyle);