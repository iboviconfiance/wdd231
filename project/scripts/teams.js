// Teams Page JavaScript

import { fetchPlayers } from './modules/api.js';
import { createPlayerModal } from './modules/modal.js';
import { 
    filterPlayersByGame, 
    groupPlayersByGame,
    sortByWins,
    sortByWinRate,
    sortByJoinDate,
    calculateTotalWins,
    calculateAverageWinRate
} from './modules/utils.js';

// DOM Elements
const allPlayersContainer = document.getElementById('allPlayers');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const playerSearch = document.getElementById('playerSearch');
const playersStatsContainer = document.getElementById('playersStats');

// State
let allPlayers = [];
let filteredPlayers = [];
let currentFilter = 'all';
let currentSort = 'wins';

// Initialize teams page
document.addEventListener('DOMContentLoaded', initTeamsPage);

async function initTeamsPage() {
    console.log('Initializing Teams Page...');
    
    try {
        // Load players data
        allPlayers = await fetchPlayers();
        filteredPlayers = [...allPlayers];
        
        // Display all players
        displayPlayers(filteredPlayers);
        
        // Display statistics
        displayGameStats();
        
        // Setup event listeners
        setupTeamsEventListeners();
        
        // Update filter buttons with game counts
        updateFilterButtons();
        
    } catch (error) {
        console.error('Error initializing teams page:', error);
        allPlayersContainer.innerHTML = `
            <div class="alert alert-error">
                <p>Impossible de charger les joueurs. Veuillez réessayer plus tard.</p>
            </div>
        `;
    }
}

// Display players
function displayPlayers(players) {
    if (players.length === 0) {
        allPlayersContainer.innerHTML = `
            <div class="alert alert-warning">
                <p>Aucun joueur trouvé pour ce filtre.</p>
            </div>
        `;
        return;
    }
    
    // Clear container
    allPlayersContainer.innerHTML = '';
    
    // Create player cards
    players.forEach(player => {
        const playerCard = createPlayerCardTeams(player);
        allPlayersContainer.appendChild(playerCard);
    });
}

