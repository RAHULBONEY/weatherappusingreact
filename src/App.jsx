import React, { useState } from 'react';
import './App.css';

function App() {
    const [city, setCity] = useState('');
    const [cityName, setCityName] = useState('Location');
    const [cityTime, setCityTime] = useState('Local Time');
    const [cityTemp, setCityTemp] = useState('Temperature');

    async function getData(city) {
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=a63c483d7bf34a0aa76145525241407&q=${city}&aqi=yes`);
        return await res.json();
    }

    async function updateWeather(city) {
        try {
            const result = await getData(city);
            setCityName(`${result.location.name}, ${result.location.region} - ${result.location.country}`);
            setCityTime(result.location.localtime);
            setCityTemp(`${result.current.temp_c}°C`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function handleSearch() {
        await updateWeather(city);
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    async function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const result = await getData(`${lat},${lon}`);
                setCityName(`${result.location.name}, ${result.location.region} - ${result.location.country}`);
                setCityTime(result.location.localtime);
                setCityTemp(`${result.current.temp_c}°C`);
            }, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    return (
        <div className="container">
            <h1>Weather App</h1>
            <div className="search">
                <input
                    id="city-input"
                    type="text"
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button id="search-button" onClick={handleSearch}>Search</button>
            </div>
            <div className="location-weather">
                <h2 id="city-name">{cityName}</h2>
                <h3 id="city-time">{cityTime}</h3>
                <p id="city-temp">{cityTemp}</p>
            </div>
        </div>
    );
}

export default App;
