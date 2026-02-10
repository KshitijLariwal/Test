// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Current weather data
let currentCoordinates = { lat: 0, lon: 0 };

// Weather Icons mapping
const weatherIcons = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '☁️',
    'broken clouds': '☁️',
    'shower rain': '🌧️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'smoke': '💨',
    'haze': '🌫️',
    'dust': '🌪️',
    'fog': '🌫️',
    'sand': '🌪️',
    'ash': '💨',
    'squall': '💨',
    'tornado': '🌪️',
    'drizzle': '🌧️'
};

// Get weather icon based on condition
function getWeatherIcon(condition) {
    const lowerCondition = condition.toLowerCase();
    for (let key in weatherIcons) {
        if (lowerCondition.includes(key)) {
            return weatherIcons[key];
        }
    }
    return '🌍';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Show loading spinner
function showLoading(show = true) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Geocode city name to coordinates
async function geocodeCity(cityName) {
    try {
        showLoading(true);
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );
        
        if (!response.ok) {
            throw new Error('Failed to geocode location');
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError('Location not found. Please try another city.');
            hideLoading();
            return null;
        }

        const result = data.results[0];
        return {
            lat: result.latitude,
            lon: result.longitude,
            name: result.name,
            country: result.country,
            admin1: result.admin1
        };
    } catch (error) {
        showError('Error finding location: ' + error.message);
        hideLoading();
        return null;
    }
}

// Fetch weather data
async function fetchWeather(lat, lon, cityName = null) {
    try {
        showLoading(true);
        
        // Fetch current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        
        // Store coordinates
        currentCoordinates = { lat, lon };

        // Display weather
        displayWeather(weatherData, cityName);
        hideLoading();

    } catch (error) {
        showError('Error fetching weather: ' + error.message);
        hideLoading();
    }
}

// WMO Weather Code interpretation
function getWeatherDescription(code) {
    const codes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || 'Unknown';
}

// Display weather information
function displayWeather(data, cityName) {
    const current = data.current;
    const daily = data.daily;

    // Get location name if not provided
    if (!cityName) {
        cityName = 'Current Location';
    }

    // Update location
    document.getElementById('cityName').textContent = cityName;
    
    // Update temperature
    const temp = Math.round(current.temperature_2m);
    document.getElementById('temperature').textContent = temp;

    // Update weather condition
    const condition = getWeatherDescription(current.weather_code);
    document.getElementById('condition').textContent = condition;
    document.getElementById('weatherIcon').textContent = getWeatherIcon(condition);

    // Update feels like
    const feelsLike = Math.round(current.apparent_temperature);
    document.getElementById('feelsLike').textContent = `Feels like ${feelsLike}°C`;

    // Update humidity
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;

    // Update wind speed
    const windSpeed = Math.round(current.wind_speed_10m);
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;

    // Update pressure
    const pressure = Math.round(current.pressure_msl);
    document.getElementById('pressure').textContent = `${pressure} hPa`;

    // Update visibility
    const visibility = (current.visibility / 1000).toFixed(1);
    document.getElementById('visibility').textContent = `${visibility} km`;

    // Display 7-day forecast
    displayForecast(daily);

    // Show weather container
    weatherContainer.classList.remove('hidden');
}

// Display 7-day forecast
function displayForecast(daily) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    const daysToShow = 7;
    
    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const condition = getWeatherDescription(daily.weather_code[i]);
        const icon = getWeatherIcon(condition);

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp-range">
                <div class="forecast-temp-max">${maxTemp}°</div>
                <div class="forecast-temp-min">${minTemp}°</div>
            </div>
            <div class="forecast-condition">${condition}</div>
        `;

        forecastContainer.appendChild(forecastCard);
    }
}

// Search for city
async function searchCity() {
    const city = searchInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    const location = await geocodeCity(city);
    
    if (location) {
        searchInput.value = '';
        await fetchWeather(location.lat, location.lon, location.name);
    }
}

// Get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeather(latitude, longitude);
            },
            (error) => {
                console.log('Geolocation error:', error);
                showError('Unable to get your location. Please search for a city.');
                hideLoading();
                // Default to London
                searchInput.value = 'London';
                searchCity();
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
        // Default to London
        searchInput.value = 'London';
        searchCity();
    }
}

// Event listeners
searchBtn.addEventListener('click', searchCity);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Load weather on page load
window.addEventListener('load', () => {
    getUserLocation();
});
