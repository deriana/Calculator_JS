const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".container");

const API_KEY = "1d3201545912277e65b16e292fd0b762";

const createWeatherCard = (weatherItem, isCurrentWeather = false) => {
    const date = new Date(weatherItem.dt_txt);
    const formattedDate = isCurrentWeather ? "Now" : `(${date.toDateString()})`;

    return `
        <div class="weather-item">
            <h3>${formattedDate}</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather">
            <p>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
            <p>Wind: ${weatherItem.wind.speed} M/S</p>
            <p>Humidity: ${weatherItem.main.humidity}%</p>
        </div>`;
};

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const currentWeather = data.list[0]; 

            weatherCardsDiv.innerHTML = "";
            currentWeatherDiv.innerHTML = createWeatherCard(currentWeather, true);

            const fiveDaysForecast = data.list.slice(1, 6); 
            fiveDaysForecast.forEach(weatherItem => {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No Coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

searchButton.addEventListener("click", getCityCoordinates);
