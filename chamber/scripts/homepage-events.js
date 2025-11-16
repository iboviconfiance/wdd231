// Simple script for homepage events
document.addEventListener('DOMContentLoaded', async () => {
    await eventsManager.init();
    
    const upcomingEvents = eventsManager.getUpcomingEvents(3);
    const container = document.getElementById('homepage-events-container');
    
    container.innerHTML = upcomingEvents.map(event => 
        eventsManager.createEventCard(event, 'compact')
    ).join('');
});