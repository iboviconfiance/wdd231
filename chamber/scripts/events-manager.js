// Events Manager - Centralized event management system
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = 'all';
    }

    // Fetch events from JSON file
    async loadEvents() {
        try {
            const response = await fetch('data/events_page.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.events = data.events;
            this.filteredEvents = [...this.events];
            
            // Dispatch event for other components to know data is loaded
            window.dispatchEvent(new CustomEvent('eventsLoaded', { 
                detail: { events: this.events } 
            }));
            
            return this.events;
        } catch (error) {
            console.error('Error loading events:', error);
            this.showErrorState();
            return [];
        }
    }

    // Get all events
    getAllEvents() {
        return this.events;
    }

    // Get upcoming events (for homepage - only future events)
    getUpcomingEvents(limit = 3) {
        const now = new Date();
        return this.events
            .filter(event => new Date(event.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);
    }

    // Get featured events
    getFeaturedEvents(limit = 2) {
        return this.events
            .filter(event => event.featured)
            .slice(0, limit);
    }

    // Filter events by multiple criteria
    filterEvents(filters = {}) {
        this.filteredEvents = this.events.filter(event => {
            // Category filter
            if (filters.category && filters.category !== 'all') {
                if (event.category.toLowerCase() !== filters.category.toLowerCase()) {
                    return false;
                }
            }

            // Price filter
            if (filters.price === 'free' && event.price.toLowerCase() !== 'free') {
                return false;
            }
            if (filters.price === 'paid' && event.price.toLowerCase() === 'free') {
                return false;
            }

            // Featured filter
            if (filters.featured && !event.featured) {
                return false;
            }

            // Search term filter
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                const searchableText = `
                    ${event.title} 
                    ${event.description} 
                    ${event.location} 
                    ${event.category}
                `.toLowerCase();
                
                if (!searchableText.includes(term)) {
                    return false;
                }
            }

            // Date range filter
            if (filters.dateRange) {
                const eventDate = new Date(event.date);
                const today = new Date();
                
                switch(filters.dateRange) {
                    case 'this-week':
                        const nextWeek = new Date(today);
                        nextWeek.setDate(today.getDate() + 7);
                        if (eventDate < today || eventDate > nextWeek) return false;
                        break;
                    case 'this-month':
                        const nextMonth = new Date(today);
                        nextMonth.setMonth(today.getMonth() + 1);
                        if (eventDate < today || eventDate > nextMonth) return false;
                        break;
                    case 'upcoming':
                        if (eventDate < today) return false;
                        break;
                }
            }

            return true;
        });

        return this.filteredEvents;
    }

    // Get events by category
    getEventsByCategory(category, limit = null) {
        let filtered = this.events.filter(event => 
            event.category.toLowerCase() === category.toLowerCase()
        );
        
        if (limit) {
            filtered = filtered.slice(0, limit);
        }
        
        return filtered;
    }

    // Get single event by ID
    getEventById(id) {
        return this.events.find(event => event.id === id);
    }

    // Search events
    searchEvents(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            return this.events;
        }

        return this.events.filter(event => {
            const searchableFields = [
                event.title,
                event.description,
                event.location,
                event.category
            ];
            
            return searchableFields.some(field => 
                field.toLowerCase().includes(term)
            );
        });
    }

    // Get event statistics
    getEventStats() {
        const totalEvents = this.events.length;
        const freeEvents = this.events.filter(event => 
            event.price.toLowerCase() === 'free'
        ).length;
        const featuredEvents = this.events.filter(event => 
            event.featured
        ).length;
        const upcomingEvents = this.events.filter(event => 
            new Date(event.date) >= new Date()
        ).length;

        return {
            totalEvents,
            freeEvents,
            featuredEvents,
            upcomingEvents
        };
    }

    // Create event card HTML (for homepage)
    createEventCard(event, style = 'compact') {
        const eventDate = new Date(event.date);
        const formattedDate = this.formatDate(eventDate);
        const isFeatured = event.featured ? 'featured-event' : '';

        if (style === 'compact') {
            // For homepage - smaller cards
            return `
                <div class="event-card ${isFeatured}">
                    ${event.featured ? '<div class="featured-badge">Featured</div>' : ''}
                    
                    <div class="event-date">
                        <span class="event-day">${eventDate.getDate()}</span>
                        <span class="event-month">${eventDate.toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    
                    <div class="event-content">
                        <div class="event-category">${event.category}</div>
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-description">${event.description}</p>
                        
                        <div class="event-details">
                            <div class="event-time">
                                <span class="icon">🕒</span>
                                ${event.time}
                            </div>
                            <div class="event-location">
                                <span class="icon">📍</span>
                                ${event.location}
                            </div>
                            <div class="event-price">
                                <span class="icon">💰</span>
                                ${event.price}
                            </div>
                        </div>
                        
                        <a href="${event.registrationLink}" class="event-cta">
                            ${event.price.toLowerCase() === 'free' ? 'Register Free' : 'Get Tickets'}
                        </a>
                    </div>
                </div>
            `;
        }

        // Default style
        return this.createEventCard(event);
    }

    // Format date for display
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Error handling
    showErrorState() {
        console.error('Events data could not be loaded');
        // You could show a user-friendly error message here
    }

    // Initialize the manager
    async init() {
        await this.loadEvents();
        return this;
    }
}

// Create global instance
const eventsManager = new EventsManager();

// Auto-initialize if this script is loaded in a page that needs events
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we're on a page that needs events
    const eventsContainer = document.getElementById('events-container');
    const upcomingEventsSection = document.querySelector('.upcoming-events');
    
    if (eventsContainer || upcomingEventsSection) {
        await eventsManager.init();
    }
});

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsManager;
}