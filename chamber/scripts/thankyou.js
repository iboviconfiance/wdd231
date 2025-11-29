// Thank You Page JavaScript
class ThankYouPage {
    constructor() {
        this.init();
    }

    init() {
        this.displayFormData();
        this.setupPrintButton();
        this.updateFooterDates();
        this.setupConfetti();
    }

    // Get URL parameters
    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            firstName: params.get('firstName') || 'Not provided',
            lastName: params.get('lastName') || 'Not provided',
            email: params.get('email') || 'Not provided',
            phone: params.get('phone') || 'Not provided',
            businessName: params.get('businessName') || 'Not provided',
            membershipLevel: params.get('membershipLevel') || 'Not provided',
            timestamp: params.get('timestamp') || new Date().toISOString()
        };
    }

    // Format membership level for display
    formatMembershipLevel(level) {
        const levels = {
            'np': 'NP Membership (Non-Profit)',
            'bronze': 'Bronze Membership',
            'silver': 'Silver Membership',
            'gold': 'Gold Membership'
        };
        return levels[level] || level;
    }

    // Get membership badge class
    getMembershipBadgeClass(level) {
        const badges = {
            'np': 'badge-np',
            'bronze': 'badge-bronze',
            'silver': 'badge-silver',
            'gold': 'badge-gold'
        };
        return badges[level] || 'badge-np';
    }

    // Format date for display
    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return new Date().toLocaleDateString();
        }
    }

    // Display form data on the page
    displayFormData() {
        const params = this.getUrlParams();
        
        // Update summary elements
        document.getElementById('summary-name').textContent = `${params.firstName} ${params.lastName}`;
        document.getElementById('summary-email').textContent = params.email;
        document.getElementById('summary-phone').textContent = params.phone;
        document.getElementById('summary-business').textContent = params.businessName;
        
        // Format and display membership level with badge
        const membershipLevel = this.formatMembershipLevel(params.membershipLevel);
        const badgeClass = this.getMembershipBadgeClass(params.membershipLevel);
        document.getElementById('summary-membership').innerHTML = 
            `<span class="membership-badge ${badgeClass}">${membershipLevel}</span>`;
        
        // Format and display date
        document.getElementById('summary-date').textContent = this.formatDate(params.timestamp);

        // Store data for potential download
        this.applicationData = params;
    }

    // Setup print functionality
    setupPrintButton() {
        // Add print button to action buttons
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            const printButton = document.createElement('button');
            printButton.className = 'btn btn-secondary';
            printButton.innerHTML = '🖨️ Print Confirmation';
            printButton.addEventListener('click', () => window.print());
            actionButtons.appendChild(printButton);
        }
    }

    // Simple confetti effect
    setupConfetti() {
        this.createConfetti();
        
        // Trigger confetti animation
        setTimeout(() => {
            this.animateConfetti();
        }, 500);
    }

    createConfetti() {
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(confettiContainer);

        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -20px;
                left: ${Math.random() * 100}%;
                opacity: 0;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;
            confettiContainer.appendChild(confetti);
        }

        this.confettiPieces = confettiContainer.querySelectorAll('div');
    }

    animateConfetti() {
        this.confettiPieces.forEach((piece, index) => {
            const delay = index * 100;
            const duration = 2000 + Math.random() * 1000;
            const rotation = Math.random() * 360;
            
            setTimeout(() => {
                piece.style.transition = `all ${duration}ms ease-out`;
                piece.style.opacity = '1';
                piece.style.transform = `translateY(100vh) rotate(${rotation}deg)`;
                
                // Remove confetti after animation
                setTimeout(() => {
                    piece.remove();
                }, duration);
            }, delay);
        });

        // Remove container after all confetti is gone
        setTimeout(() => {
            const container = document.querySelector('.confetti-container');
            if (container) container.remove();
        }, 4000);
    }

    // Update footer dates
    updateFooterDates() {
        document.getElementById('copyright-year').textContent = new Date().getFullYear();
        document.getElementById('last-modified').textContent = document.lastModified;
    }

    // Download application as PDF (basic version)
    downloadApplication() {
        const { firstName, lastName, email, phone, businessName, membershipLevel, timestamp } = this.applicationData;
        
        const content = `
            Chamber of Commerce - Application Confirmation
            =============================================
            
            Personal Information:
            --------------------
            Name: ${firstName} ${lastName}
            Email: ${email}
            Phone: ${phone}
            
            Business Information:
            --------------------
            Business Name: ${businessName}
            Membership Level: ${this.formatMembershipLevel(membershipLevel)}
            
            Application Details:
            -------------------
            Submission Date: ${this.formatDate(timestamp)}
            
            Thank you for your application!
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `application-${firstName}-${lastName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize thank you page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThankYouPage();
});

// Add download button functionality
document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn btn-secondary';
        downloadButton.innerHTML = '📥 Download Confirmation';
        downloadButton.addEventListener('click', () => {
            const thankYouPage = new ThankYouPage();
            thankYouPage.downloadApplication();
        });
        actionButtons.appendChild(downloadButton);
    }
});

// Add auto-redirect after 30 seconds (optional)
setTimeout(() => {
    const shouldRedirect = confirm('Would you like to return to the home page?');
    if (shouldRedirect) {
        window.location.href = 'index.html';
    }
}, 30000);