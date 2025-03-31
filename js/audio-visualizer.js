// Visualisateur audio avancé pour le player
document.addEventListener('DOMContentLoaded', function() {
    // Créer le conteneur du visualisateur
    setupVisualizer();
    
    // Animation du visualisateur
    animateVisualizer();
    
    // Mise à jour du visualisateur lors des changements d'état du lecteur
    setupPlayerEvents();
});

function setupVisualizer() {
    // Créer le conteneur principal
    const visualizerContainer = document.createElement('div');
    visualizerContainer.className = 'audio-visualizer-container';
    visualizerContainer.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease;
        background: linear-gradient(to top, rgba(10, 10, 14, 0.8), transparent);
    `;
    
    // Créer le visualisateur en forme de barres
    const barsVisualizer = document.createElement('div');
    barsVisualizer.className = 'bars-visualizer';
    barsVisualizer.style.cssText = `
        display: flex;
        align-items: flex-end;
        height: 50px;
        width: 70%;
        max-width: 700px;
        padding: 0 10px;
    `;
    
    // Créer les barres
    const barCount = 64;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        
        const initialHeight = Math.random() * 100;
        const hue = 271 - (Math.random() * 30); // Varier entre violet et bleu
        
        bar.style.cssText = `
            flex: 1;
            height: ${initialHeight}%;
            background: linear-gradient(to top, 
                            hsl(${hue}, 70%, 60%), 
                            hsl(${hue - 30}, 70%, 70%));
            margin: 0 1px;
            border-radius: 2px 2px 0 0;
            transform-origin: bottom;
            transform: scaleY(0.1);
            opacity: 0.7;
            transition: transform 0.1s ease, background 0.3s ease;
            box-shadow: 0 0 5px rgba(157, 78, 221, 0.3);
        `;
        
        barsVisualizer.appendChild(bar);
    }
    
    // Créer le visualisateur circulaire
    const circleVisualizer = document.createElement('div');
    circleVisualizer.className = 'circle-visualizer';
    circleVisualizer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: rgba(157, 78, 221, 0.1);
        display: none;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 20px rgba(157, 78, 221, 0.2);
    `;
    
    // Créer les cercles concentriques
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'visualizer-circle';
        
        circle.style.cssText = `
            position: absolute;
            border-radius: 50%;
            border: 2px solid rgba(157, 78, 221, ${0.3 + i * 0.2});
            width: ${100 - i * 25}%;
            height: ${100 - i * 25}%;
            opacity: 0.7;
            transition: transform 0.2s ease, opacity 0.2s ease;
        `;
        
        circleVisualizer.appendChild(circle);
    }
    
    // Créer le visualisateur d'onde
    const waveVisualizer = document.createElement('div');
    waveVisualizer.className = 'wave-visualizer';
    waveVisualizer.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    `;
    
    // Créer le SVG pour l'onde
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
    `;
    
    // Créer le path pour l'onde
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute('d', 'M0,20 Q50,0 100,20 T200,20 T300,20 T400,20 T500,20 T600,20 T700,20 T800,20 T900,20 T1000,20 T1100,20 T1200,20 T1300,20 T1400,20 T1500,20');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#gradient)');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('class', 'wave-path');
    
    // Créer un dégradé
    const defs = document.createElementNS(svgNS, "defs");
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#9d4edd');
    
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#5e67ea');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    svg.appendChild(path);
    waveVisualizer.appendChild(svg);
    
    // Ajouter les visualisateurs au conteneur
    visualizerContainer.appendChild(barsVisualizer);
    visualizerContainer.appendChild(circleVisualizer);
    visualizerContainer.appendChild(waveVisualizer);
    
    // Ajouter le conteneur au player
    const musicPlayer = document.querySelector('.music-player');
    if (musicPlayer) {
        musicPlayer.style.position = 'relative';
        musicPlayer.prepend(visualizerContainer);
    }
    
    // Ajouter un bouton pour changer le type de visualisateur
    const visualizerToggle = document.createElement('button');
    visualizerToggle.className = 'visualizer-toggle';
    visualizerToggle.innerHTML = '<i class="fas fa-chart-line"></i>';
    visualizerToggle.style.cssText = `
        position: absolute;
        top: -30px;
        right: 15px;
        background: rgba(22, 22, 30, 0.7);
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.3s ease;
        opacity: 0;
        z-index: 10;
    `;
    
    visualizerContainer.appendChild(visualizerToggle);
    
    // Ajouter un gestionnaire d'événements pour le bouton
    visualizerToggle.addEventListener('click', () => {
        const currentType = visualizerContainer.getAttribute('data-type') || 'bars';
        let newType;
        
        if (currentType === 'bars') {
            newType = 'wave';
            barsVisualizer.style.display = 'none';
            circleVisualizer.style.display = 'none';
            waveVisualizer.style.display = 'flex';
        } else if (currentType === 'wave') {
            newType = 'circle';
            barsVisualizer.style.display = 'none';
            circleVisualizer.style.display = 'flex';
            waveVisualizer.style.display = 'none';
        } else {
            newType = 'bars';
            barsVisualizer.style.display = 'flex';
            circleVisualizer.style.display = 'none';
            waveVisualizer.style.display = 'none';
        }
        
        visualizerContainer.setAttribute('data-type', newType);
    });
    
    // Définir le type par défaut
    visualizerContainer.setAttribute('data-type', 'bars');
    
    // Ajouter les styles CSS nécessaires
    const visualizerStyle = document.createElement('style');
    visualizerStyle.textContent = `
        .music-player:hover .audio-visualizer-container.active .visualizer-toggle {
            opacity: 1;
        }
        
        .visualizer-toggle:hover {
            color: var(--accent-color);
            transform: rotate(45deg);
        }
        
        @keyframes wave-animation {
            0% { d: 'M0,20 Q50,0 100,20 T200,20 T300,20 T400,20 T500,20 T600,20 T700,20 T800,20 T900,20 T1000,20 T1100,20 T1200,20 T1300,20 T1400,20 T1500,20'; }
            50% { d: 'M0,20 Q50,40 100,20 T200,0 T300,20 T400,40 T500,20 T600,0 T700,20 T800,40 T900,20 T1000,0 T1100,20 T1200,40 T1300,20 T1400,0 T1500,20'; }
            100% { d: 'M0,20 Q50,0 100,20 T200,20 T300,20 T400,20 T500,20 T600,20 T700,20 T800,20 T900,20 T1000,20 T1100,20 T1200,20 T1300,20 T1400,20 T1500,20'; }
        }
        
        .wave-path {
            animation: wave-animation 10s ease-in-out infinite;
        }
    `;
    document.head.appendChild(visualizerStyle);
}

