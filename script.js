const search = document.querySelector(".search-button");
const degree = document.querySelector('.weather-degree');
const windSpeed = document.querySelector('.wind-speed');
const windDirection = document.querySelector('.wind-direction');
const place = document.querySelector('.place');
const currentIcon = document.querySelector('.icon'); // container for current weather icon

// Initial fetch for default city (Alger)
fetchWeather(36.75, 3.06, "Alger");

function fetchWeather(lat, lon, cityName) {
    // Current weather
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
            degree.innerText = 'Degree : ' + data.current_weather.temperature + ' C°';
            windSpeed.innerText = 'Wind speed : ' + data.current_weather.windspeed + ' Km/H';
            windDirection.innerText = 'Wind direction: ' + data.current_weather.winddirection + '°';
            place.innerText = cityName;

            // Update current icon
            const weatherCode = data.current_weather.weathercode;
            currentIcon.innerHTML = getWeatherIcon(weatherCode, 75);
        })
        .catch(err => console.log(err));

    // Weekly forecast
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`)
        .then(res => res.json())
        .then(data => {
            let todayDate = document.querySelector('.today-date');
            let date = new Date(data.daily.time[0]);
            todayDate.innerText = dayFun(date.getDay()) + ' - ' + date.getDate() + ' ' + monthFun(date.getMonth());

            // Update weekly cards
            const cards = document.querySelectorAll(".cards .card");
            data.daily.time.forEach((day, index) => {
                if (cards[index]) {
                    let d = new Date(day);
                    cards[index].querySelector(".day").innerText = dayFun(d.getDay()).slice(0, 3);
                    cards[index].querySelector(".degree").innerText = data.daily.temperature_2m_max[index] + " C°";
                    cards[index].querySelector("svg").outerHTML = getWeatherIcon(data.daily.weathercode[index], 40);
                }
            });
        })
        .catch(err => console.log(err));
}

// Search feature
search.addEventListener('click', () => {
    const input = document.querySelector(".search");
    const city = input.value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(res => res.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                alert("City not found");
                return;
            }
            const lat = data.results[0].latitude;
            const lon = data.results[0].longitude;
            fetchWeather(lat, lon, city);
        })
        .catch(err => console.log(err));
});

// === ICONS ===
function getWeatherIcon(code, size) {
    // Example: match your existing SVGs
    if (code === 0) {
        // Clear/Sunny
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="36" stroke-dashoffset="36" d="M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="36;0"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M12 19v1M19 12h1M12 5v-1M5 12h-1"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="2;0"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"><animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="2;0"/></path></g></svg>`;
    } else if([51,53,55,61,63,65,80,81,82].includes(code)){
        // Default: rain
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M114.61 162.85A16.07 16.07 0 0 0 128 149.6C140.09 76.17 193.63 32 256 32c57.93 0 96.62 37.75 112.2 77.74a15.84 15.84 0 0 0 12.2 9.87c50 8.15 91.6 41.54 91.6 99.59c0 59.4-48.6 100.8-108 100.8H130c-49.5 0-90-24.7-90-79.2c0-48.47 38.67-72.22 74.61-77.95Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m144 384l-32 48m112-48l-64 96m144-96l-32 48m112-48l-64 96"/></svg>`;
    } else {
        // Partly cloudy
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><path fill="currentColor" d="M30 15.5a6.53 6.53 0 0 0-5.199-6.363a8.994 8.994 0 0 0-17.6 0A6.53 6.53 0 0 0 2 15.5a6.45 6.45 0 0 0 1.688 4.35A5.983 5.983 0 0 0 8 30h11a5.976 5.976 0 0 0 5.61-8.102A6.505 6.505 0 0 0 30 15.501M19 28H8a3.993 3.993 0 0 1-.673-7.93l.663-.112l.146-.656a5.496 5.496 0 0 1 10.73 0l.145.656l.663.113A3.993 3.993 0 0 1 19 28m4.5-8h-.055a5.96 5.96 0 0 0-2.796-1.756a7.495 7.495 0 0 0-14.299 0a6 6 0 0 0-1.031.407A4.45 4.45 0 0 1 4 15.5a4.517 4.517 0 0 1 4.144-4.481l.816-.064l.099-.812a6.994 6.994 0 0 1 13.883 0l.099.812l.815.064A4.498 4.498 0 0 1 23.5 20"/></svg>`;
    }
}

// === Helpers ===
const dayFun = (day) => {
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
};

const monthFun = (month) => {
    return ["January","February","March","April","May","June","July","August","September","October","November","December"][month];
};
