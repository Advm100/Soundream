// Optimisations pour les appareils mobiles
document.addEventListener('DOMContentLoaded', function() {
    // Détecter si l'appareil est mobile
    const isMobile = checkMobile();
    
    // Appliquer les optimisations en fonction du type d'appareil
    if (isMobile) {
        applyMobileOptimizations();
    }
    
    // Gérer le redimensionnement pour le responsive
    window.addEventListener('resize', handleResize);
    
    // Initialiser l'état en fonction de la taille actuelle
    handleResize();
});

// Vérifier si l'appareil est mobile
function checkMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth < 768;
}

// Appliquer les optimisations spécifiques pour mobiles
function applyMobileOptimizations() {
    // Ajouter une classe au body pour cibler les styles spécifiques au mobile
    document.body.classList.add('mobile-device');
    
    // Optimiser les animations (réduire ou désactiver certaines animations)
    optimizeAnimations();
    
    // Ajuster les gestionnaires d'événements pour le tactile
    setupTouchInteractions();
    
    // Ajuster la mise en page pour les écrans étroits
    adjustLayoutForMobile();
    
    // Ajouter les styles spécifiques au mobile
    addMobileStyles();
}

// Optimiser les animations pour les appareils à faible puissance
function optimizeAnimations() {
    // Réduire les animations gourmandes en ressources
    const style = document.createElement('style');
    style.textContent = `
        .mobile-device .audio-waves span {
            animation-duration: 2s !important; /* Ralentir les animations */
        }
        
        .mobile-device .spinning {
            animation-duration: 20s !important; /* Ralentir les rotations */
        }
        
        .mobile-device .particle {
            /* Réduire le nombre ou la complexité des effets de particules */
            opacity: 0.5 !important;
        }
        
        /* Désactiver certaines animations trop lourdes */
        .mobile-device .wave-path {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Réduire le nombre de particules
    const particles = document.querySelectorAll('.particle');
    if (particles.length > 20) {
        // Garder seulement un nombre limité de particules
        for (let i = 20; i < particles.length; i++) {
            if (particles[i].parentNode) {
                particles[i].parentNode.removeChild(particles[i]);
            }
        }
    }
}

// Configurer les interactions tactiles
function setupTouchInteractions() {
    // Remplacer les événements hover par des événements touch
    document.querySelectorAll('.music-card, .category-card, .playlist-card, .artist-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
            // Simuler un clic après un délai très court
            setTimeout(() => {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                this.dispatchEvent(clickEvent);
            }, 10);
        });
    });
    
    // Ajuster le comportement de défilement
    setupSmoothScrolling();
}

// Configurer le défilement fluide pour mobile
function setupSmoothScrolling() {
    // Sélectionner tous les éléments qui peuvent défiler horizontalement
    const scrollContainers = document.querySelectorAll('.artist-carousel');
    
    scrollContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchend', () => {
            isDown = false;
        });
        
        container.addEventListener('touchcancel', () => {
            isDown = false;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Vitesse de défilement
            container.scrollLeft = scrollLeft - walk;
        });
    });
}

// Ajuster la mise en page pour les écrans étroits
function adjustLayoutForMobile() {
    // Ajuster le header pour mobile
    const header = document.querySelector('header');
    const searchBar = document.querySelector('.search-bar');
    
    if (header && searchBar) {
        // Créer un bouton de recherche pour remplacer la barre
        const searchButton = document.createElement('button');
        searchButton.className = 'mobile-search-btn';
        searchButton.innerHTML = '<i class="fas fa-search"></i>';
        
        // Ajouter un gestionnaire d'événements
        searchButton.addEventListener('click', toggleMobileSearch);
        
        // Remplacer la barre de recherche par le bouton
        searchBar.style.display = 'none';
        header.querySelector('.user-controls').prepend(searchButton);
        
        // Créer un champ de recherche extensible
        const expandableSearch = document.createElement('div');
        expandableSearch.className = 'expandable-search';
        expandableSearch.innerHTML = `
            <input type="text" placeholder="Rechercher...">
            <button class="close-search"><i class="fas fa-times"></i></button>
        `;
        expandableSearch.style.display = 'none';
        
        // Ajouter le champ de recherche après le header
        document.body.insertBefore(expandableSearch, header.nextSibling);
        
        // Configurer le bouton de fermeture
        expandableSearch.querySelector('.close-search').addEventListener('click', () => {
            expandableSearch.style.display = 'none';
        });
    }
    
    // Ajuster le player pour mobile
    const player = document.querySelector('.music-player');
    if (player) {
        // Simplifier l'affichage du player sur mobile
        const additionalControls = player.querySelector('.additional-controls');
        if (additionalControls) {
            additionalControls.style.display = 'none';
        }
        
        // Réduire la largeur de certains éléments
        const nowPlaying = player.querySelector('.now-playing');
        if (nowPlaying) {
            nowPlaying.style.maxWidth = '40%';
        }
    }
}

// Ajouter les styles spécifiques pour mobile
function addMobileStyles() {
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        /* Styles spécifiques pour les appareils mobiles */
        .mobile-device main {
            padding: 20px 15px !important;
        }
        
        .mobile-device header {
            padding: 15px !important;
        }
        
        .mobile-device .hero {
            flex-direction: column !important;
            height: auto !important;
            padding: 20px 0 !important;
        }
        
        .mobile-device .hero-content,
        .mobile-device .hero-visual {
            width: 100% !important;
        }
        
        .mobile-device .hero h1 {
            font-size: 2rem !important;
        }
        
        .mobile-device .album-cover {
            width: 200px !important;
            height: 200px !important;
        }
        
        .mobile-device .music-grid,
        .mobile-device .category-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
            gap: 15px !important;
        }
        
        .mobile-device .music-player {
            padding: 10px 15px !important;
        }
        
        .mobile-device .player-controls {
            gap: 15px !important;
        }
        
        .mobile-device .progress-container {
            margin: 0 10px !important;
        }
        
        /* Bouton de recherche mobile */
        .mobile-search-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
        }
        
        /* Champ de recherche extensible */
        .expandable-search {
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background-color: var(--background-light);
            padding: 15px;
            z-index: 99;
            display: flex;
            align-items: center;
            animation: slideDown 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .expandable-search input {
            flex: 1;
            background-color: var(--background-dark);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 15px;
            border-radius: 20px;
            color: var(--text-primary);
        }
        
        .close-search {
            background: none;
            border: none;
            color: var(--text-secondary);
            margin-left: 10px;
            cursor: pointer;
        }
        
        /* Classe pour les éléments activés au toucher */
        .touch-active {
            transform: scale(0.98) !important;
            opacity: 0.9 !important;
            transition: transform 0.2s ease, opacity 0.2s ease !important;
        }
        
        /* Masquer certains éléments en mode portrait */
        @media (max-width: 576px) {
            .mobile-device .time,
            .mobile-device .btn-shuffle, 
            .mobile-device .btn-repeat {
                display: none !important;
            }
        }
        
        /* Menu burger pour mobile */
        .mobile-device .burger-menu {
            display: block !important;
        }
        
        .mobile-device nav {
            position: fixed;
            top: 0;
            left: -100%;
            width: 70%;
            height: 100%;
            background-color: var(--background-light);
            z-index: 1000;
            transition: left 0.3s ease;
            padding-top: 70px;
        }
        
        .mobile-device nav.open {
            left: 0;
        }
        
        .mobile-device nav ul {
            flex-direction: column;
            gap: 0;
        }
        
        .mobile-device nav a {
            display: block;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .burger-menu {
            display: none;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1001;
        }
    `;
    
    document.head.appendChild(mobileStyles);
    
    // Ajouter le bouton de menu burger si on est sur mobile
    if (checkMobile()) {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        if (header && nav) {
            // Créer le bouton de menu
            const burgerButton = document.createElement('button');
            burgerButton.className = 'burger-menu';
            burgerButton.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Ajouter au début du header
            header.insertBefore(burgerButton, header.firstChild);
            
            // Configurer le gestionnaire d'événements
            burgerButton.addEventListener('click', toggleNav);
            
            // Ajouter un overlay pour fermer le menu
            const navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            navOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(navOverlay);
            
            // Fermer le menu en cliquant sur l'overlay
            navOverlay.addEventListener('click', toggleNav);
            
            // Fonction pour ouvrir/fermer le menu
            function toggleNav() {
                const isOpen = nav.classList.contains('open');
                
                if (isOpen) {
                    nav.classList.remove('open');
                    navOverlay.style.opacity = '0';
                    setTimeout(() => {
                        navOverlay.style.display = 'none';
                    }, 300);
                } else {
                    nav.classList.add('open');
                    navOverlay.style.display = 'block';
                    setTimeout(() => {
                        navOverlay.style.opacity = '1';
                    }, 10);
                }
            }
        }
    }
}

