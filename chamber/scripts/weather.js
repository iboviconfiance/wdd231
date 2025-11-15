// Configuration - REMPLACEZ AVEC VOTRE CLÉ API
const API_KEY = 'b3494442366352d24672277f0177d673';
const CITY = 'Brazzaville';
const COUNTRY_CODE = 'CG';

// Fonction principale pour récupérer la météo
async function getWeather() {
    try {
        // Current Weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=imperial&appid=${API_KEY}`
        );
        
        if (!currentResponse.ok) {
            throw new Error('Weather data not available');
        }
        
        const currentData = await currentResponse.json();
        updateCurrentWeather(currentData);
        
        // Forecast (3-day)
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=imperial&appid=${API_KEY}`
        );
        
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            updateForecast(forecastData);
        }
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showDefaultWeather();
    }
}

// Mettre à jour la météo actuelle
function updateCurrentWeather(data) {
    document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°F`;
    document.getElementById('weather-condition').textContent = data.weather[0].description;
    document.getElementById('high-temp').textContent = `${Math.round(data.main.temp_max)}°`;
    document.getElementById('low-temp').textContent = `${Math.round(data.main.temp_min)}°`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    
    // Sunrise and Sunset
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('sunset').textContent = sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Weather Icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').alt = data.weather[0].description;
}

// Mettre à jour les prévisions
function updateForecast(data) {
    const forecasts = data.list;
    
    // Today's forecast (find midday forecast)
    const todayForecast = forecasts.find(f => {
        const date = new Date(f.dt * 1000);
        return date.getHours() === 12;
    });
    
    if (todayForecast) {
        document.getElementById('forecast-today').textContent = `${Math.round(todayForecast.main.temp)}°F`;
    }
    
    // Get forecasts for next days (simplified)
    const tomorrow = forecasts[8]; // Approximate tomorrow midday
    const dayAfter = forecasts[16]; // Approximate day after tomorrow midday
    
    if (tomorrow) {
        document.getElementById('forecast-wednesday').textContent = `${Math.round(tomorrow.main.temp)}°F`;
    }
    
    if (dayAfter) {
        document.getElementById('forecast-thursday').textContent = `${Math.round(dayAfter.main.temp)}°F`;
    }
}

// Données par défaut si l'API échoue
function showDefaultWeather() {
    document.getElementById('current-temp').textContent = '75°F';
    document.getElementById('weather-condition').textContent = 'Partly Cloudy';
    document.getElementById('high-temp').textContent = '85°';
    document.getElementById('low-temp').textContent = '52°';
    document.getElementById('humidity').textContent = '34%';
    document.getElementById('sunrise').textContent = '7:30am';
    document.getElementById('sunset').textContent = '9:59pm';
    
    document.getElementById('forecast-today').textContent = '90°F';
    document.getElementById('forecast-wednesday').textContent = '89°F';
    document.getElementById('forecast-thursday').textContent = '68°F';
}

// Initialiser la météo au chargement
document.addEventListener('DOMContentLoaded', function() {
    getWeather();
    
    // Rafraîchir la météo toutes les 30 minutes
    setInterval(getWeather, 30 * 60 * 1000);
});