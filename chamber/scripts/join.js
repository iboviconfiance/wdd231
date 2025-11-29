// Join Page JavaScript
class JoinPage {
    constructor() {
        this.init();
    }

    init() {
        this.setTimestamp();
        this.setupModals();
        this.setupMembershipSelection();
        this.setupFormValidation();
        this.updateFooterDates();
    }

    // Set current timestamp in hidden field
    setTimestamp() {
        const now = new Date();
        const timestamp = now.toISOString();
        document.getElementById('timestamp').value = timestamp;
    }

    // Setup modal functionality
    setupModals() {
        // Get all modal elements
        const modals = document.querySelectorAll('.modal');
        const benefitButtons = document.querySelectorAll('.btn-benefits');
        const closeButtons = document.querySelectorAll('.close-modal');

        // Open modal when benefit button is clicked
        benefitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        // Close modal when close button is clicked
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    // Open specific modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    // Close all modals
    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Setup membership level selection from modals
    setupMembershipSelection() {
        const selectButtons = document.querySelectorAll('.select-membership');
        
        selectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const level = e.target.getAttribute('data-level');
                this.selectMembershipLevel(level);
                this.closeModals();
            });
        });
    }

    // Select membership level in form
    selectMembershipLevel(level) {
        const select = document.querySelector('select[name="membershipLevel"]');
        if (select) {
            select.value = level;
            
            // Scroll to form
            select.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the selected option
            select.focus();
        }
    }

    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById('membership-form');
        const jobTitleInput = document.querySelector('input[name="jobTitle"]');

        // Custom validation for job title pattern
        if (jobTitleInput) {
            jobTitleInput.addEventListener('input', () => {
                this.validateJobTitle(jobTitleInput);
            });
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                this.showFormErrors(form);
            }
        });
    }

    // Validate job title pattern
    validateJobTitle(input) {
        const pattern = /^[A-Za-z\s\-]{7,}$/;
        const isValid = pattern.test(input.value) || input.value === '';
        
        if (!isValid && input.value !== '') {
            input.setCustomValidity('Job title must be at least 7 characters and contain only letters, spaces, and hyphens');
        } else {
            input.setCustomValidity('');
        }
    }

    // Validate entire form
    validateForm(form) {
        return form.checkValidity();
    }

    // Show form errors
    showFormErrors(form) {
        const invalidFields = form.querySelectorAll(':invalid');
        
        invalidFields.forEach(field => {
            field.style.borderColor = '#e74c3c';
            
            // Add error message if not already present
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.style.color = '#e74c3c';
                errorMessage.style.fontSize = '0.8rem';
                errorMessage.style.marginTop = '0.3rem';
                errorMessage.textContent = field.validationMessage;
                
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        });

        // Scroll to first error
        if (invalidFields.length > 0) {
            invalidFields[0].scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            invalidFields[0].focus();
        }
    }

    // Update footer dates
    updateFooterDates() {
        document.getElementById('copyright-year').textContent = new Date().getFullYear();
        document.getElementById('last-modified').textContent = document.lastModified;
    }
}

// Initialize join page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JoinPage();
});

// Add CSS for error messages
const errorStyles = `
    .error-message {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.3rem;
    }
    
    input:invalid {
        border-color: #e74c3c;
    }
    
    input:valid {
        border-color: #27ae60;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);