// Create player card for teams page
function createPlayerCardTeams(player) {
    const isMultigame = player.games && player.games.length > 1;
    const card = document.createElement('div');
    card.className = `player-card ${isMultigame ? 'multigame-player' : ''}`;
    card.dataset.playerId = player.id;
    
    // Get primary game for display
    const primaryGame = player.primaryGame || (player.games ? player.games[0] : player.game);
    
    card.innerHTML = `
        <div class="player-image-container">
            <img src="${player.image}" 
                 alt="${player.name}" 
                 class="player-image" 
                 loading="lazy"
                 onerror="this.src='images/players/default.jpg'">
            ${isMultigame ? '<span class="multigame-badge">Multijeu</span>' : ''}
        </div>
        <div class="player-info">
            <div class="player-header">
                <h3 class="player-name">${player.name}</h3>
                <span class="player-game">${primaryGame}</span>
            </div>
            <p class="player-role">${player.role}</p>
            
            ${isMultigame ? `
            <div class="game-tags">
                ${player.games.slice(0, 2).map(game => `
                    <span class="game-tag ${game === player.primaryGame ? 'primary' : ''}" 
                          data-game="${game}">
                        ${game} ${game === player.primaryGame ? '★' : ''}
                    </span>
                `).join('')}
                ${player.games.length > 2 ? `
                    <span class="game-tag">+${player.games.length - 2} autres</span>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-value">${player.wins}</span>
                    <span class="stat-label">Victoires</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${player.winRate}%</span>
                    <span class="stat-label">Taux victoire</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${player.joinDate}</span>
                    <span class="stat-label">Membre depuis</span>
                </div>
            </div>
            
            <div class="player-actions">
                <button class="btn btn-outline btn-view-details" 
                        data-player-id="${player.id}"
                        aria-label="Voir les détails de ${player.name}">
                    Voir détails
                </button>
            </div>
        </div>
    `;
    
    // Add click event to details button
    const detailsBtn = card.querySelector('.btn-view-details');
    detailsBtn.addEventListener('click', () => {
        createPlayerModal(player);
    });
    
    return card;
}

// Display game statistics
function displayGameStats() {
    const gameGroups = groupPlayersByGame(allPlayers);
    const totalPlayers = allPlayers.length;
    const totalWins = calculateTotalWins(allPlayers);
    const multigamePlayers = allPlayers.filter(p => p.games && p.games.length > 1).length;
    
    let statsHTML = `
        <div class="stats-card">
            <h3>Statistiques du Club</h3>
            <div class="stats-grid">
                <div class="stat-item-large">
                    <span class="stat-value-large">${totalPlayers}</span>
                    <span class="stat-label-large">Joueurs total</span>
                </div>
                <div class="stat-item-large">
                    <span class="stat-value-large">${totalWins}</span>
                    <span class="stat-label-large">Victoires totales</span>
                </div>
                <div class="stat-item-large">
                    <span class="stat-value-large">${multigamePlayers}</span>
                    <span class="stat-label-large">Joueurs multijeu</span>
                </div>
            </div>
        </div>
        
        <div class="stats-card">
            <h3>Statistiques par Jeu</h3>
            <div class="game-stats-list">
    `;
    
    Object.entries(gameGroups).forEach(([game, players]) => {
        const gameWins = calculateTotalWins(players);
        const avgWinRate = calculateAverageWinRate(players);
        
        statsHTML += `
            <div class="game-stat-item" data-game="${game}">
                <div class="game-stat-header">
                    <h4>${game}</h4>
                    <span class="player-count">${players.length} joueur${players.length > 1 ? 's' : ''}</span>
                </div>
                <div class="game-stat-details">
                    <span>Victoires: ${gameWins}</span>
                    <span>Taux victoire moyen: ${avgWinRate}%</span>
                </div>
            </div>
        `;
    });
    
    statsHTML += `
            </div>
        </div>
    `;
    
    if (playersStatsContainer) {
        playersStatsContainer.innerHTML = statsHTML;
    }
}

// Update filter buttons with player counts
function updateFilterButtons() {
    const gameGroups = groupPlayersByGame(allPlayers);
    
    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        
        if (filter === 'all') {
            const count = allPlayers.length;
            button.innerHTML = `Tous les joueurs <span class="filter-count">${count}</span>`;
        } else if (gameGroups[filter]) {
            const count = gameGroups[filter].length;
            button.innerHTML = `${filter} <span class="filter-count">${count}</span>`;
        }
    });
}

// Setup event listeners for teams page
function setupTeamsEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Apply filter
            applyFilter(filter);
        });
    });
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applySort();
        });
    }
    
    // Search input
    if (playerSearch) {
        playerSearch.addEventListener('input', debounce((e) => {
            applySearch(e.target.value);
        }, 300));
    }
}

// Apply filter
function applyFilter(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        filteredPlayers = [...allPlayers];
    } else {
        filteredPlayers = filterPlayersByGame(allPlayers, filter);
    }
    
    // Apply current sort
    applySort();
}

// Apply sort
function applySort() {
    switch (currentSort) {
        case 'wins':
            filteredPlayers = sortByWins(filteredPlayers);
            break;
        case 'winRate':
            filteredPlayers = sortByWinRate(filteredPlayers);
            break;
        case 'joinDate':
            filteredPlayers = sortByJoinDate(filteredPlayers);
            break;
        case 'name':
            filteredPlayers = [...filteredPlayers].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            break;
    }
    
    displayPlayers(filteredPlayers);
}

// Apply search
function applySearch(searchTerm) {
    if (!searchTerm.trim()) {
        // If search is empty, show filtered players
        applyFilter(currentFilter);
        return;
    }
    
    const term = searchTerm.toLowerCase();
    const searchResults = filteredPlayers.filter(player => 
        player.name.toLowerCase().includes(term) ||
        player.role.toLowerCase().includes(term) ||
        (player.games && player.games.some(game => game.toLowerCase().includes(term))) ||
        (!player.games && player.game.toLowerCase().includes(term))
    );
    
    displayPlayers(searchResults);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}