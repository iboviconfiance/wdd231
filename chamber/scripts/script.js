// Member data (will be replaced by JSON fetch)
const members = [];

// Function to display members
function displayMembers(viewType) {
    const container = document.getElementById('members-container');
    container.innerHTML = '';
    container.className = `${viewType}-view`;
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        
        if (viewType === 'grid') {
            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}" class="member-image">
                <div class="member-name">${member.name}</div>
                <div class="member-address">${member.address}</div>
                <div class="member-phone">${member.phone}</div>
                <div class="member-website"><a href="${member.website}" target="_blank">Visit Website</a></div>
                <div class="member-level">${getLevelText(member.level)}</div>
            `;
        } else {
            card.innerHTML = `
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-details">
                        <div class="member-address">${member.address}</div>
                        <div class="member-phone">${member.phone}</div>
                        <div class="member-website"><a href="${member.website}" target="_blank">Website</a></div>
                    </div>
                </div>
                <div class="member-level">${getLevelText(member.level)}</div>
            `;
        }
        
        container.appendChild(card);
    });
}

// Function to get member level text
function getLevelText(level) {
    switch(level) {
        case 1: return 'Member';
        case 2: return 'Silver';
        case 3: return 'Gold';
        default: return 'Member';
    }
}

// Function to fetch JSON data
async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Error loading data');
        }
        const data = await response.json();
        // Replace static data with JSON data
        members.length = 0;
        data.forEach(member => members.push(member));
        displayMembers('grid');
    } catch (error) {
        console.error('Error:', error);
        // Use static data in case of error
        displayMembers('grid');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Update last modified date
    document.getElementById('last-modified').textContent = document.lastModified;
    
    // Mobile menu handling
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    menuToggle.addEventListener('click', function() {
        navigation.classList.toggle('active');
    });
    
    // View buttons handling
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    
    gridViewBtn.addEventListener('click', function() {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        displayMembers('grid');
    });
    
    listViewBtn.addEventListener('click', function() {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        displayMembers('list');
    });
    
    // Load members
    fetchMembers();
});