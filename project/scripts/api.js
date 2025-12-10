// API Module for Diabo Esport Club

const API_URL = 'data/players.json';

// Fetch players data
export async function fetchPlayers() {
    try {
        console.log('Fetching players data...');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Successfully loaded ${data.players.length} players`);
        
        return data.players;
        
    } catch (error) {
        console.error('Error fetching players:', error);
        
        // Return fallback data if fetch fails
        return getFallbackPlayers();
    }
}

// Get players by game
export async function getPlayersByGame(game) {
    const players = await fetchPlayers();
    return players.filter(player => 
        player.games ? player.games.includes(game) : player.game === game
    );
}

// Get player by ID
export async function getPlayerById(id) {
    const players = await fetchPlayers();
    return players.find(player => player.id === id);
}

// Fallback data in case API fails
function getFallbackPlayers() {
    console.log('Using fallback player data');
    
    return [
        {
            id: 1,
            name: "Ondele Sergi Prince",
            games: ["FC (FIFA)", "Club Pro", "Diabo FC"],
            role: "Fondateur & Manager Multigaming",
            image: "images/players/prince.jpg",
            joinDate: "2015",
            wins: 245,
            losses: 67,
            winRate: 78,
            primaryGame: "FC (FIFA)"
        },
        {
            id: 2,
            name: "Lemir",
            games: ["Call of Duty", "Club Pro", "Mortal Kombat"],
            role: "Responsable Communication & Joueur Polyvalent",
            image: "images/players/lemir.jpg",
            joinDate: "2018",
            wins: 312,
            losses: 124,
            winRate: 72,
            primaryGame: "Call of Duty"
        }
    ];
}

// Export for testing
export { getFallbackPlayers };