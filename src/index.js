// Function to update the weather information on the page
function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#current-time");
  let currentDate = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  // Update the elements on the page with the new weather information
  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(currentDate);
  temperatureElement.innerHTML = Math.round(temperature);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}mph`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon"/>`;

  // Get forecast weather data for the city searched
  getForecast(response.data.city);
}

// Function to format a date object into a readable date string
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

// Function to search for weather information for a given city
function searchCity(city) {
  let apiKey = "98f12063t8f0b4be43fb6oa12441998c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  // Make an API request to get the current weather data and call refreshWeather function with the response
  axios.get(apiUrl).then(refreshWeather);
}

// Event handler for the search form submission
function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  // Get the value from the search input and call searchCity function
  searchCity(searchInput.value);
}
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Function to get the weather forecast for a given city
function getForecast(city) {
  let apiKey = "98f12063t8f0b4be43fb6oa12441998c";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  // Make an API request to get the weather forecast data and call displayForecast function with the response
  axios.get(apiUrl).then(displayForecast);
}

// Function to format the day of the week based on a timestamp
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

// Function to display the weather forecast on the page
function displayForecast(response) {
  console.log(response.data);
  let forecastHtml = "";
  // Iterate over the daily forecast data and create HTML elements for each day
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `<div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(day.time)}</div> 
             <img  src="${
               day.condition.icon_url
             }" class="weather-forecast-icon"/>
              <div class="weather-forecast-temperature">
                <strong><span class="weather-forecast-temp-max">${Math.round(
                  day.temperature.maximum
                )}°</span></strong>
                 <span class="weather-forecast-temp-min">${Math.round(
                   day.temperature.minimum
                 )}°</span>
              </div>
       </div>`;
    }
  });

  // Update the forecast element on the page with the generated HTML
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

// Initial setup: display current weather for default city ("sacramento") and search for "sacramento"
searchCity("sacramento");

/* Here's the order in which the functions in this weather application are executed:

1. **searchCity(city)**: This function is called when the user submits the search form. It retrieves the current weather data for the specified city using an API call.

2. **refreshWeather(response)**: This function is called after the API call in `searchCity(city)` is successful. It updates the DOM elements with the current weather data and calls `getForecast(city)` to retrieve the forecast data.

3. **getForecast(city)**: This function is called by `refreshWeather(response)` to retrieve the forecast weather data for the specified city using another API call.

4. **displayForecast(response)**: This function is called after the API call in `getForecast(city)` is successful. It updates the DOM with the forecast weather data for the next 5 days.

5. **handleSearchSubmit(event)**: This is the event handler for the search form submission. It prevents the default form submission behavior, retrieves the value from the search input, and calls `searchCity(city)` with the input value.

6. **formatDate(date)**: This function is used to format a date object into a readable date string.

7. **formatDay(timestamp)**: This function is used to format a timestamp into a day of the week (e.g., Sun, Mon, etc.).

8. **Initial setup**: The code at the bottom of the script initiates the process by calling `searchCity("Sacramento")` to display the current weather for the default city.

This order ensures that the weather application functions correctly by fetching and displaying the current weather and forecast data in the correct sequence.
*/
