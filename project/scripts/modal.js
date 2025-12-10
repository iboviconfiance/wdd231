// Modal Module for Diabo Esport Club

export function createPlayerModal(player) {
    // Remove any existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
        document.body.style.overflow = '';
    }
    
    const isMultigame = player.games && player.games.length > 1;
    const gamesList = player.games || [player.game];
    
    // Create modal HTML using template literals
    const modalHTML = `
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="modal-content">
                <button class="modal-close" aria-label="Fermer la fenêtre">&times;</button>
                
                <div class="modal-header">
                    <div class="modal-player-title">
                        <h2 id="modal-title">${player.name}</h2>
                        ${isMultigame ? '<span class="multigame-badge">Joueur Multijeu</span>' : ''}
                    </div>
                    <p class="player-role-modal">${player.role}</p>
                    
                    <div class="modal-game-tags">
                        ${gamesList.map(game => `
                            <span class="game-tag ${game === player.primaryGame ? 'primary' : ''}" 
                                  data-game="${game}">
                                ${game} ${game === player.primaryGame ? '★' : ''}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-body">
                    <div class="modal-player-image-container">
                        <img src="${player.image}" 
                             alt="${player.name}" 
                             class="modal-player-image" 
                             loading="lazy"
                             onerror="this.src='images/players/default.jpg'">
                    </div>
                    
                    <div class="modal-info-section">
                        <h3>Description</h3>
                        <p>${player.description || 'Joueur talentueux du Diabo Esport Club.'}</p>
                        
                        ${isMultigame ? `
                        <div class="multigame-info">
                            <p><strong>Spécialités :</strong> ${gamesList.join(', ')}</p>
                            <p><strong>Jeu principal :</strong> ${player.primaryGame || gamesList[0]}</p>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="modal-stats-grid">
                        <div class="modal-stat">
                            <span class="modal-stat-value">${player.wins}</span>
                            <span class="modal-stat-label">Victoires</span>
                        </div>
                        <div class="modal-stat">
                            <span class="modal-stat-value">${player.losses}</span>
                            <span class="modal-stat-label">Défaites</span>
                        </div>
                        <div class="modal-stat">
                            <span class="modal-stat-value">${player.winRate}%</span>
                            <span class="modal-stat-label">Taux victoire</span>
                        </div>
                        <div class="modal-stat">
                            <span class="modal-stat-value">${player.joinDate}</span>
                            <span class="modal-stat-label">Membre depuis</span>
                        </div>
                        ${isMultigame ? `
                        <div class="modal-stat">
                            <span class="modal-stat-value">${gamesList.length}</span>
                            <span class="modal-stat-label">Jeux</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${player.achievements && player.achievements.length > 0 ? `
                    <div class="modal-info-section">
                        <h3>Réalisations</h3>
                        <ul class="achievements-list">
                            ${player.achievements.map(achievement => 
                                `<li>${achievement}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div class="modal-info-section">
                        <h3>Informations</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Âge :</strong> ${player.age || 'Non spécifié'}
                            </div>
                            <div class="info-item">
                                <strong>Nationalité :</strong> ${player.nationality || 'Congolais'}
                            </div>
                            <div class="info-item">
                                <strong>Statut :</strong> ${player.status || 'Actif'}
                            </div>
                            ${player.social ? `
                            <div class="info-item">
                                <strong>Réseaux :</strong> ${player.social}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert modal into container
    const modalContainer = document.getElementById('modalContainer') || document.body;
    modalContainer.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    setupModalEvents();
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus trap for accessibility
    trapFocus();
}

function setupModalEvents() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');
    
    // Close on X button click
    closeBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

export function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Focus trap for accessibility
function trapFocus() {
    const modal = document.querySelector('.modal-content');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // Focus first element
        setTimeout(() => firstElement.focus(), 100);
    }
}