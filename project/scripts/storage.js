// Local Storage Module for Diabo Esport Club

const STORAGE_PREFIX = 'diabo_';

// Save data to localStorage
export function saveToStorage(key, data) {
    try {
        const storageKey = `${STORAGE_PREFIX}${key}`;
        const serializedData = JSON.stringify(data);
        localStorage.setItem(storageKey, serializedData);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Get data from localStorage
export function getFromStorage(key) {
    try {
        const storageKey = `${STORAGE_PREFIX}${key}`;
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting from localStorage:', error);
        return null;
    }
}

// Remove data from localStorage
export function removeFromStorage(key) {
    try {
        const storageKey = `${STORAGE_PREFIX}${key}`;
        localStorage.removeItem(storageKey);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// User preferences
export function saveUserPreference(key, value) {
    const preferences = getFromStorage('preferences') || {};
    preferences[key] = value;
    return saveToStorage('preferences', preferences);
}

export function getUserPreference(key) {
    const preferences = getFromStorage('preferences') || {};
    return preferences[key] || null;
}

// Favorite players
export function addFavoritePlayer(playerId) {
    const favorites = getFromStorage('favorites') || [];
    if (!favorites.includes(playerId)) {
        favorites.push(playerId);
        saveToStorage('favorites', favorites);
    }
}

export function removeFavoritePlayer(playerId) {
    const favorites = getFromStorage('favorites') || [];
    const index = favorites.indexOf(playerId);
    if (index > -1) {
        favorites.splice(index, 1);
        saveToStorage('favorites', favorites);
    }
}

export function getFavoritePlayers() {
    return getFromStorage('favorites') || [];
}

export function isPlayerFavorite(playerId) {
    const favorites = getFavoritePlayers();
    return favorites.includes(playerId);
}

// Theme preference
export function saveThemePreference(isDark) {
    return saveUserPreference('theme', isDark ? 'dark' : 'light');
}

export function getThemePreference() {
    return getUserPreference('theme');
}

// Form data cache
export function cacheFormData(formId, data) {
    const formCache = getFromStorage('form_cache') || {};
    formCache[formId] = {
        data,
        timestamp: Date.now()
    };
    saveToStorage('form_cache', formCache);
}

export function getCachedFormData(formId) {
    const formCache = getFromStorage('form_cache') || {};
    return formCache[formId] || null;
}

// Export for testing
export { STORAGE_PREFIX };