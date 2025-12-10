// Diabo Esport Club - Main JavaScript File

// Import modules
import { fetchPlayers } from './modules/api.js';
import { createPlayerModal } from './modules/modal.js';
import { saveUserPreference, getUserPreference } from './modules/storage.js';
import { sortByWins } from './modules/utils.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const featuredPlayersContainer = document.getElementById('featuredPlayers');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.getElementById('themeToggle');

// State
let players = [];

// Initialize app
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    console.log('Diabo Esport Club - Initialisation');
    
    // Load saved theme
    loadTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load and display players on home page
    if (featuredPlayersContainer) {
        await loadFeaturedPlayers();
    }
    
    // Setup form validation
    if (contactForm) {
        setupFormValidation();
    }
}

// Event Listeners
function setupEventListeners() {
    // Hamburger menu toggle - CORRIGÉ
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleMobileMenu();
            }
        });
    });
    
    // Theme toggle - CORRIGÉ
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        }
    });
}

// Mobile Menu - CORRIGÉ
function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');
    
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', (!isActive).toString());
    
    // Empêche le défilement quand le menu est ouvert
    if (!isActive) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
}

// Theme Management - CORRIGÉ
function loadTheme() {
    const savedTheme = getUserPreference('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme or system preference
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.innerHTML = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggle) themeToggle.innerHTML = '🌙';
    }
}

function toggleTheme() {
    const isDark = !document.body.classList.contains('light-theme');
    
    if (isDark) {
        // Switch to light theme
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '☀️';
        saveUserPreference('theme', 'light');
    } else {
        // Switch to dark theme
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '🌙';
        saveUserPreference('theme', 'dark');
    }
}

// Load Featured Players
async function loadFeaturedPlayers() {
    try {
        featuredPlayersContainer.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
        
        players = await fetchPlayers();
        
        // Get top 6 players by win rate
        const featured = sortByWins(players).slice(0, 6);
        
        // Clear container
        featuredPlayersContainer.innerHTML = '';
        
        // Create player cards
        featured.forEach(player => {
            const playerCard = createPlayerCard(player);
            featuredPlayersContainer.appendChild(playerCard);
        });
        
    } catch (error) {
        console.error('Error loading featured players:', error);
        featuredPlayersContainer.innerHTML = `
            <div class="alert alert-error">
                <p>Impossible de charger les joueurs. Veuillez réessayer plus tard.</p>
            </div>
        `;
    }
}

// Create Player Card HTML
function createPlayerCard(player) {
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

// Form Validation
function setupFormValidation() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            showFormError('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormError('Veuillez entrer une adresse email valide.');
            return;
        }
        
        // If valid, submit the form
        this.submit();
    });
}

function showFormError(message) {
    // Remove any existing error
    const existingError = contactForm.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error form-error';
    errorDiv.innerHTML = `<p>${message}</p>`;
    
    // Insert before submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    contactForm.insertBefore(errorDiv, submitBtn);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Export for use in other modules
export { createPlayerCard };