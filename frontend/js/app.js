import { initPlayer, updateProgress } from './player.js';
import { initAnimations } from './animations.js';
import { fetchMusic, fetchCategories } from './api.js';

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('NightFlow Music - Application initialisée');
    
    // Initialiser le lecteur de musique
    initPlayer();
    
    // Initialiser les animations
    initAnimations();
    
    // Simuler le chargement des données
    loadMusicData();
    loadCategoryData();
    
    // Ajouter des écouteurs d'événements
    document.querySelector('.btn-primary').addEventListener('click', startListening);
});

// Charger les données musicales
async function loadMusicData() {
    try {
        const musicData = await fetchMusic();
        renderMusicGrid(musicData);
    } catch (error) {
        console.error('Erreur lors du chargement des données musicales:', error);
        // Utiliser des données de démonstration en cas d'erreur
        renderMusicGrid(getDemoMusicData());
    }
}

// Charger les données des catégories
async function loadCategoryData() {
    try {
        const categoryData = await fetchCategories();
        renderCategoryGrid(categoryData);
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Utiliser des données de démonstration en cas d'erreur
        renderCategoryGrid(getDemoCategoryData());
    }
}

// Rendu de la grille de musique
function renderMusicGrid(musicData) {
    const grid = document.querySelector('.music-grid');
    grid.innerHTML = '';
    
    musicData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
            <div class="cover">
                <img src="${item.coverUrl || 'assets/img/default-cover.jpg'}" alt="${item.title}">
            </div>
            <div class="info">
                <div class="title">${item.title}</div>
                <div class="artist">${item.artist}</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            playMusic(item);
        });
        
        grid.appendChild(card);
    });
}

// Rendu de la grille de catégories
function renderCategoryGrid(categoryData) {
    const grid = document.querySelector('.category-grid');
    grid.innerHTML = '';
    
    categoryData.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.style.backgroundImage = `url(${category.imageUrl || 'assets/img/default-category.jpg'})`;
        card.innerHTML = `<h3>${category.name}</h3>`;
        
        card.addEventListener('click', () => {
            navigateToCategory(category);
        });
        
        grid.appendChild(card);
    });
}

// Démarrer l'écoute (fonction démo)
function startListening() {
    console.log('Démarrage de l\'écoute');
    // Simuler la lecture de la première chanson
    const demoMusic = getDemoMusicData()[0];
    playMusic(demoMusic);
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
    updateProgress(0);
    
    // Simuler la progression de la musique
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        if (progress <= 100) {
            updateProgress(progress);
        } else {
            clearInterval(progressInterval);
            // Remettre l'icône play
            playButton.classList.remove('fa-pause');
            playButton.classList.add('fa-play');
        }
    }, 300); // Simulation accélérée pour la démo
}

// Navigation vers une catégorie (fonction démo)
function navigateToCategory(category) {
    console.log(`Navigation vers la catégorie: ${category.name}`);
    alert(`Catégorie: ${category.name} - Fonctionnalité en développement`);
}

// Données de démonstration pour la musique
function getDemoMusicData() {
    return [
        { id: 1, title: "Midnight Serenade", artist: "Luna Eclipse", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
        { id: 2, title: "Dark Dreams", artist: "Shadow Pulse", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
        { id: 3, title: "Neon Nights", artist: "Cyber Wave", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
        { id: 4, title: "Eternal Echo", artist: "Mystic Mind", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
        { id: 5, title: "Electric Soul", artist: "Voltage Vibe", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" },
        { id: 6, title: "Astral Journey", artist: "Cosmic Drift", coverUrl: "https://via.placeholder.com/200/121212/9d4edd?text=♫" }
    ];
}

// Données de démonstration pour les catégories
function getDemoCategoryData() {
    return [
        { id: 1, name: "Électronique", imageUrl: "https://via.placeholder.com/400/121212/9d4edd?text=Électronique" },
        { id: 2, name: "Jazz", imageUrl: "https://via.placeholder.com/400/121212/9d4edd?text=Jazz" },
        { id: 3, name: "Lo-Fi", imageUrl: "https://via.placeholder.com/400/121212/9d4edd?text=Lo-Fi" },
        { id: 4, name: "R&B", imageUrl: "https://via.placeholder.com/400/121212/9d4edd?text=R&B" }
    ];
}

export { renderMusicGrid, renderCategoryGrid };