function animateVisualizer() {
    // Animer les barres du visualisateur
    const bars = document.querySelectorAll('.visualizer-bar');
    const circles = document.querySelectorAll('.visualizer-circle');
    const wavePath = document.querySelector('.wave-path');
    const visualizerContainer = document.querySelector('.audio-visualizer-container');
    
    if (!visualizerContainer) return;
    
    const isPaused = document.querySelector('.btn-play i').classList.contains('fa-play');
    const isActive = visualizerContainer.classList.contains('active');
    const currentType = visualizerContainer.getAttribute('data-type') || 'bars';
    
    if (!isPaused && isActive) {
        // Animer en fonction du type de visualisateur
        if (currentType === 'bars') {
            bars.forEach(bar => {
                const scaleY = Math.random() * 0.9 + 0.1; // Valeur entre 0.1 et 1
                bar.style.transform = `scaleY(${scaleY})`;
                
                // Couleur basée sur la hauteur
                const hue = 271 - (scaleY * 40); // Varier entre violet et bleu
                bar.style.background = `linear-gradient(to top, hsl(${hue}, 70%, 60%), hsl(${hue - 30}, 70%, 70%))`;
                
                // Luminosité de l'ombre basée sur la hauteur
                const shadowIntensity = Math.floor(scaleY * 10);
                bar.style.boxShadow = `0 0 ${shadowIntensity}px rgba(157, 78, 221, ${scaleY * 0.5})`;
            });
        } else if (currentType === 'circle') {
            circles.forEach((circle, index) => {
                const scale = 0.8 + Math.random() * 0.4; // Valeur entre 0.8 et 1.2
                circle.style.transform = `scale(${scale})`;
                
                // Opacité basée sur l'échelle
                const opacity = 0.3 + scale * 0.3;
                circle.style.opacity = opacity;
                
                // Luminosité de l'ombre
                circle.style.boxShadow = `0 0 ${Math.floor(scale * 15)}px rgba(157, 78, 221, ${scale * 0.4})`;
            });
        } else if (currentType === 'wave') {
            // L'animation de l'onde est gérée par CSS via wave-animation
            const animator = wavePath.getAnimations()[0];
            if (animator && animator.playState === 'paused') {
                animator.play();
            }
            
            // Ajuster la vitesse d'animation en fonction du tempo (simplifié ici)
            wavePath.style.animationDuration = `${Math.random() * 2 + 8}s`;
        }
    } else if (currentType === 'wave' && wavePath) {
        // Mettre en pause l'animation de l'onde si la lecture est en pause
        const animator = wavePath.getAnimations()[0];
        if (animator && animator.playState === 'running') {
            animator.pause();
        }
    }
    
    // Continuer l'animation
    requestAnimationFrame(animateVisualizer);
}

function setupPlayerEvents() {
    // Récupérer les éléments nécessaires
    const playButton = document.querySelector('.btn-play');
    const visualizerContainer = document.querySelector('.audio-visualizer-container');
    
    if (!playButton || !visualizerContainer) return;
    
    // Gérer le clic sur le bouton play/pause
    playButton.addEventListener('click', () => {
        const isPaused = playButton.querySelector('i').classList.contains('fa-play');
        
        if (!isPaused) {
            // Lecture en pause
            visualizerContainer.classList.remove('active');
        } else {
            // Lecture active
            visualizerContainer.classList.add('active');
            
            // Effet de démarrage
            const bars = document.querySelectorAll('.visualizer-bar');
            bars.forEach(bar => {
                bar.classList.add('pulse');
                setTimeout(() => {
                    bar.classList.remove('pulse');
                }, 1000);
            });
        }
    });
    
    // Fonction pour mettre à jour le visualisateur lors de la lecture d'une chanson
    window.updateVisualizerOnPlay = function() {
        visualizerContainer.classList.add('active');
        visualizerContainer.style.opacity = '1';
        
        // Effet de démarrage
        const currentType = visualizerContainer.getAttribute('data-type');
        
        if (currentType === 'bars') {
            const bars = document.querySelectorAll('.visualizer-bar');
            
            // Animation de démarrage synchronisée
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transform = 'scaleY(0.8)';
                    bar.style.transition = 'transform 0.3s ease';
                    
                    setTimeout(() => {
                        bar.style.transition = 'transform 0.1s ease';
                    }, 300);
                }, index * 10);
            });
        } else if (currentType === 'circle') {
            const circles = document.querySelectorAll('.visualizer-circle');
            
            // Animation de battement de cœur
            circles.forEach((circle, index) => {
                circle.style.transform = 'scale(1.2)';
                circle.style.opacity = '1';
                
                setTimeout(() => {
                    circle.style.transform = 'scale(1)';
                    circle.style.opacity = '0.7';
                }, 300 + index * 100);
            });
        }
    };
}