// Gérer le toggle de la recherche mobile
function toggleMobileSearch() {
    const expandableSearch = document.querySelector('.expandable-search');
    if (expandableSearch) {
        const isVisible = expandableSearch.style.display === 'flex';
        
        if (isVisible) {
            expandableSearch.style.display = 'none';
        } else {
            expandableSearch.style.display = 'flex';
            expandableSearch.querySelector('input').focus();
        }
    }
}

// Gérer les changements de taille d'écran
function handleResize() {
    const isMobile = window.innerWidth < 768;
    
    // Appliquer ou supprimer la classe mobile-device en fonction de la taille
    if (isMobile) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
        
        // Réinitialiser les éléments qui ont pu être modifiés
        resetMobileChanges();
    }
}

// Réinitialiser les changements spécifiques au mobile
function resetMobileChanges() {
    // Restaurer la barre de recherche
    const searchBar = document.querySelector('.search-bar');
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    const expandableSearch = document.querySelector('.expandable-search');
    
    if (searchBar) searchBar.style.display = '';
    if (mobileSearchBtn && mobileSearchBtn.parentNode) mobileSearchBtn.parentNode.removeChild(mobileSearchBtn);
    if (expandableSearch) expandableSearch.style.display = 'none';
    
    // Restaurer la navigation
    const nav = document.querySelector('nav');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (nav) nav.classList.remove('open');
    if (navOverlay) navOverlay.style.display = 'none';
    
    // Restaurer les contrôles additionnels du player
    const additionalControls = document.querySelector('.additional-controls');
    const nowPlaying = document.querySelector('.now-playing');
    
    if (additionalControls) additionalControls.style.display = '';
    if (nowPlaying) nowPlaying.style.maxWidth = '';
}