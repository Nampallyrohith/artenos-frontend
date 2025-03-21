import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { OrbitProgress } from "react-loading-indicators";

const App = () => {
  const [placeData, setPlaceData] = useState({});
  const [city, setCity] = useState("Hyderabad");
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWeatherData();
  }, []);

  const getWeatherData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://weather-server-c4pm.onrender.com/${city}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      setLoading(false);
      const data = await response.json();
      console.log("API Response:", data);

      // Check if data contains valid placeData
      if (!data || (!data.placeData && (!data.current || !data.location))) {
        throw new Error("Invalid or missing data structure");
      }

      // Fallback to handle different data structures
      const placeData = data.placeData || data;

      setPlaceData({
        cel: placeData.current.temp_c || "N/A",
        fdegree: placeData.current.temp_f || "N/A",
        city: placeData.location.name || "Unknown Location",
        condition: placeData.current.condition?.text || "No Data",
        canDo: placeData.canDo || "No activity suggestion available",
        forecast: placeData.forecast,
        icon: placeData.current.condition?.icon || "",
      });

      setHourlyWeather(placeData.forecast?.forecastday?.[0]?.hour || []);
      setForecast(placeData.forecast?.forecastday || []);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  const onChangeCity = (e) => {
    setCity(e.target.value);
  };

  const onSearchGo = (e) => {
    e.preventDefault();
    if (!city) {
      alert("Please enter a city");
    } else {
      getWeatherData();
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={onSearchGo}>
        <div className="flex w-full md:w-3/5 items-center gap-3">
          <input
            type="search"
            value={city}
            placeholder="Enter city, Country (optional)"
            onChange={onChangeCity}
          />
          <button type="submit">Go</button>
        </div>
      </form>

      {loading ? (
        <OrbitProgress color="#6b7280" size="medium" text="Loading..." textColor="#6b7280" />
      ) : (
        <div className="weather-data">
          <div className="weather w-full flex flex-col justify-center items-center border-2 rounded-2xl p-4 bg-transparent  border-gray-500">
            <h3>{placeData.city}</h3>
            <img src={placeData.icon} alt="icon" />
            <p className="cel">
              {`${placeData.cel}`}
              <sup>o</sup>C
            </p>
            <p>{placeData.condition}</p>
            <p>{placeData.canDo}</p>
          </div>
          <div className="hourly-weather">
            <h4>Hourly Based</h4>
            <ul className="custom-scrollbar">
              {hourlyWeather.map((time, index) => (
                <li key={index}>
                  <div>
                    <p>
                      {new Date(time.time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <img src={time.condition.icon} alt="icon" />
                    <h4>
                      {`${time.temp_c}`}
                      <sup>o</sup>C
                    </h4>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="weather-days">
            <h1>2-Day Forecast</h1>
            <ul>
              {forecast.map((day, index) => (
                <li
                  key={index}
                  className={`${
                    index !== forecast.length - 1 && "bottom-border"
                  }`}
                >
                  <div>
                    <p>
                      {new Date(day.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                      })}
                    </p>
                    <img src={day.day.condition.icon} alt="icon" />
                    <div className="min-max">
                      <p>
                        {`${day.day.mintemp_c}`}
                        <sup>o</sup>C (min)
                      </p>
                      <p>
                        {`${day.day.maxtemp_c}`}
                        <sup>o</sup>C (max)
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
