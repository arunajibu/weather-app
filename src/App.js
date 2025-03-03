import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import styles from "./styles"; // Importing styles

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // Using environment variable

  // Function to fetch weather data by city name
  const getWeather = async (city) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      //console.log(response.data)
      setWeather(response.data);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to get weather by current location
  const getWeatherByLocation = async (lat, lon) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("Failed to get weather data. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Get current location and fetch weather when the app loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByLocation(latitude, longitude);
        },
        () => {
          setError("Could not get your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Weather App
      </Typography>

      {/* City Input */}
      <TextField
        label="Enter City"
        variant="outlined"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        sx={{ width: "100%", mb: 2 }}
      />

      {/* Get Weather Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => getWeather(city)}
        sx={{ mb: 3 }}
      >
        Get Weather
      </Button>

      {/* Display Loading */}
      {loading && <Typography>Loading...</Typography>}

      {/* Display Error */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Display Weather Data */}
      {weather && (
        <Box sx={styles.weatherBox}>
          <Typography variant="h6" sx={styles.cityText}>
            {weather.name}, {weather.sys.country}
          </Typography>
          <Typography sx={styles.descriptionText}>
            {weather.weather[0].description}
          </Typography>
          <Typography sx={styles.temperatureText}>
            Temperature: {weather.main.temp}°C
          </Typography>
          <Typography sx={styles.humidityText}>
            Humidity: {weather.main.humidity}%
          </Typography>
          <Typography sx={styles.windSpeedText}>
            Wind Speed: {weather.wind.speed} m/s
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default App;
