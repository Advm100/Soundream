// Système de notifications stylisées
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les styles CSS pour les notifications
    addNotificationStyles();
    
    // Créer le conteneur de notifications
    createNotificationContainer();
    
    // Fonction globale pour montrer des notifications depuis n'importe où dans l'application
    window.showNotification = showNotification;
    
    // Démo : afficher une notification de bienvenue après un court délai
    setTimeout(() => {
        showNotification({
            title: 'Bienvenue sur NightFlow',
            message: 'Votre expérience musicale commence maintenant',
            type: 'info',
            duration: 5000
        });
    }, 2000);
});

function addNotificationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Conteneur de notifications */
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            max-width: calc(100% - 40px);
            z-index: 9999;
            pointer-events: none;
        }
        
        /* Style de base des notifications */
        .notification {
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 8px;
            background: rgba(22, 22, 30, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            color: var(--text-primary);
            transform: translateX(120%);
            opacity: 0;
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        opacity 0.5s ease;
            pointer-events: auto;
            border-left: 4px solid var(--accent-color);
            display: flex;
            align-items: flex-start;
        }
        
        /* Animation d'entrée */
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        /* Animation de sortie */
        .notification.hide {
            transform: translateX(120%);
            opacity: 0;
        }
        
        /* Icône de la notification */
        .notification-icon {
            margin-right: 15px;
            font-size: 1.2rem;
        }
        
        /* Contenu de la notification */
        .notification-content {
            flex: 1;
        }
        
        /* Titre de la notification */
        .notification-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        /* Corps de la notification */
        .notification-body {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        
        /* Bouton de fermeture */
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1rem;
            cursor: pointer;
            margin-left: 10px;
            padding: 0;
            margin-top: -2px;
            transition: color 0.3s;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        /* Types de notifications */
        .notification.success {
            border-left-color: #2ecc71;
        }
        
        .notification.success .notification-icon {
            color: #2ecc71;
        }
        
        .notification.warning {
            border-left-color: #f39c12;
        }
        
        .notification.warning .notification-icon {
            color: #f39c12;
        }
        
        .notification.error {
            border-left-color: #e74c3c;
        }
        
        .notification.error .notification-icon {
            color: #e74c3c;
        }
        
        .notification.info {
            border-left-color: var(--accent-color);
        }
        
        .notification.info .notification-icon {
            color: var(--accent-color);
        }
        
        /* Animation pour l'icône de succès */
        @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .notification.success .notification-icon {
            animation: checkmark 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        /* Barre de progression */
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255, 255, 255, 0.3);
            width: 100%;
            transform-origin: left;
        }
        
        /* Adaptation pour le thème clair */
        body.light-theme .notification {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        /* Animation d'attention */
        @keyframes attention {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .notification.attention {
            animation: attention 0.8s ease;
        }
    `;
    
    document.head.appendChild(styleElement);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
}

function showNotification(options) {
    // Options par défaut
    const defaults = {
        title: 'Notification',
        message: '',
        type: 'info', // info, success, warning, error
        duration: 4000, // en millisecondes, 0 pour ne pas disparaitre automatiquement
        closable: true
    };
    
    // Fusionner les options
    const settings = { ...defaults, ...options };
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${settings.type}`;
    
    // Déterminer l'icône en fonction du type
    let icon;
    switch (settings.type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            break;
        case 'info':
        default:
            icon = 'fas fa-info-circle';
            break;
    }
    
    // Construire le contenu HTML
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${settings.title}</div>
            ${settings.message ? `<div class="notification-body">${settings.message}</div>` : ''}
        </div>
        ${settings.closable ? `<button class="notification-close">&times;</button>` : ''}
        ${settings.duration > 0 ? `<div class="notification-progress"></div>` : ''}
    `;
    
    // Ajouter la notification au conteneur
    const container = document.querySelector('.notification-container');
    container.appendChild(notification);
    
    // Afficher la notification avec un léger délai pour l'animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurer la barre de progression
    if (settings.duration > 0) {
        const progress = notification.querySelector('.notification-progress');
        progress.style.animation = `shrink ${settings.duration / 1000}s linear forwards`;
        progress.style.background = getProgressColor(settings.type);
        
        // Définir l'animation keyframe dynamiquement
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes shrink {
                0% { width: 100%; }
                100% { width: 0%; }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Fermer automatiquement après la durée spécifiée
    let timeout;
    if (settings.duration > 0) {
        timeout = setTimeout(() => {
            closeNotification(notification);
        }, settings.duration);
    }
    
    // Ajouter le gestionnaire d'événements pour le bouton de fermeture
    if (settings.closable) {
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            if (timeout) clearTimeout(timeout);
            closeNotification(notification);
        });
    }
    
    // Retourner la notification pour une utilisation potentielle ultérieure
    return notification;
}

function closeNotification(notification) {
    // Ajouter la classe pour l'animation de sortie
    notification.classList.add('hide');
    notification.classList.remove('show');
    
    // Supprimer après l'animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 500); // Correspondant à la durée de la transition
}

function getProgressColor(type) {
    switch (type) {
        case 'success':
            return '#2ecc71';
        case 'warning':
            return '#f39c12';
        case 'error':
            return '#e74c3c';
        case 'info':
        default:
            return 'var(--accent-color)';
    }
}

// Fonction utilitaire pour montrer la notification "attention"
function showAttentionNotification(notification) {
    notification.classList.add('attention');
    setTimeout(() => {
        notification.classList.remove('attention');
    }, 800);
}