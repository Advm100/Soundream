// Dropdown de profil utilisateur
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter le dropdown de profil
    setupProfileDropdown();
    
    // Ajouter les styles nécessaires
    addProfileStyles();
    
    // Initialiser les interactions
    initProfileInteractions();
});

function setupProfileDropdown() {
    // Trouver le bouton de profil
    const profileButton = document.querySelector('.btn-profile');
    if (!profileButton) return;
    
    // Mettre à jour le style du bouton de profil
    profileButton.innerHTML = `
        <img src="https://via.placeholder.com/40x40" alt="Profile" class="profile-avatar">
    `;
    
    // Ajouter une classe pour le style
    profileButton.classList.add('profile-button');
    
    // Créer le dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown glass-effect';
    dropdown.style.cssText = `
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: 280px;
        border-radius: 10px;
        overflow: hidden;
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 1000;
    `;
    
    // Contenu du dropdown
    dropdown.innerHTML = `
        <div class="profile-header">
            <div class="profile-cover" style="background-image: linear-gradient(45deg, #9d4edd, #5e67ea);"></div>
            <div class="profile-info">
                <div class="profile-avatar-large">
                    <img src="https://via.placeholder.com/80x80" alt="Profile">
                </div>
                <div class="profile-name">John Doe</div>
                <div class="profile-email">john.doe@example.com</div>
            </div>
        </div>
        <div class="profile-stats">
            <div class="stat-item">
                <div class="stat-value">127</div>
                <div class="stat-label">Playlists</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">3,482</div>
                <div class="stat-label">Titres aimés</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">45</div>
                <div class="stat-label">Abonnés</div>
            </div>
        </div>
        <div class="profile-menu">
            <a href="#" class="profile-menu-item">
                <i class="fas fa-user"></i>
                <span>Mon profil</span>
            </a>
            <a href="#" class="profile-menu-item">
                <i class="fas fa-cog"></i>
                <span>Paramètres</span>
            </a>
            <a href="#" class="profile-menu-item">
                <i class="fas fa-crown"></i>
                <span>Upgrade Premium</span>
                <span class="badge">PRO</span>
            </a>
            <a href="#" class="profile-menu-item">
                <i class="fas fa-sign-out-alt"></i>
                <span>Déconnexion</span>
            </a>
        </div>
    `;
    
    // Ajouter le dropdown au document
    document.body.appendChild(dropdown);
    
    // Associer le dropdown au bouton de profil
    profileButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleProfileDropdown();
    });
    
    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && event.target !== profileButton) {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.pointerEvents = 'none';
        }
    });
    
    // Fonction pour afficher/masquer le dropdown
    function toggleProfileDropdown() {
        const isVisible = dropdown.style.opacity === '1';
        
        if (isVisible) {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.pointerEvents = 'none';
        } else {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
            dropdown.style.pointerEvents = 'auto';
            
            // Positionner le dropdown correctement
            const buttonRect = profileButton.getBoundingClientRect();
            dropdown.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
            dropdown.style.right = `${window.innerWidth - buttonRect.right - window.scrollX}px`;
        }
    }
}

function addProfileStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Styles pour le dropdown de profil */
        .profile-button {
            overflow: hidden;
            padding: 0 !important;
        }
        
        .profile-avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
        
        .profile-header {
            position: relative;
            padding-top: 60px;
            margin-bottom: 70px;
        }
        
        .profile-cover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 80px;
        }
        
        .profile-info {
            position: relative;
            text-align: center;
        }
        
        .profile-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto;
            border: 3px solid var(--background-light);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .profile-avatar-large img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .profile-name {
            font-size: 1.2rem;
            font-weight: bold;
            margin-top: 10px;
            color: var(--text-primary);
        }
        
        .profile-email {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-top: 5px;
        }
        
        .profile-stats {
            display: flex;
            justify-content: space-around;
            padding: 0 20px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 1.1rem;
            font-weight: bold;
            color: var(--accent-color);
        }
        
        .stat-label {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 5px;
        }
        
        .profile-menu {
            padding: 15px 0;
        }
        
        .profile-menu-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: var(--text-primary);
            text-decoration: none;
            transition: background-color 0.3s;
        }
        
        .profile-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        .profile-menu-item i {
            width: 20px;
            margin-right: 15px;
            color: var(--text-secondary);
        }
        
        .profile-menu-item .badge {
            margin-left: auto;
            background: var(--accent-gradient);
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.7rem;
            font-weight: bold;
        }
        
        /* Adaptation pour le thème clair */
        body.light-theme .profile-dropdown {
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
        }
        
        body.light-theme .profile-menu-item:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }
        
        body.light-theme .profile-menu {
            border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
    `;
    
    document.head.appendChild(styleElement);
}

function initProfileInteractions() {
    // Ajouter des interactions aux éléments du menu
    setTimeout(() => {
        const menuItems = document.querySelectorAll('.profile-menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                
                const action = item.textContent.trim();
                
                // Simuler des actions pour la démo
                if (action.includes('Déconnexion')) {
                    alert('Déconnexion simulée - Dans une vraie application, vous seriez redirigé vers la page de connexion.');
                } else if (action.includes('Paramètres')) {
                    alert('Page de paramètres - En développement');
                } else if (action.includes('Premium')) {
                    alert('Page d\'abonnement Premium - En développement');
                } else if (action.includes('Mon profil')) {
                    alert('Page de profil - En développement');
                }
            });
        });
    }, 1000); // Délai pour s'assurer que les éléments sont bien présents dans le DOM
}