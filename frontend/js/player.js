// Initialisation du lecteur de musique
function initPlayer() {
    console.log('Initialisation du lecteur de musique');
    
    // Récupérer les éléments du DOM
    const playButton = document.querySelector('.btn-play');
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    const shuffleButton = document.querySelector('.btn-shuffle');
    const repeatButton = document.querySelector('.btn-repeat');
    const likeButton = document.querySelector('.btn-like');
    const progressBar = document.querySelector('.progress-bar');
    const volumeSlider = document.querySelector('.volume-slider');
    
    // Ajouter des écouteurs d'événements
    playButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);
    shuffleButton.addEventListener('click', toggleShuffle);
    repeatButton.addEventListener('click', toggleRepeat);
    likeButton.addEventListener('click', toggleLike);
    progressBar.addEventListener('click', seekPosition);
    volumeSlider.addEventListener('click', changeVolume);
}

// Basculer entre lecture et pause
function togglePlay() {
    const playButton = document.querySelector('.btn-play i');
    const isPaused = playButton.classList.contains('fa-play');
    
    if (isPaused) {
        playButton.classList.remove('fa-play');
        playButton.classList.add('fa-pause');
        console.log('Lecture');
    } else {
        playButton.classList.remove('fa-pause');
        playButton.classList.add('fa-play');
        console.log('Pause');
    }
}

// Lecture du morceau précédent
function playPrevious() {
    console.log('Morceau précédent');
    alert('Morceau précédent - Fonctionnalité en développement');
}

// Lecture du morceau suivant
function playNext() {
    console.log('Morceau suivant');
    alert('Morceau suivant - Fonctionnalité en développement');
}

// Activer/désactiver la lecture aléatoire
function toggleShuffle() {
    const shuffleButton = document.querySelector('.btn-shuffle');
    shuffleButton.classList.toggle('active');
    
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.style.color = 'var(--accent-color)';
        console.log('Lecture aléatoire activée');
    } else {
        shuffleButton.style.color = '';
        console.log('Lecture aléatoire désactivée');
    }
}

// Activer/désactiver la répétition
function toggleRepeat() {
    const repeatButton = document.querySelector('.btn-repeat');
    repeatButton.classList.toggle('active');
    
    if (repeatButton.classList.contains('active')) {
        repeatButton.style.color = 'var(--accent-color)';
        console.log('Répétition activée');
    } else {
        repeatButton.style.color = '';
        console.log('Répétition désactivée');
    }
}

// Aimer/Ne plus aimer un morceau
function toggleLike() {
    const likeButton = document.querySelector('.btn-like i');
    const isLiked = likeButton.classList.contains('fas');
    
    if (isLiked) {
        likeButton.classList.remove('fas');
        likeButton.classList.add('far');
        console.log('Morceau retiré des favoris');
    } else {
        likeButton.classList.remove('far');
        likeButton.classList.add('fas');
        likeButton.style.color = '#ff4081';
        console.log('Morceau ajouté aux favoris');
        
        // Animation du cœur
        setTimeout(() => {
            if (likeButton.classList.contains('fas')) {
                likeButton.style.color = '';
            }
        }, 500);
    }
}

// Changer la position de lecture
function seekPosition(event) {
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const width = progressBar.clientWidth;
    const clickPosition = event.offsetX;
    
    const percentage = (clickPosition / width) * 100;
    progress.style.width = `${percentage}%`;
    
    // Mise à jour du temps
    updateTime(percentage);
    
    console.log(`Position de lecture: ${Math.round(percentage)}%`);
}

// Changer le volume
function changeVolume(event) {
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeProgress = document.querySelector('.volume-progress');
    const width = volumeSlider.clientWidth;
    const clickPosition = event.offsetX;
    
    const percentage = (clickPosition / width) * 100;
    volumeProgress.style.width = `${percentage}%`;
    
    // Mise à jour de l'icône du volume
    updateVolumeIcon(percentage);
    
    console.log(`Volume: ${Math.round(percentage)}%`);
}

// Mise à jour de l'icône du volume
function updateVolumeIcon(percentage) {
    const volumeIcon = document.querySelector('.volume-control i');
    
    if (percentage === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (percentage < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Mise à jour du temps affiché
function updateTime(percentage) {
    // Supposons que la durée totale est de 3:30 (210 secondes)
    const totalSeconds = 210;
    const currentSeconds = Math.round((percentage / 100) * totalSeconds);
    
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.querySelector('.time.current').textContent = formattedTime;
}

// Mise à jour de la barre de progression
function updateProgress(percentage) {
    document.querySelector('.progress').style.width = `${percentage}%`;
    updateTime(percentage);
}

export { initPlayer, updateProgress };