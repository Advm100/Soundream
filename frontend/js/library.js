// JavaScript pour la page de bibliothèque

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page de bibliothèque chargée');
    
    // Sélectionner les éléments du DOM
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    const songRows = document.querySelectorAll('.song-row');
    const playAllButton = document.querySelector('.btn-play-all');
    const sortButton = document.querySelector('.btn-sort');
    
    // Ajouter des écouteurs d'événements pour les éléments de la barre latérale
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Retirer la classe active de tous les éléments
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Ajouter la classe active à l'élément cliqué
            item.classList.add('active');
            
            // Changer le contenu en fonction de l'élément sélectionné
            changeLibraryContent(item.textContent.trim());
        });
    });
    
    // Ajouter des écouteurs d'événements pour les rangées de chansons
    songRows.forEach(row => {
        row.addEventListener('click', () => {
            playSong(row);
        });
        
        // Animation au survol pour mettre en évidence la ligne
        row.addEventListener('mouseenter', () => {
            // Changer la couleur du numéro en bouton de lecture
            const numberCell = row.querySelector('.column-number');
            numberCell.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        row.addEventListener('mouseleave', () => {
            // Remettre le numéro
            const numberCell = row.querySelector('.column-number');
            const index = Array.from(songRows).indexOf(row) + 1;
            numberCell.textContent = index;
        });
    });
    
    // Lecture de toutes les chansons
    playAllButton.addEventListener('click', () => {
        playAllSongs();
    });
    
    // Tri des chansons
    sortButton.addEventListener('click', () => {
        showSortOptions();
    });
});

