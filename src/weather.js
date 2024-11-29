import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // External CSS for styling

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Mumbai");
  const [searchCity, setSearchCity] = useState(""); // Store the city to search for
  const [citySuggestions, setCitySuggestions] = useState([]); // List of city suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // Toggle suggestions list
  const API_KEY = "5c2030272e9ecf31ed093c667b5e842f";

  // Fetch the weather data based on the city
  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Unable to fetch weather data. Please try again.");
    }
  };

  // Handle form submission for city search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim()); // Update city state
      setShowSuggestions(false); // Hide suggestions after selecting city
      fetchWeather(searchCity.trim()); // Fetch weather for the selected city
    }
  };

  // Handle search input change to fetch city suggestions
  const handleCityChange = async (e) => {
    const inputValue = e.target.value.trim();
    setSearchCity(inputValue);

    if (!inputValue) {
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?q=${inputValue}&appid=${API_KEY}`
      );

      if (response.data.list) {
        setCitySuggestions(response.data.list);
      } else {
        setCitySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setShowSuggestions(false);
    }
  };

  // Fetch weather data when city changes
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  return (
    <div className="weather-app">
      <h1>Weather App</h1>

      {weatherData && (
        <div className="weather-container">
          {/* Left Panel */}
          <div className="left-panel">
            <h2>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h2>
            <p>
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <h3>
              {weatherData.city.name} - {weatherData.city.country}
            </h3>

            <div className="temperature">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                alt={weatherData.list[0].weather[0].description}
                className="weather-icon"
              />
              <h1>{Math.round(weatherData.list[0].main.temp - 273.15)}°C</h1>
            </div>
            <p>{weatherData.list[0].weather[0].description}</p>
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                className="search-input"
                value={searchCity}
                onChange={handleCityChange} // Handle input change for suggestions
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>

            {/* Show city suggestions when available */}
            {showSuggestions && citySuggestions.length > 0 && (
              <div className="suggestions-list">
                {citySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchCity(suggestion.name); // Set the selected city
                      setCity(suggestion.name); // Fetch weather for selected city
                      setShowSuggestions(false); // Hide suggestions
                      fetchWeather(suggestion.name); // Fetch weather immediately
                    }}
                  >
                    {suggestion.name}, {suggestion.sys.country}
                  </div>
                ))}
              </div>
            )}

            {/* Forecast section under the search */}
            <div className="forecast">
              {weatherData.list.slice(0, 5).map((forecast, index) => (
                <div key={index} className="forecast-item">
                  <p>
                    {new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p>{Math.round(forecast.main.temp - 273.15)}°C</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt={forecast.weather[0].description}
                  />
                </div>
              ))}
            </div>

            <div className="details">
              <p>UV Index: 8 (Very High)</p>
              <p>Humidity: {weatherData.list[0].main.humidity}%</p>
              <p>Wind Speed: {weatherData.list[0].wind.speed} km/h</p>
              <p>
                Population:{" "}
                {Intl.NumberFormat().format(weatherData.city.population || 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
