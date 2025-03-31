// Système de changement de thème (mode sombre/clair)
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les styles des thèmes
    addThemeStyles();
    
    // Créer le bouton de changement de thème
    createThemeToggle();
    
    // Initialiser le thème en fonction des préférences
    initTheme();
});

function addThemeStyles() {
    const themeStyle = document.createElement('style');
    themeStyle.id = 'theme-styles';
    
    themeStyle.textContent = `
        /* Variables du thème sombre (défaut) */
        :root {
            --background-dark: #0a0a0e;
            --background-light: #16161e;
            --accent-color: #9d4edd;
            --accent-color-hover: #b15eff;
            --accent-gradient: linear-gradient(45deg, #9d4edd 0%, #5e67ea 100%);
            --text-primary: #ffffff;
            --text-secondary: #b3b3b3;
            --card-bg: #181822;
            --card-hover: #22222e;
            --card-border: 1px solid rgba(255, 255, 255, 0.03);
            --glow-effect: 0 0 20px rgba(157, 78, 221, 0.3);
            
            /* Transition pour les changements de thème */
            transition: all 0.5s ease;
        }
        
        /* Variables du thème clair */
        body.light-theme {
            --background-dark: #f5f5f7;
            --background-light: #ffffff;
            --accent-color: #8a2be2;
            --accent-color-hover: #7217c5;
            --accent-gradient: linear-gradient(45deg, #8a2be2 0%, #4e5aca 100%);
            --text-primary: #333333;
            --text-secondary: #666666;
            --card-bg: #ffffff;
            --card-hover: #f0f0f5;
            --card-border: 1px solid rgba(0, 0, 0, 0.05);
            --glow-effect: 0 0 20px rgba(138, 43, 226, 0.2);
        }
        
        /* Adaptations spécifiques pour le thème clair */
        body.light-theme .music-player {
            background: rgba(245, 245, 247, 0.9) !important;
            box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05) !important;
        }
        
        body.light-theme header {
            background: rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
        }
        
        body.light-theme .audio-visualizer-container {
            background: linear-gradient(to top, rgba(245, 245, 247, 0.8), transparent) !important;
        }
        
        body.light-theme .btn-play {
            color: white !important;
        }
        
        /* Inversion des icônes pour meilleure visibilité */
        body.light-theme .fa-moon {
            display: none;
        }
        
        body.light-theme .fa-sun {
            display: inline-block;
        }
        
        body:not(.light-theme) .fa-moon {
            display: inline-block;
        }
        
        body:not(.light-theme) .fa-sun {
            display: none;
        }
        
        /* Animation de transition de thème */
        .theme-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.5s ease;
            opacity: 0;
            background: var(--accent-gradient);
            mix-blend-mode: overlay;
        }
        
        .theme-transition-overlay.active {
            opacity: 0.3;
        }
    `;
    
    document.head.appendChild(themeStyle);
}

function createThemeToggle() {
    // Créer le bouton de changement de thème
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <i class="fas fa-moon"></i>
        <i class="fas fa-sun"></i>
    `;
    
    // Styliser le bouton
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--accent-gradient);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    `;
    
    // Ajouter des effets de survol
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'scale(1.1)';
        themeToggle.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'scale(1)';
        themeToggle.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    });
    
    // Ajouter le bouton au document
    document.body.appendChild(themeToggle);
    
    // Créer l'overlay de transition
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);
    
    // Ajouter le gestionnaire d'événements pour le changement de thème
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    // Activer l'overlay de transition
    const overlay = document.querySelector('.theme-transition-overlay');
    overlay.classList.add('active');
    
    // Changer le thème après un court délai
    setTimeout(() => {
        document.body.classList.toggle('light-theme');
        
        // Enregistrer la préférence dans localStorage
        const isLightTheme = document.body.classList.contains('light-theme');
        localStorage.setItem('nightflow-theme', isLightTheme ? 'light' : 'dark');
        
        // Désactiver l'overlay progressivement
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 300);
    }, 200);
    
    // Animation du bouton
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.style.transform = 'rotate(180deg)';
    
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 500);
}

function initTheme() {
    // Vérifier les préférences enregistrées
    const savedTheme = localStorage.getItem('nightflow-theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (!savedTheme) {
        // Si aucune préférence n'est enregistrée, vérifier les préférences système
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (!prefersDarkScheme) {
            document.body.classList.add('light-theme');
        }
    }
}