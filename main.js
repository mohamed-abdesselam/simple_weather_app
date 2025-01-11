const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/",
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getResultsByLocation(latitude, longitude);
    });
  }
}

function getResultsByLocation(lat, lon) {
  fetch(
    `${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`
  )
    .then((weather) => weather.json())
    .then((data) => {
      displayResults(data);
      fetchForecast(lat, lon);
    });
}

function fetchForecast(lat, lon) {
  fetch(
    `${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`
  )
    .then((response) => response.json())
    .then((forecastData) => displayChart(forecastData));
}

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => weather.json())
    .then((data) => {
      displayResults(data);
      fetchForecastByCity(query);
    });
}

function fetchForecastByCity(city) {
  fetch(`${api.base}forecast?q=${city}&units=metric&APPID=${api.key}`)
    .then((response) => response.json())
    .then((forecastData) => displayChart(forecastData));
}

function displayResults(weather) {
  console.log(weather);
  
  let city = document.querySelector(".location .city");
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector(".location .date");
  date.innerText = dateBuilder(now);

  let temp = document.querySelector(".current .temp");
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector(".current .weatherData");
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector(".hi-low");
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
    weather.main.temp_max
  )}°c`;

  let icon = document.querySelector(".current .icon");
  icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}">`;
}

function displayChart(forecastData) {
  const labels = forecastData.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    return `${date.getHours()}:00`;
  });

  const temps = forecastData.list.slice(0, 8).map((item) => item.main.temp);

  const ctx = document.getElementById("weatherChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temps,
          borderColor: "blue",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

getLocation();
