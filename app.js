const getCity = async (city) => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
  );
  const data = await res.json();
  return data;
};

const getWeather = async (latitude, longitude) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );
  const data = await res.json();
  return data;
};

const getAll = async (cityName) => {
  const cityData = await getCity(cityName);
  const latitude = cityData.results[0].latitude;
  const longitude = cityData.results[0].longitude;
  const cityWeatherData = await getWeather(latitude, longitude);
  return { cityWeatherData, cityData };
};

// Elementos del DOM
const search = document.querySelector("#search");
const input = document.querySelector("#inputCity");
const cityN = document.querySelector(".cityN span");
const temperature = document.querySelector(".temperature span");
const country = document.querySelector(".country span");
const timeZone = document.querySelector(".timeZone span");
const population = document.querySelector(".population span");
const tforescast = document.querySelector(".tforescast span");

search.addEventListener("click", async () => {
  try {
    const { cityData, cityWeatherData } = await getAll(input.value);

    // Actualizar solo los <span>
    cityN.textContent = input.value;
    temperature.textContent = cityWeatherData.current_weather.temperature + cityWeatherData.current_weather_units.temperature;
    country.textContent = cityData.results[0].country || "No data";
    timeZone.textContent = new Date(cityWeatherData.current_weather.time).toLocaleString();
    population.textContent = cityData.results[0].population || "No data";
    tforescast.textContent = `
      Min: ${cityWeatherData.daily.temperature_2m_min[0]} ${
      cityWeatherData.daily_units.temperature_2m_min
    }, Max: ${cityWeatherData.daily.temperature_2m_max[0]} ${
      cityWeatherData.daily_units.temperature_2m_max
    }`;

    // Cambiar el fondo según is_day
    const isDay = cityWeatherData.current_weather.is_day;
    document.body.className = isDay ? "" : "night";
  } catch (error) {
    console.error(error.message);
    alert("Error fetching data: " + error.message);
  }
});
