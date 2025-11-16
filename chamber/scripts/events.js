// Events Management System
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = 'all';
    }

    // Fetch events from JSON
    async loadEvents() {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error('Failed to load events');
            }
            const data = await response.json();
            this.events = data.events;
            this.filteredEvents = [...this.events];
            this.displayEvents();
            this.setupFilters();
        } catch (error) {
            console.error('Error loading events:', error);
            this.showError();
        }
    }

    // Display events in the container
    displayEvents() {
        const container = document.getElementById('events-container');
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    <p>No events found matching your criteria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');
    }

    // Create event card HTML
    createEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = this.formatDate(eventDate);
        const isFeatured = event.featured ? 'featured-event' : '';
        const isFree = event.price.toLowerCase() === 'free' ? 'free-event' : '';

        return `
            <div class="event-card ${isFeatured} ${isFree}" data-category="${event.category.toLowerCase()}" data-featured="${event.featured}" data-price="${event.price}">
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
                            ${event.time} - ${event.endTime}
                        </div>
                        <div class="event-location">
                            <span class="icon">📍</span>
                            ${event.location}
                        </div>
                        <div class="event-price">
                            <span class="icon">💰</span>
                            ${event.price}
                        </div>
                        ${event.spotsAvailable < 20 ? `
                        <div class="event-spots">
                            <span class="icon">👥</span>
                            Only ${event.spotsAvailable} spots left!
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="event-actions">
                        <a href="${event.registrationLink}" class="event-cta">
                            ${event.price.toLowerCase() === 'free' ? 'Register Free' : 'Get Tickets'}
                        </a>
                        <button class="event-share" onclick="shareEvent(${event.id})">
                            Share
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Filter events
    filterEvents(filter) {
        this.currentFilter = filter;
        
        switch(filter) {
            case 'featured':
                this.filteredEvents = this.events.filter(event => event.featured);
                break;
            case 'free':
                this.filteredEvents = this.events.filter(event => event.price.toLowerCase() === 'free');
                break;
            case 'workshop':
                this.filteredEvents = this.events.filter(event => 
                    event.category.toLowerCase().includes('workshop'));
                break;
            default:
                this.filteredEvents = [...this.events];
        }
        
        this.displayEvents();
        this.updateActiveFilter(filter);
    }

    // Update active filter button
    updateActiveFilter(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }

    // Setup filter buttons
    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterEvents(btn.dataset.filter);
            });
        });
    }

    // Format date
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Show error state
    showError() {
        const container = document.getElementById('events-container');
        container.innerHTML = `
            <div class="error-state">
                <p>Unable to load events at this time. Please try again later.</p>
            </div>
        `;
    }

    // Get upcoming events (for homepage)
    getUpcomingEvents(limit = 3) {
        const now = new Date();
        return this.events
            .filter(event => new Date(event.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);
    }
}

// Share event function
function shareEvent(eventId) {
    // Simple share functionality - can be enhanced with Web Share API
    const event = eventsManager.events.find(e => e.id === eventId);
    if (event && navigator.share) {
        navigator.share({
            title: event.title,
            text: event.description,
            url: window.location.href,
        });
    } else {
        // Fallback: copy to clipboard or show share options
        alert(`Share: ${event.title}`);
    }
}

// Initialize Events Manager
const eventsManager = new EventsManager();

// Load events when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    eventsManager.loadEvents();
});