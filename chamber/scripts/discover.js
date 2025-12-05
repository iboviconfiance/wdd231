// Discover Page JavaScript Module
import places from '../data/places.mjs';

class DiscoverPage {
    constructor() {
        this.places = places;
        this.init();
    }

    async init() {
        this.updateFooterDates();
        this.setupVisitorMessage();
        await this.loadPlaces();
        this.setupCloseButton();
    }

    // Load places from JSON and display them
    async loadPlaces() {
        const container = document.getElementById('places-container');
        
        if (!container) return;

        // Clear loading message
        container.innerHTML = '';

        // Create and display place cards
        this.places.forEach((place, index) => {
            const card = this.createPlaceCard(place, index + 1);
            container.appendChild(card);
        });
    }

    // Create place card HTML
    createPlaceCard(place, index) {
        const card = document.createElement('article');
        card.className = 'place-card';
        card.style.gridArea = `card${index}`;
        card.setAttribute('data-category', place.category.toLowerCase());

        card.innerHTML = `
            <img src="${place.image}" 
                 alt="${place.name}" 
                 class="card-image"
                 loading="lazy"
                 width="300"
                 height="200">
            <div class="card-content">
                <h2>${place.name}</h2>
                <span class="card-category">${place.category}</span>
                <address>${place.address}</address>
                <p class="card-description">${place.description}</p>
                <div class="card-footer">
                    <span class="card-year">Est. ${place.year}</span>
                    <button class="btn-learn-more" data-id="${place.id}">
                        Learn More
                    </button>
                </div>
            </div>
        `;

        // Add click event to learn more button
        const learnMoreBtn = card.querySelector('.btn-learn-more');
        learnMoreBtn.addEventListener('click', () => {
            this.showPlaceDetails(place);
        });

        return card;
    }

    // Show place details (modal)
    showPlaceDetails(place) {
        const modalHTML = `
            <div class="place-modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${place.image}" alt="${place.name}" class="modal-image">
                    <h2>${place.name}</h2>
                    <span class="modal-category">${place.category}</span>
                    <address><strong>Address:</strong> ${place.address}</address>
                    <p><strong>Year Established:</strong> ${place.year}</p>
                    <div class="modal-description">
                        <h3>Description</h3>
                        <p>${place.description}</p>
                    </div>
                    <button class="btn-close-modal">Close</button>
                </div>
            </div>
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);

        // Add modal styles
        this.addModalStyles();

        // Setup modal events
        const closeBtn = modal.querySelector('.close-modal');
        const closeModalBtn = modal.querySelector('.btn-close-modal');
        const modalElement = modal.querySelector('.place-modal');

        const closeModal = () => {
            modalElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                closeModal();
            }
        });

        // Close with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Add modal styles dynamically
    addModalStyles() {
        const styles = `
            .place-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .close-modal {
                position: absolute;
                right: 1rem;
                top: 1rem;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
                transition: color 0.3s ease;
            }
            
            .close-modal:hover {
                color: #e74c3c;
            }
            
            .modal-image {
                width: 100%;
                height: 250px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 1rem;
            }
            
            .modal-category {
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 0.2rem 0.8rem;
                border-radius: 15px;
                font-size: 0.9rem;
                margin: 0.5rem 0;
            }
            
            .modal-content address {
                font-style: normal;
                margin: 1rem 0;
                color: #555;
            }
            
            .modal-description {
                margin: 1.5rem 0;
            }
            
            .modal-description h3 {
                color: #2c3e50;
                margin-bottom: 0.5rem;
            }
            
            .btn-close-modal {
                background: #3498db;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 5px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                margin-top: 1rem;
            }
            
            .btn-close-modal:hover {
                background: #2980b9;
            }
        `;

        if (!document.querySelector('#modal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'modal-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    // Setup visitor message with localStorage
    setupVisitorMessage() {
        const visitMessage = document.getElementById('visit-message');
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();

        if (!lastVisit) {
            // First visit
            visitMessage.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const lastVisitTime = parseInt(lastVisit);
            const timeDifference = now - lastVisitTime;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            if (daysDifference === 0) {
                // Less than a day
                visitMessage.textContent = "Back so soon! Awesome!";
            } else if (daysDifference === 1) {
                // Exactly 1 day
                visitMessage.textContent = `You last visited 1 day ago.`;
            } else {
                // More than 1 day
                visitMessage.textContent = `You last visited ${daysDifference} days ago.`;
            }
        }

        // Store current visit
        localStorage.setItem('lastVisit', now.toString());
    }

    // Setup close button for visitor message
    setupCloseButton() {
        const closeBtn = document.querySelector('.close-message');
        const messageDiv = document.getElementById('visitor-message');

        if (closeBtn && messageDiv) {
            closeBtn.addEventListener('click', () => {
                messageDiv.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 300);
            });
        }
    }

    // Update footer dates
    updateFooterDates() {
        document.getElementById('copyright-year').textContent = new Date().getFullYear();
        document.getElementById('last-modified').textContent = document.lastModified;
    }
}

// Initialize discover page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DiscoverPage();
});