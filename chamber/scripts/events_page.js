// Events Page Specific Functionality
class EventsPage {
    constructor() {
        this.eventsManager = new EventsManager();
        this.currentView = 'grid';
        this.currentPage = 1;
        this.eventsPerPage = 6;
        this.allEvents = [];
        this.filteredEvents = [];
        
        this.initializePage();
    }

    async initializePage() {
        await this.eventsManager.loadEvents();
        this.allEvents = this.eventsManager.events;
        this.filteredEvents = [...this.allEvents];
        
        this.setupEventListeners();
        this.updateStats();
        this.displayEvents();
    }

    setupEventListeners() {
        // Search
        document.getElementById('events-search').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Filters
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.applyFilters();
        });

        document.getElementById('price-filter').addEventListener('change', (e) => {
            this.applyFilters();
        });

        document.getElementById('date-filter').addEventListener('change', (e) => {
            this.applyFilters();
        });

        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // View Toggle
        document.getElementById('grid-view').addEventListener('click', () => {
            this.switchView('grid');
        });

        document.getElementById('list-view').addEventListener('click', () => {
            this.switchView('list');
        });

        // Load More
        document.getElementById('load-more').addEventListener('click', () => {
            this.loadMoreEvents();
        });

        // Newsletter
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            this.handleNewsletterSubmit(e);
        });
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            this.filteredEvents = [...this.allEvents];
        } else {
            this.filteredEvents = this.allEvents.filter(event => 
                event.title.toLowerCase().includes(term) ||
                event.description.toLowerCase().includes(term) ||
                event.location.toLowerCase().includes(term) ||
                event.category.toLowerCase().includes(term)
            );
        }
        
        this.currentPage = 1;
        this.displayEvents();
    }

    applyFilters() {
        const category = document.getElementById('category-filter').value;
        const price = document.getElementById('price-filter').value;
        const date = document.getElementById('date-filter').value;

        this.filteredEvents = this.allEvents.filter(event => {
            // Category filter
            if (category !== 'all' && event.category.toLowerCase() !== category) {
                return false;
            }

            // Price filter
            if (price === 'free' && event.price.toLowerCase() !== 'free') {
                return false;
            }
            if (price === 'paid' && event.price.toLowerCase() === 'free') {
                return false;
            }

            // Date filter
            if (date !== 'all') {
                const eventDate = new Date(event.date);
                const today = new Date();
                
                switch(date) {
                    case 'this-week':
                        const nextWeek = new Date(today);
                        nextWeek.setDate(today.getDate() + 7);
                        return eventDate >= today && eventDate <= nextWeek;
                        
                    case 'this-month':
                        const nextMonth = new Date(today);
                        nextMonth.setMonth(today.getMonth() + 1);
                        return eventDate >= today && eventDate <= nextMonth;
                        
                    case 'next-month':
                        const startNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                        const endNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                        return eventDate >= startNextMonth && eventDate <= endNextMonth;
                        
                    default:
                        return true;
                }
            }

            return true;
        });

        this.currentPage = 1;
        this.displayEvents();
    }

    resetFilters() {
        document.getElementById('events-search').value = '';
        document.getElementById('category-filter').value = 'all';
        document.getElementById('price-filter').value = 'all';
        document.getElementById('date-filter').value = 'all';
        
        this.filteredEvents = [...this.allEvents];
        this.currentPage = 1;
        this.displayEvents();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.displayEvents();
    }

    displayEvents() {
        const container = document.getElementById('events-container');
        const noResults = document.getElementById('no-results');
        const loadMoreBtn = document.getElementById('load-more');

        if (this.filteredEvents.length === 0) {
            container.innerHTML = '';
            noResults.classList.remove('hidden');
            loadMoreBtn.classList.add('hidden');
            return;
        }

        noResults.classList.add('hidden');

        // Get events for current page
        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const eventsToShow = this.filteredEvents.slice(0, endIndex);

        // Render events
        if (this.currentView === 'grid') {
            container.innerHTML = this.createGridView(eventsToShow);
        } else {
            container.innerHTML = this.createListView(eventsToShow);
        }

        // Show/hide load more button
        if (endIndex < this.filteredEvents.length) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    }

    createGridView(events) {
        return `
            <div class="events-grid">
                ${events.map(event => this.createEventCardGrid(event)).join('')}
            </div>
        `;
    }

    createListView(events) {
        return `
            <div class="events-list">
                ${events.map(event => this.createEventCardList(event)).join('')}
            </div>
        `;
    }

    createEventCardGrid(event) {
        const eventDate = new Date(event.date);
        const isFeatured = event.featured ? 'featured' : '';
        const spotsClass = event.spotsAvailable < 20 ? 'low' : '';

        return `
            <div class="event-card-grid ${isFeatured}">
                ${event.featured ? '<div class="event-badge">Featured</div>' : ''}
                
                <div class="event-image">
                    <!-- In real implementation, use event.image -->
                    📅
                </div>
                
                <div class="event-content-grid">
                    <div class="event-date-grid">
                        <div class="event-date-main">
                            <span class="event-day">${eventDate.getDate()}</span>
                            <span class="event-month">${eventDate.toLocaleString('en', { month: 'short' })}</span>
                        </div>
                        <div class="event-date-info">
                            <div class="event-weekday">${eventDate.toLocaleString('en', { weekday: 'long' })}</div>
                            <div class="event-time">${event.time} - ${event.endTime}</div>
                        </div>
                    </div>
                    
                    <div class="event-category">${event.category}</div>
                    <h3 class="event-title-grid">${event.title}</h3>
                    <p class="event-description-grid">${event.description}</p>
                    
                    <div class="event-meta-grid">
                        <div class="event-price">${event.price}</div>
                        <div class="event-spots ${spotsClass}">
                            ${event.spotsAvailable} spots available
                        </div>
                    </div>
                    
                    <div class="event-actions-grid">
                        <a href="${event.registrationLink}" class="btn-event btn-register">
                            ${event.price.toLowerCase() === 'free' ? 'Register Free' : 'Get Tickets'}
                        </a>
                        <button class="btn-event btn-details" onclick="showEventDetails(${event.id})">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createEventCardList(event) {
        const eventDate = new Date(event.date);
        const spotsClass = event.spotsAvailable < 20 ? 'low' : '';

        return `
            <div class="event-card-list">
                <div class="event-date-list">
                    <span class="event-day">${eventDate.getDate()}</span>
                    <span class="event-month">${eventDate.toLocaleString('en', { month: 'short' })}</span>
                </div>
                
                <div class="event-content-list">
                    <div class="event-header-list">
                        <h3 class="event-title-list">${event.title}</h3>
                        ${event.featured ? '<span class="event-category-list">Featured</span>' : ''}
                    </div>
                    
                    <p class="event-description-list">${event.description}</p>
                    
                    <div class="event-details-list">
                        <div class="event-detail-item">
                            <span>🕒</span>
                            <span>${event.time} - ${event.endTime}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>📍</span>
                            <span>${event.location}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>💰</span>
                            <span>${event.price}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>👥</span>
                            <span class="${spotsClass}">${event.spotsAvailable} spots left</span>
                        </div>
                    </div>
                    
                    <div class="event-actions-list">
                        <a href="${event.registrationLink}" class="btn-event btn-register">
                            ${event.price.toLowerCase() === 'free' ? 'Register Free' : 'Get Tickets'}
                        </a>
                        <button class="btn-event btn-details" onclick="showEventDetails(${event.id})">
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    loadMoreEvents() {
        this.currentPage++;
        this.displayEvents();
    }

    updateStats() {
        const totalEvents = this.allEvents.length;
        const freeEvents = this.allEvents.filter(event => event.price.toLowerCase() === 'free').length;
        const featuredEvents = this.allEvents.filter(event => event.featured).length;

        document.getElementById('total-events').textContent = totalEvents;
        document.getElementById('free-events').textContent = freeEvents;
        document.getElementById('featured-events').textContent = featuredEvents;
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Simple validation and submission
        if (email) {
            alert(`Thank you for subscribing with: ${email}`);
            e.target.reset();
        }
    }
}

// Global function to show event details
function showEventDetails(eventId) {
    const event = eventsPage.eventsManager.events.find(e => e.id === eventId);
    if (event) {
        // In a real implementation, this would open a modal or navigate to event detail page
        alert(`Event Details: ${event.title}\n\n${event.description}\n\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\nPrice: ${event.price}`);
    }
}

// Initialize the events page
let eventsPage;

document.addEventListener('DOMContentLoaded', () => {
    eventsPage = new EventsPage();
    
    // Update copyright and last modified
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
});