// Changer le contenu de la bibliothèque
function changeLibraryContent(category) {
    const contentHeader = document.querySelector('.content-header h2');
    contentHeader.textContent = category;
    
    // Dans une vraie application, on chargerait les données correspondant à la catégorie
    console.log(`Chargement de la catégorie: ${category}`);
    
    // Simuler un chargement pour la démo
    const tableBody = document.querySelector('.table-body');
    tableBody.innerHTML = '<div class="loading">Chargement...</div>';
    
    setTimeout(() => {
        // Restaurer les rangées par défaut pour la démo
        tableBody.innerHTML = '';
        
        // Contenu différent selon la catégorie sélectionnée
        if (category === 'Titres aimés') {
            createSampleSongs(tableBody, 5);
        } else if (category === 'Récemment écoutés') {
            createSampleSongs(tableBody, 3, 'recent');
        } else if (category === 'Téléchargements') {
            createSampleSongs(tableBody, 2, 'downloaded');
        } else if (category === 'Favoris') {
            createSampleSongs(tableBody, 4, 'favorite');
        } else if (category.includes('playlist')) {
            createSampleSongs(tableBody, 6, 'playlist');
        } else {
            tableBody.innerHTML = '<div class="empty-state">Aucun contenu disponible pour cette catégorie</div>';
        }
        
        // Réinitialiser les écouteurs d'événements pour les nouvelles rangées
        const newRows = document.querySelectorAll('.song-row');
        newRows.forEach((row, index) => {
            row.addEventListener('click', () => {
                playSong(row);
            });
            
            row.addEventListener('mouseenter', () => {
                const numberCell = row.querySelector('.column-number');
                numberCell.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            row.addEventListener('mouseleave', () => {
                const numberCell = row.querySelector('.column-number');
                numberCell.textContent = index + 1;
            });
        });
    }, 800);
}

// Créer des chansons d'exemple pour la démo
function createSampleSongs(container, count, type = 'liked') {
    const songs = [
        { title: "Midnight Serenade", artist: "Luna Eclipse", album: "Lunar Phase", date: "Aujourd'hui", duration: "3:30" },
        { title: "Dark Dreams", artist: "Shadow Pulse", album: "Nightfall", date: "Hier", duration: "4:15" },
        { title: "Neon Nights", artist: "Cyber Wave", album: "Electric Dreams", date: "Il y a 3 jours", duration: "3:05" },
        { title: "Eternal Echo", artist: "Mystic Mind", album: "Reflections", date: "25 mars", duration: "4:42" },
        { title: "Electric Soul", artist: "Voltage Vibe", album: "Current", date: "22 mars", duration: "3:52" },
        { title: "Astral Journey", artist: "Cosmic Drift", album: "Starlight", date: "20 mars", duration: "5:10" }
    ];
    
    // Filtrer ou modifier les chansons selon le type
    let filteredSongs = [];
    
    if (type === 'recent') {
        filteredSongs = songs.slice(0, count).map(song => ({
            ...song,
            date: ["Il y a 1 heure", "Il y a 3 heures", "Hier"][Math.floor(Math.random() * 3)]
        }));
    } else if (type === 'downloaded') {
        filteredSongs = songs.slice(count - 2, count).map(song => ({
            ...song,
            date: "Téléchargé"
        }));
    } else if (type === 'favorite') {
        filteredSongs = songs.slice(1, count + 1);
    } else if (type === 'playlist') {
        filteredSongs = [...songs.slice(2, 4), ...songs.slice(0, count - 2)];
    } else {
        filteredSongs = songs.slice(0, count);
    }
    
    // Créer les rangées
    filteredSongs.forEach((song, index) => {
        const row = document.createElement('div');
        row.className = 'song-row';
        row.innerHTML = `
            <div class="column-number">${index + 1}</div>
            <div class="column-title">
                <div class="song-info-cell">
                    <div class="song-thumbnail"></div>
                    <div class="song-details">
                        <div class="song-name">${song.title}</div>
                    </div>
                </div>
            </div>
            <div class="column-artist">${song.artist}</div>
            <div class="column-album">${song.album}</div>
            <div class="column-date">${song.date}</div>
            <div class="column-duration">${song.duration}</div>
        `;
        
        container.appendChild(row);
    });
}

// Jouer une chanson
function playSong(row) {
    // Récupérer les informations de la chanson
    const title = row.querySelector('.song-name').textContent;
    const artist = row.querySelector('.column-artist').textContent;
    
    console.log(`Lecture de "${title}" par ${artist}`);
    
    // Mettre en évidence la rangée sélectionnée
    const allRows = document.querySelectorAll('.song-row');
    allRows.forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row');
    
    // Mettre à jour l'interface du lecteur
    document.querySelector('.song-info h3').textContent = title;
    document.querySelector('.song-info p').textContent = artist;
    
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

// Jouer toutes les chansons
function playAllSongs() {
    console.log('Lecture de toutes les chansons');
    
    // Simuler la lecture de la première chanson
    const firstRow = document.querySelector('.song-row');
    if (firstRow) {
        playSong(firstRow);
    }
}

// Afficher les options de tri
function showSortOptions() {
    // Créer un menu déroulant de tri
    const sortMenu = document.createElement('div');
    sortMenu.className = 'sort-menu';
    sortMenu.innerHTML = `
        <div class="sort-option" data-sort="title">Titre</div>
        <div class="sort-option" data-sort="artist">Artiste</div>
        <div class="sort-option" data-sort="album">Album</div>
        <div class="sort-option" data-sort="date">Date d'ajout</div>
        <div class="sort-option" data-sort="duration">Durée</div>
    `;
    
    // Positionner le menu près du bouton de tri
    const sortButton = document.querySelector('.btn-sort');
    const rect = sortButton.getBoundingClientRect();
    
    sortMenu.style.position = 'absolute';
    sortMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
    sortMenu.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(sortMenu);
    
    // Animation d'entrée
    sortMenu.style.opacity = '0';
    sortMenu.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        sortMenu.style.opacity = '1';
        sortMenu.style.transform = 'translateY(0)';
    }, 10);
    
    // Ajouter des écouteurs d'événements aux options
    const sortOptions = sortMenu.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', () => {
            const sortBy = option.dataset.sort;
            sortSongs(sortBy);
            sortMenu.remove();
        });
    });
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function closeMenu(e) {
        if (!sortMenu.contains(e.target) && e.target !== sortButton) {
            sortMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Trier les chansons
function sortSongs(sortBy) {
    console.log(`Tri par ${sortBy}`);
    
    const tableBody = document.querySelector('.table-body');
    const rows = Array.from(tableBody.querySelectorAll('.song-row'));
    
    // Trier les rangées
    rows.sort((a, b) => {
        let valueA, valueB;
        
        if (sortBy === 'title') {
            valueA = a.querySelector('.song-name').textContent;
            valueB = b.querySelector('.song-name').textContent;
        } else if (sortBy === 'artist') {
            valueA = a.querySelector('.column-artist').textContent;
            valueB = b.querySelector('.column-artist').textContent;
        } else if (sortBy === 'album') {
            valueA = a.querySelector('.column-album').textContent;
            valueB = b.querySelector('.column-album').textContent;
        } else if (sortBy === 'duration') {
            // Convertir la durée en secondes pour le tri
            valueA = convertDurationToSeconds(a.querySelector('.column-duration').textContent);
            valueB = convertDurationToSeconds(b.querySelector('.column-duration').textContent);
            return valueA - valueB;
        } else {
            // Par défaut, trier par titre
            valueA = a.querySelector('.song-name').textContent;
            valueB = b.querySelector('.song-name').textContent;
        }
        
        return valueA.localeCompare(valueB);
    });
    
    // Vider et reconstruire le tableau
    tableBody.innerHTML = '';
    rows.forEach((row, index) => {
        // Mettre à jour le numéro
        row.querySelector('.column-number').textContent = index + 1;
        tableBody.appendChild(row);
    });
    
    // Réinitialiser les écouteurs d'événements pour les rangées triées
    const sortedRows = tableBody.querySelectorAll('.song-row');
    sortedRows.forEach((row, index) => {
        row.addEventListener('click', () => {
            playSong(row);
        });
        
        row.addEventListener('mouseenter', () => {
            const numberCell = row.querySelector('.column-number');
            numberCell.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        row.addEventListener('mouseleave', () => {
            const numberCell = row.querySelector('.column-number');
            numberCell.textContent = index + 1;
        });
    });
}

// Convertir une durée en format MM:SS en secondes
function convertDurationToSeconds(duration) {
    const parts = duration.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Ajouter des styles pour le menu de tri et les états des rangées
const style = document.createElement('style');
style.textContent = `
    .sort-menu {
        background-color: var(--background-light);
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        z-index: 100;
        width: 150px;
        transition: opacity 0.3s, transform 0.3s;
    }
    
    .sort-option {
        padding: 10px 15px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .sort-option:hover {
        background-color: var(--card-hover);
    }
    
    .active-row {
        background-color: rgba(157, 78, 221, 0.1) !important;
    }
    
    .loading, .empty-state {
        padding: 20px;
        text-align: center;
        color: var(--text-secondary);
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);