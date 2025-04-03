// JavaScript pour la page d'exploration

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page d\'exploration chargée');
    
    // Simuler le chargement des musiques
    loadExploreMusic();
    
    // Ajouter des écouteurs d'événements pour les onglets de genre
    const genreTabs = document.querySelectorAll('.genre-tab');
    genreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            genreTabs.forEach(t => t.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            tab.classList.add('active');
            
            // Filtrer les musiques par genre
            filterMusicByGenre(tab.textContent.trim());
        });
    });
    
    // Gestion du carousel d'artistes
    initArtistCarousel();
    
    // Gestion des cartes d'ambiance
    const moodCards = document.querySelectorAll('.mood-card');
    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            const mood = card.querySelector('h3').textContent;
            alert(`Sélection de l'ambiance: ${mood} - Fonctionnalité en développement`);
        });
    });
});

// Charger les musiques pour la page d'exploration
function loadExploreMusic() {
    // Simuler un chargement avec délai
    const musicGrid = document.querySelector('.music-grid');
    
    // Afficher un indicateur de chargement
    musicGrid.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Chargement des titres...</p>
        </div>
    `;
    
    // Simuler un délai de chargement
    setTimeout(() => {
        musicGrid.innerHTML = ''; // Vider la grille
        
        // Données de démo
        const demoMusic = [
            { title: "Midnight Serenade", artist: "Luna Eclipse", genre: "Électronique", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Dark Dreams", artist: "Shadow Pulse", genre: "Lo-Fi", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Smooth Jazz", artist: "Night Quartet", genre: "Jazz", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Soul Groove", artist: "Rhythm Collective", genre: "R&B", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Chill Vibes", artist: "Ambient Flow", genre: "Ambient", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Night City", artist: "Cyber Wave", genre: "Électronique", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Rainy Day", artist: "Lo-Fi Dreamers", genre: "Lo-Fi", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
            { title: "Blue Note", artist: "Jazz Ensemble", genre: "Jazz", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" }
        ];
        
        // Ajouter les cartes à la grille
        demoMusic.forEach(item => {
            const card = document.createElement('div');
            card.className = 'music-card';
            card.dataset.genre = item.genre;
            card.innerHTML = `
                <div class="cover">
                    <img src="${item.coverUrl}" alt="${item.title}">
                </div>
                <div class="info">
                    <div class="title">${item.title}</div>
                    <div class="artist">${item.artist}</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                playMusic(item);
            });
            
            musicGrid.appendChild(card);
        });
        
        // Animer l'apparition des cartes
        animateCardEntrance();
        
    }, 1000);
}

// Filtrer les musiques par genre
function filterMusicByGenre(genre) {
    const cards = document.querySelectorAll('.music-card');
    
    // Si "Tous" est sélectionné, montrer toutes les cartes
    if (genre === 'Tous') {
        cards.forEach(card => {
            card.style.display = 'block';
            // Ajouter une animation de fade-in
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        });
        return;
    }
    
    // Sinon, filtrer par genre
    cards.forEach(card => {
        if (card.dataset.genre === genre) {
            card.style.display = 'block';
            // Ajouter une animation de fade-in
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Ajouter une animation de fade-out
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Initialiser le carousel d'artistes
function initArtistCarousel() {
    const carousel = document.querySelector('.artist-carousel');
    let isDragging = false;
    let startPosition = 0;
    let scrollLeft = 0;
    
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPosition = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    carousel.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startPosition) * 2; // Vitesse de défilement
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Ajouter le clic sur les cartes d'artistes
    const artistCards = document.querySelectorAll('.artist-card');
    artistCards.forEach(card => {
        card.addEventListener('click', () => {
            const artistName = card.querySelector('h3').textContent;
            alert(`Artiste sélectionné: ${artistName} - Page d'artiste en développement`);
        });
    });
}

// Animer l'apparition des cartes
function animateCardEntrance() {
    const cards = document.querySelectorAll('.music-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 100); // Délai progressif
    });
}

// Lecture de musique (fonction démo)
function playMusic(musicItem) {
    console.log(`Lecture de "${musicItem.title}" par ${musicItem.artist}`);
    
    // Mettre à jour l'interface du lecteur
    document.querySelector('.song-info h3').textContent = musicItem.title;
    document.querySelector('.song-info p').textContent = musicItem.artist;
    
    // Changer l'icône play en pause
    const playButton = document.querySelector('.btn-play i');
    playButton.classList.remove('fa-play');
    playButton.classList.add('fa-pause');
    
    // Réinitialiser la progression
    const progress = document.querySelector('.progress');
    progress.style.width = '0%';
    
    // Simuler la progression de la musique
    let width = 0;
    const progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
            // Remettre l'icône play
            playButton.classList.remove('fa-pause');
            playButton.classList.add('fa-play');
        } else {
            width += 0.5;
            progress.style.width = width + '%';
        }
    }, 100); // Simulation accélérée pour la démo
}

// Ajouter des styles pour le chargement
const style = document.createElement('style');
style.textContent = `
    .loading-indicator {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        grid-column: 1 / -1;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(157, 78, 221, 0.3);
        border-radius: 50%;
        border-top-color: var(--accent-color);
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);