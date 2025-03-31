// JavaScript pour la page des playlists

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page des playlists chargée');
    
    // Sélectionner les éléments DOM
    const createPlaylistButton = document.querySelector('.btn-create-playlist');
    const createPlaylistCard = document.querySelector('.create-playlist');
    const modal = document.querySelector('.modal-create-playlist');
    const closeButton = document.querySelector('.btn-close-modal');
    const cancelButton = document.querySelector('.btn-cancel');
    const createButton = document.querySelector('.btn-create');
    const playButtons = document.querySelectorAll('.btn-play-playlist');
    
    // Ouvrir la modal depuis le bouton ou la carte
    createPlaylistButton.addEventListener('click', openModal);
    createPlaylistCard.addEventListener('click', openModal);
    
    // Fermer la modal
    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    
    // Créer une nouvelle playlist
    createButton.addEventListener('click', createNewPlaylist);
    
    // Lecture des playlists
    playButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêcher la propagation au parent
            const playlistCard = button.closest('.playlist-card');
            playPlaylist(playlistCard);
        });
    });
    
    // Fermer la modal si on clique en dehors
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Initialiser l'aperçu d'image
    initImagePreview();
});

// Ouvrir la modal de création de playlist
function openModal() {
    const modal = document.querySelector('.modal-create-playlist');
    modal.style.display = 'flex';
    
    // Animation d'entrée
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(-20px)';
    modalContent.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Focus sur le champ de nom
    setTimeout(() => {
        document.getElementById('playlist-name').focus();
    }, 300);
}

// Fermer la modal
function closeModal() {
    const modal = document.querySelector('.modal-create-playlist');
    const modalContent = modal.querySelector('.modal-content');
    
    // Animation de sortie
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        // Réinitialiser le formulaire
        document.getElementById('playlist-name').value = '';
        document.getElementById('playlist-description').value = '';
        const preview = document.querySelector('.upload-preview');
        preview.innerHTML = '<i class="fas fa-music"></i>';
    }, 300);
}

// Créer une nouvelle playlist
function createNewPlaylist() {
    const playlistName = document.getElementById('playlist-name').value.trim();
    const playlistDescription = document.getElementById('playlist-description').value.trim();
    
    if (!playlistName) {
        // Animer le champ pour signaler l'erreur
        const nameInput = document.getElementById('playlist-name');
        nameInput.style.borderColor = 'red';
        nameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            nameInput.style.borderColor = '';
            nameInput.style.animation = '';
        }, 500);
        return;
    }
    
    // Simuler la création d'une playlist (dans une vraie application, envoyer à l'API)
    console.log(`Création de la playlist "${playlistName}"`);
    console.log(`Description: ${playlistDescription || 'Aucune description'}`);
    
    // Montrer une notification de succès
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>Playlist "${playlistName}" créée avec succès!</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Afficher puis cacher la notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Fermer la modal
    closeModal();
    
    // Dans une vraie application, recharger les playlists ou ajouter dynamiquement une nouvelle carte
    // Pour la démo, nous allons simplement recharger la page après un court délai
    setTimeout(() => {
        alert('Dans une vraie application, une nouvelle carte de playlist serait ajoutée ici sans recharger la page.');
    }, 500);
}

// Jouer une playlist
function playPlaylist(playlistCard) {
    const playlistName = playlistCard.querySelector('h3').textContent;
    console.log(`Lecture de la playlist "${playlistName}"`);
    
    // Simuler le chargement et la lecture
    const playButton = playlistCard.querySelector('.btn-play-playlist i');
    playButton.className = 'fas fa-spinner fa-spin';
    
    setTimeout(() => {
        playButton.className = 'fas fa-play';
        
        // Changer l'état du lecteur
        const playerPlayButton = document.querySelector('.music-player .btn-play i');
        playerPlayButton.className = 'fas fa-pause';
        
        // Mettre à jour les informations du morceau
        document.querySelector('.music-player .song-info h3').textContent = 'Titre de la playlist';
        document.querySelector('.music-player .song-info p').textContent = playlistName;
        
        // Simuler une progression
        const progress = document.querySelector('.music-player .progress');
        progress.style.width = '0%';
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += 0.5;
                progress.style.width = width + '%';
            }
        }, 100);
    }, 1000);
}

// Initialiser l'aperçu d'image
function initImagePreview() {
    const uploadButton = document.querySelector('.btn-upload');
    
    uploadButton.addEventListener('click', () => {
        // Simuler le choix d'un fichier (normalement, un input file serait utilisé)
        console.log('Sélection d\'une image');
        
        // Simuler une image sélectionnée
        setTimeout(() => {
            const preview = document.querySelector('.upload-preview');
            preview.innerHTML = '<img src="https://via.placeholder.com/100/121212/9d4edd?text=Cover" alt="Cover Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">';
        }, 500);
    });
}

// Ajouter une animation de secouement pour les erreurs de validation
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--accent-color);
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    z-index: 2100;
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s, transform 0.3s;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification i {
    font-size: 1.2rem;
}
`;
document.head.appendChild(style);