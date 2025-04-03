// js/audio-visualizer.js
document.addEventListener('DOMContentLoaded', function() {
    // Visualizer elements and context
    let canvas, ctx;
    let analyser = null;
    let dataArray = null;
    let animationFrame = null;
    let visualizerType = 'bars'; // 'bars', 'waves', 'circle'
    let visualizerTheme = 'gradient'; // 'gradient', 'solid', 'spectrum'
    let isPlaying = false;
    
    // Initialize the visualizer
    function initVisualizer() {
        // Create canvas element
        canvas = document.createElement('canvas');
        canvas.className = 'audio-visualizer-canvas';
        canvas.width = window.innerWidth;
        canvas.height = 120;
        
        // Style the canvas
        canvas.style.position = 'absolute';
        canvas.style.bottom = '100%';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '120px';
        canvas.style.zIndex = '5';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.5s ease';
        
        // Add canvas to the player
        const player = document.querySelector('.music-player');
        if (player) {
            player.style.position = 'relative';
            player.prepend(canvas);
        }
        
        // Get the canvas context
        ctx = canvas.getContext('2d');
        
        // Create visualizer controls
        createVisualizerControls();
        
        // Set up resize listener
        window.addEventListener('resize', handleResize);
    }
    
    // Create visualizer type and theme controls
    function createVisualizerControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'visualizer-controls';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 100%;
            right: 15px;
            display: flex;
            gap: 10px;
            z-index: 10;
            padding: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Type buttons
        const typeButtons = [
            { id: 'bars', icon: 'fa-bars' },
            { id: 'waves', icon: 'fa-wave-square' },
            { id: 'circle', icon: 'fa-circle' }
        ];
        
        typeButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `visualizer-btn type-${btn.id}`;
            button.innerHTML = `<i class="fas ${btn.icon}"></i>`;
            button.title = `${btn.id.charAt(0).toUpperCase() + btn.id.slice(1)} Visualizer`;
            button.dataset.type = btn.id;
            
            // Style the button
            button.style.cssText = `
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: none;
                background-color: rgba(20, 20, 30, 0.8);
                color: var(--text-secondary);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            // Add active state for current visualizer type
            if (btn.id === visualizerType) {
                button.style.backgroundColor = 'var(--accent-color)';
                button.style.color = 'white';
            }
            
            button.addEventListener('click', () => {
                visualizerType = btn.id;
                
                // Update button styles
                document.querySelectorAll('.visualizer-btn[data-type]').forEach(btn => {
                    btn.style.backgroundColor = 'rgba(20, 20, 30, 0.8)';
                    btn.style.color = 'var(--text-secondary)';
                });
                
                button.style.backgroundColor = 'var(--accent-color)';
                button.style.color = 'white';
            });
            
            controlsContainer.appendChild(button);
        });
        
        // Add control container to the player
        const player = document.querySelector('.music-player');
        if (player) {
            player.appendChild(controlsContainer);
            
            // Show controls on player hover
            player.addEventListener('mouseenter', () => {
                if (canvas.style.opacity > 0) {
                    controlsContainer.style.opacity = '1';
                }
            });
            
            player.addEventListener('mouseleave', () => {
                controlsContainer.style.opacity = '0';
            });
        }
    }
    
    // Handle window resize
    function handleResize() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = 120;
        }
    }
    
    // Initialize audio context and analyzer
    function setupAudioAnalyzer() {
        // Check if the Web Audio API is available
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.error('Web Audio API is not supported in this browser');
            return false;
        }
        
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            // Create analyzer node
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Power of 2, between 32 and 2048
            
            // Set up buffer
            const bufferLength = analyser.frequencyBinCount; // Half of fftSize
            dataArray = new Uint8Array(bufferLength);
            
            // For demo/testing purposes, we'll create a mock audio source
            // In a real implementation, you would connect to audio element or media stream
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
            
            // Connect oscillator to analyzer and analyzer to destination
            oscillator.connect(analyser);
            analyser.connect(audioContext.destination);
            
            // Start the oscillator (for real app, you'd control this with play/pause)
            // oscillator.start();
            
            return true;
        } catch (error) {
            console.error('Error setting up audio analyzer:', error);
            return false;
        }
    }
    
    // Drawing functions for different visualizer types
    function drawBars() {
        // For demo, generate random data if no real audio data
        if (!analyser) {
            dataArray = generateRandomData(128);
        } else {
            analyser.getByteFrequencyData(dataArray);
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barCount = dataArray.length;
        const barWidth = (canvas.width / barCount) * 0.8;
        const barSpacing = (canvas.width / barCount) * 0.2;
        const maxBarHeight = canvas.height * 0.9;
        
        // Draw each bar
        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i];
            const percent = value / 255;
            const barHeight = percent * maxBarHeight;
            
            const x = i * (barWidth + barSpacing);
            const y = canvas.height - barHeight;
            
            // Set color based on theme
            if (visualizerTheme === 'gradient') {
                const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
                gradient.addColorStop(0, 'rgba(157, 78, 221, 0.8)');
                gradient.addColorStop(1, 'rgba(94, 103, 234, 0.4)');
                ctx.fillStyle = gradient;
            } else if (visualizerTheme === 'spectrum') {
                const hue = (i / barCount) * 260 + 240;
                ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
            } else {
                ctx.fillStyle = 'rgba(157, 78, 221, 0.7)';
            }
            
            // Draw bar with rounded corners
            roundedRect(ctx, x, y, barWidth, barHeight, 2);
            
            // Add glow effect for high-energy frequencies
            if (percent > 0.5) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(157, 78, 221, 0.7)';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }
    
    function drawWaves() {
        // For demo, generate random data if no real audio data
        if (!analyser) {
            dataArray = generateRandomData(128);
        } else {
            analyser.getByteFrequencyData(dataArray);
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const sliceWidth = canvas.width / dataArray.length;
        const center = canvas.height / 2;
        
        // Set line style
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Top wave (mirrored on bottom)
        ctx.beginPath();
        ctx.moveTo(0, center);
        
        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const y = center - (value * center * 0.8);
            const x = i * sliceWidth;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Set color based on theme
            if (visualizerTheme === 'gradient') {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                gradient.addColorStop(0, 'rgba(157, 78, 221, 0.8)');
                gradient.addColorStop(0.5, 'rgba(94, 103, 234, 0.8)');
                gradient.addColorStop(1, 'rgba(157, 78, 221, 0.8)');
                ctx.strokeStyle = gradient;
            } else if (visualizerTheme === 'spectrum') {
                // Gradient will be applied after the path is complete
                ctx.strokeStyle = 'rgba(157, 78, 221, 0.8)';
            } else {
                ctx.strokeStyle = 'rgba(157, 78, 221, 0.8)';
            }
        }
        
        // Add glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(157, 78, 221, 0.5)';
        ctx.stroke();
        
        // Bottom wave (mirror of top)
        ctx.beginPath();
        ctx.moveTo(0, center);
        
        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const y = center + (value * center * 0.8);
            const x = i * sliceWidth;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    function drawCircle() {
        // For demo, generate random data if no real audio data
        if (!analyser) {
            dataArray = generateRandomData(64);
        } else {
            analyser.getByteFrequencyData(dataArray);
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.4;
        const maxBarHeight = baseRadius * 0.8;
        const numBars = dataArray.length;
        const angleStep = (2 * Math.PI) / numBars;
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.3, 0, 2 * Math.PI);
        
        if (visualizerTheme === 'gradient') {
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, baseRadius * 0.3
            );
            gradient.addColorStop(0, 'rgba(94, 103, 234, 0.6)');
            gradient.addColorStop(1, 'rgba(157, 78, 221, 0.4)');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = 'rgba(157, 78, 221, 0.4)';
        }
        
        ctx.fill();
        
        // Draw bars around the circle
        for (let i = 0; i < numBars; i++) {
            const value = dataArray[i] / 255;
            const barHeight = value * maxBarHeight;
            
            // Calculate position
            const angle = i * angleStep - Math.PI / 2; // Start from top
            const x1 = centerX + Math.cos(angle) * baseRadius;
            const y1 = centerY + Math.sin(angle) * baseRadius;
            const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
            const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);
            
            // Set color based on theme
            if (visualizerTheme === 'gradient') {
                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, 'rgba(157, 78, 221, 0.2)');
                gradient.addColorStop(1, 'rgba(157, 78, 221, 0.8)');
                ctx.strokeStyle = gradient;
            } else if (visualizerTheme === 'spectrum') {
                const hue = (i / numBars) * 260 + 240;
                ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${value})`;
            } else {
                ctx.strokeStyle = `rgba(157, 78, 221, ${value})`;
            }
            
            // Draw line
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            // Add glow for high frequencies
            if (value > 0.5) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(157, 78, 221, 0.7)';
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.stroke();
        }
    }
    
    // Helper function for rounded rectangles
    function roundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    // Generate random data for demonstration
    function generateRandomData(size) {
        const arr = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            // Create pattern that somewhat resembles audio frequencies
            // (higher in the lower-mid range, falling off at the high end)
            const position = i / size;
            let value;
            
            if (position < 0.1) {
                value = 80 + Math.random() * 40; // Bass frequencies
            } else if (position < 0.3) {
                value = 150 + Math.random() * 60; // Low-mid frequencies
            } else if (position < 0.6) {
                value = 100 + Math.random() * 50; // Mid frequencies
            } else {
                value = 40 + Math.random() * 40; // High frequencies
            }
            
            // Add some dynamic feel to the data
            if (isPlaying) {
                value += Math.sin(Date.now() * 0.003 + i * 0.15) * 20;
                value += Math.random() * 30 - 15;
            } else {
                value = value * 0.3;
            }
            
            arr[i] = Math.max(0, Math.min(255, Math.floor(value)));
        }
        return arr;
    }
    
    // Animation loop
    function animate() {
        animationFrame = requestAnimationFrame(animate);
        
        switch (visualizerType) {
            case 'bars':
                drawBars();
                break;
            case 'waves':
                drawWaves();
                break;
            case 'circle':
                drawCircle();
                break;
            default:
                drawBars();
        }
    }
    
    // Start visualizer
    function startVisualizer() {
        if (!canvas || !ctx) {
            initVisualizer();
        }
        
        // Show the canvas
        canvas.style.opacity = '1';
        
        // Show the controls
        document.querySelector('.visualizer-controls')?.style.opacity = '1';
        
        // Flag that playback is active
        isPlaying = true;
        
        // Set up audio analyzer if available
        if (!analyser) {
            setupAudioAnalyzer();
        }
        
        // Start animation
        if (!animationFrame) {
            animate();
        }
    }
    
    // Stop visualizer
    function stopVisualizer() {
        // Hide the canvas
        if (canvas) {
            canvas.style.opacity = '0';
        }
        
        // Hide the controls
        document.querySelector('.visualizer-controls')?.style.opacity = '0';
        
        // Flag that playback is inactive
        isPlaying = false;
        
        // Stop animation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }
    
    // Listen for play button clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-play')) {
            const icon = e.target.closest('.btn-play').querySelector('i');
            
            if (icon.classList.contains('fa-play')) {
                // Play button was clicked
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                startVisualizer();
            } else {
                // Pause button was clicked
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                stopVisualizer();
            }
        }
    });
    
    // Initialize visualizer on page load
    initVisualizer();
    
    // Expose functions globally for use in the player
    window.audioVisualizer = {
        start: startVisualizer,
        stop: stopVisualizer
    };
});