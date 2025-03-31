// Transitions entre les pages
document.addEventListener('DOMContentLoaded', function() {
    // Ajout des styles pour les transitions
    const transitionStyle = document.createElement('style');
    transitionStyle.textContent = `
        /* Animation de transition de page */
        body.page-transition-out main {
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        body.page-transition-in main {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.5s ease forwards 0.1s;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Overlay de transition */
        .page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 14, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .page-transition-overlay.active {
            opacity: 1;
            pointer-events: all;
        }
        
        /* Animation de loader pour les transitions */
        .page-loader {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .page-loader.active {
            opacity: 1;
        }
        
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(157, 78, 221, 0.3);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .loader-text {
            margin-top: 15px;
            color: white;
            font-weight: 500;
        }
    `;
    document.head.appendChild(transitionStyle);
    
    // Créer l'overlay de transition
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    // Créer le loader
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <div class="loader-text">Chargement...</div>
    `;
    document.body.appendChild(loader);
    
    // Intercepter les clics sur les liens de navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Si ce n'est pas un lien externe
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                
                const targetUrl = this.href;
                const currentPage = window.location.href;
                
                // Ne pas faire de transition si on clique sur la page active
                if (targetUrl === currentPage) {
                    return;
                }
                
                // Animer la sortie
                document.body.classList.add('page-transition-out');
                overlay.classList.add('active');
                loader.classList.add('active');
                
                // Attendre la fin de l'animation puis charger la nouvelle page
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });
    
    // Animer l'entrée quand la page a fini de charger
    window.addEventListener('load', () => {
        document.body.classList.add('page-transition-in');
        
        // Masquer le loader et l'overlay progressivement
        setTimeout(() => {
            loader.classList.remove('active');
            overlay.classList.remove('active');
        }, 300);
    });
});