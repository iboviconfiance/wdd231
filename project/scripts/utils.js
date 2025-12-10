// Utility Module for Diabo Esport Club

// Array Methods

// Filter players by game
export function filterPlayersByGame(players, game) {
    return players.filter(player => {
        if (player.games) {
            return player.games.includes(game);
        }
        return player.game === game;
    });
}

// Sort players by wins (descending)
export function sortByWins(players) {
    return [...players].sort((a, b) => b.wins - a.wins);
}

// Sort players by win rate (descending)
export function sortByWinRate(players) {
    return [...players].sort((a, b) => b.winRate - a.winRate);
}

// Sort players by join date (oldest first)
export function sortByJoinDate(players) {
    return [...players].sort((a, b) => {
        const yearA = parseInt(a.joinDate) || 0;
        const yearB = parseInt(b.joinDate) || 0;
        return yearA - yearB;
    });
}

// Calculate average win rate for a group of players
export function calculateAverageWinRate(players) {
    if (players.length === 0) return 0;
    
    const total = players.reduce((sum, player) => sum + player.winRate, 0);
    return (total / players.length).toFixed(1);
}

// Calculate total wins for a group of players
export function calculateTotalWins(players) {
    return players.reduce((total, player) => total + player.wins, 0);
}

// Group players by game
export function groupPlayersByGame(players) {
    const groups = {};
    
    players.forEach(player => {
        const games = player.games || [player.game];
        
        games.forEach(game => {
            if (!groups[game]) {
                groups[game] = [];
            }
            if (!groups[game].includes(player)) {
                groups[game].push(player);
            }
        });
    });
    
    return groups;
}

// String Utilities

// Capitalize first letter
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Format player name
export function formatPlayerName(name) {
    return name.split(' ').map(capitalize).join(' ');
}

// Format game name
export function formatGameName(game) {
    const gameMap = {
        'fc (fifa)': 'FC (FIFA)',
        'call of duty': 'Call of Duty',
        'mortal kombat': 'Mortal Kombat',
        'club pro': 'Club Pro',
        'diabo fc': 'Diabo FC'
    };
    
    const lowerGame = game.toLowerCase();
    return gameMap[lowerGame] || capitalize(game);
}

// Number Utilities

// Format number with commas
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate win percentage
export function calculateWinPercentage(wins, losses) {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
}

// Date Utilities

// Get current year
export function getCurrentYear() {
    return new Date().getFullYear();
}

// Calculate years since joining
export function calculateYearsSince(joinYear) {
    const currentYear = getCurrentYear();
    const join = parseInt(joinYear) || currentYear;
    return currentYear - join;
}

// DOM Utilities

// Debounce function for performance
export function debounce(func, wait) {
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

// Validation

// Validate email format
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate required fields
export function validateRequired(fields) {
    return fields.every(field => field && field.toString().trim().length > 0);
}

// Export for testing
export default {
    filterPlayersByGame,
    sortByWins,
    sortByWinRate,
    calculateAverageWinRate,
    calculateTotalWins,
    capitalize,
    formatPlayerName,
    formatGameName,
    formatNumber,
    calculateWinPercentage,
    getCurrentYear,
    calculateYearsSince,
    debounce,
    isValidEmail,
    validateRequired
};